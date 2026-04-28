#!/usr/bin/env node

'use strict';

const { createHash } = require('crypto');
const { existsSync, readFileSync, writeFileSync } = require('fs');
const { join } = require('path');
const { spawnSync, spawn } = require('child_process');

const ROOT = join(__dirname, '..');
const STATE_FILE = join(ROOT, '.dev-install-state.json');
const APPS = ['backend', 'frontend'];
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function hashDeps(app) {
  const hash = createHash('sha256');
  for (const file of ['package.json', 'package-lock.json']) {
    const fullPath = join(ROOT, app, file);
    if (existsSync(fullPath)) {
      hash.update(readFileSync(fullPath));
    }
  }
  return hash.digest('hex');
}

function loadState() {
  if (existsSync(STATE_FILE)) {
    try {
      return JSON.parse(readFileSync(STATE_FILE, 'utf8'));
    } catch {
      return {};
    }
  }
  return {};
}

function saveState(state) {
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + '\n', 'utf8');
}

function install(app) {
  console.log(`\n[${app}] Installing dependencies...`);
  const result = spawnSync(npm, ['install'], {
    cwd: join(ROOT, app),
    stdio: 'inherit',
    shell: false,
  });
  if (result.status !== 0) {
    console.error(`\n[${app}] npm install failed.`);
    process.exit(result.status ?? 1);
  }
}

function ensureDeps() {
  const state = loadState();
  const nextState = { ...state };

  for (const app of APPS) {
    const currentHash = hashDeps(app);
    const nodeModulesExists = existsSync(join(ROOT, app, 'node_modules'));

    if (!nodeModulesExists || state[app] !== currentHash) {
      install(app);
      nextState[app] = currentHash;
      saveState(nextState);
    } else {
      console.log(`[${app}] Dependencies up to date, skipping install.`);
    }
  }
}

function startProcesses() {
  console.log('\nStarting backend and frontend...\n');

  const procs = APPS.map((app) => {
    const proc = spawn(npm, ['run', 'dev'], {
      cwd: join(ROOT, app),
      shell: false,
    });

    proc.stdout.on('data', (data) => {
      for (const line of data.toString().split('\n')) {
        if (line.trim()) process.stdout.write(`[${app}] ${line}\n`);
      }
    });

    proc.stderr.on('data', (data) => {
      for (const line of data.toString().split('\n')) {
        if (line.trim()) process.stderr.write(`[${app}] ${line}\n`);
      }
    });

    return { app, proc };
  });

  function shutdown() {
    for (const { proc } of procs) {
      try {
        proc.kill();
      } catch {}
    }
  }

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  for (const { app, proc } of procs) {
    proc.on('exit', (code) => {
      if (code !== 0 && code !== null) {
        console.error(`\n[${app}] exited with code ${code}. Stopping all.`);
        shutdown();
        process.exit(code);
      }
    });
  }
}

ensureDeps();
startProcesses();

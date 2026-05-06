import fs from 'fs';
import path from 'path';
import { ConfigRecord, EndpointSet, LogEntry } from './types';
import {
  DEFAULT_VERIFYUSER_CONFIG,
  DEFAULT_AUTHORIZE_CONFIG,
  DEFAULT_TRANSFER_CONFIG,
  DEFAULT_CANCEL_CONFIG,
  DEFAULT_NOTIFICATION_CONFIG,
  DEFAULT_LOOKUPUSER_CONFIG,
  DEFAULT_SIGNIN_CONFIG,
} from './defaults';

const ENDPOINTS = ['verifyuser', 'authorize', 'transfer', 'cancel', 'notification', 'lookupuser', 'signin'] as const;
type Endpoint = typeof ENDPOINTS[number];

const SETS_FILE = path.resolve(__dirname, '../../data/sets.json');

const DEFAULT_CONFIGS: Record<Endpoint, ConfigRecord[]> = {
  verifyuser:   DEFAULT_VERIFYUSER_CONFIG,
  authorize:    DEFAULT_AUTHORIZE_CONFIG,
  transfer:     DEFAULT_TRANSFER_CONFIG,
  cancel:       DEFAULT_CANCEL_CONFIG,
  notification: DEFAULT_NOTIFICATION_CONFIG,
  lookupuser:   DEFAULT_LOOKUPUSER_CONFIG,
  signin:       DEFAULT_SIGNIN_CONFIG,
};

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

function cloneDefaults(defaults: ConfigRecord[]): ConfigRecord[] {
  return defaults.map(r => ({
    ...r,
    value: typeof r.value === 'object' ? deepClone(r.value) : r.value,
  }));
}

type SetsData = Record<Endpoint, EndpointSet[]>;

function loadSetsFromDisk(): SetsData {
  try {
    if (fs.existsSync(SETS_FILE)) {
      const raw = fs.readFileSync(SETS_FILE, 'utf-8');
      const data = JSON.parse(raw) as SetsData;
      // Ensure every endpoint exists in the file
      for (const ep of ENDPOINTS) {
        if (!data[ep]) data[ep] = [];
      }
      return data;
    }
  } catch {
    // ignore corrupt file, start fresh
  }
  return buildInitialSets();
}

function buildInitialSets(): SetsData {
  const data = {} as SetsData;
  for (const ep of ENDPOINTS) {
    data[ep] = [makeInitialSet(ep)];
  }
  return data;
}

function makeInitialSet(ep: Endpoint): EndpointSet {
  return {
    id: 'initial',
    name: 'Initial',
    createdAt: new Date().toISOString(),
    config: cloneDefaults(DEFAULT_CONFIGS[ep]),
  };
}

function saveSetssToDisk(sets: SetsData): void {
  try {
    const dir = path.dirname(SETS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(SETS_FILE, JSON.stringify(sets, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist sets to disk:', err);
  }
}

const loadedSets = loadSetsFromDisk();

// Ensure every endpoint has at least the Initial set
for (const ep of ENDPOINTS) {
  if (loadedSets[ep].length === 0) {
    loadedSets[ep] = [makeInitialSet(ep)];
  }
}

export const store = {
  verifyuserConfig:   cloneDefaults(DEFAULT_VERIFYUSER_CONFIG),
  authorizeConfig:    cloneDefaults(DEFAULT_AUTHORIZE_CONFIG),
  transferConfig:     cloneDefaults(DEFAULT_TRANSFER_CONFIG),
  cancelConfig:       cloneDefaults(DEFAULT_CANCEL_CONFIG),
  notificationConfig: cloneDefaults(DEFAULT_NOTIFICATION_CONFIG),
  lookupuserConfig:   cloneDefaults(DEFAULT_LOOKUPUSER_CONFIG),
  signinConfig:       cloneDefaults(DEFAULT_SIGNIN_CONFIG),

  logs: [] as LogEntry[],

  sets: loadedSets,

  // ── Config accessors by endpoint name ─────────────────────────────────────

  getConfig(endpoint: string): ConfigRecord[] {
    const key = `${endpoint}Config` as keyof typeof this;
    return this[key] as ConfigRecord[];
  },

  setConfig(endpoint: string, config: ConfigRecord[]): void {
    const key = `${endpoint}Config` as keyof typeof this;
    (this as Record<string, unknown>)[key] = config;
  },

  // ── Sets management ───────────────────────────────────────────────────────

  getSets(endpoint: string): EndpointSet[] {
    return this.sets[endpoint as Endpoint] ?? [];
  },

  // Create a new set with the given name and config (provided by caller)
  addSet(endpoint: string, name: string, config: ConfigRecord[]): EndpointSet {
    const entry: EndpointSet = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      createdAt: new Date().toISOString(),
      config: deepClone(config),
    };
    if (!this.sets[endpoint as Endpoint]) {
      this.sets[endpoint as Endpoint] = [];
    }
    this.sets[endpoint as Endpoint].push(entry);
    // Also load this config into the live store
    this.setConfig(endpoint, deepClone(config));
    saveSetssToDisk(this.sets);
    return entry;
  },

  // Save config+name into an existing set and load it into the live store
  saveSet(endpoint: string, id: string, name: string, config: ConfigRecord[]): EndpointSet | null {
    const list = this.sets[endpoint as Endpoint] ?? [];
    const set = list.find(s => s.id === id);
    if (!set) return null;
    set.name = name;
    set.config = deepClone(config);
    // Load into live store so incoming requests use the new config
    this.setConfig(endpoint, deepClone(config));
    saveSetssToDisk(this.sets);
    return set;
  },

  // Load a set's config into the live store (on dropdown select)
  activateSet(endpoint: string, id: string): EndpointSet | null {
    const set = (this.sets[endpoint as Endpoint] ?? []).find(s => s.id === id);
    if (!set) return null;
    this.setConfig(endpoint, deepClone(set.config));
    return set;
  },

  deleteSet(endpoint: string, id: string): boolean {
    if (id === 'initial') return false; // protect the Initial set
    const list = this.sets[endpoint as Endpoint] ?? [];
    const idx = list.findIndex(s => s.id === id);
    if (idx === -1) return false;
    list.splice(idx, 1);
    saveSetssToDisk(this.sets);
    return true;
  },

  // ── Logs ──────────────────────────────────────────────────────────────────

  addLog(entry: LogEntry) {
    this.logs.push(entry);
  },

  clearLogs() {
    this.logs = [];
  },
};

// On startup, load the Initial set for each endpoint into the live store
for (const ep of ENDPOINTS) {
  const initial = store.sets[ep].find(s => s.id === 'initial');
  if (initial) {
    store.setConfig(ep, deepClone(initial.config));
  }
}

import { ConfigRecord, LogEntry } from './types';

const BASE = '/api';

export async function fetchConfigFor(endpoint: string): Promise<ConfigRecord[]> {
  const res = await fetch(`${BASE}/config/${endpoint}`);
  if (!res.ok) throw new Error('Failed to fetch config');
  return res.json();
}

export async function saveConfigFor(endpoint: string, config: ConfigRecord[]): Promise<ConfigRecord[]> {
  const res = await fetch(`${BASE}/config/${endpoint}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  if (!res.ok) throw new Error('Failed to save config');
  return res.json();
}

export async function fetchAllLogs(): Promise<LogEntry[]> {
  const res = await fetch(`${BASE}/logs`);
  if (!res.ok) throw new Error('Failed to fetch logs');
  return res.json();
}

export async function clearAllLogs(): Promise<void> {
  const res = await fetch(`${BASE}/logs`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to clear logs');
}

export const fetchConfig = () => fetchConfigFor('verifyuser');
export const saveConfig  = (config: ConfigRecord[]) => saveConfigFor('verifyuser', config);

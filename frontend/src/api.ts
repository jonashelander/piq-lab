import { ConfigRecord, EndpointSet, LogEntry } from './types';

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

export async function fetchSets(endpoint: string): Promise<EndpointSet[]> {
  const res = await fetch(`${BASE}/sets/${endpoint}`);
  if (!res.ok) throw new Error('Failed to fetch sets');
  return res.json();
}

// Create a new set with the given name and the current frontend config
export async function createSet(endpoint: string, name: string, config: ConfigRecord[]): Promise<EndpointSet> {
  const res = await fetch(`${BASE}/sets/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, config }),
  });
  if (!res.ok) throw new Error('Failed to create set');
  return res.json();
}

// Overwrite an existing set's name + config
export async function updateSet(endpoint: string, id: string, name: string, config: ConfigRecord[]): Promise<EndpointSet> {
  const res = await fetch(`${BASE}/sets/${endpoint}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, config }),
  });
  if (!res.ok) throw new Error('Failed to update set');
  return res.json();
}

// Load a set's config into the live store
export async function activateSet(endpoint: string, id: string): Promise<EndpointSet> {
  const res = await fetch(`${BASE}/sets/${endpoint}/${id}/activate`, { method: 'PUT' });
  if (!res.ok) throw new Error('Failed to activate set');
  return res.json();
}

export async function deleteSet(endpoint: string, id: string): Promise<void> {
  const res = await fetch(`${BASE}/sets/${endpoint}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete set');
}

export const fetchConfig = () => fetchConfigFor('verifyuser');
export const saveConfig  = (config: ConfigRecord[]) => saveConfigFor('verifyuser', config);

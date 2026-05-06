import { Router } from 'express';
import { store } from '../store';
import { ConfigRecord } from '../types';

const router = Router();

const ENDPOINTS = new Set(['verifyuser', 'authorize', 'transfer', 'cancel', 'notification', 'lookupuser', 'signin']);

function validEndpoint(ep: string, res: import('express').Response): boolean {
  if (!ENDPOINTS.has(ep)) {
    res.status(404).json({ error: `Unknown endpoint: ${ep}` });
    return false;
  }
  return true;
}

// GET /api/sets/:endpoint — list all sets for an endpoint
router.get('/:endpoint', (req, res) => {
  const { endpoint } = req.params;
  if (!validEndpoint(endpoint, res)) return;
  res.json(store.getSets(endpoint));
});

// POST /api/sets/:endpoint — create a new set with provided name + config
router.post('/:endpoint', (req, res) => {
  const { endpoint } = req.params;
  if (!validEndpoint(endpoint, res)) return;
  const { name, config } = req.body as { name?: string; config?: ConfigRecord[] };
  if (!name || typeof name !== 'string' || !name.trim()) {
    res.status(400).json({ error: 'A non-empty "name" field is required.' });
    return;
  }
  if (!Array.isArray(config)) {
    res.status(400).json({ error: 'A "config" array is required.' });
    return;
  }
  const entry = store.addSet(endpoint, name.trim(), config);
  res.status(201).json(entry);
});

// PUT /api/sets/:endpoint/:id — save name + config into an existing set
router.put('/:endpoint/:id', (req, res) => {
  const { endpoint, id } = req.params;
  if (!validEndpoint(endpoint, res)) return;
  const { name, config } = req.body as { name?: string; config?: ConfigRecord[] };
  if (!name || typeof name !== 'string' || !name.trim()) {
    res.status(400).json({ error: 'A non-empty "name" field is required.' });
    return;
  }
  if (!Array.isArray(config)) {
    res.status(400).json({ error: 'A "config" array is required.' });
    return;
  }
  const set = store.saveSet(endpoint, id, name.trim(), config);
  if (!set) {
    res.status(404).json({ error: `Set ${id} not found for endpoint ${endpoint}.` });
    return;
  }
  res.json(set);
});

// PUT /api/sets/:endpoint/:id/activate — load set into live store
router.put('/:endpoint/:id/activate', (req, res) => {
  const { endpoint, id } = req.params;
  if (!validEndpoint(endpoint, res)) return;
  const set = store.activateSet(endpoint, id);
  if (!set) {
    res.status(404).json({ error: `Set ${id} not found for endpoint ${endpoint}.` });
    return;
  }
  res.json(set);
});

// DELETE /api/sets/:endpoint/:id — remove a set (Initial set is protected)
router.delete('/:endpoint/:id', (req, res) => {
  const { endpoint, id } = req.params;
  if (!validEndpoint(endpoint, res)) return;
  if (id === 'initial') {
    res.status(403).json({ error: 'The Initial set cannot be deleted.' });
    return;
  }
  const deleted = store.deleteSet(endpoint, id);
  if (!deleted) {
    res.status(404).json({ error: `Set ${id} not found for endpoint ${endpoint}.` });
    return;
  }
  res.status(204).send();
});

export default router;

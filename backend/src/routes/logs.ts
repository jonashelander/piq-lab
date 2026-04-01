import { Router } from 'express';
import { store } from '../store';

const router = Router();

const endpoints = ['verifyuser', 'authorize', 'transfer', 'cancel', 'notification', 'lookupuser', 'signin'] as const;

for (const ep of endpoints) {
  router.get(`/${ep}`, (_req, res) => {
    res.json([...store.getLogs(ep)].reverse());
  });

  router.delete(`/${ep}`, (_req, res) => {
    store.clearLogs(ep);
    res.json({ cleared: true });
  });
}

export default router;

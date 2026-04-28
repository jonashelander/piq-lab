import { Router } from 'express';
import { store } from '../store';

const router = Router();

router.get('/', (_req, res) => {
  res.json([...store.logs]);
});

router.delete('/', (_req, res) => {
  store.clearLogs();
  res.json({ cleared: true });
});

export default router;

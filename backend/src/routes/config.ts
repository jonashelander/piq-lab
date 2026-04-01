import { Router } from 'express';
import { store } from '../store';
import { ConfigRecord } from '../types';

const router = Router();

function addConfigRoutes(
  ep: string,
  get: () => ConfigRecord[],
  set: (c: ConfigRecord[]) => void,
) {
  router.get(`/${ep}`, (_req, res) => {
    res.json(get());
  });

  router.put(`/${ep}`, (req, res) => {
    const config = req.body as ConfigRecord[];
    if (!Array.isArray(config)) {
      res.status(400).json({ error: 'Expected an array of config records' });
      return;
    }
    set(config);
    res.json(get());
  });
}

addConfigRoutes(
  'verifyuser',
  () => store.verifyuserConfig,
  c => { store.verifyuserConfig = c; },
);

addConfigRoutes(
  'authorize',
  () => store.authorizeConfig,
  c => { store.authorizeConfig = c; },
);

addConfigRoutes(
  'transfer',
  () => store.transferConfig,
  c => { store.transferConfig = c; },
);

addConfigRoutes(
  'cancel',
  () => store.cancelConfig,
  c => { store.cancelConfig = c; },
);

export default router;

import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { store } from '../store';
import { ConfigRecord } from '../types';

const router = Router();

function addMockEndpoint(
  path: string,
  endpoint: string,
  getConfig: () => ConfigRecord[],
) {
  router.post(path, (req, res) => {
    const timestamp = new Date().toISOString();

    const sorted = [...getConfig()].sort((a, b) => a.order - b.order);
    const responseBody: Record<string, unknown> = {};
    for (const record of sorted) {
      if (record.included) {
        responseBody[record.key] = record.value;
      }
    }

    const responseStatus = 200;
    const responseHeaders: Record<string, string> = {
      'content-type': 'application/json; charset=utf-8',
    };

    store.addLog({
      id: uuidv4(),
      timestamp,
      endpoint,
      method: req.method,
      path: req.path,
      requestHeaders: req.headers as Record<string, string | string[] | undefined>,
      requestBody: req.body,
      responseStatus,
      responseHeaders,
      responseBody,
    });

    res.status(responseStatus).json(responseBody);
  });
}

addMockEndpoint('/verifyuser', 'verifyuser', () => store.verifyuserConfig);
addMockEndpoint('/authorize',  'authorize',  () => store.authorizeConfig);
addMockEndpoint('/transfer',   'transfer',   () => store.transferConfig);
addMockEndpoint('/cancel',     'cancel',     () => store.cancelConfig);

export default router;

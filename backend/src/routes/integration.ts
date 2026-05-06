import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { store } from '../store';
import { ConfigRecord, ThreeDS2Field, ThreeDS2PhoneField } from '../types';

const router = Router();

type ThreeDS2Stored = Record<string, ThreeDS2Field | ThreeDS2PhoneField | Record<string, ThreeDS2Field | ThreeDS2PhoneField>>;

function serializeThreeDS2(stored: ThreeDS2Stored): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, fieldOrSection] of Object.entries(stored)) {
    if (
      fieldOrSection !== null &&
      typeof fieldOrSection === 'object' &&
      'included' in fieldOrSection &&
      'value' in fieldOrSection
    ) {
      const f = fieldOrSection as ThreeDS2Field | ThreeDS2PhoneField;
      if (f.included) {
        out[key] = f.value;
      }
    } else if (fieldOrSection !== null && typeof fieldOrSection === 'object') {
      const sectionOut = serializeThreeDS2(fieldOrSection as ThreeDS2Stored);
      if (Object.keys(sectionOut).length > 0) {
        out[key] = sectionOut;
      }
    }
  }
  return out;
}

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
        if (record.key === 'threeDS2') {
          responseBody[record.key] = serializeThreeDS2(record.value as ThreeDS2Stored);
        } else {
          responseBody[record.key] = record.value;
        }
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

addMockEndpoint('/verifyuser',   'verifyuser',   () => store.verifyuserConfig);
addMockEndpoint('/authorize',    'authorize',    () => store.authorizeConfig);
addMockEndpoint('/transfer',     'transfer',     () => store.transferConfig);
addMockEndpoint('/cancel',       'cancel',       () => store.cancelConfig);
addMockEndpoint('/notification', 'notification', () => store.notificationConfig);
addMockEndpoint('/lookupuser',   'lookupuser',   () => store.lookupuserConfig);
addMockEndpoint('/signin',       'signin',       () => store.signinConfig);

export default router;

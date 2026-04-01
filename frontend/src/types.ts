export interface ConfigRecord {
  key: string;
  value: string | Record<string, string>;
  included: boolean;
  order: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  endpoint: string;
  method: string;
  path: string;
  requestHeaders: Record<string, string | string[] | undefined>;
  requestBody: unknown;
  responseStatus: number;
  responseHeaders: Record<string, string>;
  responseBody: unknown;
}

export type Page =
  | 'config-verifyuser'   | 'logs-verifyuser'
  | 'config-authorize'    | 'logs-authorize'
  | 'config-transfer'     | 'logs-transfer'
  | 'config-cancel'       | 'logs-cancel'
  | 'config-notification' | 'logs-notification'
  | 'config-lookupuser'   | 'logs-lookupuser'
  | 'config-signin'       | 'logs-signin';

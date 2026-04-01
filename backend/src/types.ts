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

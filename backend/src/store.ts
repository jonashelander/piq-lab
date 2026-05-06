import { ConfigRecord, LogEntry } from './types';
import {
  DEFAULT_VERIFYUSER_CONFIG,
  DEFAULT_AUTHORIZE_CONFIG,
  DEFAULT_TRANSFER_CONFIG,
  DEFAULT_CANCEL_CONFIG,
  DEFAULT_NOTIFICATION_CONFIG,
  DEFAULT_LOOKUPUSER_CONFIG,
  DEFAULT_SIGNIN_CONFIG,
} from './defaults';

function cloneDefaults(defaults: ConfigRecord[]): ConfigRecord[] {
  return defaults.map(r => ({
    ...r,
    value:
      typeof r.value === 'object'
        ? JSON.parse(JSON.stringify(r.value))
        : r.value,
  }));
}

export const store = {
  verifyuserConfig:   cloneDefaults(DEFAULT_VERIFYUSER_CONFIG),
  authorizeConfig:    cloneDefaults(DEFAULT_AUTHORIZE_CONFIG),
  transferConfig:     cloneDefaults(DEFAULT_TRANSFER_CONFIG),
  cancelConfig:       cloneDefaults(DEFAULT_CANCEL_CONFIG),
  notificationConfig: cloneDefaults(DEFAULT_NOTIFICATION_CONFIG),
  lookupuserConfig:   cloneDefaults(DEFAULT_LOOKUPUSER_CONFIG),
  signinConfig:       cloneDefaults(DEFAULT_SIGNIN_CONFIG),

  logs: [] as LogEntry[],

  addLog(entry: LogEntry) {
    this.logs.push(entry);
  },

  clearLogs() {
    this.logs = [];
  },
};

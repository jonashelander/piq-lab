import { ConfigRecord, LogEntry } from './types';
import {
  DEFAULT_VERIFYUSER_CONFIG,
  DEFAULT_AUTHORIZE_CONFIG,
  DEFAULT_TRANSFER_CONFIG,
  DEFAULT_CANCEL_CONFIG,
} from './defaults';

function cloneDefaults(defaults: ConfigRecord[]): ConfigRecord[] {
  return defaults.map(r => ({
    ...r,
    value:
      typeof r.value === 'object'
        ? { ...(r.value as Record<string, string>) }
        : r.value,
  }));
}

export const store = {
  verifyuserConfig: cloneDefaults(DEFAULT_VERIFYUSER_CONFIG),
  authorizeConfig:  cloneDefaults(DEFAULT_AUTHORIZE_CONFIG),
  transferConfig:   cloneDefaults(DEFAULT_TRANSFER_CONFIG),
  cancelConfig:     cloneDefaults(DEFAULT_CANCEL_CONFIG),

  verifyuserLogs: [] as LogEntry[],
  authorizeLogs:  [] as LogEntry[],
  transferLogs:   [] as LogEntry[],
  cancelLogs:     [] as LogEntry[],

  getLogs(endpoint: string): LogEntry[] {
    switch (endpoint) {
      case 'authorize': return this.authorizeLogs;
      case 'transfer':  return this.transferLogs;
      case 'cancel':    return this.cancelLogs;
      default:          return this.verifyuserLogs;
    }
  },

  addLog(entry: LogEntry) {
    switch (entry.endpoint) {
      case 'authorize': this.authorizeLogs.push(entry); break;
      case 'transfer':  this.transferLogs.push(entry); break;
      case 'cancel':    this.cancelLogs.push(entry); break;
      default:          this.verifyuserLogs.push(entry); break;
    }
  },

  clearLogs(endpoint: string) {
    switch (endpoint) {
      case 'authorize': this.authorizeLogs = []; break;
      case 'transfer':  this.transferLogs = []; break;
      case 'cancel':    this.cancelLogs = []; break;
      default:          this.verifyuserLogs = []; break;
    }
  },
};

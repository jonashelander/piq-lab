import { ConfigRecord } from './types';

export const DEFAULT_VERIFYUSER_CONFIG: ConfigRecord[] = [
  { key: 'userId',    value: 'user123',              included: true,  order: 0  },
  { key: 'success',   value: 'true',                 included: true,  order: 1  },
  { key: 'userCat',   value: 'standard',             included: true,  order: 2  },
  { key: 'kycStatus', value: 'verified',             included: true,  order: 3  },
  { key: 'sex',       value: 'M',                    included: true,  order: 4  },
  { key: 'firstName', value: 'John',                 included: true,  order: 5  },
  { key: 'lastName',  value: 'Doe',                  included: true,  order: 6  },
  { key: 'street',    value: '123 Main St',          included: true,  order: 7  },
  { key: 'city',      value: 'New York',             included: true,  order: 8  },
  { key: 'state',     value: 'NY',                   included: true,  order: 9  },
  { key: 'zip',       value: '10001',                included: true,  order: 10 },
  { key: 'country',   value: 'US',                   included: true,  order: 11 },
  { key: 'email',     value: 'john.doe@example.com', included: true,  order: 12 },
  { key: 'dob',       value: '1990-01-01',           included: true,  order: 13 },
  { key: 'mobile',    value: '+1234567890',          included: true,  order: 14 },
  { key: 'balance',   value: '1000.00',              included: true,  order: 15 },
  { key: 'balanceCy', value: 'USD',                  included: true,  order: 16 },
  { key: 'locale',    value: 'en-US',                included: true,  order: 17 },
  { key: 'attributes',value: {},                     included: true,  order: 18 },
  { key: 'errCode',   value: '',                     included: false, order: 19 },
  { key: 'errMsg',    value: '',                     included: false, order: 20 },
];

export const DEFAULT_AUTHORIZE_CONFIG: ConfigRecord[] = [
  { key: 'userId',       value: 'user_123',                              included: true,  order: 0 },
  { key: 'success',      value: 'true',                                  included: true,  order: 1 },
  { key: 'merchantTxId', value: '111111111',                             included: true,  order: 2 },
  { key: 'authCode',     value: '550e8400-e29b-41d4-a716-446655440000',  included: true,  order: 3 },
  { key: 'errCode',      value: '',                                      included: false, order: 4 },
  { key: 'errMsg',       value: '',                                      included: false, order: 5 },
  { key: 'updatedUser',  value: { kycStatus: 'Approved' },               included: true,  order: 6 },
];

export const DEFAULT_TRANSFER_CONFIG: ConfigRecord[] = [
  { key: 'userId',       value: 'user_123',  included: true,  order: 0 },
  { key: 'success',      value: 'true',      included: true,  order: 1 },
  { key: 'txId',         value: '26720',     included: true,  order: 2 },
  { key: 'merchantTxId', value: '111111111', included: true,  order: 3 },
  { key: 'errCode',      value: '',          included: false, order: 4 },
  { key: 'errMsg',       value: '',          included: false, order: 5 },
];

export const DEFAULT_CANCEL_CONFIG: ConfigRecord[] = [
  { key: 'userId',  value: 'user_123', included: true,  order: 0 },
  { key: 'success', value: 'true',     included: true,  order: 1 },
  { key: 'errCode', value: '',         included: false, order: 2 },
  { key: 'errMsg',  value: '',         included: false, order: 3 },
];

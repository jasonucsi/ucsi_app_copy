import {Connector, AuthHeader, ApiUrl} from './api';
const instance = Connector;
const baseURL = ApiUrl;
const getAuthHeader = AuthHeader;

getAuthHeader();

export default {
  getValidateNumber: number => {
    return instance
      .get(`/api/search/users?countryCode=%2B60&number=${number}`)
      .then(res => res)
      .catch(error => error);
  },

  getRecentContact: () => {
    return instance
      .get(`/api/account/wallet/recent-transfer-contacts`)
      .then(res => res)
      .catch(error => error);
  },

  scanWalletId: walletId => {
    return instance
      .get(`/api/search/wallets?walletId=${walletId}`)
      .then(res => res)
      .catch(error => error);
  },

  walletTransaction: (
    data = {
      walletId: String,
      contact: {countryCode: '+60', number: '123456789'},
      amount: Number,
      remark: String,
      pin: Number,
    },
  ) => {
    return instance
      .post('/api/account/wallet/transactions', data)
      .then(res => res)
      .catch(error => error);
  },

  testingTotp: (
    data = {
      totp: String,
    },
  ) => {
    return instance
      .post('/api/auth/test', data)
      .then(res => res)
      .catch(error => error);
  },

  topUp: (
    data = {
      amount: Number,
    },
  ) => {
    return instance
      .post('/api/account/wallet/reload', data)
      .then(res => res)
      .catch(error => error);
  },

  bankRedirect: (
    bankURL,
    data = {
      AMOUNT: Number,
      MERCHANT_ACC_NO: Number,
      TRANSACTION_TYPE: String,
      MERCHANT_TRANID: String,
      RESPONSE_TYPE: String,
      RETURN_URL: String,
      TXN_DESC: String,
      TXN_SIGNATURE: String,
    },
  ) => {
    return instance
      .post(bankURL, data, {
        'Content-Type': 'multipart/form-data',
      })
      .then(res => res)
      .catch(error => error);
  },

  //merchant transaction history
  getBusinessList: () => {
    return instance
      .get('/api/account/businesses')
      .then(res => res)
      .catch(error => error);
  },
  getBusinessIdWallet: businessId => {
    return instance
      .get('/api/account/businesses/' + businessId + '/wallet')
      .then(res => res)
      .catch(error => error);
  },
  transactionList: (businessId, start, end) => {
    return instance
      .get(
        `/api/account/businesses/${businessId}/wallet/transactions${
          start && end ? `?start=${start}&end=${end}` : ''
        }`,
      )
      .then(res => res)
      .catch(error => error);
  },
};

import {Connector, AuthHeader, ApiUrl} from './api';
const instance = Connector;
const baseURL = ApiUrl;
const getAuthHeader = AuthHeader;

getAuthHeader();

export default {
  registerNewUser: (
    data = {
      name: String,
      email: String,
      contact: {countryCode: '+60', number: '123456789'},
      otp: Number,
      pin: Number,
    },
  ) => {
    return instance
      .post('/api/auth/register-new-user', data)
      .then(res => res)
      .catch(error => error);
  },
  requestSignUpOtp: (
    data = {
      contact: {countryCode: '+60', number: '123456789'},
    },
  ) => {
    return instance
      .post('/api/auth/request-register-otp', data)
      .then(res => res)
      .catch(error => error);
  },
  checkLoginNumber: contact => {
    return instance
      .get(
        '/api/search/check-contact-exists?countryCode=%2B60' +
          '&number=' +
          contact +
          '&userOnly=true',
      )
      .then(res => res)
      .catch(error => error);
  },
  requestLoginOtp: (
    data = {
      contact: {countryCode: '+60', number: '123456789'},
    },
  ) => {
    return instance
      .post('/api/auth/request-login-otp', data)
      .then(res => res)
      .catch(error => error);
  },
  loginWithOtp: (
    data = {
      contact: {countryCode: '+60', number: '123456789'},
      otp: Number,
    },
  ) => {
    return instance
      .post('/api/auth/user-login', data)
      .then(res => res)
      .catch(error => error);
  },
  setupPin: (
    data = {
      pin: Number,
      oldPin: Number,
    },
  ) => {
    return instance
      .patch('/api/account/pin', data)
      .then(res => res)
      .catch(error => error);
  },
  requestResetPinOtp: (
    data = {
      contact: {countryCode: '+60', number: '123456789'},
    },
  ) => {
    return instance
      .post('/api/account/request-reset-pin-otp', data)
      .then(res => res)
      .catch(error => error);
  },
  resetPin: (
    data = {
      contact: {countryCode: '+60', number: '123456789'},
      otp: Number,
      pin: Number,
    },
  ) => {
    return instance
      .patch('/api/account/reset-pin', data)
      .then(res => res)
      .catch(error => error);
  },
  setupKyc: data => {
    return instance
      .patch('/api/account', data, {
        'Content-Type': 'multipart/form-data',
      })
      .then(res => res)
      .catch(error => error);
  },
  getProfile: () => {
    return instance
      .get('/api/account')
      .then(res => res)
      .catch(error => error);
  },
  getWallet: () => {
    return instance
      .get('/api/account/wallet')
      .then(res => res)
      .catch(error => error);
  },
  getTransaction: (start, end) => {
    return instance
      .get(
        `/api/account/wallet/transactions${
          start && end ? `?start=${start}&end=${end}` : ''
        }`,
      )
      .then(res => res)
      .catch(error => error);
  },
  changeContactPermission: () => {
    return instance
      .get('/api/account/change-contact-submission')
      .then(res => res)
      .catch(error => error);
  },
  checkChangeContactExist: contact => {
    return instance
      .get(
        '/api/search/check-contact-exists?countryCode=%2B60' +
          '&number=' +
          contact,
      )
      .then(res => res)
      .catch(error => error);
  },
  requestChangeContactOtp: (
    data = {
      contact: {countryCode: '+60', number: '123456789'},
    },
  ) => {
    return instance
      .post('/api/account/request-change-contact-otp', data)
      .then(res => res)
      .catch(error => error);
  },
  submitChangeContact: data => {
    return instance
      .post('/api/account/change-contact-submission', data, {
        'Content-Type': 'multipart/form-data',
      })
      .then(res => res)
      .catch(error => error);
  },
  submitChangeContact: data => {
    return instance
      .post('/api/account/change-contact-submission', data, {
        'Content-Type': 'multipart/form-data',
      })
      .then(res => res)
      .catch(error => error);
  },
  changeAvatar: (
    data = {
      avatar: String,
    },
  ) => {
    return instance
      .patch('/api/account/avatar', data, {
        'Content-Type': 'multipart/form-data',
      })
      .then(res => res)
      .catch(error => error);
  },
  checkEmailExist: email => {
    return instance
      .get('/api/search/check-email-exists?email=' + email)
      .then(res => res)
      .catch(error => error);
  },
  changeProfile: (
    data = {
      otp: Number,
      email: String,
      address: {
        street: String,
        postcode: String,
        city: String,
        state: String,
        country: String,
      },

      workAddress: {
        street: String,
        postcode: String,
        city: String,
        state: String,
        country: String,
      },

      companyName: String, 
      
      workContact: {
        countryCode: String,
        number: String,
      },

      bankAccountName: String,
      bankAccountNumber: Number,
      bankName: String,

      url: String,
      url2: String,
      url3: String,
    },
  ) => {
    return instance
      .patch('/api/account/profile', data)
      .then(res => res)
      .catch(error => error);
  },
  requestChangeEmailOtp: () => {
    return instance
      .post('/api/account/request-change-email-otp')
      .then(res => res)
      .catch(error => error);
  },
  getCardList: () => {
    return instance
      .get('/api/account/wallet/cards')
      .then(res => res)
      .catch(error => error);
  },
  addUCSICard: (
    ucsiId,
    data = {
      bind: Boolean,
    },
  ) => {
    return instance
      .patch(`/api/account/wallet/cards/${ucsiId}`, data)
      .then(res => res)
      .catch(error => error);
  },
  getCardTransaction: (ucsiId, start, end) => {
    return instance
      .get(
        `/api/account/wallet/cards/${ucsiId}/transactions${
          start && end ? `?start=${start}&end=${end}` : ''
        }`,
      )
      .then(res => res)
      .catch(error => error);
  },
  tncPrivacyPolicy: () => {
    return instance
      .get('/api/global/tnc-and-privacy-policy')
      .then(res => res)
      .catch(error => error);
  },
  notificationTransaction: transactionId => {
    return instance
      .get(`/api/account/wallet/transactions/${transactionId}`)
      .then(res => res)
      .catch(error => error);
  },
  notificationMerchantTransaction: (businessId, transactionId) => {
    return instance
      .get(
        `/api/account/businesses/${businessId}/wallet/transactions/${transactionId}`,
      )
      .then(res => res)
      .catch(error => error);
  },
  spendingLimit: (
    ucsiId,
    data = {
      spendingLimit: Number,
    },
  ) => {
    return instance
      .patch(`/api/account/wallet/cards/${ucsiId}/spending-limit`, data)
      .then(res => res)
      .catch(error => error);
  },
  getAppVersion: () => {
    return instance
      .get('/api/global/version')
      .then(res => res)
      .catch(error => error);
  },
  accountVerifyPin: (
    data = {
      pin: Number,
    },
  ) => {
    return instance
      .post(`/api/account/pin/verify`, data)
      .then(res => res)
      .catch(error => error);
  },
  logout: data => {
    return instance
      .post('/api/auth/logout', data)
      .then(res => res)
      .catch(error => error);
  },
};

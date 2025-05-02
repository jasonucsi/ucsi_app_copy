import {Connector, AuthHeader, ApiUrl} from './api';
const instance = Connector;
const baseURL = ApiUrl;
const getAuthHeader = AuthHeader;

getAuthHeader();
export default {
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
  getProfile: () => {
    // return {
    //   action: baseURL + '/api/account',
    //   ...new getAuthHeader(),
    // };
    return instance
      .get('/api/account')
      .then(res => res)
      .catch(error => error);
  },
};

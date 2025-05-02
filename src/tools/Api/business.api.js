import {Connector, AuthHeader, ApiUrl} from './api';
const instance = Connector;
const baseURL = ApiUrl;
const getAuthHeader = AuthHeader;

getAuthHeader();

export default {
  getBusinessList: () => {
    return instance
      .get(`/api/businesses/discover`)
      .then(res => res)
      .catch(error => error);
  },

  getBusinessDetails: businessId => {
    return instance
      .get(`/api/businesses/details/${businessId}`)
      .then(res => res)
      .catch(error => error);
  },

  // getBusinessDetails: businessId => {
  //   return instance
  //     .get(`/api/businesses/details/${businessId}`)
  //     .then(res => res)
  //     .catch(error => error);
  // },
};

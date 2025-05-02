import {Connector, AuthHeader, ApiUrl} from './api';
const instance = Connector;
const baseURL = ApiUrl;
const getAuthHeader = AuthHeader;

getAuthHeader();

export default {
  getPromotionList: () => {
    return instance
      .get(`/api/promotions/active`)
      .then(res => res)
      .catch(error => error);
  },

  getPromotionDetails: promotionId => {
    return instance
      .get(`/api/promotions/active/${promotionId}`)
      .then(res => res)
      .catch(error => error);
  },
};

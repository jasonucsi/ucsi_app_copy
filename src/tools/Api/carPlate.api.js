import {Connector, AuthHeader, ApiUrl} from './api';
const instance = Connector;
const baseURL = ApiUrl;
const getAuthHeader = AuthHeader;

getAuthHeader();

export default {
  getCarPlate: () => {
    return instance
      .get(`/api/car-plate`)
      .then(res => res)
      .catch(error => error);
  },
  getMaxCarPlate: () => {
    return instance
      .get(`/api/parking-system/max-carplate`)
      .then(res => res)
      .catch(error => error);
  },
  getCarPlateFee: carPlateId => {
    return instance
      .get(`/api/car-plate/parking-fee/${carPlateId}`)
      .then(res => res)
      .catch(error => error);
  },
  getCarPlateFeeByCarPlate: body => {
    return instance
      .post(`/api/car-plate/parking-fee`, body)
      .then(res => res)
      .catch(error => error);
  },
  registerCarPlate: (
    data = {
      carPlate: String,
      displayName: String,
    },
  ) => {
    return instance
      .post(`/api/car-plate`, data)
      .then(res => res)
      .catch(error => error);
  },
  deleteCarPlate: carPlateId => {
    return instance
      .delete(`/api/car-plate/${carPlateId}`)
      .then(res => res)
      .catch(error => error);
  },
  payCarPlate: (carPlateId, body = {pin: '000000'}) => {
    return instance
      .post(`/api/car-plate/parking-fee/payment/${carPlateId}`, body)
      .then(res => res)
      .catch(error => error);
  },
};

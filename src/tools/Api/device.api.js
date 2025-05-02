import { Connector } from "./api";
const instance = Connector;
export default {
  deviceDetails: (
    data = {
      userid: String,
      deviceName: String,
      deviceBrand: String,
      deviceManufacturer: String,
      deviceModel: String,
      deviceID: String,
      deviceUUID: String,
      isTablet: String,
      appVersion: String,
      sysVersion: String,
      os: String
    }
  ) => {
    return instance
      .post("/v1/common/devicedetail", data)
      .then(res => res)
      .catch(error => error);
  }
};

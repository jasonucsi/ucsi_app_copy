import DeviceInfo from 'react-native-device-info';
import {Platform} from 'react-native';
export default {
  getDeviceInfo: async () => {
    var deviceInfo = {
      // deviceName: '',
      // deviceManufacturer: '',
      deviceBrand: '',
      deviceModel: '',
      // deviceID: '',
      deviceUUID: '',
      // isTablet: '',
      appVersion: '',
      sysVersion: '',
      os: '',
    };

    const deviceName = await DeviceInfo.getDeviceName();
    const deviceManufacturer = await DeviceInfo.getManufacturer();
    const deviceBrand = await DeviceInfo.getBrand();
    const deviceModel = await DeviceInfo.getModel();
    const deviceID = await DeviceInfo.getDeviceId();
    const deviceUUID = await DeviceInfo.getUniqueId();
    const isTablet = await DeviceInfo.isTablet();
    const appVersion = await DeviceInfo.getVersion();
    const sysVersion = await DeviceInfo.getSystemVersion();
    const os = await DeviceInfo.getBaseOs();

    // deviceInfo.deviceName = deviceName;
    // deviceInfo.deviceManufacturer = deviceManufacturer;
    deviceInfo.deviceBrand = deviceBrand;
    deviceInfo.deviceModel = deviceModel;
    // deviceInfo.deviceID = deviceID;
    deviceInfo.deviceUUID = deviceUUID;
    // deviceInfo.isTablet = isTablet;
    deviceInfo.appVersion = appVersion;
    deviceInfo.sysVersion = sysVersion;
    deviceInfo.os = Platform.OS;
    // console.log(deviceInfo);
    return deviceInfo;
  },
  getAppVersion: async () => {
    var deviceInfo = {
      carrier: '',
      deviceName: '',
      // deviceManufacturer: '',
      deviceBrand: '',
      deviceModel: '',
      deviceID: '',
      appVersion: '',
      systemName: '',
      systemVersion: '',
    };

    const carrier = await DeviceInfo.getCarrier();
    const deviceName = await DeviceInfo.getDeviceName();
    // const deviceManufacturer = await DeviceInfo.getManufacturer();
    const deviceBrand = await DeviceInfo.getBrand(); //Apple, Samsung
    const deviceModel = await DeviceInfo.getModel();
    const deviceID = await DeviceInfo.getDeviceId();
    const appVersion = await DeviceInfo.getVersion();
    const systemName = await DeviceInfo.getSystemName();
    const systemVersion = await DeviceInfo.getSystemVersion();

    deviceInfo.carrier = carrier;
    deviceInfo.deviceName = deviceName;
    // deviceInfo.deviceManufacturer = deviceManufacturer;
    deviceInfo.deviceBrand = deviceBrand;
    deviceInfo.deviceModel = deviceModel;
    deviceInfo.deviceID = deviceID;
    deviceInfo.appVersion = appVersion;
    deviceInfo.systemName = systemName;
    deviceInfo.systemVersion = systemVersion;
    // console.log(deviceInfo);
    return deviceInfo;
  },
  checkMobileSensorStatus: async () => {
    var mobileSensor = {
      locationService: '',
    };
    const locationService = await DeviceInfo.isLocationEnabled();

    mobileSensor.locationService = locationService;

    return mobileSensor;
  },
  getUserAgent: () => {
    return DeviceInfo.getUserAgent();
  },
};

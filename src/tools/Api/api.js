import axios from 'axios';
import RNSecureStorage from 'rn-secure-storage';
import perf from '@react-native-firebase/perf';
import {env} from '../Constant/Constant';

// var baseURL = process.env.REACT_APP_BE_API || "http://localhost:8002";
// var baseURL = 'http://172.16.40.20:8014';
// var baseURL = 'http://172.16.40.60:8014';
// var baseURL = 'http://172.20.10.9:8014';
// var baseURL = 'http://192.168.0.102:8014';
var baseURL =
  env === 'Production'
    ? 'https://ewallet1-api.ucsipay.com'
    : 'https://ewallet1-api-stg.ucsipay.com';
//  : 'http://172.16.50.154:8002';
// : 'http://172.16.40.25:8002';
// 'http://localhost:8002';

axios.interceptors.request.use(async function (config) {
  try {
    // axios.defaults.headers.common['Authorization'] = '88888';
    const httpMetric = perf().newHttpMetric(config.url, config.method);
    config.metadata = {httpMetric};
    // add any extra metric attributes, if required
    // httpMetric.putAttribute('userId', '12345678');

    await httpMetric.start();
  } finally {
    return config;
  }
});

axios.interceptors.response.use(
  async function (response) {
    try {
      // Request was successful, e.g. HTTP code 200

      const {httpMetric} = response.config.metadata;

      // add any extra metric attributes if needed
      // httpMetric.putAttribute('userId', '12345678');

      httpMetric.setHttpResponseCode(response.status);
      httpMetric.setResponseContentType(response.headers['content-type']);
      await httpMetric.stop();
    } finally {
      return response;
    }
  },
  async function (error) {
    try {
      // Request failed, e.g. HTTP code 500

      const {httpMetric} = error.config.metadata;

      // add any extra metric attributes if needed
      // httpMetric.putAttribute('userId', '12345678');

      httpMetric.setHttpResponseCode(error.response.status);
      httpMetric.setResponseContentType(error.response.headers['content-type']);
      console.log('Runned Error');
      await httpMetric.stop();
    } finally {
      // Ensure failed requests throw after interception
      return Promise.reject(error);
    }
  },
);

var instance = axios.create({
  baseURL: baseURL,
  timeout: 1800000,
});

const getAuthHeader = async () => {
  try {
    const token = await RNSecureStorage.get('jwt');
    // console.log(22, token);
    var auth_data = '';
    if (token) {
      auth_data = token;
    } else {
      auth_data = '';
    }
    instance.defaults.headers = {
      authorization: auth_data,
    };

    return {
      authorization: auth_data,
    };
  } catch (error) {
    console.log('authHeader', error);
  }
  return;
};

const AuthCredentialFunc = async () => {
  const res = await getAuthHeader();

  return res;
};

const generateMediaLinkFromUID = uid => {
  return `${baseURL}/api/media/${uid}`;
};

export const Connector = instance;
export const ApiUrl = baseURL;
export const AuthHeader = getAuthHeader;
export const AuthCredential = AuthCredentialFunc;
export const GenerateMediaLinkFromUID = generateMediaLinkFromUID;

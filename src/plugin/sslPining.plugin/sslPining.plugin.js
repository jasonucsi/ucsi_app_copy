import {fetch} from 'react-native-ssl-pinning';
import {ApiUrl} from '../../tools/Api/api';

export default {
  apiSSLCheck: () => {
    return fetch(ApiUrl + '/version', {
      method: 'GET',
      timeoutInterval: 10000,
      pkPinning: true,
      sslPinning: {
        certs: [
          'sha256/eS3YXADYzC/oXgvWVcB1CeGMTdjkAGHGWS9498BiO8I=', // Cloudflare
          'sha256/gqDvw0ix4h9TWMjW1C7/P9FgYkoxnPMRMBONpxdRubM=', // Origin Server Certificate
        ],
      },
      // disableAllSecurity: true,
    })
      .then(response => {
        console.log(response, 17);
        return {
          error: false,
        };
      })
      .catch(err => {
        console.log(err, 20);
        return {
          error: true,
        };
      });
  },
};

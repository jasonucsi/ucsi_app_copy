import {Platform} from 'react-native';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';

export default {
  requestCameraPermission: () => {
    if (Platform.OS === 'ios') {
      return request(PERMISSIONS.IOS.CAMERA).then(res => {
        return res;
      });
    } else {
      return request(PERMISSIONS.ANDROID.CAMERA).then(res => {
        return res;
      });
    }
  },
  requestGalleryPermission: () => {
    if (Platform.OS === 'ios') {
      return request(PERMISSIONS.IOS.PHOTO_LIBRARY).then(res => {
        return res;
      });
    } else {
      return request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES).then(res => {
        return res;
      });
    }
  },
};

import DeviceInfo from 'react-native-device-info';
import {Platform} from 'react-native';
import {
  getTrackingStatus,
  requestTrackingPermission,
} from 'react-native-tracking-transparency';

const _status = {
  unavailable: {
    code: 'unavailable',
  },
  denied: {
    code: 'denied',
  },
  authorized: {
    code: 'authorized',
  },
  restricted: {
    code: 'restricted',
  },
  unavailable: {
    code: 'unavailable',
  },
  'not-determined': {
    code: 'not-determined',
  },
};

const requestTrackingStatus = async () => {
  if (Platform.OS !== 'ios') {
    return {};
  }
  const trackingStatus = await getTrackingStatus();
  console.log(trackingStatus, 34);
  if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
    // enable tracking features
    return {
      status: 'ok',
    };
  } else {
    return {
      status: 'error',
      message: 'Tracking unauthorized',
    };
  }
};

const requestTracking = async () => {
  if (Platform.OS !== 'ios') {
    return {};
  }
  const trackingStatus = await requestTrackingPermission();
  if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
    // enable tracking features
    return {
      status: 'ok',
    };
  } else {
    return {
      status: 'error',
      message: 'Tracking unauthorized',
    };
  }
};

export default {requestTrackingStatus, requestTracking};

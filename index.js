/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {enableScreens} from 'react-native-screens';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import PushNotificationPlugin from './src/plugin/pushNotification.plugin/pushNotification.plugin';

enableScreens();
// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);

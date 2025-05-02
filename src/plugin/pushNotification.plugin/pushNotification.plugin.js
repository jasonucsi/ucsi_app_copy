import {Platform} from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import isEmpty from 'is-empty';
import messaging from '@react-native-firebase/messaging';
export default pushNofication = {
  Configure: (navigation, contextProvider) => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: async function (token) {
        console.log('TOKEN:', token);

        // console.log(contextProvider);
        if (Platform.OS === 'android') {
          contextProvider.setNotificationToken(token);
        } else if (Platform.OS === 'ios') {
          messaging().requestPermission();
          const fcmToken = await messaging().getToken();
          console.log({token: fcmToken, os: Platform.OS});
          contextProvider.setNotificationToken({token: fcmToken, os: 'ios'});
        }

        PushNotification.createChannel(
          {
            channelId: '88888888', // (required)
            channelName: 'Default Notification Channel', // (required)
            channelDescription: 'Default Notification', // (optional) default: undefined.
            // soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function

            importance: 4, // (optional) default: 4. Int value of the Android notification importance
            vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
            banner: true,
          },
          created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
        );

        // PushNotification.createChannel(
        //   {
        //     channelId: '74639690', // (required)
        //     channelName: 'Seller Order Request Notification', // (required)
        //     channelDescription: 'Seller receive order request long.', // (optional) default: undefined.
        //     // soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        //     importance: 4, // (optional) default: 4. Int value of the Android notification importance
        //     vibrate: true,
        //     banner: true,
        //     // (optional) default: true. Creates the default vibration patten if true.
        //   },
        //   created =>
        //     console.log(
        //       `seller receive order createChannel returned '${created}'`,
        //     ), // (optional) callback returns whether the channel was created, false means it already existed.
        // );
      },
      onRegistrationError: function (err) {
        console.log('Registration Error', err);
      },
      // (required) Called when a remote or local notification is opened or received
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        console.log('Navigation', navigation);
        console.log(contextProvider);
        // process the notification

        // required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/react-native-push-notification-ios)
        if (Platform.OS === 'ios') {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        } else {
          notification.finish();
        }

        // return;
        // return handleOnNotification(notification);

        // var androidClicked = false;
        // var iosClicked = 0
        // if (Platform.OS === 'android')
        //  androidClicked = notification.userInteraction;
        //  else
        //  iosClicked = notification.data.userInteraction
        // console.log('clicked', clicked);
        // if (androidClicked || iosClicked) {
        //   contextProvider.onClickNotification();
        // }

        const clicked =
          Platform.OS === 'android'
            ? notification.userInteraction
            : notification.data.userInteraction;

        if (clicked) {
          contextProvider.onClickNotification();
        }

        const type =
          Platform.OS === 'android'
            ? isEmpty(notification.data)
              ? notification.type
              : notification.data.type
            : notification.data.type;
        const path =
          Platform.OS === 'android'
            ? isEmpty(notification.data)
              ? notification.path
              : notification.data.path
            : notification.data.path;
        const id =
          Platform.OS === 'android'
            ? isEmpty(notification.data)
              ? notification.id
              : notification.data.id
            : notification.data.id;
        const businessId =
          Platform.OS === 'android'
            ? isEmpty(notification.data)
              ? notification.businessId
              : notification.data.businessId
            : notification.data.businessId;
        const url =
          Platform.OS === 'android'
            ? isEmpty(notification.data)
              ? notification.url
              : notification.data.url
            : notification.data.url;

        switch (path) {
          case 'transactionDetails':
            //local transfer money completed notification refer to (TransferMoney)
            if (clicked) {
              navigation.reset({
                index: 1,
                routes: [
                  {name: 'home'},
                  {
                    name: 'TransactionDetails',
                    params: {
                      data: type,
                    },
                  },
                  // {name: 'merchantTrx', params: {}},
                ],
              });
            }
            break;

          case 'Transaction':
            if (clicked) {
              navigation.reset({
                index: 1,
                routes: [
                  {name: 'home'},
                  {
                    name: 'TransactionDetails',
                    params: {
                      data: {},
                      id,
                      businessId,
                    },
                  },
                  // {name: 'merchantTrx', params: {}},
                ],
              });
            }
            break;

          case 'News':
            if (clicked) {
              navigation.reset({
                index: 1,
                routes: [
                  {name: 'home'},
                  {
                    name: 'NotificationWebview',
                    params: {
                      url,
                      // id,
                      // businessId,
                    },
                  },
                  // {name: 'merchantTrx', params: {}},
                ],
              });
            }
            break;

          default:
            if (clicked) {
              navigation.reset({
                index: 0,
                routes: [{name: 'home'}],
              });
            }
            break;
        }
      },

      // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
      senderID: '711335305311', // From Firebase

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       */
      requestPermissions: true,
    });
  },

  sendLocalNotification: (
    id,
    title,
    message,
    data = {
      // type: String,
      // path: String,
    },
    options = {},
  ) => {
    PushNotification.localNotification({
      // Android
      id: id ? id : null,
      autoCancel: true,
      bigText: message,
      subText: title,
      vibrate: true,
      vibration: 300,
      priority: 'high',
      channelId: '88888888',
      // iOS
      title: title,
      message: message,
      playSound: true,

      // Custom data android
      ...data,
      // Custom data ios
      userInfo: isEmpty(data) ? {} : {...data},
    });

    // if (Platform.OS === 'ios') {
    //   PushNotificationIOS.presentLocalNotification({
    //     alertTitle: title,
    //     alertBody: message,
    //     ...data,
    //   });
    // }
  },
};

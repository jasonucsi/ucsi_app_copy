// import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  Platform,
  View,
  StatusBar,
  Linking,
  Text,
  Image,
  Dimensions,
  AppState,
  PermissionsAndroid,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import codePush from 'react-native-code-push';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SplashScreen from 'react-native-splash-screen';
import RNRestart from 'react-native-restart';
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';
import Geolocation from '@react-native-community/geolocation';
import GeolocationService from 'react-native-geolocation-service';
import I18n from './src/locales';
import AuthApi from './src/tools/Api/auth.api';
// import {ResponseError} from './src/tools/ErrorHandler/ErrorHandler';
import deviceInfoPlugin from './src/plugin/deviceInfo.plugin/deviceInfo.plugin';
import Modal from 'react-native-modal';
import {ApiUrl} from './src/tools/Api/api';
import iOSTrackingPlugin from './src/plugin/iOSTracking.plugin/iOSTracking.plugin';
// import SellerSocket from "./src/tools/Api/seller/socket/socket.api";
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {Button} from 'react-native-elements';
import moment from 'moment';
import RNDeviceInfo from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';
// Function
import {firebase} from '@react-native-firebase/perf';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import messaging from '@react-native-firebase/messaging';
import OwnSplashScreen from './src/screen/splash/splash';
import pushNotificationPlugin from './src/plugin/pushNotification.plugin/pushNotification.plugin';
// import PlaySound from "./src/plugin/playSound.plugin/playSound.plugin";
import deviceApi from './src/tools/Api/device.api';
import {PrimaryColor} from './src/tools/Constant/Constant';
//Screen
import OnBoardingPage from './src/screen/OnBoardingPage/OnBoardingPage';
import StepList from './src/screen/SignUp/components/StepList';
import SignUp from './src/screen/SignUp/SignUp';
import SignUpSuccessful from './src/screen/SignUp/components/SignUpSuccessful';
import LoginPage from './src/screen/loginPage/loginPage';
import LoginOTP from './src/screen/loginPage/components/loginOTP';
import LoginPIN from './src/screen/loginPage/components/LoginPIN';
import home from './src/screen/Home/Home';
import Kyc from './src/screen/Kyc/Kyc';
import KycStartExploring from './src/screen/Kyc/components/KycStartExploring';
import KycRejected from './src/screen/Kyc/components/KycRejected';
import TopUp from './src/screen/TopUp/TopUp';
import FirstTimeTopUp from './src/screen/TopUp/components/FirstTimeTopUp';
import TopUpMethod from './src/screen/TopUp/components/TopUpMethod';
import PaymentMethod from './src/screen/TopUp/components/PaymentMethod';
import AddCard from './src/screen/TopUp/components/AddCard';
import Account from './src/screen/Account/Account';
import EditProfile from './src/screen/Account/components/EditProfile';
import CardDetails from './src/screen/Account/components/CardDetails';
import Receive from './src/screen/Home/components/Receive/Receive';
import PaymentStatus from './src/screen/PaymentStatus/PaymentStatus';
import Transfer from './src/screen/PaymentStatus/components/Transfer';
import TransferMoney from './src/screen/PaymentStatus/components/TransferMoney';
import TransactionHistory from './src/screen/TransactionHistory/TransactionHistory';
import TransactionDetails from './src/screen/TransactionDetails/TransactionDetails';
import ChangePin from './src/screen/SecureCode/components/ChangePin';
import ForgetPin from './src/screen/SecureCode/components/ForgetPin';
import UcsiCard from './src/screen/UcsiCard/UcsiCard';
import AddUcsiCard from './src/screen/UcsiCard/components/AddUcsiCard';
import PromotionDetails from './src/screen/Promotion/PromotionDetails';
import ChangeMobileNumber from './src/screen/Account/components/ChangeMobileNumber';
import DiscoverMerchant from './src/screen/DiscoverMerchant/DiscoverMerchant';
import MerchantDetails from './src/screen/DiscoverMerchant/components/MerchantDetails';
import MerchantTransactionHistory from './src/screen/MerchantTransactionHistory/MerchantTransactionHistory';
import TopUpStatus from './src/screen/TopUp/TopUpStatus';
import TncPdf from './src/screen/Account/components/TncPdf';
import PrivacyPolicyPdf from './src/screen/Account/components/PrivacyPolicyPdf';
import RefundPolicyPdf from './src/screen/Account/components/RefundPolicyPdf';
import UcsiPayWebview from './src/screen/Account/components/UcsiPayWebview';
import eTranscriptWebview from './src/screen/Account/components/eTranscriptWebview';
import ePortfolioWebView from './src/screen/Account/components/ePortfolioWebview';
import AuthenticationWebView from './src/screen/Account/components/AuthenticationWebview';
import Arrival from './src/screen/Portal/ArrivalWebview';
import Iis from './src/screen/Portal/IisWebview';
import CourseNetworking from './src/screen/Portal/CnWebview'; 
import UCSIBus from './src/screen/Portal/BusWebview';
import Office365 from './src/screen/Portal/OfficeWebview';
import Email from './src/screen/Portal/MailWebview';
import Vpn from './src/screen/Portal/VpnWebview';
import Library from './src/screen/Portal/LibraryWebview';
import Resources from './src/screen/Portal/ResourcesWebview';
import Authenticator from './src/screen/Portal/AuthenticatorWebview';
import Download from './src/screen/Portal/DownloadWebview';
import Coop from './src/screen/Portal/CoopWebview';
import Marketplace from './src/screen/Portal/MarketplaceWebview';
import Ucsi1CardWebview from './src/screen/Home/components/Ucsi1CardWebview';
import ReloadWebview from './src/screen/TopUp/components/ReloadWebview';
import UcsiCardHistory from './src/screen/UcsiCard/components/UcsiCardHistory';
import NotificationWebview from './src/screen/NotificationWebview/NotificationWebview';
import Parking from './src/screen/Parking/Parking';
import ParkingPayment from './src/screen/Parking/ParkingPayment';
import ParkingStatus from './src/screen/Parking/ParkingStatus';
import { WebView } from 'react-native-webview';



// import GestureDemo from './src/screen/PaymentStatus/components/GestureDemo';

const ReactContext = React.createContext();
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MIN_BACKGROUND_DURATION_IN_MIN = 3;

NetInfo.configure({
  reachabilityUrl: `${ApiUrl}/version`,
  reachabilityTest: async response => response.status === 200,
  reachabilityLongTimeout: 300000,
  reachabilityRequestTimeout: 15000,
  reachabilityShortTimeout: 30000,
});

class App extends Component {
  state = {
    showIntro: true,
    isBan: false,
    isAuth: false,
    loginMode: 'user',
    location: {
      // latitude: 5.285153,
      // longitude: 100.456238,
      // latitudeDelta: 0.004,
      // longitudeDelta: 0.004
    },
    position: {},
    error: null,
    appsLanguage: 'en',
    languageFound: true,
    language: '',
    languageModalVisible: false,
    notificationToken: {
      token: '',
      os: '',
    },
    my_profile: {},
    merchant_profile: {},
    codePushMeta: '',
    appVersionModalVisible: false,
    sensorStatus: '',
    sensorStatusModalVisible: false,
    notificationClicked: false,
    reviewModalVisible: false,
    reviewOrderNumber: '',
    appState: AppState.currentState,
    lastBackgroundedTime: 0, //codepush use
    searchLocation: true,
    advertisementModalVisible: false,
    codePushDownloadProgress: false,
    codePushStatus: '',
    deploymentType: 'production', // production
    deeplinkUrl: '',
    // statusBarColor: PrimaryColor,
    statusBarColor: 'transparent',
    networkInfo: {},
    connectivityModalVisible: false,
    buyerUnreadCSMsgCount: 0,
    activeVoucherCount: 0,
    getLocationAttempt: 0,
    isCPDownload: true,
    connectionFail: false,
    cartQuantity: 0,
    isSocketDisconnect: false,
    activeOrderQty: 0,
    signUpStep: {
      mobile_number: null,
      step: 0,
    },
    showSecureScreen: false,
  };

  NetInfoEvent = null;

  componentDidMount() {
    this.mounted = true;
    SplashScreen.hide();
    this.initSystem();
    // this.VersionCheck();

    // if (Platform.OS === 'ios') {
    //   PushNotificationIOS.addEventListener(
    //     'notification',
    //     this.onRemoteNotification,
    //   );
    // }

    this.NetInfoEvent = NetInfo.addEventListener(this.NetInfoListener);
    AppState.addEventListener('change', this.handleAppStateChange);
    messaging().onMessage(this.onRemoteNotification);
    if (Platform.OS === 'ios') {
      PushNotificationIOS.setApplicationIconBadgeNumber(0);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    // Linking.removeEventListener('url', this._handleOpenURL);
    AppState.removeEventListener('change', this.handleAppStateChange);
    this.NetInfoEvent && this.NetInfoEvent();
  }

  onRemoteNotification = async notification => {
    if (Platform.OS === 'ios') {
      await pushNotificationPlugin.sendLocalNotification(
        moment().unix(),
        notification?.notification?.title,
        notification?.notification?.body,
        {
          ...(notification && notification.data ? notification.data : {}),
        },
      );
    } else {
      await pushNotificationPlugin.sendLocalNotification(
        moment().unix(),
        notification?.notification?.title,
        notification?.notification?.body,
        {
          data: {
            ...(notification && notification.data ? notification.data : {}),
          },
        },
      );
    }
  };

  initSystem = async () => {
    // await this.getLocale();
    codePush.notifyAppReady();

    await Promise.all[
      (this.FirebaseCheckPermission(),
      this.setAuth(),
      this.clearIntroScreen(),
      this.initCodePush(),
      // this.initAnalytics(),
      iOSTrackingPlugin.requestTracking(),
      this.VersionCheck())
    ];

    // console.log("versioncheck", res);
    // if (res) {
    //   await this.setAuth();
    //   await Promise.all([
    //     // this.VersionCheck(),
    //     this.getGPSLocation()
    //     // this.getLocale(),
    //     // this.initSocket()
    //   ]);
    // setTimeout(async () => {
    //   await this.registerDevice();
    // }, 1000);
    // }
  };

  // initSocket = async () => {
  //   try {
  //     console.log("init socket");
  //     const jwt = await RNSecureStorage.get("jwt");
  //     if (jwt) {
  //       // const socket = await SellerSocket.initSocket(jwt);
  //       // console.log(socket);
  //       this.socket = SellerSocket.initSocket(jwt);
  //       this.socket.on("connect", () => {
  //         console.log("Socket Connected");
  //         this.setState({ isSocketDisconnect: this.socket.disconnected });
  //       });

  //       this.socket.on("disconnect", () => {
  //         console.log("Socket disconnect");
  //         this.setState({ isSocketDisconnect: this.socket.disconnected });
  //       });

  //       this.socket.on("connect_error", (err) => {
  //         console.log("Socket connection failed", err);
  //         this.setState({ isSocketDisconnect: this.socket.disconnected });
  //       });
  //     }
  //   } catch (error) {
  //     console.log("initSocket", error);
  //   }
  // };

  GetUserData = async () => {
    // await RNSecureStorage.set("loginuserid", "48", {
    //   accessible: ACCESSIBLE.WHEN_UNLOCKED,
    // });

    RNSecureStorage.get('jwt')
      .then(async value => {
        const res = await AuthApi.getProfile();
        console.log('UserData', res);

        if (res.status === 200) {
          this.setState(
            {
              my_profile: res.data,
            },
            () => {
              this.initAnalytics();
            },
          );
        }

        console.log(value);
      })
      .catch(err => {
        console.log(err);
      });
  };

  FirebaseCheckPermission = async () => {
    const enabled = await messaging().requestPermission({
      alert: true,
      sound: true,
    });
    console.log('Firebase', enabled);
    const deviceRegistered = await messaging()
      .isDeviceRegisteredForRemoteMessages;
    console.log(deviceRegistered);
    try {
      const token = await messaging().getToken();
      console.log('MyToken', token);
    } catch (error) {
      console.log(error);
    }
  };

  VersionCheck = async () => {
    const res = await AuthApi.getAppVersion();
    const appVersion = await deviceInfoPlugin.getAppVersion();
    console.log('app version', appVersion);
    console.log('device version', appVersion);

    if (res.status === 200) {
      if (Platform.OS === 'ios') {
        if (appVersion.appVersion < res.data.minIosVersion) {
          console.log('app < min ios');
          this.setState({appVersionModalVisible: true});
        }
      } else if (Platform.OS === 'android') {
        if (appVersion.appVersion < res.data.minAndroidVersion) {
          console.log('app < min android');
          this.setState({appVersionModalVisible: true});
        }
      }
      return true;
    } else {
      // this.setState({ connectionFail: true });
      return false;
    }

    // const appVersion = await deviceInfoPlugin.getAppVersion();
    // console.log(appVersion);
    // console.log(res);
    // if (res.status === 200) {
    //   if (Platform.OS === "ios") {
    //     if (appVersion.appVersion < res.data.data.min_ios_version) {
    //       console.log("app < min ios");
    //       this.setState({ appVersionModalVisible: true });
    //     }
    //   } else if (Platform.OS === "android") {
    //     if (appVersion.appVersion < res.data.data.min_android_version) {
    //       console.log("app < min android");
    //       this.setState({ appVersionModalVisible: true });
    //     }
    //   }
    //   return true;
    // } else {
    //   this.setState({ connectionFail: true });
    //   return false;
    // }
  };

  setNotificationToken = token => {
    this.setState({
      notificationToken: token,
    });
  };

  onClickNotification = async () => {
    this.setState({notificationClicked: true});
  };

  checkLocationService = async () => {
    const locationService = await deviceInfoPlugin.checkMobileSensorStatus();
    console.log(locationService);
    this.setState({sensorStatus: locationService}, () => {
      if (!this.state.sensorStatus.locationService) {
        this.setState({sensorStatusModalVisible: true});
      }
    });
    return locationService;
  };

  NetInfoListener = state => {
    console.log(660, 'netinfo ', state);
    this.setState({networkInfo: state}, () => {
      if (
        // (this.state.networkInfo.type === 'cellular' &&
        //   this.state.networkInfo.details.cellularGeneration !== '4g' &&
        //   this.state.networkInfo.details.cellularGeneration !== '5g') ||
        this.state.networkInfo.isInternetReachable === false
      ) {
        if (!this.state.connectivityModalVisible) {
          this.setState({connectivityModalVisible: true});
        }
      } else {
        this.setState({connectivityModalVisible: false});
      }
      console.log(this.state.networkInfo);
    });
  };

  handleAppStateChange = async nextAppState => {
    console.log('appState', nextAppState);
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App come to foreground');
      this.setState({showSecureScreen: false});
      this.VersionCheck();
      // this.getGPSLocation();
      // setTimeout(() => {
      //   this.setState({ searchLocation: false });
      // }, 1200);
      console.log(
        moment
          .duration(moment().diff(this.state.lastBackgroundedTime))
          .asMinutes(),
        MIN_BACKGROUND_DURATION_IN_MIN,
      );
      if (
        moment
          .duration(moment().diff(this.state.lastBackgroundedTime))
          .asMinutes() > MIN_BACKGROUND_DURATION_IN_MIN
      ) {
        this.getGPSLocation();
        // Please show the user some feedback while running this
        // This might take some time, especially if an update is available
        console.log('Sync Codepush');
        await codePush.sync(
          {
            installMode: codePush.InstallMode.ON_NEXT_RESUME,
            rollbackRetryOptions: {delayInHours: 1, maxRetryAttempts: 2},
            // updateDialog: true
          },
          this.codePushStatusDidChange.bind(this),
          this.codePushDownloadDidProgress.bind(this),
        );
      }
    }

    if (nextAppState.match(/inactive|background/)) {
      console.log('App goes to background / inactive');
      this.setState({lastBackgroundedTime: moment(), showSecureScreen: true});
      // if (messaging().isDeviceRegisteredForRemoteMessages()) {
      //   messaging().unregisterDeviceForRemoteMessages();
      // }
    }

    if (this.state.appState !== nextAppState) {
      this.setState({appState: nextAppState});
    }
    // this.setState({ appState: nextAppState });
  };

  iosRequestPermission = async () => {
    if (Platform.OS === 'ios') {
      // await Geolocation.requestAuthorization('whenInUse');
      await GeolocationService.requestAuthorization('whenInUse');
    } else if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }
  };

  getGPSLocation = async () => {
    console.log(
      'getting gps location',
      moment().unix(),
      this.state.getLocationAttempt,
    );
    this.setState({
      searchLocation: true,
      // codePushStatus: 'Getting location...'
    });
    // console.log('start timing ', moment().unix());
    var gmsAvailability = false;
    if (Platform.OS === 'android') {
      gmsAvailability = await RNDeviceInfo.hasGms();
    }
    console.log('gms', gmsAvailability);

    if (Platform.OS === 'ios' || gmsAvailability) {
      GeolocationService.getCurrentPosition(
        position => {
          console.log(position);
          // console.log('end timing ', moment().unix());
          const region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.004,
            longitudeDelta: 0.004,
          };

          // if (this.state.getLocationAttempt === 0) {
          //   return this.setState({
          //     searchLocation: false,
          //     error: 'Failed to get location'
          //   });
          // }
          this.setState(
            {
              location: region,
              position,
              searchLocation: false,
              getLocationAttempt: 0,
            },
            () => this.setState({showIntro: false /* , codePushStatus: '' */}),
          );
          console.log('location get ', moment().unix());
        },
        error => {
          console.log(721, error.message, moment().unix());
          if (
            error.message === 'No location provider available.' ||
            error.message === 'Location services disabled.' ||
            error.message === 'Location settings are not satisfied.' ||
            error.message === 'Location service is turned off'
          ) {
            return this.setState({
              error: error.message,
              searchLocation: false,
            });
          }
          if (this.state.getLocationAttempt > 1) {
            return this.setState({
              error: 'Failed to get location',
              searchLocation: false,
            });
          }
          this.setState(
            {
              error: error.message,
              getLocationAttempt:
                this.state.getLocationAttempt + 1 /* searchLocation: false */,
            },
            () => this.getGPSLocation(),
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 1000,
        },
      );
    } else {
      Geolocation.getCurrentPosition(
        position => {
          console.log(position);
          // console.log('end timing ', moment().unix());
          const region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.004,
            longitudeDelta: 0.004,
          };

          // if (this.state.getLocationAttempt === 0) {
          //   return this.setState({
          //     searchLocation: false,
          //     error: 'Failed to get location'
          //   });
          // }
          this.setState(
            {
              location: region,
              position,
              searchLocation: false,
              getLocationAttempt: 0,
            },
            () => this.setState({showIntro: false /* , codePushStatus: '' */}),
          );
          console.log('location get ', moment().unix());
        },
        error => {
          console.log(783, error.message, moment().unix());
          if (
            error.message === 'No location provider available.' ||
            error.message === 'Location services disabled.' ||
            error.message === 'Location settings are not satisfied.' ||
            error.message === 'Location service is turned off'
          ) {
            return this.setState({
              error: error.message,
              searchLocation: false,
            });
          }
          if (this.state.getLocationAttempt > 1) {
            return this.setState({
              error: 'Failed to get location',
              searchLocation: false,
            });
          }
          this.setState(
            {
              error: error.message,
              getLocationAttempt:
                this.state.getLocationAttempt + 1 /* searchLocation: false */,
            },
            () => this.getGPSLocation(),
          );
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 1000,
        },
      );
    }
  };

  setGPSLocation = location => {
    console.log(location);
    this.setState({location});
  };

  // getLocale = async () => {
  //   // await RNSecureStorage.remove('appsLanguage');
  //   try {
  //     const getLocale = await RNSecureStorage.get('appsLanguage');
  //     if (getLocale) {
  //       this.setState({languageFound: true});
  //     } else {
  //       await RNSecureStorage.set('appsLanguage', 'en', {
  //         accessible: ACCESSIBLE.WHEN_UNLOCKED,
  //       });
  //       this.setState({languageFound: true});
  //     }

  //     console.log('locale', getLocale);
  //   } catch (error) {
  //     console.log(error);
  //     this.setState(
  //       {languageFound: true}, //, () =>
  //       // this.setState({ languageModalVisible: true })
  //     );
  //   }
  // };

  onChangeLanguage = async languageSelected => {
    this.setState({appsLanguage: languageSelected, languageFound: true});
    I18n.locale = languageSelected;

    await RNSecureStorage.set('appsLanguage', languageSelected, {
      accessible: ACCESSIBLE.WHEN_UNLOCKED,
    });

    RNRestart.Restart();
  };

  navigate(url) {
    console.log('navigate', url);
    // alert(url);
    if (url) {
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          this.setState({showIntro: false}, () => {
            let shopPos = url.indexOf('shop');
            let productPos = url.indexOf('product');
            if (shopPos !== -1) {
              let shopTypePos = url.indexOf('/', shopPos) + 1;
              let lastSlashPos = url.lastIndexOf('/');
              let shopType = url.substring(shopTypePos, lastSlashPos);
              let shopId = url.substring(lastSlashPos + 1);
              // alert(shopType + ',' + shopId);
              if (this.mounted)
                this.navigationRef.navigate('market_seller', {
                  shop_id: shopId,
                  shop_type: shopType,
                });
            } else if (productPos !== -1) {
              let productNumber = url.substring(url.lastIndexOf('/') + 1);
              if (this.mounted)
                this.navigationRef.navigate('market_variant', {
                  product_number: productNumber,
                });
            }
          });
        }
      });
    }
    // this.setState({ deeplinkUrl: url, showIntro: false });
  }

  _handleOpenURL(event) {
    console.log('handle open url', event.url);
    // alert(event.url);
    Linking.canOpenURL(event.url).then(supported => {
      // alert(supported + ', ' + event.url);
      if (supported) {
        // alert(event.url);
        let shopPos = event.url.indexOf('shop');
        let productPos = event.url.indexOf('product');
        if (shopPos !== -1) {
          let shopTypePos = event.url.indexOf('/', shopPos) + 1;
          let lastSlashPos = event.url.lastIndexOf('/');
          let shopType = event.url.substring(shopTypePos, lastSlashPos);
          let shopId = event.url.substring(lastSlashPos + 1);
          // alert(shopType + ',' + shopId);
          // if (this.mounted)
          // this.navigationRef.navigate('market_seller', {
          //   shop_id: shopId,
          //   shop_type: shopType
          // });
          this.navigationRef.navigate('Device Information');
        } else if (productPos !== -1) {
          let productNumber = event.url.substring(
            event.url.lastIndexOf('/') + 1,
          );
          console.log(productNumber);
          // if (this.mounted)
          this.navigationRef.navigate('Device Information');
          // this.navigationRef.navigate('market_variant', {
          //   product_number: productNumber
          // });
        }
      }
    });
  }

  codePushStatusDidChange(status) {
    switch (status) {
      case codePush.SyncStatus.CHECKING_FOR_UPDATE:
        console.log('Checking for updates.');
        // this.setState({ codePushStatus: 'Checking for updates...' });
        break;
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        console.log('Downloading package.');
        // this.setState({ codePushStatus: 'Downloading package...' });
        break;
      case codePush.SyncStatus.INSTALLING_UPDATE:
        console.log('Installing update.');
        // this.setState({ codePushStatus: 'Installing update...' });
        break;
      case codePush.SyncStatus.UP_TO_DATE:
        console.log('Up to date.');
        this.setState({isCPDownload: false});
        // this.setState({ codePushStatus: 'Up to date', showIntro: false });
        break;
      case codePush.SyncStatus.UPDATE_INSTALLED:
        console.log('Update installed.');
        this.setState({isCPDownload: false});
        // this.setState({ codePushStatus: 'Update installed', showIntro: false });
        // RNRestart.Restart();
        break;
      case codePush.SyncStatus.UNKNOWN_ERROR:
        this.setState({isCPDownload: false});
        // this.setState({ codePushStatus: 'Network error', showIntro: false });
        break;
    }
  }

  codePushDownloadDidProgress(progress) {
    console.log(
      progress.receivedBytes + ' of ' + progress.totalBytes + ' received.',
    );
    this.setState({codePushDownloadProgress: progress}, () => {
      if (progress.receivedBytes === progress.totalBytes) {
        setTimeout(() => {
          this.setState({showIntro: false});
        }, 500);
      }
    });
  }

  initCodePush = async () => {
    // if (this.mounted) {
    const updateMeta = await codePush.getUpdateMetadata();
    console.log('codePush', updateMeta);

    // try {
    //   const locale = await RNSecureStorage.get("appsLanguage");
    //   if (!locale) {
    //     return;
    //   }
    // } catch (error) {
    //   if (!locale) {
    //     return;
    //   }
    // }
    await codePush.sync(
      {
        installMode: codePush.InstallMode.ON_NEXT_RESUME,
        rollbackRetryOptions: {delayInHours: 1, maxRetryAttempts: 2},
        // updateDialog: true
      },
      this.codePushStatusDidChange.bind(this),
      this.codePushDownloadDidProgress.bind(this),
    );

    this.setState(
      {
        codePushMeta: updateMeta,
        showIntro: false,
        statusBarColor: PrimaryColor,
      },
      () => {
        if (!updateMeta) {
          this.setState({
            codePushMeta: {
              appVersion: Platform.select({ios: '1.0.1', android: '1.0.1'}),
              label: '-',
            },
          });
        }
      },
    );
    // codePush.restartApp(true);
    // }
  };

  clearIntroScreen = () => {
    setTimeout(() => {
      this.setState({
        showIntro: false,
      });
      // }, 1500);
    }, 1000);
  };

  setAuth = async () => {
    try {
      const jwt = await RNSecureStorage.get('jwt');
      console.log(jwt);
      // const loginuserid = await RNSecureStorage.get('loginuserid');
      // console.log(loginuserid);
      // const profile = await RNSecureStorage.get('my_profile');
      // console.log(JSON.parse(profile));
      // console.log(jwt);
      if (jwt) {
        this.setState({isAuth: true}, () => {
          // this.initSocket();
          this.GetUserData();
        });
      } else {
        this.setState({isAuth: false});
      }
    } catch (error) {
      console.log('setAuth', error);
      this.setState({isAuth: false});
    }
  };

  handleLogout = async () => {
    this.setState({isAuth: false});
  };

  // registerDevice = async () => {
  //   try {
  //     console.log(this.state.notificationToken);
  //     const deviceInfo = await deviceInfoPlugin.getDeviceInfo();
  //     const jwt = await RNSecureStorage.get('jwt');
  //     if (jwt) {
  //       var res = await deviceApi.deviceDetails({
  //         ...deviceInfo,
  //         ...this.state.notificationToken,
  //       });
  //     }
  //     console.log('device', res);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  initAnalytics = async () => {
    await firebase.perf().setPerformanceCollectionEnabled(true);
    await crashlytics().setCrashlyticsCollectionEnabled(true);

    if (this.state.isAuth && this.state.my_profile) {
      await crashlytics().setUserId(this.state.my_profile._id);
      await crashlytics().setAttributes({
        role: 'user',
        account_number: this.state.my_profile._id,
        full_name: this.state.my_profile.name,
        contact: this.state.my_profile?.contact.number,
        email: this.state.my_profile.email,
      });
    } else {
      await crashlytics().setAttributes({
        role: 'user',
      });
    }
    crashlytics().log('App Start Successful');

    // Test log
    // if (Platform.OS === 'android') {
    //   console.log('Runned');
    //   await analytics().logEvent('basket_Android', {
    //     id: 3745092,
    //     item: 'mens grey t-shirt',
    //     description: ['round neck', 'long sleeved'],
    //     size: 'L',
    //   });
    // } else {
    //   await analytics().logEvent('basket_iOS', {
    //     id: 3745092,
    //     item: 'mens grey t-shirt',
    //     description: ['round neck', 'long sleeved'],
    //     size: 'L',
    //   });
    // }
  };

  setSignUpStep = step => {
    this.setState({
      signUpStep: step,
    });
  };

  setMyProfile = profile => {
    this.setState({
      my_profile: profile,
    });
  };

  render() {
    const languageModal = (
      <Modal
        isVisible={this.state.languageModalVisible}
        onModalHide={() => this.onChangeLanguage(this.state.language)}
        useNativeDriver
        hideModalContentWhileAnimating>
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            paddingVertical: 8,
            paddingHorizontal: 24,
          }}>
          <Text style={{paddingVertical: 8}}>
            {I18n.t('modalLanguageSelect.select')}
          </Text>
          <Button
            title={I18n.t('modalLanguageSelect.en')}
            type="outline"
            containerStyle={{paddingVertical: 8}}
            titleStyle={{color: PrimaryColor}}
            buttonStyle={{borderColor: PrimaryColor}}
            onPress={() => {
              this.setState({language: 'en'}, () =>
                this.setState({languageModalVisible: false}),
              );
              // setLanguage('en');
              // setLanguageModalVisible(false);
            }}
          />
          <Button
            title={I18n.t('modalLanguageSelect.ms')}
            type="outline"
            containerStyle={{paddingVertical: 8}}
            titleStyle={{color: PrimaryColor}}
            buttonStyle={{borderColor: PrimaryColor}}
            onPress={() => {
              this.setState({language: 'ms'}, () =>
                this.setState({languageModalVisible: false}),
              );
              // setLanguage('ms');
              // setLanguageModalVisible(false);
            }}
          />
          <Button
            title={I18n.t('modalLanguageSelect.zh')}
            type="outline"
            containerStyle={{paddingVertical: 8}}
            titleStyle={{color: PrimaryColor}}
            buttonStyle={{borderColor: PrimaryColor}}
            onPress={() => {
              this.setState({language: 'zh'}, () =>
                this.setState({languageModalVisible: false}),
              );
              // setLanguage('zh');
              // setLanguageModalVisible(false);
            }}
          />
        </View>
      </Modal>
    );

    const connectivityModal = (
      <Modal
        isVisible={this.state.connectivityModalVisible}
        // isVisible={this.state.connectionFail}
        useNativeDriver
        hideModalContentWhileAnimating>
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            justifyContent: 'center',
            paddingVertical: 28,
            paddingHorizontal: 16,
          }}>
          <Image
            source={require('./src/assest/image/logo/Network-error-FG-10.png')}
            resizeMode="contain"
            resizeMethod="scale"
            style={{
              width: '100%',
              height: Dimensions.get('window').height * 0.3,
            }}
          />
          <Text
            style={{
              fontSize: 18,
              textAlign: 'center',
              marginVertical: 16,
              fontWeight: 'bold',
            }}>
            Poor Network Connection
          </Text>
          {/* <Button
            title="Close"
            onPress={() => this.setState({ connectivityModalVisible: false })}
            buttonStyle={{ backgroundColor: '#014f86' }}
          /> */}
        </View>
      </Modal>
    );

    const AppVersionModal = (
      <Modal
        isVisible={this.state.appVersionModalVisible}
        useNativeDriver
        hideModalContentWhileAnimating>
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            paddingHorizontal: 16,
            paddingVertical: 28,
          }}>
          <Image
            source={require('./src/assest/image/logo/spanna-04.png')}
            resizeMode="contain"
            resizeMethod="scale"
            style={{
              width: '100%',
              height: Dimensions.get('window').height * 0.3,
            }}
          />
          <Text
            style={{
              fontSize: 18,
              textAlign: 'center',
              marginVertical: 16,
              fontWeight: 'bold',
            }}>
            Opps! The app version is not the latest. Go apps store to update the
            latest version.
          </Text>
        </View>
      </Modal>
    );

    const connectionFailModal = (
      <Modal
        isVisible={this.state.connectionFail}
        useNativeDriver
        hideModalContentWhileAnimating>
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            paddingHorizontal: 16,
            paddingVertical: 28,
          }}>
          <Image
            source={require('./src/assest/image/logo/spanna-04.png')}
            resizeMode="contain"
            resizeMethod="scale"
            style={{
              width: '100%',
              height: Dimensions.get('window').height * 0.3,
            }}
          />
          <Text
            style={{
              fontSize: 18,
              textAlign: 'center',
              marginVertical: 16,
              fontWeight: 'bold',
            }}>
            Opps! The app is currently down for maintenance. We're preparing to
            serve you better.
          </Text>
        </View>
      </Modal>
    );

    return (
      <SafeAreaProvider>
        <ReactContext.Provider
          value={{
            // getLocale: this.getLocale,
            contextProvider: this.state,
            getGPSLocation: this.getGPSLocation,
            onChangeLanguage: this.onChangeLanguage,
            setAuth: this.setAuth,
            getUserdata: this.GetUserData,
            setNotificationToken: this.setNotificationToken,
            handleLogout: this.handleLogout,
            setGPSLocation: this.setGPSLocation,
            checkLocationService: this.checkLocationService,
            onClickNotification: this.onClickNotification,
            initSocket: this.initSocket,
            setSignUpStep: this.setSignUpStep,
            setMyProfile: this.setMyProfile,
          }}>
          {languageModal}
          {/* {connectionFailModal} */}
          {connectivityModal}
          {AppVersionModal}
          <StatusBar
            animated
            backgroundColor={this.state.statusBarColor}
            translucent={true}
            barStyle="light-content"
          />
          <NavigationContainer
            ref={e => (this.navigationRef = e)}
            onReady={() => {
              this.routeNameRef = this.navigationRef.getCurrentRoute().name;
            }}
            onStateChange={async state => {
              const previousRouteName = this.routeNameRef;
              const currentRouteName =
                this.navigationRef.getCurrentRoute().name;
              if (previousRouteName !== currentRouteName) {
                await analytics().logScreenView({
                  screen_name: currentRouteName,
                  screen_class: currentRouteName,
                });
              }
              this.routeNameRef = currentRouteName;
            }}
            linking={{
              prefixes: [
                'ucsipay://',
                'https://www.ucsipay.com',
                'https://merchant.ucsipay.com',
              ],
              config: {
                screens: {
                  ForgetPin: {
                    path: 'forget-pin',
                  },
                  // market_variant: {
                  //   path: 'product/:product_number',
                  // },
                },
              },
            }}
            // fallback={<Text>Loading</Text>}
          >
            <Stack.Navigator
              initialRouteName="SplashScreen"
              // initialRouteName="home"
              screenOptions={{
                headerStyle: {backgroundColor: '#fff'},
                headerTintColor: PrimaryColor,
                headerTitleAlign: 'center',
                headerBackTitleVisible: false,
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                ...TransitionPresets.SlideFromRightIOS,
                // cardStyleInterpolator:
                //   CardStyleInterpolators.forHorizontalIOS,
                // transitionSpec: {
                //   open: closeConfig,
                //   close: closeConfig,
                // },
              }}
              // headerMode="float"
            >
              <Stack.Screen
                name="SplashScreen"
                component={OwnSplashScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="OnBoardingPage"
                component={OnBoardingPage}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="LoginPage"
                component={LoginPage}
                options={{
                  title: <Text style={{color: '#fff'}}>Login</Text>,
                  headerStyle: {backgroundColor: '#000'},
                  headerTitleAlign: 'center',
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="LoginOTP"
                component={LoginOTP}
                options={{
                  title: <Text style={{color: '#fff'}}>Login OTP</Text>,
                  headerStyle: {backgroundColor: '#000'},
                  headerTitleAlign: 'center',
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="LoginPIN"
                component={LoginPIN}
                options={{
                  title: <Text style={{color: '#fff'}}>Login PIN</Text>,
                  headerStyle: {backgroundColor: '#000'},
                  headerTitleAlign: 'center',
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="StepList"
                component={StepList}
                options={{
                  headerShown: false,
                  // title: 'Sign Up',
                }}
              />
              <Stack.Screen
                name="SignUp"
                component={SignUp}
                options={{
                  headerShown: false,
                  // title: 'Sign Up',
                }}
              />
              <Stack.Screen
                name="SignUpSuccessful"
                component={SignUpSuccessful}
                options={{
                  headerShown: false,
                  // title: 'Sign Up',
                }}
              />
              <Stack.Screen
                name="home"
                // component={Home}
                component={home}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Kyc"
                component={Kyc}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="KycStartExploring"
                component={KycStartExploring}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="KycRejected"
                component={KycRejected}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="FirstTimeTopUp"
                component={FirstTimeTopUp}
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="TopUp"
                component={TopUp}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'Top Up',
                  };
                }}
              />

              <Stack.Screen
                name="TopUpMethod"
                component={TopUpMethod}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'Top Up Method',
                  };
                }}
              />
              <Stack.Screen
                name="PaymentMethod"
                component={PaymentMethod}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title:
                      route.params.type === 'account'
                        ? 'My Bank Card(s)'
                        : 'Payment Method',
                  };
                }}
              />
              <Stack.Screen
                name="AddCard"
                component={AddCard}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'Add Card',
                  };
                }}
              />
              <Stack.Screen
                name="EditProfile"
                component={EditProfile}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'Edit Profile',
                  };
                }}
              />
              <Stack.Screen
                name="CardDetails"
                component={CardDetails}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'Card Details',
                  };
                }}
              />
              <Stack.Screen
                name="Receive"
                component={Receive}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Transfer"
                component={Transfer}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'Transfer',
                  };
                }}
              />
              <Stack.Screen
                name="TransferMoney"
                component={TransferMoney}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'Transfer',
                  };
                }}
              />
              <Stack.Screen
                name="TransactionHistory"
                component={TransactionHistory}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'Transaction History',
                  };
                }}
              />
              <Stack.Screen
                name="TransactionDetails"
                component={TransactionDetails}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'Transaction Details',
                  };
                }}
              />
              <Stack.Screen
                name="ChangePIN"
                component={ChangePin}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'Change PIN',
                  };
                }}
              />
              <Stack.Screen
                name="ForgetPin"
                component={ForgetPin}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'Forgot PIN',
                  };
                }}
              />
              <Stack.Screen
                name="UcsiCard"
                component={UcsiCard}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    headerShown: false,
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'UCSI Card',
                  };
                }}
              />
              <Stack.Screen
                name="PromotionDetails"
                component={PromotionDetails}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    // headerShown: false,
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'Promotion Details',
                  };
                }}
              />
              <Stack.Screen
                name="ChangeMobileNumber"
                component={ChangeMobileNumber}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    // headerShown: false,
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'Change Mobile No.',
                  };
                }}
              />
              <Stack.Screen
                name="DiscoverMerchant"
                component={DiscoverMerchant}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    // headerShown: false,
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'Discover Merchants',
                  };
                }}
              />
              <Stack.Screen
                name="MerchantDetails"
                component={MerchantDetails}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    // headerShown: false,
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'Merchant Details',
                  };
                }}
              />
              <Stack.Screen
                name="MerchantTransactionHistory"
                component={MerchantTransactionHistory}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    // headerShown: false,
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'Merchant Transaction History',
                  };
                }}
              />
              <Stack.Screen
                name="TopUpStatus"
                component={TopUpStatus}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    headerShown: false,
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'Top Up Status',
                  };
                }}
              />
              <Stack.Screen
              name="Marketplace"
              component={Marketplace}
              // options={{ headerShown: false }}
              // options={{ title: "Recipient Transfer" }}
              options={({route, navigation}) => {
                console.log(route);
                return {
                  // headerShown: false,
                  headerTintColor: '#fff',
                  headerStyle: {backgroundColor: PrimaryColor},
                  title: 'UCSI Marketplace',
                };
              }}
              />
              <Stack.Screen
              name="Arrival"
              component={Arrival}
              // options={{ headerShown: false }}
              // options={{ title: "Recipient Transfer" }}
              options={({route, navigation}) => {
                console.log(route);
                return {
                  // headerShown: false,
                  headerTintColor: '#fff',
                  headerStyle: {backgroundColor: PrimaryColor},
                  title: 'Arrival',
                };
              }}
              />
              <Stack.Screen
                name="AddUcsiCard"
                component={AddUcsiCard}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    headerShown: true,
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'Add New Card',
                  };
                }}
              />
              <Stack.Screen
              name="IIsV2"
              // component={Iis}
              options={{
                headerTitleStyle: { fontWeight: 'bold' },
                headerStyle: {backgroundColor: PrimaryColor}, 
                headerTintColor: '#FFFFFF',
                // headerRight: () => (
                //   <TouchableOpacity
                //     onPress={() => navigation.navigate('Download')}
                //     style={{ marginRight: 10 }}
                //   >
                //     <Text style={{ color: '#FFFFFF' }}>Click Here for Manual</Text>
                //   </TouchableOpacity>
                // ),
              }}
              >
              {({ navigation }) => (
                <View style={styles.container}>
                  <View style={styles.downloadButtonContainer}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Download')}
                      style={styles.downloadButtonTouchable}
                    >
                      <Text style={styles.downloadButtonText}>Click Here for Manual</Text>
                    </TouchableOpacity>
                  </View>
                  {/* <WebViewScreen /> */}
                  <Iis/>
                </View>
              )}
            </Stack.Screen>
            <Stack.Screen name="Download" component={Download}   
            options={{
              headerTintColor: '#fff',
              headerStyle: {backgroundColor: PrimaryColor}, 
            }}/>
            <Stack.Screen
              name="TheCN"
              component={CourseNetworking}
              // options={{ headerShown: false }}
              // options={{ title: "Recipient Transfer" }}
              options={({route, navigation}) => {
                console.log(route);
                return {
                  // headerShown: false,
                  headerTintColor: '#fff',
                  headerStyle: {backgroundColor: PrimaryColor},
                  title: 'TheCN',
                };
              }}
              />
              <Stack.Screen
                name="UCSI Bus"
                component={UCSIBus}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    // headerShown: false,
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'UCSI Bus',
                  };
                }}
              />
              <Stack.Screen
                name="Email"
                component={Email}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    // headerShown: false,
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'Email',
                  };
                }}
              />
              <Stack.Screen
                name="Office365"
                options={{
                title: 'Office365',
                headerTitleStyle: { fontWeight: 'bold' },
                headerStyle: { backgroundColor: PrimaryColor },
                headerTintColor: '#FFFFFF',
                }}
              >
              {({ navigation }) => (
                <View style={styles.container}>
                  <View style={styles.authButtonContainer}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Authenticator')}
                      style={styles.authButtonTouchable}
                    >
                      <Text style={styles.authButtonText}>Click Here for Authenticator Guide</Text>
                    </TouchableOpacity>
                  </View>
                  <Office365/>
                </View>
              )}
              </Stack.Screen>
              <Stack.Screen name="Authenticator" component={Authenticator}
              options={{
                headerTintColor: '#fff',
                headerStyle: {backgroundColor: PrimaryColor}, 
              }}/>
              <Stack.Screen
                name="VPN"
                component={Vpn}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    // headerShown: false,
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'VPN',
                  };
                }}
              />
              <Stack.Screen
                name="Library"
                component={Library}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    // headerShown: false,
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'Library',
                  };
                }}
              />
              <Stack.Screen
                name="Resources"
                component={Resources}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    // headerShown: false,
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'Resources',
                  };
                }}
              />
              <Stack.Screen
              name="Coop"
              component={Coop}
              // options={{ headerShown: false }}
              // options={{ title: "Recipient Transfer" }}
              options={({route, navigation}) => {
                console.log(route);
                return {
                  // headerShown: false,
                  headerTintColor: '#fff',
                  headerStyle: {backgroundColor: PrimaryColor},
                  title: 'Coop Internship',
                };
              }}
              />
              {/* <Stack.Screen
                name="Authenticator"
                component={Authenticator}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    // headerShown: false,
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'Authenticator',
                  };
                }}
              /> */}
              <Stack.Screen
                name="TncPdf"
                component={TncPdf}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    headerShown: true,
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'Terms & Conditions',
                  };
                }}
              />
              <Stack.Screen
                name="PrivacyPolicyPdf"
                component={PrivacyPolicyPdf}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    headerShown: true,
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'Privacy Policy',
                  };
                }}
              />
              <Stack.Screen
                name="RefundPolicyPdf"
                component={RefundPolicyPdf}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    headerShown: true,
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'Refund Policy',
                  };
                }}
              />
              <Stack.Screen
                name="UcsiPayWebview"
                component={UcsiPayWebview}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    headerShown: true,
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'UCSI Pay Web',
                  };
                }}
              />
              <Stack.Screen
                name="eTranscriptWebview"
                component={eTranscriptWebview}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    headerShown: true,
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'eTranscript',
                  };
                }}
              />
              <Stack.Screen
                name="AuthenticationWebView"
                component={AuthenticationWebView}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    // headerShown: false,
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'Authentication',
                  };
                }}
              />
              <Stack.Screen
                name="ePortfolioWebView"
                component={ePortfolioWebView}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    // headerShown: false,
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'ePortfolio',
                  };
                }}
              />
              <Stack.Screen
                name="Ucsi1CardWebview"
                component={Ucsi1CardWebview}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    headerShown: true,
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'UCSI 1Card Merchants',
                  };
                }}
              />
              <Stack.Screen
                name="ReloadWebview"
                component={ReloadWebview}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    headerShown: true,
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'Top Up Wallet',
                  };
                }}
              />
              <Stack.Screen
                name="UcsiCardHistory"
                component={UcsiCardHistory}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    headerShown: true,
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'UCSI Card History',
                  };
                }}
              />
              <Stack.Screen
                name="NotificationWebview"
                component={NotificationWebview}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    headerShown: true,
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'Website',
                  };
                }}
              />
              <Stack.Screen
                name="Parking"
                component={Parking}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    headerShown: true,
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'UCSI Parking',
                  };
                }}
              />
              <Stack.Screen
                name="ParkingPayment"
                component={ParkingPayment}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    headerShown: true,
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'UCSI Parking Payment',
                  };
                }}
              />
              <Stack.Screen
                name="ParkingStatus"
                component={ParkingStatus}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    headerShown: false,
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'UCSI Parking Status',
                  };
                }}
              />
              {/* <Stack.Screen
                name="GestureDemo"
                component={GestureDemo}
                // options={{ headerShown: false }}
                // options={{ title: "Recipient Transfer" }}
                options={({route, navigation}) => {
                  console.log(route);
                  return {
                    headerTintColor: '#fff',
                    headerStyle: {backgroundColor: PrimaryColor},
                    title: 'GestureDemo',
                  };
                }}
              /> */}

              <Stack.Screen
                name="PaymentStatus"
                component={PaymentStatus}
                options={{headerShown: false}}
                // options={{ title: "Payment Status" }}
              />

              <Stack.Screen
                name="Account"
                component={Account}
                options={{
                  headerShown: false,
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </ReactContext.Provider>
        {this.state.showSecureScreen ? (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#fff',
            }}>
            <ImageBackground
              source={require('./src/assest/image/UcsiLogo/ucsi_splash_background.png')}
              style={{flex: 1}}>
              <View
                style={{
                  paddingTop: Dimensions.get('window').height * 0.2,
                  alignItems: 'center',
                  flex: 1,
                }}>
                <Image
                  source={require('./src/assest/image/UcsiLogo/ucsi_white_logo.png')}
                  style={{
                    width: Dimensions.get('window').width * 0.7,
                    height: Dimensions.get('window').height * 0.5,
                  }}
                  resizeMode="contain"
                  resizeMethod="auto"
                  fadeDuration={800}
                />
              </View>
            </ImageBackground>
          </View>
        ) : null}
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  downloadButtonContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  downloadButtonTouchable: {
    width: 300, // Set width to desired size
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: '#CE1E22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontSize: 16, // Adjust font size if needed
  },
  authButtonContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  authButtonTouchable: {
    width: 300, // Set width to desired size
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: '#CE1E22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 16, // Adjust font size if needed
  },
})

export default codePush({
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  // checkFrequency: codePush.CheckFrequency.MANUAL,
  rollbackRetryOptions: {delayInHours: 1, maxRetryAttempts: 3},
})(App);




export const context = ReactContext;

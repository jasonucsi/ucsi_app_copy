import {useFocusEffect} from '@react-navigation/core';
import {HeaderBackButton} from '@react-navigation/stack';
import React, {useCallback, useState, useContext, useEffect} from 'react';
import {
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  Switch,
  Text,
  TouchableWithoutFeedback,
  View,
  ToastAndroid,
  ImageBackground,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';
import {Avatar, Button, Icon, ListItem} from 'react-native-elements';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import biometricPlugin from '../../plugin/biometric.plugin/biometric.plugin';
import deviceInfo from '../../plugin/deviceInfo.plugin/deviceInfo.plugin';
import {
  PrimaryColor,
  windowHeight,
  windowWidth,
} from '../../tools/Constant/Constant';
import {TouchableOpacity} from 'react-native';
import {useForm} from 'react-hook-form';
import RNRestart from 'react-native-restart';
import I18n from '../../locales';
import AuthApi from '../../tools/Api/auth.api';
import TransactionApi from '../../tools/Api/transaction.api';
import {ResponseError} from '../../tools/ErrorHandler/ErrorHandler';
import {WebView} from 'react-native-webview';
import {context} from '../../../App';
import {ActivityIndicator} from '@ant-design/react-native';
import Modal from 'react-native-modal';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Toast from 'react-native-root-toast';
import SetPin from '../SecureCode/components/SetPin';
import NotificationPlugin from '../../plugin/pushNotification.plugin/pushNotification.plugin';
import moment from 'moment';
import PermissionPlugin from '../../plugin/permission.plugin/permission.plugin';
import QRCode from 'react-native-qrcode-svg';
import SecureAvatarLoader from '../../library/SecureAvatarLoader';
import vCard from 'react-native-vcards';

const Account = ({navigation, route}) => {
  const contextProvider = useContext(context);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const [businessList, setBusinessList] = useState([]);
  const [profilePicture, setProfilePicture] = useState();
  const [toastWord, setToastWord] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [qrCodeVisible, setQrCodeVisible] = useState(false);

  const [pin, setPin] = useState('');
  const [pinVisible, setPinVisible] = useState(false);
  const [pinPath, setPinPath] = useState('');
  const [appInfo, setAppInfo] = useState({
    appVersion: '',
    systemName: '',
    systemVersion: '',
  });

  const insets = useSafeAreaInsets();
  const [jwt, setJWT] = useState('');
  const [menu, setMenu] = useState([
    {
      name: 'My UCSI One Card',
      title: 'My UCSI One Card',
      // icon_name: 'store',
      // icon_type: 'material-community',
      image: require('../../assest/image/UcsiAccount/ucsi_card.png'),
    },
    // {
    //   name: 'My Points',
    //   title: I18n.t('Account.myPoints'),
    //   // icon_name: "award",
    //   // icon_type: "font-awesome-5",
    //   image: require('../../assest/image/logo/MyPoints.png'),
    // },
    {
      name: 'My Bank Card(s)',
      title: I18n.t('Account.myBankCard'),
      // icon_name: "credit-card",
      // icon_type: "material",
      image: require('../../assest/image/UcsiAccount/bank_card.png'),
    },
    {
      name: 'Change Mobile No.',
      title: I18n.t('Account.changeMobileNo'),
      icon_name: 'phone',
      icon_type: 'antdesign',
      // image: require("../../assest/image/logo/ChangePIN.png"),
    },
    {
      name: 'PIN Number',
      title: 'PIN Number',
      // icon_name: "asterisk",
      // icon_type: "foundation",
      image: require('../../assest/image/UcsiAccount/pin.png'),
    },
    {
      name: 'Merchant Transaction History',
      title: 'Merchant Transaction History',
      icon_name: 'list',
      icon_type: 'feather',
      // image: require('../../assest/image/UcsiAccount/pin.png'),
    },
    // {
    //   name: 'Referral Rewards',
    //   title: I18n.t('Account.referralRewards'),
    //   // icon_name: "gift-outline",
    //   // icon_type: "material-community",
    //   image: require('../../assest/image/logo/Referral.png'),
    // },
    // {
    //   name: 'Help Center',
    //   title: I18n.t('Account.helpCenter'),
    //   // icon_name: "question",
    //   // icon_type: "simple-line-icon",
    //   image: require('../../assest/image/UcsiAccount/help_center.png'),
    // },
    {
      name: 'UCSIPAY Web',
      title: 'UCSIPAY Web',
      icon_name: 'web',
      icon_type: 'material-community',
      // image: require("../../assest/image/logo/HelpCenter.png"),
    },
    {
      name: 'Authentication',
      title: 'Authentication',
      icon_name: 'shield-check',
      icon_type: 'material-community',
    },
    {
      name: 'eTranscript',
      title: 'eTranscript',
      icon_name: 'file-chart',
      icon_type: 'material-community',
    },
    {
      name: 'ePortfolio',
      title: 'ePortfolio',
      icon_name: 'file-certificate',
      icon_type: 'material-community',
    },
    {
      name: 'Refund Policy',
      title: 'Refund Policy',
      icon_name: 'cash-refund',
      icon_type: 'material-community',
      // image: require("../../assest/image/logo/HelpCenter.png"),
    },
    {
      name: 'Privacy Policy',
      title: I18n.t('Account.privacyPolicy'),
      icon_name: 'policy',
      icon_type: 'material',
      // image: require("../../assest/image/logo/HelpCenter.png"),
    },
    {
      name: 'Terms & Conditions',
      title: I18n.t('Account.termsAndConditions'),
      // icon_name: "file",
      // icon_type: "octicon",
      image: require('../../assest/image/UcsiAccount/tnc.png'),
    },
    // {
    //   name: 'FOM Certificate',
    //   title: 'FOM Certificate',
    //   icon_name: 'file',
    //   icon_type: 'octicon',
    //   // image: require("../../assest/image/logo/TermsConditions.png"),
    // },
    // {
    //   name: 'About Us',
    //   title: I18n.t('Account.aboutUs'),
    //   icon_name: 'copyright',
    //   icon_type: 'antdesign',
    //   // image: require("../../assest/image/logo/HelpCenter.png"),
    // },
    // {
    //   name: 'Contact Us',
    //   title: I18n.t('Account.contactUs'),
    //   icon_name: 'headphones',
    //   icon_type: 'feather',
    //   // image: require("../../assest/image/logo/HelpCenter.png"),
    // },
    // {
    //   name: 'Language',
    //   title: I18n.t('Account.language'),
    //   icon_name: 'language',
    //   icon_type: 'material',
    // },
    {
      name: 'Log Out',
      title: I18n.t('Account.logout'),
      // icon_name: "logout",
      // icon_type: "material",
      image: require('../../assest/image/UcsiAccount/logout.png'),
    },
  ]);
  const [biometricAvailability, setBiometricAvailability] = useState(false);
  const [biometricType, setBiometricType] = useState('');
  const [bioStatus, setBioStatus] = useState(false);

  // Language
  const [appsLanguage, setAppLanguage] = useState('en');
  const [languageFound, setLanguageFound] = useState(false);
  const [language, setLanguage] = useState('');
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  useEffect(() => {
    console.log('contextProvider', contextProvider);
    temporaryRemoveUCSIPay();
    GetBusinessList();
    setProfilePicture(contextProvider.contextProvider.my_profile?.avatar?.url);
    // GetUserData();
    // GetProfileImage();
  }, []);

  useFocusEffect(
    useCallback(() => {
      biometricChecker();
      biometricStatus();
      getAppInfo();
    }, []),
  );

  const temporaryRemoveUCSIPay = () => {
    if (moment() < moment('03-02-2023', 'DD-MM-YYYY').endOf('day')) {
      let buffer = menu;
      buffer = buffer.filter(x => x.name !== 'UCSIPAY Web');
      setMenu(buffer);
    }
  };

  const getAppInfo = async () => {
    const info = await deviceInfo.getAppVersion();
    console.log(info, 215);
    setAppInfo(info);
  };

  const GetBusinessList = async () => {
    setLoading(true);

    const res = await TransactionApi.getBusinessList();
    console.log('business list', res);

    if (res.status >= 200 || res.status < 300) {
      setBusinessList(res.data.businesses);

      if (res.data.businesses.length === 0) {
        const object = menu.findIndex(
          obj => obj.name === 'Merchant Transaction History',
        );

        console.log('index', object);

        menu.splice(object, 1);
      }

      setLoading(false);
    } else {
      setLoading(false);
      ResponseError(res);
    }
  };

  const LogOut = async () => {
    setLoading(true);

    const res = await AuthApi.logout();
    console.log('logout', res);

    if (res.status >= 200 || res.status < 300) {
      RNSecureStorage.remove('jwt');
      RNSecureStorage.remove('secret');
      navigation.reset({index: 0, routes: [{name: 'OnBoardingPage'}]});
      // navigation.reset({index: 0, routes: [{name: 'LoginPage'}]});
      setLoading(false);
    } else {
      setLoading(false);
      // ResponseError(res);
    }
  };

  const ChangeAvatar = async image => {
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append('avatar', {
        uri: image.assets ? image.assets[0].uri : image.url,
        name: image.assets ? image.assets[0].fileName : image.name,
        type: image.assets ? image.assets[0].type : image.mimeType,
      });

      const res = await AuthApi.changeAvatar(formData);
      console.log('edit image', res);

      if (res.status >= 200 || res.status < 300) {
        setLoading(false);
        contextProvider.getUserdata();

        // setUserData(res.data);
      } else {
        setLoading(false);
        ResponseError(res);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const biometricChecker = async () => {
    const res = await biometricPlugin.checkBiometric();
    console.log(res);
    if (res.status === 'ok') {
      setBiometricAvailability(true);
      setBiometricType(res.data.type);
    } else {
      setBiometricAvailability(false);
    }
  };

  const biometricStatus = async () => {
    const res = await RNSecureStorage.get('biometric');
    console.log(res);

    if (res === 'Enabled') {
      setBioStatus(true);
    } else if (res === 'Disabled') {
      setBioStatus(false);
    }
  };

  const HandlePin = async () => {
    setLoading(true);
    const res = await AuthApi.accountVerifyPin({
      pin,
    });
    console.log('res', res);
    if (res.status >= 200 || res.status < 300) {
      setLoading(false);
      setPinVisible(false);
      navigation.navigate(pinPath);
    } else {
      setLoading(false);
      setPinVisible(false);
      ResponseError(res);
    }
  };

  ////////Upload Image////////
  const options = {
    title: 'Select Photo',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  const selectPhoto = async () => {
    try {
      await PermissionPlugin.requestGalleryPermission();

      setTimeout(
        () => {
          launchImageLibrary(options, response => {
            // console.log('Response = ', response);
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
              console.log(`launchImageLibrary Error: ${response.error}`);
            } else if (response.customButton) {
              console.log(
                `User tapped custom button: ${response.customButton}`,
              );
            } else {
              setLoading(true);

              // setProfilePicture(response);
              setProfilePicture(response.assets[0].uri);

              ChangeAvatar(response);

              console.log('response', response);

              setTimeout(() => {
                setLoading(false);
              }, 1500);
            }
          });
        },
        Platform.OS === 'ios' ? 500 : 0,
      );
    } catch (error) {
      console.log(error);
    }
  };

  // Language Setting //
  const initSystem = async () => {
    await Promise.all([getLocale()]);
  };

  const getLocale = async () => {
    try {
      // await RNSecureStorage.remove('appsLanguage');
      // await RNSecureStorage.set('appsLanguage', 'en', {
      //   accessible: ACCESSIBLE.WHEN_UNLOCKED
      // });
      const getLocale = await RNSecureStorage.get('appsLanguage');
      console.log('locale', getLocale);
      if (getLocale) {
        setLanguageFound(true);
        // this.setState({ languageFound: true });
      }
    } catch (error) {
      console.log(error);
      setLanguageFound(false);
      setLanguageModalVisible(true);
      // this.setState({ languageFound: false }, () =>
      //   this.setState({ languageModalVisible: true })
      // );
    }
  };

  const onChangeLanguage = async languageSelected => {
    // this.setState({ appsLanguage: languageSelected, languageFound: true });
    setAppLanguage(languageSelected);
    setLanguageFound(true);
    I18n.locale = languageSelected;

    await RNSecureStorage.set('appsLanguage', languageSelected, {
      accessible: ACCESSIBLE.WHEN_UNLOCKED,
    });

    RNRestart.Restart();
  };

  const languageModal = (
    <Modal
      // isVisible={this.state.languageModalVisible}
      // onModalHide={() => this.onChangeLanguage(this.state.language)}
      isVisible={languageModalVisible}
      onModalHide={() => {
        if (language) onChangeLanguage(language);
      }}
      onBackdropPress={() => setLanguageModalVisible(false)}
      useNativeDriver
      hideModalContentWhileAnimating>
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 10,
          paddingVertical: 8,
          paddingHorizontal: 24,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={{paddingVertical: 8}}>
            {I18n.t('modalLanguageSelect.select')}
          </Text>
          <Icon
            type="material"
            name="close"
            color="#014f86"
            onPress={() => setLanguageModalVisible(false)}
            Component={TouchableOpacity}
            style={{zIndex: 10}}
          />
        </View>
        <Button
          title={I18n.t('modalLanguageSelect.en')}
          type="outline"
          containerStyle={{paddingVertical: 8}}
          titleStyle={{color: PrimaryColor}}
          buttonStyle={{borderColor: PrimaryColor}}
          onPress={() => {
            // this.setState({ language: 'en' }, () =>
            //   this.setState({ languageModalVisible: false })
            // );
            setLanguage('en');
            setLanguageModalVisible(false);
          }}
        />
        <Button
          title={I18n.t('modalLanguageSelect.ms')}
          type="outline"
          containerStyle={{paddingVertical: 8}}
          titleStyle={{color: PrimaryColor}}
          buttonStyle={{borderColor: PrimaryColor}}
          onPress={() => {
            // this.setState({ language: 'ms' }, () =>
            //   this.setState({ languageModalVisible: false })
            // );
            setLanguage('ms');
            setLanguageModalVisible(false);
          }}
        />
        <Button
          title={I18n.t('modalLanguageSelect.zh')}
          type="outline"
          containerStyle={{paddingVertical: 8}}
          titleStyle={{color: PrimaryColor}}
          buttonStyle={{borderColor: PrimaryColor}}
          onPress={() => {
            // this.setState({ language: 'zh' }, () =>
            //   this.setState({ languageModalVisible: false })
            // );
            setLanguage('zh');
            setLanguageModalVisible(false);
          }}
        />
      </View>
    </Modal>
  );
  // Language Setting ^ //

  const renderMenuItem = ({item}) => (
    <ListItem
      bottomDivider
      containerStyle={{
        backgroundColor: '#fff',
        paddingHorizontal: 24,
        paddingVertical: 12,
      }}
      onPress={() => {
        switch (item.name) {
          case 'My UCSI One Card':
            navigation.reset({
              index: 2,
              routes: [
                {
                  name: 'home',
                  //  params: { },
                },
                {
                  name: 'Account',
                  //  params: { },
                },
                {
                  name: 'UcsiCard',
                  //  params: { },
                },
              ],
            });

            // navigation.navigate('UcsiCard');
            break;

          case 'My Bank Card(s)':
            navigation.navigate('PaymentMethod', {
              type: 'account',
            });
            break;

          case 'PIN Number':
            navigation.navigate('ChangePIN');
            break;

          case 'Merchant Transaction History':
            navigation.navigate('MerchantTransactionHistory');
            break;

          case 'Change Mobile No.':
            setPinVisible(true);
            setPinPath('ChangeMobileNumber');
            // navigation.navigate('ChangeMobileNumber');
            break;

          case 'Terms & Conditions':
            navigation.navigate('TncPdf');
            break;

          case 'Privacy Policy':
            navigation.navigate('PrivacyPolicyPdf');
            break;

          case 'Refund Policy':
            navigation.navigate('RefundPolicyPdf');
            break;

          case 'UCSIPAY Web':
            navigation.navigate('UcsiPayWebview');
            break;

          case 'Authentication':
            navigation.navigate('AuthenticationWebView');
            break;

          case 'eTranscript':
            navigation.navigate('eTranscriptWebview');
            break;
          
          case 'ePortfolio':
            navigation.navigate('ePortfolioWebView');
            break;

          case 'Referral Rewards':
            navigation.navigate('Referral', {
              firstName: userData.firstName,
            });
            break;

          case 'Contact Us':
            navigation.navigate('ContactUs');
            break;

          case 'Language':
            setLanguageModalVisible(true);
            break;

          case 'Log Out':
            LogOut();
            // RNSecureStorage.remove('jwt');
            // navigation.reset({index: 0, routes: [{name: 'LoginPage'}]});
            break;

          default:
            break;
        }
      }}>
      <View style={{width: 28}}>
        {item.icon_name && (
          <Icon
            color={PrimaryColor}
            type={item.icon_type}
            name={item.icon_name}
          />
        )}
        {item.image && (
          <Image
            source={item.image}
            style={{width: 28, height: 28}}
            // resizeMethod="scale"
            resizeMode="contain"
          />
        )}
      </View>
      <ListItem.Content>
        <ListItem.Title>{item.title}</ListItem.Title>
      </ListItem.Content>
      <ListItem.Chevron color={PrimaryColor} />
    </ListItem>
  );

  const renderHeader = (
    <View
      style={{
        // height: windowHeight * 0.38,
        height: windowHeight * 0.4,
        // backgroundColor: PrimaryColor,
        alignItems: 'center',
        justifyContent: 'center',
        // justifyContent: 'flex-end',
      }}>
      <ImageBackground
        source={require('../../assest/image/UcsiLogo/account_background_ps.png')}
        style={{
          position: 'absolute',
          height: windowHeight * 0.4,
          width: Dimensions.get('window').width,
        }}
        resizeMode="stretch"
        // resizeMethod="scale"
      />
      {profilePicture ? (
        <SecureAvatarLoader
          rounded
          source={{uri: profilePicture}}
          // source={{uri: `data:image/jpeg;base64,${profilePicture}`}}
          // icon={{
          //   type: "font-awesome",
          //   name: "user",
          //   size: windowWidth * 0.16,
          // }}
          containerStyle={{borderWidth: 2, borderColor: '#fff'}}
          size={windowWidth * 0.23}
          onPress={selectPhoto}
        />
      ) : (
        <Avatar
          rounded
          icon={{
            type: 'font-awesome',
            name: 'user',
            size: windowWidth * 0.16,
          }}
          containerStyle={{borderWidth: 2, borderColor: '#fff'}}
          size={windowWidth * 0.23}
          onPress={selectPhoto}
        />
      )}
      <View style={{paddingTop: 8, paddingBottom: 12}}>
        <Text style={{color: '#fff', fontSize: 24}}>
          {contextProvider.contextProvider.my_profile?.name
            ? contextProvider.contextProvider.my_profile?.name
            : 'User'}
        </Text>
      </View>
      <View style={{marginBottom: windowHeight * 0.03}}>
        <Button
          title={I18n.t('Account.editProfile')}
          buttonStyle={{
            backgroundColor: '#fff',
            borderRadius: 100,
            paddingHorizontal: 16,
          }}
          titleStyle={{color: PrimaryColor, fontSize: 12, paddingVertical: 0}}
          icon={{
            type: 'material-community',
            name: 'pencil-outline',
            color: PrimaryColor,
            size: 17,
          }}
          onPress={() => {
            setPinVisible(true);
            setPinPath('EditProfile');
            // navigation.navigate('EditProfile')
          }}
        />
      </View>

      <View
        style={{
          position: 'absolute',
          top:
            Platform.OS === 'android'
              ? StatusBar.currentHeight + 12
              : insets.top + 12,
          left: 24,
        }}>
        <Icon
          name="arrow-left"
          type="feather"
          color="#fff"
          size={28}
          onPress={() => {
            // navigation.goBack();

            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'home',
                  // params: {
                  //   // data: route.params.data,
                  // },
                },
              ],
            });
          }}
        />
      </View>

      <View
        style={{
          position: 'absolute',
          top:
            Platform.OS === 'android'
              ? StatusBar.currentHeight + 12
              : insets.top + 12,
          right: 24,
        }}>
        <Icon
          name="qrcode"
          type="font-awesome"
          color="#fff"
          size={28}
          onPress={() => {
            setQrCodeVisible(true);
          }}
        />
      </View>

      {/* <View
        style={{
          position: 'absolute',
          top:
            Platform.OS === 'android'
              ? StatusBar.currentHeight + 12
              : insets.top + 12,
          right: 24,
        }}>
        <Button
          title={'Accessible Mode'}
          icon={
            <Icon
              type="font-awesome-5"
              name="accessible-icon"
              color={'#fff'}
              size={17}
              style={{marginRight: 8}}
            />
          }
          buttonStyle={{
            backgroundColor: '#000',
            borderRadius: 100,
            paddingHorizontal: 16,
          }}
          titleStyle={{color: '#fff', fontSize: 12, paddingVertical: 0}}
          onPress={() => navigation.navigate('AccessibleMode')}
        />
      </View> */}
    </View>
  );

  const renderFooter = (
    <>
      {biometricAvailability && (
        <View style={{paddingHorizontal: 16, marginVertical: 16, flex: 1}}>
          <View style={{paddingLeft: 16}}>
            <Text style={{fontSize: 16}}>
              {I18n.t('Account.enableBiometrics')}
              {/* {biometricType} */}
            </Text>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{flex: 1, paddingRight: 16}}>
                <Text style={{color: '#86989d'}}>
                  {I18n.t('Account.biometricsDescription')}
                </Text>
              </View>
              <View>
                <Switch
                  ios_backgroundColor="#bcbcbc"
                  trackColor={{
                    false: '#bcbcbc',
                    true: PrimaryColor,
                  }}
                  value={bioStatus}
                  onValueChange={async e => {
                    console.log(e);

                    if (!e) {
                      await RNSecureStorage.set('biometric', 'Disabled', {
                        accessible: ACCESSIBLE.WHEN_UNLOCKED,
                      });

                      await NotificationPlugin.sendLocalNotification(
                        moment().unix(),
                        'Biometric Disabled',
                        moment().format('DD-MMM-YYYY HH:mm'),
                      );

                      Toast.show('Biometric Disabled', {
                        duration: 5000,
                        position: -65,
                      });

                      // setToastVisible(true);

                      // setTimeout(() => {
                      //   setToastVisible(false);
                      // }, 3500);

                      setBioStatus(false);
                    } else {
                      const res =
                        await biometricPlugin.createBiometricCredential();
                      console.log(res);
                      if (res.status === 'ok') {
                        await RNSecureStorage.set('biometric', 'Enabled', {
                          accessible: ACCESSIBLE.WHEN_UNLOCKED,
                        });

                        await NotificationPlugin.sendLocalNotification(
                          moment().unix(),
                          'Biometric Enabled',
                          moment().format('DD-MMM-YYYY HH:mm'),
                        );

                        Toast.show('Biometric Enabled', {
                          duration: 5000,
                          position: -65,
                        });

                        // setToastVisible(true);

                        // setTimeout(() => {
                        //   setToastVisible(false);
                        // }, 3500);

                        setBioStatus(true);
                      }
                    }
                  }}
                  thumbColor="#fff"
                  style={{
                    transform: [
                      {scaleX: Platform.OS === 'ios' ? 0.8 : 1.2},
                      {scaleY: Platform.OS === 'ios' ? 0.8 : 1.2},
                    ],
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      )}

      <View>
        <Text style={{textAlign: 'center', color: '#86989d'}}>
          App build version : {appInfo.appVersion}{' '}
          {contextProvider.contextProvider.codePushMeta.label !== '-' &&
            '(' + contextProvider.contextProvider.codePushMeta.label + ')'}
        </Text>
        <Text style={{textAlign: 'center', color: '#86989d'}}>
          OS version : {appInfo.systemName} {appInfo.systemVersion}
        </Text>
      </View>
    </>
  );

  const ToastModal = (
    <Toast
      duration={3500}
      visible={toastVisible}
      position={-40}
      shadow={true}
      animation={true}
      hideOnPress={true}>
      blablabla
    </Toast>
  );

  const CreateVCard = () => {
    var contact = new vCard();
    contact.version = '3.0';

    contact.firstName = contextProvider.contextProvider.my_profile?.name;
    contact.cellPhone = `(${contextProvider.contextProvider.my_profile?.contact?.countryCode})${contextProvider.contextProvider.my_profile?.contact?.number}`;
    contact.workPhone = `(${contextProvider.contextProvider.my_profile?.workContact?.countryCode})${contextProvider.contextProvider.my_profile?.workContact?.number}`;
    contact.email = contextProvider.contextProvider.my_profile?.email;
    contact.organization = contextProvider.contextProvider.my_profile?.companyName;
    contact.url = contextProvider.contextProvider.my_profile?.url;

    contact.homeAddress.label = 'Home Address';
    contact.homeAddress.street = contextProvider.contextProvider.my_profile?.address?.street;
    contact.homeAddress.city = contextProvider.contextProvider.my_profile?.address?.city;
    contact.homeAddress.stateProvince = contextProvider.contextProvider.my_profile?.address?.state;
    contact.homeAddress.postalCode = contextProvider.contextProvider.my_profile?.address?.postcode;
    contact.homeAddress.countryRegion = contextProvider.contextProvider.my_profile?.address?.country;

    contact.workAddress.label = 'Work Address';
    contact.workAddress.street = contextProvider.contextProvider.my_profile?.workAddress?.street;
    contact.workAddress.city = contextProvider.contextProvider.my_profile?.workAddress?.city;
    contact.workAddress.stateProvince = contextProvider.contextProvider.my_profile?.workAddress?.state;
    contact.workAddress.postalCode = contextProvider.contextProvider.my_profile?.workAddress?.postcode;
    contact.workAddress.countryRegion = contextProvider.contextProvider.my_profile?.workAddress?.country;

    return contact.getFormattedString();
  };

  const QrCodeModal = (
    <Modal
      isVisible={qrCodeVisible}
      onBackdropPress={() => setQrCodeVisible(false)}
      useNativeDriver
      hideModalContentWhileAnimating>
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 10,
          height: windowHeight * 0.5,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <QRCode
          value={CreateVCard()}
          color={PrimaryColor}
          size={windowHeight * 0.3}
          logo={require('../../assest/image/UcsiIcon/qrcode_ucsi.png')}
          logoSize={55}
          logoBackgroundColor="rgba(255,255,255,.7)"
        />

        <Text style={{marginTop: 24, fontSize: 20, fontWeight: '500'}}>
          UCSI eBizCard QR
        </Text>
      </View>
    </Modal>
  );

  const PinModal = (
    <Modal
      isVisible={pinVisible}
      style={{margin: 0, justifyContent: 'flex-end'}}
      onBackdropPress={() => setPinVisible(false)}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{
          backgroundColor: '#fff',
          paddingHorizontal: 12,
          paddingTop: 16,
          paddingBottom: 16,
        }}
        keyboardVerticalOffset={16}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            paddingBottom: 12,
            marginBottom: 32,
            borderBottomColor: 'rgba(0,0,0,0.15)',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{marginRight: 8}}>
              <Text style={{fontSize: 16, fontWeight: '700'}}>
                {I18n.t('PaymentStatus.Label.verifyPin')}
              </Text>
            </View>

            <View>
              <Icon
                name="verified-user"
                type="material"
                color={PrimaryColor}
                size={20}
              />
            </View>
          </View>

          <Icon
            name="close"
            type="antdesign"
            color="rgba(0,0,0,0.65)"
            size={20}
            onPress={() => setPinVisible(false)}
          />
        </View>

        <View>
          <SetPin focus={true} setFirstPin={e => setPin(e)} />
        </View>

        <View style={{marginTop: 24, paddingHorizontal: 40}}>
          <Button
            title={I18n.t('PaymentStatus.button.submit')}
            buttonStyle={{
              borderRadius: 10,
              paddingVertical: 12,
              backgroundColor: PrimaryColor,
            }}
            onPress={() => HandlePin()}
            disabled={pin.length < 6}
          />
        </View>

        {/* <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.05)',
            marginTop: 24,
            marginBottom: 24,
            padding: 12,
            borderRadius: 10,
          }}>
          <View style={{flex: 1.5, alignItems: 'flex-start'}}>
            <Icon
              name="verified"
              type="material"
              color={PrimaryColor}
              size={28}
            />
          </View>

          <View style={{flex: 8.5}}>
            <Text style={{color: 'rgba(0,0,0,0.45)'}}>
              Your payments will be processed in a safe and secured environment
            </Text>
          </View>
        </View> */}
      </KeyboardAvoidingView>
    </Modal>
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingBottom: Platform.OS === 'ios' ? insets.bottom : 0,
      }}>
      <StatusBar backgroundColor={'transparent'} barStyle="light-content" />
      <FlatList
        bounces={false}
        data={menu}
        keyExtractor={item => item.name}
        renderItem={renderMenuItem}
        ListHeaderComponent={renderHeader}
        // ListFooterComponent={biometricAvailability && renderFooter}
        ListFooterComponent={renderFooter}
        contentContainerStyle={{backgroundColor: '#fff'}}
      />

      {languageModal}
      {QrCodeModal}
      {PinModal}
      {/* {ToastModal} */}

      <ActivityIndicator
        toast
        size="large"
        animating={loading}
        text={I18n.t('Account.loading')}
      />
    </View>
  );
};

export default Account;

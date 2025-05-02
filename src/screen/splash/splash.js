import React, {useEffect, useState, useContext} from 'react';
import {View, Image, Dimensions, StatusBar, Text} from 'react-native';
import {ActivityIndicator} from '@ant-design/react-native';
import {context} from '../../../App';
import pushNotificationPlugin from '../../plugin/pushNotification.plugin/pushNotification.plugin';
import Modal from 'react-native-modal';
import {Button, Icon} from 'react-native-elements';
import RNSecureStorage from 'rn-secure-storage';
import AuthApi from '../../tools/Api/auth.api';
import {ImageBackground} from 'react-native';
import {env, PrimaryColor} from '../../tools/Constant/Constant';
import AsyncStorage from '@react-native-community/async-storage';
import SSLPiningPlugin from '../../plugin/sslPining.plugin/sslPining.plugin';
import RootDetector from '../../plugin/rootDetector.plugin/rootDetector.plugin';
import CloseApp from '../../plugin/closeApp.plugin/closeApp.plugin';

const Introduction = ({navigation, route}) => {
  const contextProvider = useContext(context);
  const [appIntro, setAppIntro] = useState(null);

  useEffect(() => {
    console.log('Init Notification');
    pushNotificationPlugin.Configure(navigation, contextProvider);
    // setTimeout(() => {
    //   pushNotificationPlugin.sendLocalNotification(
    //     '123',
    //     'Welcome to Sernsoft Research',
    //     'Get started',
    //     {type: 'test', path: '123'},
    //   );
    // }, 2000);
    if (env === 'Production') {
      checkDeviceRootedJailbreak();
      // checkAPISSLCertification();
    }

    _retrieveData();
  }, []);

  const checkAPISSLCertification = async () => {
    const res = await SSLPiningPlugin.apiSSLCheck();
    console.log(res, 44);
    if (res.error) {
      CloseApp('Insecure network connection');
    }
  };

  const checkDeviceRootedJailbreak = () => {
    const res = RootDetector.validateEnvironment();
    if (res) {
      CloseApp('Insecure Environment');
    }
  };

  const _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('Initial');
      if (value !== null) {
        setAppIntro(value);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // setTimeout(() => {
    //   navigation.reset({
    //     index: 0,
    //     // routes: [{name: 'seller_account'}],
    //     // routes: [{ name: "OnBoardingPage" }]
    //     routes: [{ name: "IdentityVerification" }]
    //     // routes: [{ name: 'LoginPage' }]
    //   });
    // }, 1500);

    console.log(contextProvider, 'splash');

    if (!contextProvider.contextProvider.notificationClicked) {
      // if (
      //   !contextProvider.contextProvider.showIntro &&
      //   contextProvider.contextProvider.isAuth
      // ) {
      //   navigation.reset({
      //     index: 0,
      //     // routes: [{name: 'seller_account'}],
      //     routes: [{ name: 'HomePage' }]
      //   });
      // } else if (
      //   !contextProvider.contextProvider.showIntro &&
      //   !contextProvider.contextProvider.isAuth
      // ) {
      //   navigation.reset({
      //     index: 0,
      //     routes: [{ name: 'LoginPage' }]
      //   });
      // }

      // console.log(contextProvider.contextProvider);
      // if (!contextProvider.contextProvider.isBan) {
      if (contextProvider.contextProvider.languageFound) {
        if (
          !contextProvider.contextProvider.isBan &&
          !contextProvider.contextProvider.showIntro
          // &&
          // (!contextProvider.contextProvider.codePushDownloadProgress ||
          //   contextProvider.contextProvider.codePushDownloadProgress
          //     .receivedBytes ===
          //     contextProvider.contextProvider.codePushDownloadProgress.totalBytes)
        ) {
          // RNSecureStorage.remove('jwt');

          RNSecureStorage.get('jwt')
            .then(async value => {
              console.log(value); // Will return direct value

              if (value) {
                const UserData = await AuthApi.getProfile();
                console.log('UserData', UserData);

                // if (!UserData.data.pinSet) {
                //   // setup pin
                //   navigation.reset({
                //     index: 0,
                //     routes: [
                //       {
                //         name: 'SignUp',
                //       },
                //     ],
                //   });

                //   contextProvider.setSignUpStep({
                //     step: 2,
                //   });
                // } else

                if (
                  (UserData.data.pinSet &&
                    UserData.data.verificationStatus === 'new') ||
                  (UserData.data.pinSet &&
                    UserData.data.verificationStatus === 'pending') ||
                  (UserData.data.pinSet &&
                    UserData.data.verificationStatus === 'verified')
                ) {
                  // setup kyc
                  navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: 'home',
                      },
                    ],
                  });
                } else if (
                  UserData.data.pinSet &&
                  UserData.data.verificationStatus === 'rejected'
                ) {
                  // kyc rejected
                  navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: 'KycRejected',
                      },
                    ],
                  });
                }
              }
            })
            .catch(err => {
              navigation.reset({
                index: 0,
                routes: [{name: 'OnBoardingPage'}],
              });

              RNSecureStorage.remove('jwt');

              // navigation.reset({
              //   index: 0,
              //   routes: [
              //     {
              //       name: 'home',
              //       // name: 'KycRejected',
              //     },
              //   ],
              // });

              console.log(err);
            });
        }
      }
    }
  }, [
    contextProvider.contextProvider.isAuth,
    contextProvider.contextProvider.showIntro,
    contextProvider.contextProvider.codePushDownloadProgress,
    // contextProvider.contextProvider.codePushStatus,
    contextProvider.contextProvider.notificationClicked,
    contextProvider.contextProvider.deeplinkUrl,
  ]);

  // useEffect(() => {}, [contextProvider.contextProvider.codePushStatus]);

  return (
    <View style={{height: '100%' /* , backgroundColor: PrimaryColor */}}>
      <StatusBar backgroundColor="transparent" barStyle="light-content" />
      <ImageBackground
        source={require('../../assest/image/UcsiLogo/ucsi_splash_background.png')}
        style={{flex: 1}}>
        <View
          style={{
            paddingTop: Dimensions.get('window').height * 0.2,
            alignItems: 'center',
            flex: 1,
          }}>
          <Image
            source={require('../../assest/image/UcsiLogo/ucsi_white_logo.png')}
            style={{
              width: Dimensions.get('window').width * 0.7,
              height: Dimensions.get('window').height * 0.5,
            }}
            resizeMode="contain"
            resizeMethod="auto"
            fadeDuration={800}
          />
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
          }}>
          <ActivityIndicator
            // animating={contextProvider.contextProvider.showIntro}
            animating
            size="small"
            // color="rgba(0,0,0,0.65)"
            color="#fff"
          />
        </View>
      </ImageBackground>
      <Modal isVisible={contextProvider.contextProvider.isBan}>
        <View style={{padding: 16, borderRadius: 10, backgroundColor: '#fff'}}>
          <Icon
            type="material"
            name="block"
            size={Dimensions.get('window').width * 0.2}
            color="#f00"
            containerStyle={{marginBottom: 16}}
          />
          <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>
            {/* Your account has been suspended. Please contact customer service for
            more details. */}
            There is some issues with your log in. Please contact customer
            service for more details.
          </Text>
          {/* <Button
            title="Customer Service"
            icon={{ type: 'font-awesome', name: 'phone', color: '#fff' }}
            buttonStyle={{ backgroundColor: PrimaryColor }}
            containerStyle={{ marginVertical: 16 }}
            onPress={() => {
              var phone;
              if (Platform.OS === 'android') phone = `tel:1700818151`;
              else phone = `telprompt:1700818151`;

              Linking.canOpenURL(phone)
                .then(supported => {
                  if (!supported) {
                    return alert('Device not support calling function');
                  } else {
                    return Linking.openURL(phone);
                  }
                })
                .catch(err => console.log(err));
            }}
          /> */}
          <Button
            type="outline"
            title="Back to SignIn"
            titleStyle={{color: PrimaryColor}}
            buttonStyle={{borderColor: PrimaryColor}}
            containerStyle={{marginTop: 16}}
            onPress={async () => {
              await RNSecureStorage.remove('jwt');
              await RNSecureStorage.remove('loginuserid');
              await contextProvider.setAuth();
              contextProvider.handleLogout();
              navigation.reset({
                index: 0,
                routes: [{name: 'SignIn'}],
              });
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

export default Introduction;

import {HeaderBackButton} from '@react-navigation/stack';
import React, {useEffect, useState, useContext} from 'react';
import {
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
  View,
  Platform,
  Text,
  Alert,
  ScrollView,
} from 'react-native';
import {context} from '../../../../App';
import {Button, Divider} from 'react-native-elements';
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';
import AuthApi from '../../../tools/Api/auth.api';
import {ResponseError} from '../../../tools/ErrorHandler/ErrorHandler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {PrimaryColor, windowHeight} from '../../../tools/Constant/Constant';
import SetPin from './SetPin';
import {ActivityIndicator} from '@ant-design/react-native';
import I18n from '../../../locales';

const ForgetPin = ({navigation, route}) => {
  const contextProvider = useContext(context);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const [pin, setPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [page, setPage] = useState(1);
  const [buttonVisible, setButtonVisible] = useState(true);

  const [otpCountDown, setOtpCountDown] = useState(60);
  var countDownInterval;

  useEffect(() => {
    // GetUserData();
    //supportForgetPinFromExternalWeb();
    const keyboardShow = Keyboard.addListener('keyboardDidShow', () => {
      setButtonVisible(false);
    });
    const keyboardHide = Keyboard.addListener('keyboardDidHide', () => {
      setButtonVisible(true);
    });

    return () => {
      clearInterval(countDownInterval);
      setOtpCountDown(60);

      keyboardShow.remove();
      keyboardHide.remove();
    };
  }, []);

  const supportForgetPinFromExternalWeb = () => {
    // When this view trigger from web, it will direct show this page if auth,
    // but if not auth then will request login
    const {isAuth} = contextProvider.contextProvider;
    if (!isAuth) {
      navigation.navigate('LoginPage');
    }
  };

  const RequestForgetPinOtp = async () => {
    setLoading(true);
    // setOtpLoading(true);

    const res = await AuthApi.requestResetPinOtp({
      contact: {
        countryCode: '+60',
        number:
          route.params.type === 'LoginPIN'
            ? route.params.number
            : contextProvider.contextProvider.my_profile.contact.number,
      },
    });
    console.log('requestOTP', res);

    if (res.status >= 200 || res.status < 300) {
      setLoading(false);

      var countdown = otpCountDown;
      countDownInterval = setInterval(() => {
        countdown -= 1;
        setOtpCountDown(countdown);

        if (countdown === -1) {
          clearInterval(countDownInterval);
          // setOtpLoading(false);
          setOtpCountDown(60);
        }
      }, 1000);
    } else {
      setLoading(false);
      // setOtpLoading(false);
      ResponseError(res);
    }
  };

  const SubmitForgetPin = async () => {
    setLoading(true);

    const res = await AuthApi.resetPin({
      contact: {
        countryCode: '+60',
        number:
          route.params.type === 'LoginPIN'
            ? route.params.number
            : contextProvider.contextProvider.my_profile.contact.number,
      },
      otp: pin,
      pin: newPin,
    });
    console.log('submit otp', res);

    if (res.status === 200) {
      setLoading(false);
      // setPage(2);

      Alert.alert(null, I18n.t('SecureCode.successMessage.resetPinSuccess'), [
        {
          text: I18n.t('SecureCode.button.ok'),
          onPress: () => {
            if (route.params.type === 'LoginPIN') {
              navigation.goBack();
            } else {
              navigation.navigate('Account');
            }
          },
        },
      ]);
    } else {
      setLoading(false);
      ResponseError(res);
    }
  };

  return (
    <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
      <StatusBar
        backgroundColor={PrimaryColor}
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
      />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{flex: 1, paddingVertical: 24}}>
          <View
            style={{
              paddingHorizontal: 24,
            }}>
            <Text
              style={{
                color: PrimaryColor,
                fontSize: 20,
                fontWeight: 'bold',
              }}>
              {I18n.t('SecureCode.Label.resetPin')}
            </Text>
            <Text style={{paddingTop: 4, marginBottom: 24}}>
              {I18n.t('SecureCode.Label.resetPinDesc')}
            </Text>

            <View>
              <Text style={{fontSize: 18}}>
                {I18n.t('SecureCode.Label.mobileNumber')}
              </Text>
              <Text
                style={{
                  backgroundColor: 'rgba(0,0,0,0.15)',
                  padding: 12,
                  borderRadius: 5,
                  fontWeight: 'bold',
                  fontSize: 18,
                  marginBottom: 24,
                }}>
                +60
                {route.params?.number
                  ? route.params?.number
                  : contextProvider.contextProvider.my_profile?.contact?.number}
                {/* {userData.phone ? userData.phone : 'xxxxxxxxxx'} */}
              </Text>
            </View>

            <View
              style={{
                alignItems: 'center',
              }}>
              {otpCountDown === 60 ? (
                <Button
                  //   disabled={pin.length < 6}
                  title={I18n.t('SecureCode.button.sendOtp')}
                  containerStyle={{width: '70%'}}
                  titleStyle={{paddingVertical: 8}}
                  buttonStyle={{
                    borderRadius: 10,
                    backgroundColor: PrimaryColor,
                  }}
                  onPress={() => RequestForgetPinOtp()}
                />
              ) : (
                <Button
                  disabled={true}
                  title={
                    I18n.t('SecureCode.button.sendOtp') +
                    ' ' +
                    otpCountDown +
                    's'
                  }
                  containerStyle={{width: '70%'}}
                  titleStyle={{paddingVertical: 8}}
                  buttonStyle={{
                    borderRadius: 10,
                    backgroundColor: PrimaryColor,
                  }}
                  //   onPress={() => RequestForgetPinOtp()}
                />
              )}
            </View>
          </View>

          <View style={{paddingHorizontal: 32}}>
            <Divider color="#bcbbc1" style={{marginVertical: 16}} />

            <View>
              <Text
                style={{
                  color: PrimaryColor,
                  fontSize: 20,
                  fontWeight: 'bold',
                }}>
                OTP
              </Text>
              <Text style={{paddingTop: 4}}>Key in your OTP</Text>
            </View>

            <View style={{marginTop: 24, marginBottom: 40}}>
              <SetPin setFirstPin={e => setPin(e)} confirmPin={false} />
            </View>

            <View>
              <Text
                style={{
                  color: PrimaryColor,
                  fontSize: 20,
                  fontWeight: 'bold',
                }}>
                New PIN
              </Text>
              <Text style={{paddingTop: 4}}>
                {I18n.t('SecureCode.Label.keyNewPin')}
              </Text>
            </View>

            <View>
              <View style={{marginTop: 24, marginBottom: 40}}>
                <SetPin setFirstPin={e => setNewPin(e)} confirmPin={false} />
              </View>
            </View>
          </View>

          <View
            style={{
              alignItems: 'center',
              marginBottom: windowHeight * 0.05,
            }}>
            <Button
              disabled={pin.length < 6 || newPin.length < 6}
              title={I18n.t('SecureCode.button.submit')}
              containerStyle={{width: '70%', paddingHorizontal: 16}}
              titleStyle={{paddingVertical: 8}}
              buttonStyle={{
                borderRadius: 10,
                backgroundColor: PrimaryColor,
              }}
              onPress={() => SubmitForgetPin()}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>

      <ActivityIndicator
        toast
        size="large"
        animating={loading}
        text={I18n.t('SecureCode.Label.loading')}
      />
    </ScrollView>
  );
};

export default ForgetPin;

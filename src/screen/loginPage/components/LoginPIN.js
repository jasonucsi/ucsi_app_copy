// import { useFocusEffect, } from "@react-navigation/core";
import React, {
  useCallback,
  useEffect,
  useState,
  useContext,
  useRef,
} from 'react';
import {
  View,
  Text,
  StatusBar,
  Dimensions,
  Image,
  ScrollView,
  Keyboard,
  Alert,
  ImageBackground,
  TouchableWithoutFeedback,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
  MaskSymbol,
  isLastFilledCell,
} from 'react-native-confirmation-code-field';
import {context} from '../../../../App';
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';
import {AuthHeader} from '../../../tools/Api/api';
import AuthApi from '../../../tools/Api/auth.api';
import {ResponseError} from '../../../tools/ErrorHandler/ErrorHandler';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {PrimaryColor} from '../../../tools/Constant/Constant';
import {Button, Input} from 'react-native-elements';
import {useForm} from 'react-hook-form';
import {ActivityIndicator} from '@ant-design/react-native';
import analytics from '@react-native-firebase/analytics';
import I18n from '../../../locales';
import {addSignPrefixAndSuffix} from 'react-native-currency-input/lib/typescript/src/utils/formatNumber';
import DeviceInfo from '../../../plugin/deviceInfo.plugin/deviceInfo.plugin';

const CELL_COUNT = 6;

const LoginPIN = ({navigation, route}) => {
  const contextProvider = useContext(context);
  const {
    contextProvider: {
      notificationToken: {token: fcmRegistrationToken},
    },
  } = useContext(context);
  const {register, setValue: setValues, errors, handleSubmit} = useForm();
  const [loading, setLoading] = useState(false);
  const [otpCountDown, setOtpCountDown] = useState(60);
  const [otpLoading, setOtpLoading] = useState(false);
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [buttonMargin, setButtonMargin] = useState(
    Dimensions.get('window').height * 0.08,
  );
  const [buttonVisible, setButtonVisible] = useState(true);
  const [referralCode, setReferralCode] = useState('');
  var countDownInterval;

  useEffect(() => {
    // ResendOtp();
  }, []);

  useFocusEffect(
    useCallback(() => {
      console.log(route);
      register('referral_code');

      //auto focus PIN
      setTimeout(() => {
        ref.current.focus();
      }, 100);

      const keyboardShow = Keyboard.addListener('keyboardDidShow', () => {
        setButtonVisible(false);
      });
      const keyboardHide = Keyboard.addListener('keyboardDidHide', () => {
        setButtonVisible(true);
      });

      return () => {
        if (countDownInterval) {
          clearInterval(countDownInterval);
          setOtpCountDown(60);
        }

        keyboardShow.remove();
        keyboardHide.remove();
      };
    }, [register]),
  );

  const saveJWT = async (jwt, secret) => {
    // const setVal =
    await RNSecureStorage.set('jwt', jwt, {
      accessible: ACCESSIBLE.WHEN_UNLOCKED,
    });

    // PIN encrypt key
    await RNSecureStorage.set('secret', secret, {
      accessible: ACCESSIBLE.WHEN_UNLOCKED,
    });

    RNSecureStorage.get('jwt')
      .then(value => {
        console.log(value);
      })
      .catch(err => {
        console.log(err);
      });
    // console.log(setVal);
    // const value = await RNSecureStorage.get('jwt');
    // console.log(value);
  };

  const GetUserData = async () => {
    try {
      // http passing token to getProfile api //
      await AuthHeader();
      // http passing token to getProfile api ^ //

      setTimeout(async () => {
        const res = await AuthApi.getProfile();

        if (res.status >= 200 || res.status < 300) {
          contextProvider.setMyProfile(res.data);

          console.log('res', res);

          if (!res.data.pinSet) {
            // setup pin
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'SignUp',
                },
              ],
            });

            contextProvider.setSignUpStep({
              step: 2,
            });
          } else {
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'home',
                },
              ],
            });
          }
        } else {
          ResponseError(res);
        }
      }, 1000);
    } catch (error) {
      console.log('res', error);
    }
  };

  const ResendOtp = async () => {
    setOtpLoading(true);

    const res = await AuthApi.requestLoginOtp({
      contact: {
        countryCode: '+60',
        number: route.params.data.phone,
      },
    });
    console.log(res);

    if (res.status >= 200 || res.status < 300) {
      var countdown = otpCountDown;
      countDownInterval = setInterval(() => {
        countdown -= 1;
        setOtpCountDown(countdown);

        if (countdown === -1) {
          clearInterval(countDownInterval);
          setOtpLoading(false);
          setOtpCountDown(60);
        }
      }, 1000);
    } else {
      setOtpLoading(false);
      Alert.alert(null, res.response.data, [
        {
          text: 'Ok',
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
      // ResponseError(res);
    }
  };

  const handleLogin = async values => {
    try {
      setLoading(true);

      const deviceInfo = await DeviceInfo.getDeviceInfo();

      const res = await AuthApi.loginWithOtp({
        contact: {
          countryCode: '+60',
          number: route.params.data.phone,
        },
        deviceInfo: {
          ...deviceInfo,
          fcmRegistrationToken: fcmRegistrationToken
            ? fcmRegistrationToken
            : undefined,
        },
        pin: value,
        // otp: value,
      });
      console.log(res);

      if (res.status >= 200 || res.status < 300) {
        // setLoading(false);
        await saveJWT(res.data.token, res.data.secret);

        await GetUserData();

        // await analytics().logLogin({
        //   method: 'Login OTP',
        // });
      } else {
        setLoading(false);

        if (res.response.data === 'Wrong PIN') {
          Alert.alert(null, res.response.data);
          // ResponseError(res);
        } else {
          Alert.alert(null, res.response.data, [
            {
              text: 'Ok',
              onPress: () => {
                navigation.goBack();
              },
            },
          ]);
          // ResponseError(res);
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }} /* contentContainerStyle={{flex: 1}} bounces={false} */
    >
      <StatusBar backgroundColor="transparent" barStyle="light-content" />
      <ImageBackground
        source={require('../../../assest/image/UcsiOnBoarding/background2.png')}
        style={{
          //   position: 'absolute',
          height: Dimensions.get('window').height * 0.4,
          width: Dimensions.get('window').width,
          //   zIndex: -1,
        }}
        resizeMode="stretch"
        resizeMethod="scale"
      />
      <View style={{marginBottom: 40}}>
        <View style={{marginBottom: 24, marginHorizontal: 24}}>
          <View>
            <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
              <Image
                source={require('../../../assest/image/UcsiIcon/arrow_left.png')}
                style={{
                  // position: 'absolute',
                  height: 25,
                  width: 25,
                  marginBottom: 12,
                  // right: 40,
                  // bottom: 64,
                  //   zIndex: -1,
                }}
                resizeMode="contain"
                // resizeMethod="scale"
              />
            </TouchableWithoutFeedback>
          </View>
          <View style={{marginBottom: 16}}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                lineHeight: 24,
                paddingBottom: 6,
              }}>
              {I18n.t('LoginPage.Label.yourMobile')}
            </Text>
            <Text style={{color: '#bcbbc1'}}>Login with your PIN</Text>
          </View>
          <View
            style={{
              height: 50,
              backgroundColor: '#edf3f4',
              borderRadius: 5,
              justifyContent: 'center',
              paddingHorizontal: 24,
              alignSelf: 'center',
            }}>
            <Text style={{fontSize: 16}}>
              +60{route.params && route.params.data.phone}
            </Text>
          </View>
        </View>
        <View style={{marginHorizontal: 24}}>
          <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            keyboardType="phone-pad"
            textContentType="oneTimeCode"
            onFocus={() => setButtonMargin(0)}
            onBlur={() =>
              setButtonMargin(Dimensions.get('window').height * 0.08)
            }
            renderCell={({index, symbol, isFocused}) => {
              let textChild = null;

              if (symbol) {
                textChild = (
                  <MaskSymbol
                    maskSymbol="•"
                    isLastFilledCell={isLastFilledCell({value, index})}>
                    {symbol}
                  </MaskSymbol>
                );
              } else if (isFocused) {
                textChild = <Cursor cursorSymbol="" />;
              }

              return (
                <Text
                  key={index}
                  style={{
                    width: Dimensions.get('window').width <= 320 ? 38 : 46,
                    height: 45,
                    lineHeight: 45,
                    fontSize: Dimensions.get('window').width <= 320 ? 14 : 16,
                    borderWidth: isFocused ? 1 : 0,
                    borderRadius: 10,
                    borderColor: isFocused ? '#edf3f4' : 'transparent',
                    textAlign: 'center',
                    backgroundColor: isFocused ? '#fff' : '#edf3f4',
                    overflow: 'hidden',
                    color: isFocused ? PrimaryColor : '#000',
                  }}
                  onLayout={getCellOnLayoutHandler(index)}>
                  {textChild}
                  {/* {symbol || (isFocused ? <Cursor cursorSymbol="" /> : null)} */}
                </Text>
              );
            }}
          />
        </View>
        {/* {route.params && !route.params.isLogin && (
          <View style={{marginHorizontal: 24, marginTop: 24}}>
            <View style={{marginBottom: 6}}>
              <Text>{I18n.t('LoginPage.Label.referralCode')}</Text>
            </View>
            <Input
              placeholder={I18n.t('LoginPage.Label.referralPlaceholder')}
              renderErrorMessage={false}
              containerStyle={{paddingHorizontal: 0}}
              inputContainerStyle={{
                borderBottomColor: 'transparent',
                paddingHorizontal: 10,
                backgroundColor: '#edf3f4',
                borderRadius: 10,
              }}
              inputStyle={{fontSize: 16}}
              value={referralCode}
              onChangeText={e => {
                setReferralCode(e);
                setValues('referral_code', e);
              }}
              onFocus={() => {
                setButtonVisible(false);
                setButtonMargin(0);
              }}
              onBlur={() => {
                setButtonVisible(true);
                setButtonMargin(Dimensions.get('window').height * 0.08);
              }}
            />
          </View>
        )} */}
      </View>
      {buttonVisible && (
        <View
          style={{
            marginHorizontal: 24,
            marginBottom: Dimensions.get('window').height * 0.08,
          }}>
          <Button
            disabled={value.length < 6}
            title={I18n.t('LoginPage.button.login')}
            buttonStyle={{borderRadius: 100, backgroundColor: PrimaryColor}}
            titleStyle={{
              color: '#fff',
              paddingVertical: 8,
              fontWeight: 'bold',
            }}
            containerStyle={{marginBottom: 16}}
            onPress={handleSubmit(handleLogin)}
          />

          <Button
            // disabled={otpLoading}
            title={'Forget PIN'}
            type="outline"
            buttonStyle={{borderColor: PrimaryColor, borderRadius: 100}}
            titleStyle={{
              paddingVertical: 8,
              color: PrimaryColor,
            }}
            onPress={() =>
              navigation.navigate('ForgetPin', {
                type: 'LoginPIN',
                number: route.params.data.phone,
              })
            }
          />

          {/* {route.params && route.params.isLogin ? (
            <Button
              disabled={value.length < 6}
              title={I18n.t('LoginPage.button.login')}
              buttonStyle={{borderRadius: 100, backgroundColor: '#0094d9'}}
              titleStyle={{
                color: '#fff',
                paddingVertical: 8,
                fontWeight: 'bold',
              }}
              onPress={handleSubmit(handleLogin)}
            />
          ) : (
            <Button
              disabled={value.length < 6}
              title={I18n.t('LoginPage.button.signUp')}
              buttonStyle={{borderRadius: 100, backgroundColor: '#0094d9'}}
              titleStyle={{
                color: '#fff',
                paddingVertical: 10,
                fontWeight: 'bold',
              }}
              onPress={handleSubmit(handleLogin)}
            />
          )} */}
        </View>
      )}

      <ActivityIndicator
        toast
        size="large"
        animating={loading}
        text={I18n.t('LoginPage.Label.loading')}
      />
    </ScrollView>
  );
};

export default LoginPIN;

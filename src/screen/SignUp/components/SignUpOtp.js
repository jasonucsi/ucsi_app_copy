import React, {useEffect, useState, useContext, useRef} from 'react';
import {
  View,
  Image,
  Dimensions,
  StatusBar,
  Text,
  Platform,
  Linking,
  ScrollView,
  ImageBackground,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import {ActivityIndicator, Flex} from '@ant-design/react-native';
import {context} from '../../../../App';
import pushNotificationPlugin from '../../../plugin/pushNotification.plugin/pushNotification.plugin';
import Modal from 'react-native-modal';
import {Button, Icon, Input} from 'react-native-elements';
import {PrimaryColor} from '../../../tools/Constant/Constant';
import {AuthHeader} from '../../../tools/Api/api';
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';
import AuthApi from '../../../tools/Api/auth.api';
import {ResponseError} from '../../../tools/ErrorHandler/ErrorHandler';
import {useForm} from 'react-hook-form';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {color} from 'react-native-elements/dist/helpers';
import DeviceInfo from '../../../plugin/deviceInfo.plugin/deviceInfo.plugin';

const CELL_COUNT = 6;

const SignUpOtp = ({navigation, route}) => {
  const contextProvider = useContext(context);
  const {
    contextProvider: {
      notificationToken: {token: fcmRegistrationToken},
    },
  } = useContext(context);

  const {register, handleSubmit, errors, setValue: setValues} = useForm();

  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

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

  const [contact, setContact] = useState();
  const [fullName, setFullName] = useState();
  const [email, setEmail] = useState();

  const contactInput = useRef();
  const fullNameInput = useRef();
  const emailInput = useRef();

  useEffect(() => {
    console.log('context', contextProvider);

    ResendOtp();

    setContact(contextProvider.contextProvider.signUpStep.data.phone);
  }, []);

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
        } else {
          ResponseError(res);
        }
      }, 1000);
    } catch (error) {
      console.log('res', error);
    }
  };

  const handleSetUpOtp = async values => {
    console.log(values);

    // if (value.length === 6) {
    //   contextProvider.setSignUpStep({
    //     step: 2,
    //   });
    //   // navigation.navigate("")
    // }

    if (value.length === 6) {
      setLoading(true);

      const deviceInfo = await DeviceInfo.getDeviceInfo();

      console.log('deviceInfo', deviceInfo);

      const res = await AuthApi.registerNewUser({
        name: contextProvider.contextProvider.signUpStep.data.fullName,
        email: contextProvider.contextProvider.signUpStep.data.email,
        contact: {
          countryCode: '+60',
          number: contextProvider.contextProvider.signUpStep.data.phone,
        },
        pin: contextProvider.contextProvider.signUpStep.pin,
        otp: value,

        deviceInfo: {
          ...deviceInfo,
          fcmRegistrationToken: fcmRegistrationToken
            ? fcmRegistrationToken
            : undefined,
        },
      });
      console.log(res);
      if (res.status >= 200 || res.status < 300) {
        await saveJWT(res.data.token, res.data.secret);

        await GetUserData();

        contextProvider.setSignUpStep({
          step: 3,
        });
      } else {
        setLoading(false);
        Alert.alert(null, res.response.data);
      }
    }
  };

  const ResendOtp = async () => {
    setOtpLoading(true);

    // var countdown = otpCountDown;
    // var countDownInterval = setInterval(() => {
    //   countdown -= 1;
    //   setOtpCountDown(countdown);

    //   if (countdown === -1) {
    //     clearInterval(countDownInterval);
    //     setOtpLoading(false);
    //     setOtpCountDown(60);
    //   }
    // }, 1000);

    const res = await AuthApi.requestSignUpOtp({
      contact: {
        countryCode: '+60',
        number: contextProvider.contextProvider.signUpStep.data.phone,
      },
    });

    console.log(res);

    if (res.status >= 200 || res.status < 300) {
      var countdown = otpCountDown;
      var countDownInterval = setInterval(() => {
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
            contextProvider.setSignUpStep({
              step: 1,
              pin: contextProvider.contextProvider.signUpStep.pin,
              data: contextProvider.contextProvider.signUpStep.data,
            });
          },
        },
      ]);
      // ResponseError(res);
    }
  };

  const SetUpOtp = (
    <View>
      <Input
        // placeholderTextColor="grey"
        // disabled
        // disabledInputStyle={{fontWeight: 'bold', color: 'rgba(0,0,0,1)'}}
        editable={false}
        ref={contactInput}
        label="Mobile Number"
        maxLength={10}
        leftIcon={
          <Text
            style={{
              fontSize: 18,
              color: 'black',
              fontWeight: 'bold',
            }}>
            +60
          </Text>
        }
        inputStyle={{
          transform: [{translateY: 1}],
          color: 'black',
          fontWeight: 'bold',
        }}
        placeholder={'123456789'}
        keyboardType="phone-pad"
        renderErrorMessage={true}
        value={contact}
        // onChangeText={e => {
        //   setContact(e.replace(/[- #*;,.<>()+N\{\}\[\]\\\/]/gi, ''));
        //   setValue('phone', e.replace(/[- #*;,.<>()+N\{\}\[\]\\\/]/gi, ''), {
        //     shouldDirty: true,
        //     shouldValidate: true,
        //   });
        // }}
        errorMessage={errors.phone && errors.phone.message}
        // onSubmitEditing={() => fullNameInput.current.focus()}
        // onSubmitEditing={handleSubmit(handleLogin)}
        // onFocus={() => setButtonMargin(0)}
        // onBlur={() =>
        //   setButtonMargin(
        //     Dimensions.get("window").height * 0.08
        //   )
        // }
      />

      <View
        style={{
          paddingHorizontal: 8,
        }}>
        <Text
          style={{
            fontSize: 16,
            color: '#86939e',
            fontWeight: 'bold',
            marginBottom: 16,
          }}>
          Enter Your OTP Number
        </Text>

        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          keyboardType="phone-pad"
          textContentType="oneTimeCode"
          onFocus={() => setButtonMargin(0)}
          onBlur={() => setButtonMargin(Dimensions.get('window').height * 0.08)}
          renderCell={({index, symbol, isFocused}) => (
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
              {symbol || (isFocused ? <Cursor cursorSymbol="" /> : null)}
            </Text>
          )}
        />

        <View style={{flexDirection: 'row'}}>
          <Button
            disabled={otpLoading}
            title={
              otpLoading
                ? 'Didn’t receive your OTP? Request here in' +
                  ' ' +
                  otpCountDown +
                  's'
                : 'Resend OTP'
            }
            type="clear"
            titleStyle={{
              color: 'red',
              fontWeight: 'bold',
              fontSize: 14,
            }}
            buttonStyle={{paddingHorizontal: 5}}
            onPress={ResendOtp}
          />
        </View>

        {value.length < 6 && (
          <View style={{margin: 5}}>
            <Text style={{color: '#f00', fontSize: 12}}>
              OTP Number is required
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View>
      <View style={{paddingHorizontal: 24}}>
        <Text
          style={{
            fontWeight: 'bold',
            color: PrimaryColor,
            fontSize: 24,
            marginBottom: 12,
          }}>
          Set up your mobile number
        </Text>
        <Text style={{color: '#606264', fontSize: 16, marginBottom: 12}}>
          UCSIPAY will send you a 6-digit verification code
        </Text>

        {SetUpOtp}
      </View>

      <View
        style={{
          // flex: 1,
          justifyContent: 'flex-end',
          flexDirection: 'row',
          //   alignItems: 'flex-end',
          paddingTop: 40,
          paddingHorizontal: 32,
          // paddingBottom: 64,
        }}>
        {/* <TouchableWithoutFeedback
          onPress={() => {
            contextProvider.setSignUpStep({
              step: 0,
            });
          }}>
          <Image
            source={require('../../../assest/image/UcsiIcon/arrow_right_circle.png')}
            style={{
              // position: 'absolute',
              height: 50,
              width: 50,
              transform: [{rotateY: '180deg'}],
              // right: 40,
              // bottom: 64,
              //   zIndex: -1,
            }}
            // resizeMode="stretch"
            // resizeMethod="scale"
          />
        </TouchableWithoutFeedback> */}

        <TouchableWithoutFeedback
          onPress={() => {
            if (!loading) {
              handleSubmit(handleSetUpOtp)();
            }
          }}>
          <Image
            source={require('../../../assest/image/UcsiIcon/arrow_right_circle.png')}
            style={{
              // position: 'absolute',
              height: 50,
              width: 50,
              //   transform: [{rotateY: '180deg'}],
              // right: 40,
              // bottom: 64,
              //   zIndex: -1,
            }}
            // resizeMode="stretch"
            // resizeMethod="scale"
          />
        </TouchableWithoutFeedback>
      </View>

      <ActivityIndicator
        toast
        size="large"
        animating={loading}
        text={'Loading...'}
      />
    </View>
  );
};

export default SignUpOtp;

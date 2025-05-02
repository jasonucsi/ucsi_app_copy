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
import {context} from '../../../App';
import deviceInfo from '../../plugin/deviceInfo.plugin/deviceInfo.plugin';
import pushNotificationPlugin from '../../plugin/pushNotification.plugin/pushNotification.plugin';
import Modal from 'react-native-modal';
import {Button, Icon, Input} from 'react-native-elements';
import {PrimaryColor} from '../../tools/Constant/Constant';
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';
import AuthApi from '../../tools/Api/auth.api';
import {ResponseError} from '../../tools/ErrorHandler/ErrorHandler';
import {useForm} from 'react-hook-form';
import I18n from '../../locales';
import CountryPicker from 'react-native-country-picker-modal';

const LoginPage = ({navigation, route}) => {
  const {register, handleSubmit, errors, setValue} = useForm();
  const contextProvider = useContext(context);
  const [loading, setLoading] = useState(false);

  const [appInfo, setAppInfo] = useState({
    appVersion: '',
    systemName: '',
    systemVersion: '',
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [buttonVisible, setButtonVisible] = useState(true);
  const [buttonMargin, setButtonMargin] = useState(
    Dimensions.get('window').height * 0.08,
  );

  const [contact, setContact] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const [countryCode, setCountryCode] = useState('MY');
  const [countryNumber, setCountryNumber] = useState('60');

  const contactInput = useRef();
  const emailInput = useRef();
  const passwordInput = useRef();

  useEffect(() => {
    console.log('context', contextProvider);

    getAppInfo();

    register(
      {name: 'phone'},
      {
        required: 'Mobile Number is required',
        minLength: {
          value: 9,
          message: 'Please insert valid mobile number',
        },
        maxLength: {
          value: 10,
          message: 'Please insert valid mobile number',
        },
      },
    );

    // register('email', {
    //   required: 'Student/Staff Email Address is required',
    //   pattern: {
    //     value: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
    //     message: 'Invalid email address',
    //   },
    //   // validate: ValidateEmail
    // });

    // register('password', {
    //   required: 'Password is required',
    // });
  }, []);

  const getAppInfo = async () => {
    const info = await deviceInfo.getAppVersion();
    console.log(info, 215);
    setAppInfo(info);
  };

  const handleLogin = async values => {
    console.log(values);

    const res = await AuthApi.checkLoginNumber(values.phone);
    console.log(res);

    if (res.data.exists) {
      navigation.navigate('LoginPIN', {
        data: values,
      });
    } else {
      Alert.alert(
        null,
        'Contact number does not exist, please sign up as a new user.',
      );
    }

    // navigation.navigate('LoginOTP', {
    //   data: values,
    // });

    // navigation.reset({
    //   index: 0,
    //   routes: [
    //     {
    //       name: 'home',
    //       // params: {
    //       //   data: UserData.data,
    //       // },
    //     },
    //   ],
    // });
  };

  const SetUpMobileNumber = (
    <View>
      {/* <Input
        // placeholderTextColor="grey"
        ref={contactInput}
        label="Mobile Number"
        maxLength={10}
        leftIcon={<Text style={{fontSize: 18}}>+60</Text>}
        inputStyle={{transform: [{translateY: 1}]}}
        placeholder={'123456789'}
        keyboardType="phone-pad"
        renderErrorMessage={true}
        value={contact}
        onChangeText={e => {
          setContact(e.replace(/[- #*;,.<>()+N\{\}\[\]\\\/]/gi, ''));
          setValue('phone', e.replace(/[- #*;,.<>()+N\{\}\[\]\\\/]/gi, ''), {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
        errorMessage={errors.phone && errors.phone.message}
        onSubmitEditing={() => fullNameInput.current.focus()}
        // onSubmitEditing={handleSubmit(handleLogin)}
        // onFocus={() => setButtonMargin(0)}
        // onBlur={() =>
        //   setButtonMargin(
        //     Dimensions.get("window").height * 0.08
        //   )
        // }
      /> */}

      <Input
        ref={emailInput}
        label={'Student/Staff Email Address'}
        placeholder={'ucsi_pay@gmail.com'}
        keyboardType="email-address"
        onChangeText={e => {
          setEmail(e);
          setValue('email', e, {shouldValidate: true, shouldDirty: true});
        }}
        errorMessage={errors.email && errors.email.message}
        onSubmitEditing={() => passwordInput.current.focus()}
        // errorMessage={
        //     errors.email && !validateEmail
        //       ? errors.email.message
        //       : !errors.email && validateEmail
        //       ? I18n.t("SignUpDetails.errorMessage.emailExist")
        //       : null
        //   }
        value={email}
      />

      <Input
        ref={passwordInput}
        secureTextEntry={true}
        label={'Password'}
        placeholder={'Your password here'}
        keyboardType="default"
        onChangeText={e => {
          setPassword(e);
          setValue('password', e, {shouldValidate: true, shouldDirty: true});
        }}
        errorMessage={errors.password && errors.password.message}
        onSubmitEditing={handleSubmit(handleLogin)}
        // errorMessage={
        //     errors.email && !validateEmail
        //       ? errors.email.message
        //       : !errors.email && validateEmail
        //       ? I18n.t("SignUpDetails.errorMessage.emailExist")
        //       : null
        //   }
        value={password}
      />

      <Text
        style={{color: PrimaryColor, paddingHorizontal: 12, fontWeight: '500'}}>
        Forgot Password?
      </Text>
    </View>
  );

  const MobileNumber = (
    <View>
      <View>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              backgroundColor: '#edf3f4',
              borderRadius: 5,
              height: 50,
              paddingHorizontal: 12,
              paddingTop: 12,
              marginRight: 10,

              flexDirection: 'row',
            }}>
            <CountryPicker
              withFlag
              withEmoji
              withCallingCode
              withAlphaFilter
              countryCode={countryCode}
              onSelect={e => {
                console.log(e);
                setCountryCode(e.cca2);
                setCountryNumber(e.callingCode[0]);
              }}
            />
            <Text
              style={{
                color: 'rgba(0,0,0,.85)',
                fontSize: 16,
                paddingTop: 3,
              }}>
              +{countryNumber}
            </Text>
            {/* <Text
                          style={{ color: "rgba(0,0,0,.85)", fontSize: 16 }}
                        >
                          MY +60
                        </Text> */}
          </View>
          <View
            style={{
              backgroundColor: '#edf3f4',
              borderRadius: 5,
              height: 50,
              paddingHorizontal: 8,
              flex: 1,
            }}>
            <Input
              // placeholderTextColor="grey"
              maxLength={10}
              placeholder={'Mobile Number'}
              keyboardType="phone-pad"
              inputStyle={{
                color: 'rgba(0,0,0,.85)',
                fontSize: 16,
                paddingTop: Platform.OS === 'ios' ? 10 : 0,
                marginTop: Platform.OS === 'android' ? 10 : 0,
              }}
              renderErrorMessage={false}
              inputContainerStyle={{
                borderBottomColor: 'transparent',
              }}
              ref={contactInput}
              value={contact}
              onChangeText={e => {
                setContact(e.replace(/[- #*;,.<>()+N\{\}\[\]\\\/]/gi, ''));
                setValue(
                  'phone',
                  e.replace(/[- #*;,.<>()+N\{\}\[\]\\\/]/gi, ''),
                  {
                    shouldDirty: true,
                    shouldValidate: true,
                  },
                );
              }}
              onSubmitEditing={handleSubmit(handleLogin)}
              // onFocus={() => setButtonMargin(0)}
              // onBlur={() =>
              //   setButtonMargin(
              //     Dimensions.get("window").height * 0.08
              //   )
              // }
            />
          </View>
        </View>
        {errors.phone && (
          <Text
            style={{
              color: '#f00',
              fontSize: 12,
              textAlign: 'right',
            }}>
            {errors.phone.message}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    // <ScrollView
    //   style={{flex: 1, backgroundColor: '#fff'}}
    //   automaticallyAdjustKeyboardInsets={true}>
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <StatusBar backgroundColor="transparent" barStyle="light-content" />
      <ImageBackground
        source={require('../../assest/image/UcsiOnBoarding/background2.png')}
        style={{
          //   position: 'absolute',
          height: Dimensions.get('window').height * 0.4,
          width: Dimensions.get('window').width,
          //   zIndex: -1,
        }}
        resizeMode="stretch"
        resizeMethod="scale"
      />
      <View style={{paddingHorizontal: 24}}>
        <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
          <Image
            source={require('../../assest/image/UcsiIcon/arrow_left.png')}
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

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}>
          <View>
            <Text
              style={{
                fontWeight: 'bold',
                color: PrimaryColor,
                fontSize: 24,
              }}>
              Log In
            </Text>
          </View>

          <View style={{flexDirection: 'row', paddingTop: 8}}>
            <Text>Don't have account ? </Text>

            <Text
              style={{
                color: PrimaryColor,
                // paddingHorizontal: 12,
                fontWeight: '500',
              }}
              onPress={() => navigation.navigate('SignUp')}>
              Sign Up Now
            </Text>
          </View>
        </View>

        {MobileNumber}
      </View>

      <View
        style={{
          // flex: 1,
          // justifyContent: 'flex-end',
          alignItems: 'flex-end',
          paddingTop: 40,
          paddingRight: 24,
          // paddingBottom: 64,
        }}>
        <TouchableWithoutFeedback onPress={handleSubmit(handleLogin)}>
          <Image
            source={require('../../assest/image/UcsiIcon/arrow_right_circle.png')}
            style={{
              // position: 'absolute',
              height: 50,
              width: 50,
              // right: 40,
              // bottom: 64,
              //   zIndex: -1,
            }}
            // resizeMode="stretch"
            // resizeMethod="scale"
          />
        </TouchableWithoutFeedback>
      </View>

      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{textAlign: 'center', color: '#86989d'}}>
          App build version : {appInfo.appVersion}{' '}
          {contextProvider.contextProvider.codePushMeta.label !== '-' &&
            '(' + contextProvider.contextProvider.codePushMeta.label + ')'}
        </Text>
        <Text style={{textAlign: 'center', color: '#86989d'}}>
          OS version : {appInfo.systemName} {appInfo.systemVersion}
        </Text>
      </View>
    </View>
    // </ScrollView>
  );
};

export default LoginPage;

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
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Flex} from '@ant-design/react-native';
import {context} from '../../../App';
import pushNotificationPlugin from '../../plugin/pushNotification.plugin/pushNotification.plugin';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Modal from 'react-native-modal';
import {Button, Icon, Input} from 'react-native-elements';
import {
  PrimaryColor,
  windowHeight,
  windowWidth,
} from '../../tools/Constant/Constant';
import I18n from '../../locales';
import biometricPlugin from '../../plugin/biometric.plugin/biometric.plugin';
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import AuthApi from '../../tools/Api/auth.api';
import {ResponseError} from '../../tools/ErrorHandler/ErrorHandler';
import {useForm} from 'react-hook-form';
import SignUpMobileNumber from './components/SignUpMobileNumber';
import SignUpOtp from './components/SignUpOtp';
import SetUpPin from './components/SetUpPin';
import SignUpBiometric from './components/SignUpBiometric';

const SignUp = ({navigation, route}) => {
  const {register, handleSubmit, errors, setValue} = useForm();
  const contextProvider = useContext(context);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const [cardNumber, setCardNumber] = useState();

  const cardNumberInput = useRef();
  useEffect(() => {
    console.log('context', contextProvider);

    register(
      {name: 'cardNumber'},
      {
        required: 'UCSI CARD ID',
        // minLength: {
        //   value: 1,
        //   message: 'Please insert valid mobile number',
        // },
        // maxLength: {
        //   value: 10,
        //   message: 'Please insert valid mobile number',
        // },
      },
    );

    return () => {
      FingerprintScanner.release();
    };
  }, []);

  const handleSetUpCard = async values => {
    console.log(values);

    Alert.alert(null, 'Confirm UCSI CARD ID is correct?', [
      {
        text: 'Cancel',
        //   onPress: () => console.log('Cancel Pressed'),
      },
      {
        text: 'Submit',
        onPress: async () => {
          const res = await AuthApi.addUCSICard(values.cardNumber, {
            bind: true,
          });

          console.log(res);
          if (res.status >= 200 || res.status < 300) {
            // setLoading(false);

            Alert.alert(null, 'Add UCSI CARD Successful!', [
              {
                text: 'Ok',
                onPress: () => {
                  navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: 'SignUpSuccessful',
                        // params: {
                        //   // data: route.params.data,
                        // },
                      },
                    ],
                  });

                  contextProvider.setSignUpStep({
                    step: 0,
                  });
                },
              },
            ]);
          } else {
            // setLoading(false);
            Alert.alert(null, res.response.data);
          }
        },
      },
    ]);
  };
  const StepDot = (
    <View
      style={{flexDirection: 'row', marginBottom: 16, paddingHorizontal: 24}}>
      <View
        style={{
          width: 12,
          height: 12,
          borderRadius: 100,
          marginRight: 16,

          backgroundColor:
            contextProvider.contextProvider.signUpStep.step === 0
              ? PrimaryColor
              : '#C4C4C4',
        }}
      />
      <View
        style={{
          width: 12,
          height: 12,
          borderRadius: 100,
          marginRight: 16,

          backgroundColor:
            contextProvider.contextProvider.signUpStep.step === 1
              ? PrimaryColor
              : '#C4C4C4',
        }}
      />
      <View
        style={{
          width: 12,
          height: 12,
          borderRadius: 100,
          marginRight: 16,

          backgroundColor:
            contextProvider.contextProvider.signUpStep.step === 2
              ? PrimaryColor
              : '#C4C4C4',
        }}
      />
      <View
        style={{
          width: 12,
          height: 12,
          borderRadius: 100,
          marginRight: 16,

          backgroundColor:
            contextProvider.contextProvider.signUpStep.step === 3
              ? PrimaryColor
              : '#C4C4C4',
        }}
      />
      {/* <View
        style={{
          width: 12,
          height: 12,
          borderRadius: 100,
          marginRight: 16,

          backgroundColor:
            contextProvider.contextProvider.signUpStep.step === 4
              ? PrimaryColor
              : '#C4C4C4',
        }}
      /> */}
    </View>
  );

  const SignUpBiometric = (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          // marginTop: windowHeight * 0.1,
          marginTop: 12,
          paddingHorizontal: 40,
        }}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 20,
            paddingBottom: 8,
            fontWeight: 'bold',
          }}>
          UCSI Pay does not store your Biometrics data. You can set up or update
          your Biometric authentication at anytime at the settings page.
        </Text>
        {/* <Text style={{textAlign: 'center', color: '#86989d'}}>
          {I18n.t('SignUpBiometric.Label.loginFasterDesc')}
          {route.params.biometricType}.
        </Text> */}
        <View /* style={{paddingTop: windowHeight * 0.03}} */>
          {/* <Icon
            type="ionicon"
            name="finger-print"
            size={windowWidth * 0.4}
            color={PrimaryColor}
          /> */}
          <Image
            source={require('../../assest/image/logo/FingerprintID.png')}
            style={{
              width: windowWidth * 0.5,
              height: windowWidth * 0.5,
              tintColor: 'red',
            }}
            resizeMode="contain"
            resizeMethod="scale"
          />
        </View>
      </View>
      <View style={{alignItems: 'center', marginBottom: windowHeight * 0.05}}>
        <Button
          title={I18n.t('SignUpBiometric.button.scanNow')}
          titleStyle={{paddingVertical: 8, fontWeight: 'bold'}}
          buttonStyle={{borderRadius: 10, backgroundColor: PrimaryColor}}
          containerStyle={{width: '70%', marginBottom: 8}}
          // onPress={() => navigation.navigate("SignUpDetails")}
          onPress={async () => {
            const res = await biometricPlugin.createBiometricCredential();
            console.log(res);
            if (res.status === 'ok') {
              await RNSecureStorage.set('biometric', 'Enabled', {
                accessible: ACCESSIBLE.WHEN_UNLOCKED,
              });
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'SignUpSuccessful',
                    // params: {
                    //   // data: route.params.data,
                    // },
                  },
                ],
              });

              // contextProvider.setSignUpStep({
              //   step: 4,
              // });
            } else if (res.status === 'error') {
              alert(res.message);
            }
          }}
        />
        <Button
          title={I18n.t('SignUpBiometric.button.noThanks')}
          type="clear"
          titleStyle={{textDecorationLine: 'underline', color: '#000'}}
          containerStyle={{width: '70%'}}
          onPress={
            () =>
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'SignUpSuccessful',
                    // params: {
                    //   // data: route.params.data,
                    // },
                  },
                ],
              })

            // contextProvider.setSignUpStep({
            //   step: 4,
            // })
          }
        />
      </View>
    </View>
  );

  const SetUpCard = (
    <View>
      <View style={{paddingHorizontal: 24}}>
        <Text
          style={{
            fontWeight: 'bold',
            color: PrimaryColor,
            fontSize: 24,
            marginBottom: 12,
          }}>
          Link Your Student/Staff Card
        </Text>
        <Text style={{color: '#606264', fontSize: 16, marginBottom: 12}}>
          You’re at the final step
        </Text>

        <Input
          // placeholderTextColor="grey"
          ref={cardNumberInput}
          label="UCSI CARD ID"
          // maxLength={10}
          placeholder={'UC89583275910'}
          // keyboardType="phone-pad"
          renderErrorMessage={true}
          value={cardNumber}
          onChangeText={e => {
            setCardNumber(e);
            setValue('cardNumber', e, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
          errorMessage={errors.cardNumber && errors.cardNumber.message}
          onSubmitEditing={handleSubmit(handleSetUpCard)}
          // onSubmitEditing={handleSubmit(handleLogin)}
          // onFocus={() => setButtonMargin(0)}
          // onBlur={() =>
          //   setButtonMargin(
          //     Dimensions.get("window").height * 0.08
          //   )
          // }
        />

        <TouchableWithoutFeedback
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'SignUpSuccessful',
                  // params: {
                  //   // data: route.params.data,
                  // },
                },
              ],
            });

            contextProvider.setSignUpStep({
              step: 0,
            });
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 12,
            }}>
            <Text
              style={{
                color: PrimaryColor,
                fontWeight: 'bold',
                fontSize: 20,
              }}>
              Skip
            </Text>

            <Icon
              name="chevron-right"
              type="entypo"
              color={PrimaryColor}
              size={24}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>

      <View
        style={{
          // flex: 1,
          // justifyContent: 'flex-end',
          alignItems: 'flex-end',
          paddingTop: 16,
          paddingRight: 32,
          // paddingBottom: 64,
        }}>
        <TouchableWithoutFeedback onPress={handleSubmit(handleSetUpCard)}>
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
    </View>
  );

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView
        style={{flex: 1, backgroundColor: '#fff'}}
        automaticallyAdjustKeyboardInsets={true}>
        <View style={{paddingBottom: 24}}>
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />
          {/* <StatusBar backgroundColor="transparent" barStyle="light-content" /> */}

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
          <View>
            <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
              <Image
                source={require('../../assest/image/UcsiIcon/arrow_left.png')}
                style={{
                  position: 'absolute',
                  height: 25,
                  width: 25,
                  // marginBottom: 12,
                  left: 24,
                  top: -48,
                  //   zIndex: -1,
                }}
                resizeMode="contain"
                // resizeMethod="scale"
              />
            </TouchableWithoutFeedback>

            {StepDot}

            {contextProvider.contextProvider.signUpStep.step === 0 ? (
              <SignUpMobileNumber />
            ) : contextProvider.contextProvider.signUpStep.step === 1 ? (
              <SetUpPin />
            ) : contextProvider.contextProvider.signUpStep.step === 2 ? (
              <SignUpOtp />
            ) : contextProvider.contextProvider.signUpStep.step === 3 ? (
              SignUpBiometric
            ) : // <SignUpBiometric />
            //       : contextProvider.contextProvider.signUpStep.step === 4 ? (
            // SetUpCard
            // )
            null}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SignUp;

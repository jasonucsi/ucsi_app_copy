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
import {context} from '../../../../App';
import pushNotificationPlugin from '../../../plugin/pushNotification.plugin/pushNotification.plugin';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Modal from 'react-native-modal';
import {Button, Icon, Input} from 'react-native-elements';
import {PrimaryColor} from '../../../tools/Constant/Constant';
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';
import {ResponseError} from '../../../tools/ErrorHandler/ErrorHandler';
import {useForm} from 'react-hook-form';

const SignUp = ({navigation, route}) => {
  const {register, handleSubmit, errors, setValue} = useForm();
  const contextProvider = useContext(context);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const [contact, setContact] = useState();
  const [fullName, setFullName] = useState();

  const contactInput = useRef();
  const fullNameInput = useRef();

  useEffect(() => {
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

    register('fullName', {
      required: 'Name as per NRIC/Passport ID is required',
    });
  }, []);

  const SignUpSuccessful = (
    <View style={{height: '100%' /* , backgroundColor: PrimaryColor */}}>
      <StatusBar backgroundColor="transparent" barStyle="light-content" />
      <ImageBackground
        source={require('../../../assest/image/UcsiLogo/ucsi_splash_background.png')}
        style={{flex: 1}}>
        <TouchableWithoutFeedback
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [
                {
                  // name: 'OnBoardingPage',
                  // name: 'LoginPage',
                  name: 'home',
                  // params: {
                  //   // data: route.params.data,
                  // },
                },
              ],
            })
          }>
          <View
            style={{
              // paddingTop: Dimensions.get('window').height * 0.2,
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
            }}>
            <Image
              source={require('../../../assest/image/UcsiIcon/register_successful.png')}
              style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height * 0.6,
              }}
              resizeMode="contain"
              resizeMethod="auto"
              fadeDuration={800}
            />
          </View>
        </TouchableWithoutFeedback>

        {/* <View
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
        </View> */}
      </ImageBackground>
    </View>
  );

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>{SignUpSuccessful}</View>
  );
};

export default SignUp;

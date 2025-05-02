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
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';
import AuthApi from '../../../tools/Api/auth.api';
import {ResponseError} from '../../../tools/ErrorHandler/ErrorHandler';
import {useForm} from 'react-hook-form';
import SetPin from '../../SecureCode/components/SetPin';

const SetUpPin = ({navigation, route}) => {
  const {register, handleSubmit, errors, setValue} = useForm();
  const contextProvider = useContext(context);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  useEffect(() => {
    console.log('context', contextProvider);
  }, []);

  const handleSetUpPin = async () => {
    console.log('pin', pin);
    console.log('confirm pin', confirmPin);

    if (pin.match(confirmPin) && pin && confirmPin) {
      contextProvider.setSignUpStep({
        step: 2,
        pin,
        data: contextProvider.contextProvider.signUpStep.data,
      });
    } else {
      Alert.alert(null, 'PIN Not Match');
    }

    // if (pin.match(confirmPin) && pin && confirmPin) {
    //   const res = await AuthApi.setupPin({
    //     pin,
    //   });
    //   console.log(res);
    //   if (res.status >= 200 || res.status < 300) {
    //     await RNSecureStorage.set('pin', pin, {
    //       accessible: ACCESSIBLE.WHEN_UNLOCKED,
    //     });

    //     contextProvider.setSignUpStep({
    //       step: 2,
    //     });
    //   } else {
    //     Alert.alert(null, res.response.data);
    //   }
    // } else {
    //   Alert.alert(null, 'PIN Not Match');
    // }
  };

  const setupPin = (
    <View>
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
          Enter Your 6-Digit PIN
        </Text>

        <SetPin
          setFirstPin={e => setPin(e)}
          confirmPin={false}
          setConfirmPin={e => setConfirmPin(e)}
        />

        {pin.length < 6 && (
          <View style={{margin: 5}}>
            <Text style={{color: '#f00', fontSize: 12}}>
              6-Digit Pin is required
            </Text>
          </View>
        )}

        <Text
          style={{
            fontSize: 16,
            color: '#86939e',
            fontWeight: 'bold',
            marginBottom: 16,
          }}>
          Confirm 6-Digit PIN
        </Text>

        <SetPin
          setFirstPin={e => setPin(e)}
          confirmPin={true}
          setConfirmPin={e => setConfirmPin(e)}
        />

        {confirmPin.length < 6 && (
          <View style={{margin: 5}}>
            <Text style={{color: '#f00', fontSize: 12}}>
              Confirm 6-Digit Pin is required
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
          Set up your eWallet
        </Text>
        <Text style={{color: '#606264', fontSize: 16, marginBottom: 12}}>
          Set up your 6-digit PIN. This PIN number will be used to authorise
          your future transactions.
        </Text>

        {setupPin}
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

        <TouchableWithoutFeedback onPress={handleSubmit(handleSetUpPin)}>
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
    </View>
  );
};

export default SetUpPin;

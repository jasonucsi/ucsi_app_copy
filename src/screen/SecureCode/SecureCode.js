import {HeaderBackButton} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {
  Keyboard,
  Platform,
  StatusBar,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Button} from 'react-native-elements';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {ResponseError} from '../../tools/ErrorHandler/ErrorHandler';
import biometricPlugin from '../../plugin/biometric.plugin/biometric.plugin';
import {PrimaryColor, windowHeight} from '../../tools/Constant/Constant';
import SetPin from './components/SetPin';
import I18n from '../../locales';

const SecureCode = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(true);
  useEffect(() => {
    console.log(route);
    if (route.params && route.params.type === 'SignUp') {
      setIsSignUp(true);
    }

    const keyboardShow = Keyboard.addListener('keyboardDidShow', () => {
      setButtonVisible(false);
    });
    const keyboardHide = Keyboard.addListener('keyboardDidHide', () => {
      setButtonVisible(true);
    });

    return () => {
      keyboardShow.remove();
      keyboardHide.remove();
    };
  }, []);

  const handleSubmit = async () => {
    console.log('pin', pin);
    console.log('confirm pin', confirmPin);
    if (pin.match(confirmPin)) {
      //   alert("PIN match");
      if (isSignUp) {
        const res = await biometricPlugin.checkBiometric();

        if (res.status === 'ok') {
          navigation.navigate('SignUpBiometric', {
            biometricType: res.data.type,
            referralcode: route.params && route.params.referralcode,
            pin: pin,
            phone: route.params && route.params.phone,
          });
        } else {
          navigation.navigate('SignUpDetails', {
            referralcode: route.params && route.params.referralcode,
            pin: pin,
            phone: route.params && route.params.phone,
          });
        }
      } else {
        navigation.navigate('Account');
      }
    } else {
      alert('PIN Not Match');
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{flex: 1}}>
          {!isSignUp && (
            <View
              style={{
                position: 'absolute',
                top: 8,
                left: 18,
              }}>
              <HeaderBackButton
                labelVisible={false}
                style={{marginHorizontal: 0}}
                tintColor={PrimaryColor}
                onPress={() => navigation.goBack()}
              />
            </View>
          )}
          <View
            style={{
              paddingHorizontal: 24,
              marginTop: Platform.OS === 'android' ? 38 : 48,
              // paddingTop: 8
            }}>
            <Text
              style={{
                color: PrimaryColor,
                fontSize: 20,
                fontWeight: 'bold',
              }}>
              {isSignUp
                ? I18n.t('SecureCode.Label.createPin')
                : I18n.t('SecureCode.Label.enterPin')}
            </Text>
            <Text style={{paddingTop: 4}}>
              {I18n.t('SecureCode.Label.setPinDesc')}
            </Text>
          </View>
          <View style={{paddingHorizontal: 32}}>
            <View style={{marginTop: windowHeight * 0.06, marginBottom: 16}}>
              <Text style={{textAlign: 'center', fontSize: 16}}>
                {I18n.t('SecureCode.Label.setPin')}
              </Text>
            </View>
            <View>
              <SetPin
                setFirstPin={e => setPin(e)}
                confirmPin={false}
                setConfirmPin={e => setConfirmPin(e)}
              />
            </View>
          </View>
          <View style={{paddingHorizontal: 32}}>
            <View style={{marginTop: windowHeight * 0.05, marginBottom: 16}}>
              <Text style={{textAlign: 'center', fontSize: 16}}>
                {I18n.t('SecureCode.Label.confirmPin')}
              </Text>
            </View>
            <View>
              <SetPin
                setFirstPin={e => setPin(e)}
                confirmPin={true}
                setConfirmPin={e => setConfirmPin(e)}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
      {buttonVisible && (
        <View
          style={{
            alignItems: 'center',
            marginBottom: windowHeight * 0.05,
          }}>
          <Button
            disabled={pin.length < 6 || confirmPin.length < 6}
            title={I18n.t('SecureCode.button.submit')}
            containerStyle={{width: '70%'}}
            titleStyle={{paddingVertical: 8}}
            buttonStyle={{
              borderRadius: 10,
              backgroundColor: PrimaryColor,
            }}
            onPress={handleSubmit}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default SecureCode;

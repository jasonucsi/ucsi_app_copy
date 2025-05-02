import {HeaderBackButton} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
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
import {Button} from 'react-native-elements';
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';
import I18n from '../../../locales';
import AuthApi from '../../../tools/Api/auth.api';
import {ResponseError} from '../../../tools/ErrorHandler/ErrorHandler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {PrimaryColor, windowHeight} from '../../../tools/Constant/Constant';
import SetPin from './SetPin';
import {VirtualKeyboard} from 'react-native-screen-keyboard';

const ChangePin = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({});

  const [oldPin, setOldPin] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const [buttonVisible, setButtonVisible] = useState(true);
  useEffect(() => {
    // GetUserData();

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
    if (oldPin.match(pin || confirmPin)) {
      Alert.alert(null, "New Pin and Confirm Pin can't be same with Old Pin");
      return;
    }

    setLoading(true);

    const res = await AuthApi.setupPin({
      pin: pin,
      oldPin: oldPin,
    });
    console.log(res);

    if (pin.match(confirmPin)) {
      if (res.status >= 200 || res.status < 300) {
        setLoading(false);

        Alert.alert(null, I18n.t('Account.SetOldNewPin.changeNewPinSuccess'), [
          {
            text: I18n.t('SecureCode.button.ok'),
            onPress: () => {
              navigation.navigate('Account');
            },
          },
        ]);
      } else {
        setLoading(false);
        ResponseError(res);
      }
    } else {
      alert('New Pin & Confirm PIN does not match');
    }

    // if (pin.match(confirmPin)) {
    //   Alert.alert(null, I18n.t('Account.SetOldNewPin.changeNewPinSuccess'), [
    //     {
    //       text: I18n.t('SecureCode.button.ok'),
    //       onPress: () => {
    //         navigation.navigate('Account');
    //       },
    //     },
    //   ]);
    // } else {
    //   alert(I18n.t('Account.SetOldNewPin.pinNotMatch'));
    // }
  };
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <StatusBar
        backgroundColor={PrimaryColor}
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
      />

      <View style={{paddingVertical: 24}}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={{flex: 1}}>
            {/* <View
            style={{
              position: "absolute",
              top: 8,
              left: 18,
              zIndex: 10,
            }}
          >
            <HeaderBackButton
              labelVisible={false}
              style={{ marginHorizontal: 0 }}
              tintColor={PrimaryColor}
              onPress={() => navigation.goBack()}
            />
          </View> */}
            <View
              style={{
                paddingHorizontal: 24,
                // paddingTop: Platform.OS === "android" ? 38 : 48,
              }}>
              <Text
                style={{
                  color: PrimaryColor,
                  fontSize: 20,
                  fontWeight: 'bold',
                }}>
                {I18n.t('Account.ChangePin.change6DigitPin')}
              </Text>
              <Text style={{paddingTop: 4}}>
                {I18n.t('Account.ChangePin.change6DigitPinDescription')}
              </Text>
            </View>
            <View style={{paddingHorizontal: 32}}>
              <View style={{marginTop: windowHeight * 0.06, marginBottom: 16}}>
                <Text style={{textAlign: 'center', fontSize: 16}}>Old Pin</Text>
              </View>
              <View /* style={{marginTop: windowHeight * 0.06, marginBottom: 16}} */
              >
                <SetPin setFirstPin={e => setOldPin(e)} confirmPin={false} />
              </View>
            </View>

            <View style={{paddingHorizontal: 32}}>
              <View style={{marginTop: windowHeight * 0.06, marginBottom: 16}}>
                <Text style={{textAlign: 'center', fontSize: 16}}>
                  {I18n.t('Account.SetOldNewPin.newPin')}
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
                  Confirm PIN
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
              disabled={
                oldPin.length < 6 || pin.length < 6 || confirmPin.length < 6
              }
              title={I18n.t('Account.ChangePin.submit')}
              containerStyle={{width: '70%'}}
              titleStyle={{paddingVertical: 8}}
              buttonStyle={{
                borderRadius: 10,
                backgroundColor: PrimaryColor,
                marginTop: 40,
              }}
              onPress={handleSubmit}
            />

            <Button
              title={'Forgot your PIN ?'}
              type="clear"
              titleStyle={{
                textDecorationLine: 'underline',
                color: PrimaryColor,
              }}
              onPress={() =>
                navigation.navigate('ForgetPin', {
                  type: 'ChangePIN',
                })
              }
            />
          </View>
        )}

        {/* <VirtualKeyboard
        onRef={(ref) => (keyboard = ref)}
        keyDown={keyDown.bind(this)}
      /> */}
      </View>
    </ScrollView>
  );
};

export default ChangePin;

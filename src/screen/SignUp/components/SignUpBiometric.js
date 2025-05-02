import React, {useEffect, useContext} from 'react';
import {StatusBar, View, Text, Image} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import {SafeAreaView} from 'react-native-safe-area-context';
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';
import biometricPlugin from '../../../plugin/biometric.plugin/biometric.plugin';
import {
  PrimaryColor,
  windowHeight,
  windowWidth,
} from '../../../tools/Constant/Constant';
import I18n from '../../../locales';
import {context} from '../../../../App';

const SignUpBiometric = ({navigation, route}) => {
  const contextProvider = useContext(context);
  useEffect(() => {
    // console.log(route.params);

    return () => {
      FingerprintScanner.release();
    };
  }, []);
  return (
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
          UCSIPAY does not store your Biometrics data. You can set up or update
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
            source={require('../../../assest/image/logo/FingerprintID.png')}
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
};

export default SignUpBiometric;

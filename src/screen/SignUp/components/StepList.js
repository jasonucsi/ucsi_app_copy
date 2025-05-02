import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Image,
  Dimensions,
  StatusBar,
  Text,
  Platform,
  Linking,
  ImageBackground,
  ScrollView,
  TouchableWithoutFeedback,
  imagebac,
} from 'react-native';
import {context} from '../../../../App';
import {ActivityIndicator, Flex} from '@ant-design/react-native';
import Modal from 'react-native-modal';
import {AuthHeader} from '../../../tools/Api/api';
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';
import AuthApi from '../../../tools/Api/auth.api';
import {Button, Icon} from 'react-native-elements';
import {PrimaryColor} from '../../../tools/Constant/Constant';
import StepIndicator from 'react-native-step-indicator';
import {useIsFocused} from '@react-navigation/native';

const StepList = ({navigation, route}) => {
  const contextProvider = useContext(context);

  const stepIndicatorStyles = {
    stepIndicatorSize: 30,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 3,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: PrimaryColor,
    separatorFinishedColor: PrimaryColor,
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: PrimaryColor,
    stepIndicatorUnFinishedColor: '#aaaaaa',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 15,
    currentStepIndicatorLabelFontSize: 15,
    stepIndicatorLabelCurrentColor: '#000000',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: 'rgba(255,255,255,0.5)',
    labelColor: '#666666',
    labelSize: 15,
    currentStepLabelColor: PrimaryColor,
    labelAlign: 'flex-start',
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    console.log(route);

    // if (isFocused) {
    //   contextProvider.setSignUpStep({
    //     step: 0,
    //   });
    // }

    if (isFocused) {
      GetUserData();
    }
  }, [isFocused]);

  const GetUserData = async () => {
    RNSecureStorage.get('jwt')
      .then(async value => {
        console.log(value);

        try {
          // http passing token to getProfile api //
          await AuthHeader();
          // http passing token to getProfile api ^ //

          setTimeout(async () => {
            const UserData = await AuthApi.getProfile();
            console.log('UserData', UserData);

            if (res.status >= 200 || res.status < 300) {
              if (!UserData.data.pinSet) {
                // setup pin
                // navigation.reset({
                //   index: 0,
                //   routes: [
                //     {
                //       name: 'SignUp',
                //     },
                //   ],
                // });

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
            }
          }, 1000);
        } catch (error) {
          console.log('UserData', error);
        }
      })
      .catch(err => {
        console.log(err);

        contextProvider.setSignUpStep({
          step: 0,
        });
      });
  };

  return (
    <ScrollView
      style={{flex: 1, backgroundColor: '#fff'}}
      automaticallyAdjustKeyboardInsets={true}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* <StatusBar backgroundColor="transparent" barStyle="light-content" /> */}

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
      <View style={{paddingHorizontal: 24, paddingBottom: 24}}>
        <Text
          style={{
            fontWeight: 'bold',
            color: PrimaryColor,
            fontSize: 24,
            marginBottom: 12,
          }}>
          We’re excited to have you on this journey!
        </Text>
        <Text style={{fontWeight: '500', color: '#606264', fontSize: 20}}>
          Get started in 3 simple steps.
        </Text>

        <View style={{height: 250, marginVertical: 24}}>
          <StepIndicator
            customStyles={stepIndicatorStyles}
            stepCount={3}
            direction="vertical"
            currentPosition={3}
            labels={[
              'Set up mobile number',
              'Set up your account',
              'Set up your KYC',
              // 'Set up your eWallet',
              // 'Set up your UCSI One Card',
            ]}
          />
        </View>

        <View style={{alignItems: 'center'}}>
          <Button
            title="I’m Ready to Start"
            buttonStyle={{
              width: Dimensions.get('window').width * 0.6,
              borderRadius: 100,
              backgroundColor: PrimaryColor,
              marginBottom: 16,
            }}
            titleStyle={{paddingVertical: 8}}
            onPress={() => {
              navigation.navigate('SignUp');
            }}
          />

          <Button
            title="Back to Login"
            buttonStyle={{
              width: Dimensions.get('window').width * 0.6,
              borderRadius: 100,
              backgroundColor: PrimaryColor,
            }}
            titleStyle={{paddingVertical: 8}}
            onPress={() => {
              navigation.goBack();
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default StepList;

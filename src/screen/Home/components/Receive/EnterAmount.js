import React, {Fragment, useEffect, useState, useRef} from 'react';
import {
  Alert,
  Image,
  NavigatorIOS,
  Platform,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';
import QRCode from 'react-native-qrcode-svg';
import Barcode from '@kichiyaki/react-native-barcode-generator';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  PrimaryColor,
  windowHeight,
  windowWidth,
} from '../../../../tools/Constant/Constant';
import {ResponseError} from '../../../../tools/ErrorHandler/ErrorHandler';
import {RNCamera} from 'react-native-camera';
import I18n from '../../../../locales';
import DeviceBrightness from '@adrianso/react-native-device-brightness';
import Share from 'react-native-share';
import {ActivityIndicator} from '@ant-design/react-native';
import Modal from 'react-native-modal';
import CurrencyInput from 'react-native-currency-input';

const EnterAmount = ({navigation, route}) => {
  var _svg = useRef();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('');
  const [countDown, setCountDown] = useState(60);
  const [barcodes, setBarcodes] = useState([]);
  const [isFlashOn, setFlashOnOff] = useState(false);
  const [brightnessLevel, setBrightnessLevel] = useState();
  var countDownInterval;

  const [amountModalVisible, setAmountModalVisible] = useState(false);
  const [currencyAmount, setCurrencyAmount] = useState(0);

  const [userCode, setUserCode] = useState({});
  const [merchantCode, setMerchantCode] = useState({});

  useEffect(() => {
    console.log(route);
    setType(route.params.type);

    return () => {
      DeviceBrightness.setBrightnessLevel(0.4);
    };
  }, []);

  useEffect(() => {
    countDownPayTimer();
    GetBrightnessLevel();
    // GetMerchantQrCode();

    return () => {
      clearInterval(countDownInterval);
      setCountDown(60);
    };
  }, [type]);

  const GetBrightnessLevel = async () => {
    // const brightness = await DeviceBrightness.getBrightnessLevel();
    // console.log(brightness);
    await DeviceBrightness.setBrightnessLevel(1);
  };

  const countDownPayTimer = () => {
    if (route.params.type === 'Pay' || type === 'Pay') {
      var countDownTimer = countDown;
      countDownInterval = setInterval(() => {
        countDownTimer -= 1;
        setCountDown(countDownTimer);

        if (countDownTimer === -1) {
          countDownTimer = 60;
          setCountDown(60);

          GetUserQrCode();
          // GetMerchantQrCode()
        }
      }, 1000);
    }
  };

  const receiveQRView = (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <View
        style={{
          backgroundColor: '#fff',
          height:
            windowHeight <= 640 ? windowHeight * 0.65 : windowHeight * 0.6,
          marginHorizontal: 24,
          borderRadius: 10,
          padding: 16,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.29,
          shadowRadius: 4.65,

          elevation: 7,
        }}>
        <ActivityIndicator
          toast
          size="large"
          animating={loading}
          text={I18n.t('Account.Home.EnterAmount.loading')}
        />
        <View style={{flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{flex: 1}}>
              <Text style={{fontSize: 18}}>{userCode.loginusername}</Text>
              {/* <Text style={{ color: "#86989d" }}>xxxx-xxxx-1234</Text> */}
            </View>
            {/* <Button
            title="Change Account"
            titleProps={{ numberOfLines: 2 }}
            titleStyle={{
              fontSize: 11,
              paddingVertical: 0,
              paddingHorizontal: 0,
            }}
            buttonStyle={{
              backgroundColor: PrimaryColor,
              borderRadius: 10,
              width: 95,
            }}
          /> */}
          </View>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <View
                style={{
                  borderColor: PrimaryColor,
                  borderRadius: 20,
                  borderWidth: 5,
                  backgroundColor: PrimaryColor,
                }}>
                <View
                  style={{
                    borderRadius: 20,
                    padding: windowHeight * 0.015,
                    // padding:
                    //   windowHeight <= 640
                    //     ? windowHeight * 0.045
                    //     : windowHeight * 0.045,
                    borderColor: PrimaryColor,
                    borderWidth: 5,
                    backgroundColor: '#fff',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={{
                      uri: `data:image/jpeg;base64,${userCode.qrbyte}`,
                    }}
                    style={{
                      height: windowHeight * 0.3,

                      width: windowHeight * 0.3,
                    }}
                  />
                  {/* <QRCode
                  value={userCode.qrbyte ? userCode.qrbyte : "null"}
                  color={PrimaryColor}
                  size={
                    windowHeight <= 640
                      ? windowHeight * 0.25
                      : windowHeight * 0.23
                  }
                  getRef={_svg}
                /> */}
                </View>
                <View style={{backgroundColor: PrimaryColor}}>
                  <Text
                    style={{
                      color: '#fff',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      paddingVertical: 4,
                    }}
                    numberOfLines={1}>
                    {I18n.t('Account.Home.EnterAmount.receiverQr')}
                  </Text>
                </View>
              </View>
            </View>

            <View style={{paddingHorizontal: 16}}>
              <Text style={{color: '#86989d', textAlign: 'center'}}>
                {I18n.t('Account.Home.EnterAmount.receiverQrDescription')}
              </Text>
            </View>

            <View>
              <Text style={{fontSize: 32, fontWeight: 'bold'}}>
                RM{route.params.amount.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const shareQR = () => {
    _svg.current.toDataURL(callback);
  };

  const callback = dataURL => {
    console.log(dataURL);
    Share.open({
      url: `data:image/png;base64,${dataURL}`,
      title: 'QR Code',
      // type: "application/pdf"
    })
      .then(res => {
        console.log(res);
      })
      .catch(error => console.log(error));
  };

  const receiveOptionButton = (
    <View style={{flexDirection: 'row'}}>
      <View style={{flex: 1}}>
        <Button
          title="Enter Amount"
          titleStyle={{fontSize: 16, fontWeight: 'bold'}}
          buttonStyle={{
            height:
              windowHeight <= 640 ? windowHeight * 0.08 : windowHeight * 0.11,
            borderRadius: 0,
            backgroundColor: '#222d37',
          }}
          containerStyle={{borderRadius: 0}}
          onPress={() => setAmountModalVisible(true)}
        />
      </View>
      <View style={{flex: 1}}>
        <Button
          title="Share QR Code"
          titleStyle={{fontSize: 16, fontWeight: 'bold'}}
          buttonStyle={{
            height:
              windowHeight <= 640 ? windowHeight * 0.08 : windowHeight * 0.11,
            borderRadius: 0,
          }}
          containerStyle={{borderRadius: 0}}
          onPress={shareQR}
        />
      </View>
    </View>
  );

  return (
    <View style={{flex: 1, backgroundColor: PrimaryColor}}>
      <StatusBar backgroundColor={PrimaryColor} barStyle="light-content" />

      {receiveQRView}
    </View>
  );
};

export default EnterAmount;

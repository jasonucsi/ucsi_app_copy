import React, {Fragment, useEffect, useState, useRef, useContext} from 'react';
import {
  Alert,
  Image,
  NavigatorIOS,
  PermissionsAndroid,
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
import {context} from '../../../../../App';
import TransactionApi from '../../../../tools/Api/transaction.api';
import {RNCamera} from 'react-native-camera';
import DeviceBrightness from '@adrianso/react-native-device-brightness';
import Share from 'react-native-share';
import I18n from '../../../../locales';
import Modal from 'react-native-modal';
import CurrencyInput from 'react-native-currency-input';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import moment from 'moment';
import Toast from 'react-native-root-toast';
import TotpPlugin from '../../../../plugin/totp.plugin/totp.plugin';

const Receive = ({navigation, route}) => {
  const contextProvider = useContext(context);
  var _svg = useRef();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('Scan');
  const [countDown, setCountDown] = useState(60);
  const [barcodes, setBarcodes] = useState([]);
  const [isFlashOn, setFlashOnOff] = useState(false);
  const [brightnessLevel, setBrightnessLevel] = useState();
  var countDownInterval;
  var countDownTimer;

  const [intervalScanQr, setIntervalScanQr] = useState(true);

  const [amountModalVisible, setAmountModalVisible] = useState(false);
  const [currencyAmount, setCurrencyAmount] = useState(0);

  const [userCode, setUserCode] = useState();
  const [merchantCode, setMerchantCode] = useState({});

  const [walletBalance, setWalletBalance] = useState(0);
  const [walletType, setWalletType] = useState('NormalWallet');
  const [refWallet, setRefWallet] = useState(0);

  // Pay QR
  const [currTime, setCurrTimestamp] = useState(Math.floor(Date.now()));
  const [payQRcode, setPayQRcode] = useState('null');

  useEffect(() => {
    console.log(route);
    console.log(contextProvider);

    if (route.params) {
      setType(route.params.type);
      setUserCode(route.params.walletDetails._id);
    }

    return () => {
      DeviceBrightness.setBrightnessLevel(0.4);
    };
  }, []);

  useEffect(() => {
    countDownPayTimer();
    GetBrightnessLevel();
    FirstTimePayQR();
    // GetUserQrCode();
    // GetMerchantQrCode();

    return () => {
      clearInterval(countDownInterval);
      setCountDown(60);
    };
  }, [type]);

  const FindNameQr = async qrcode => {
    try {
      if (intervalScanQr === true) {
        setLoading(true);

        const res = await TransactionApi.scanWalletId(qrcode[0].data);

        console.log('find QR', res);

        if (res.status >= 200 || res.status < 300) {
          setLoading(false);

          navigation.navigate('TransferMoney', {
            fullName: res.data.name,
            contact: res.data.contact ? res.data.contact.number : null,
            walletId: res.data.walletId ? res.data.walletId : null,
            walletBalance: route.params.walletBalance,
            // full_name: "Lim Giap Weng",
            // data: { contact: "0102801099" },
            // data: res.data,
            // barcodes,
            // walletType: walletType,
            // refWallet: refWallet,
          });
        } else {
          setLoading(false);

          // False can't Scan else True can Scan
          setIntervalScanQr(false);
          setTimeout(() => {
            setIntervalScanQr(true);
          }, 1000);

          Toast.show('Invalid Wallet ID', {
            duration: Toast.durations.SHORT,
            position: 0,
            // position: Toast.positions.BOTTOM,
            backgroundColor: 'red',
            shadow: false,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
          // ResponseError(res);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleNext = async () => {
    setAmountModalVisible(false);

    // await analytics().logEvent(firebaseAnalyticCustom.customQrCodeAmount, {
    //   currencyAmount: "RM" + currencyAmount,
    //   currency: "MYR",
    // });

    navigation.navigate('EnterAmount', {
      amount: currencyAmount,
    });
  };

  const GetBrightnessLevel = async () => {
    // const brightness = await DeviceBrightness.getBrightnessLevel();
    // console.log(brightness);
    await DeviceBrightness.setBrightnessLevel(1);
  };

  const countDownPayTimer = () => {
    if (type === 'Pay') {
      countDownTimer = countDown;
      countDownInterval = setInterval(() => {
        countDownTimer -= 1;
        setCountDown(countDownTimer);

        if (countDownTimer === -1) {
          countDownTimer = 60;
          setCountDown(60);

          refreshPayQR();
          // GetUserQrCode();
          // GetMerchantQrCode()
        }
      }, 1000);
    }
  };

  const renderBarcode = ({bounds, data}) => (
    <Fragment key={data + bounds.origin.x}>
      <View
        style={{
          borderWidth: 2,
          borderRadius: 10,
          position: 'absolute',
          borderColor: '#f00',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.9)',
          padding: 10,
          ...bounds.size,
          left: bounds.origin.x,
          top: bounds.origin.y,
        }}>
        <Text
          style={{
            color: '#F00',
            flex: 1,
            position: 'absolute',
            textAlign: 'center',
            backgroundColor: 'transparent',
          }}>
          {data}
        </Text>
      </View>
    </Fragment>
  );

  const barcodeRecognized = async ({barcodes}) => {
    setBarcodes(barcodes);

    console.log(barcodes);

    if (barcodes.length > 0) {
      await DeviceBrightness.setBrightnessLevel(0.4);
      await FindNameQr(barcodes);
    }
  };

  function toFixed(x) {
    if (Math.abs(x) < 1.0) {
      var e = parseInt(x.toString().split('e-')[1]);
      if (e) {
        x *= Math.pow(10, e - 1);
        x = '0.' + new Array(e).join('0') + x.toString().substring(2);
      }
    } else {
      var e = parseInt(x.toString().split('+')[1]);
      if (e > 20) {
        e -= 20;
        x /= Math.pow(10, e);
        x += new Array(e + 1).join('0');
      }
    }
    return x;
  }

  const FirstTimePayQR = async () => {
    const now = Math.floor(Date.now());
    setCurrTimestamp(now);
    const payQR = await TotpPlugin.signPayQR(now);
    console.log(userCode, payQR, now);
    console.log(`${userCode}${payQR}${now}`);
    setPayQRcode(`${userCode}${payQR}${now}`);
  };

  const refreshPayQR = async () => {
    setType('Pays');

    setTimeout(() => {
      setType('Pay');
    }, 1);

    // clearInterval(countDownInterval);
    // setCountDown(60);

    // console.log(countDownResetControl);

    // setTimeout(() => {
    //   countDownPayTimer();
    // }, 100);

    // const now = Math.floor(Date.now());
    // setCurrTimestamp(now);
    // const payQR = await TotpPlugin.signPayQR(now);
    // console.log(userCode, payQR, now);
    // console.log(`${userCode}${payQR}${now}`);
    // setPayQRcode(`${userCode}${payQR}${now}`);
  };

  const option = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginTop:
          Platform.OS === 'android'
            ? StatusBar.currentHeight + 20
            : insets.top + 20,
      }}>
      <TouchableWithoutFeedback
        onPress={() => {
          setType('Scan');
          clearInterval(countDownInterval);
          setCountDown(60);
        }}>
        <View
          style={{
            borderBottomWidth: 1.5,
            paddingBottom: 6,
            borderBottomColor: type === 'Scan' ? '#fff' : 'transparent',
          }}>
          <Image
            source={require('../../../../assest/image/UcsiIcon/Scan_White.png')}
            style={{
              width: windowWidth * 0.12,
              height: windowWidth * 0.12,
            }}
            resizeMethod="scale"
            resizeMode="contain"
          />
          <Text
            style={{
              color: '#fff',
              textAlign: 'center',
              paddingTop: 2,
              fontSize: 12,
            }}>
            {I18n.t('Account.Home.Receive.scan')}
          </Text>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() => {
          setType('Pay');
          clearInterval(countDownInterval);
          setCountDown(60);

          setTimeout(() => {
            countDownPayTimer();
          }, 100);
        }}>
        <View
          style={{
            borderBottomWidth: 1.5,
            paddingBottom: 6,
            borderBottomColor:
              type === 'Pay' || type === 'Pays' ? '#fff' : 'transparent',
          }}>
          <Image
            source={require('../../../../assest/image/UcsiIcon/Receive_White.png')}
            style={{
              width: windowWidth * 0.12,
              height: windowWidth * 0.12,
              transform: [
                {
                  rotate: '180deg',
                },
              ],
            }}
            resizeMethod="scale"
            resizeMode="contain"
          />
          <Text
            style={{
              color: '#fff',
              textAlign: 'center',
              paddingTop: 2,
              fontSize: 12,
            }}>
            {I18n.t('Account.Home.Receive.pay')}
          </Text>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() => {
          setType('Receive');
          clearInterval(countDownInterval);
          setCountDown(60);
        }}>
        <View
          style={{
            borderBottomWidth: 1.5,
            paddingBottom: 6,
            borderBottomColor: type === 'Receive' ? '#fff' : 'transparent',
            alignItems: 'center',
          }}>
          <Image
            source={require('../../../../assest/image/UcsiIcon/Receive_White.png')}
            style={{
              width: windowWidth * 0.12,
              height: windowWidth * 0.12,
            }}
            resizeMethod="scale"
            resizeMode="contain"
          />
          <Text
            style={{
              color: '#fff',
              textAlign: 'center',
              paddingTop: 2,
              fontSize: 12,
            }}>
            Receive Money
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );

  const receiveQRView = (
    <View
      style={{
        backgroundColor: '#fff',
        height: windowHeight <= 640 ? windowHeight * 0.65 : windowHeight * 0.6,
        marginHorizontal: 24,
        marginTop:
          windowHeight <= 640 ? windowHeight * 0.03 : windowHeight * 0.05,
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
      <View style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 18}}>
              {contextProvider.contextProvider.my_profile.name}
            </Text>
            {/* <Text style={{fontSize: 18}}>Jackson Wang</Text> */}
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
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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
                {/* <Image
                  source={{uri: `data:image/jpeg;base64,${userCode.qrbyte}`}}
                  style={{
                    height: windowHeight * 0.3,

                    width: windowHeight * 0.3,
                  }}
                /> */}
                <QRCode
                  value={userCode ? userCode : 'null'}
                  // value={'6274cd4651325c5d2789ed76'}
                  color={PrimaryColor}
                  size={
                    windowHeight <= 640
                      ? windowHeight * 0.25
                      : windowHeight * 0.23
                  }
                  getRef={_svg}
                  logo={require('../../../../assest/image/UcsiIcon/qrcode_ucsi.png')}
                  logoSize={55}
                  logoBackgroundColor="rgba(255,255,255,.7)"
                />
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
                  {I18n.t('Account.Home.Receive.receiverQr')}
                </Text>
              </View>
            </View>
          </View>

          <View style={{paddingHorizontal: 16}}>
            <Text style={{color: '#86989d', textAlign: 'center'}}>
              {I18n.t('Account.Home.Receive.receiverQrDescription')}
            </Text>
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

  const isPermitted = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs access to Storage data',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (error) {
        console.log('write permission error', error);
        return false;
      }
    } else {
      return true;
    }
  };

  const createPDF = async () => {
    if (await isPermitted()) {
      let options = {
        // Content to print
        html: `<div style="display:flex;height:100%;width:100%;background:linear-gradient(227deg, rgba(86,204,242,0.2) 0%, rgba(47,128,237,0.2) 50%)">
        <div style="margin:auto">
        <div style="display:flex;justify-content:center">
        <img style="width:180;margin-bottom:24px" src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAa4AAABtCAYAAAD5/oU0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDAyIDc5LjE2NDQ2MCwgMjAyMC8wNS8xMi0xNjowNDoxNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjIgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjg4NTU1RUE0Njg1QTExRUM5ODZGRjkwMjU5Njk5MUI4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjg4NTU1RUE1Njg1QTExRUM5ODZGRjkwMjU5Njk5MUI4Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ODg1NTVFQTI2ODVBMTFFQzk4NkZGOTAyNTk2OTkxQjgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6ODg1NTVFQTM2ODVBMTFFQzk4NkZGOTAyNTk2OTkxQjgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5K3ubhAAAVw0lEQVR42uxdTW8cxxFtUjwoiCDSQZCDLxwhgA9CgF0dfA1Hvgdc/wKukFuMgOtfwOUhQG5cHnzm8Bd49Qs0POQWQEs4cQIjipaAnUMOMWk4jg0nZrrIGnG0WpI7M93VH/Me0CBlS7szNT316lVXVy+dn5+rNuD+3YeJ/pHwH8u/lzHlcfrVt59OFAAAAOAdlmIiLianLo+CnOj31ZofeawHEVhOQ5PZFFMGAAAAxFWXpLolkqKxIfC1RGQZDU1ip5g+AAAAIK6biCrVP4rRREWZwqEeI6QUAQAAQFxlRdVjotrw2IZP9RggjQgAANBC4tJk1WOy6nmgqKpilxUYUogAAAAxE1fgZDULWgPrm04fLn30GanPNYkbOP/gnRyvBQA4dMoffUbvelfgq071+x7kUseKI7JKyMHzWI9oznX0eK7v74kmr8zg546UXLp0Ca4DAJyCSOuZwPccqculGBDXLYRFRhrosRn5xDuge9Xk1cc7CAAAECBxMWENld9FFqaxpe9bgbwAAAACIq6WEhbICwAAIDTi0s6aFhczFX9KEOQFAAAgjGULpEVrWFOQ1hvkNYIZAAAAPCIuUll6jPWveyr8snYb2Nb2geoCAADwgbi4y8UEKutWjNhWAAAAgCviYhWRq7j2Y9kCKdGM1wABAAAAaeJi0jpQSA1WAW1SHsIMAAAAwsRVIi2gOrZ5qwAAAAAgQVwgLSNAlSEAAIAEcYG0jKGjbTmEGQAAACwSF3dyB2mZwwAmAAAAsERcXMadwWRGcKbHvpI5ugAAACAqLNTyicu3aXMxqgeb4URdVhSOceAkAACAReJipYV9WvXxVF2ejpzDFAAAAJaJi9e1QumIcTTnvyWOSPeMCZ8Ia4qpBgAAIEBcpS7vPoLSbpS+JBUzuYkc+D6IgFM9tgSua6iQDgQAAHCiuGivkU/rWoWKyTQpTBb9R0wgF/+OS9Cpmm/b8LUhHQgAAOCSuLizw5Yn13nGJDpqqmJYmQ30/WVMZh0DRIp0IAAAgAeKa+jJNZKS6ZtOu5FiY3Im4qm6hod0IAAAgE/ExQ59w4Pre6KJIbP14Uw6PVZfi6jLQ3WZpswxdQAAAPxSXK7VFqXg0irrWA0JrM8brDvXXMuICWuKKQMAAOAZcbEDd6m2REmrBKo6pO8silGO1eXaVYZpAiyKpY8+owrWLo+10k/V8L064/lZgH4/5UG/T88/eGfaAnum/L/WVP31aUr1T2fsePFT2zDHLF74maSl53Lb3D5mO5N986Z2nqe4XPfP6zsgrYuiDW4g3FNIB5qY3F22pSuQExoJ3GfKL3DxEtuqwl2dcQ4bc66FfhyxE6Yx1jY4DWzeJOpq6wrZ08YezPXS527MseExO9gxiOw1surxqLOvt1Oy947+PArEaDtTVsfGS+fn52W1RRf3pUP77GvCQOPZNydNLqWC9SRaMjTJp8rdVooL1a7vZeLhCyyNp+wgvCUxtmmfR8ezyyN1lrGDnQrZg0j7mcBXHel7Shd4NgMett5nCraGVQhslrho4rjq/n6iSSsBTYVNXDzRc4cOyAppsRIYMmGF2LPz1ZYSXwisZNOtQGxIxVkD2/bzhbj0dQwtE9a8IKu/iH1nu8O7TO30QVFRIIuJtIiI+QWesIMNtdE0XfcOKWF9Py7f88KmRKIvAyItxddK9os6K0Rpfj0mPF8k5/sm2/fWUzOWS2przWHq46jta0pkf+oLSZ099EgCnfCZwzlkg7S6TFjSL7BtAvtY39uY1bH0HKEIf6rMd66RtN8eZUFc2E/g+RApP3cYfJJ9ybb9RRVX6jhKbxtRJZSapT1kepBzpLXFj9lJpgFO+L7D6JkW07uGSat4gWM9FWGTHURXcI6Qcn0WSRBAqfuJpP0EVDD54T1PgoMDDnK8Ja6zNpSc06ZuVlNjPU45TXLAzn42ukkDm/QuT8Y+ZqU1Nawc91T86EiRF9t0JzL7rUuTvy3SUpfr0r6lbcfX2XbFA2c5jpCkiv0mNOrsi+sGNOldnoxdkNapwfvJVFjrLiai2wsHYavoIHKbFqmtJLStBzOk1fHUttk8f7g8E325QB4BUXVLaT+K/Iu037aqVw3YYfLzfdIn/PxcpH5skNawZaRVVg6ZpTkyaIFNVwP1Yz6T1itfyO/lm8TFvQldYRLa056T9qO1kCLtZ2pNJPXZBhypjSMiLbJ3bKmsKtg0XW3IanyvJfbrcKVkUNfsOWkVGMwWwhSpQmepKRddMiqSVNO0X110ld9p1LGjSW+DtHw+MFUSI8Nzrm023aZqTXTbsKJoSbkPZ4nLVVrqxEOiKvqiFWTlqqrMW8XFaxYu+lkaJ60iolPxVg9WwTpVh2r7ZgbmSD+QaN4G+XcxlcyrrnnE5cpJTj0gqrKaSpU/pbobPs4eh2sWVkir1NIGuMTQkFIaOpgfpx68Px1T5A+8rroola3tOi4TVyvgMO1Xm1R92pjNUbSLNQtbSosQagsnm6orbZLu4rUt2wq2aGE1vm7/HhcP0bveF37XTZE/8Oa7+hpxbcR4lx6l/eqCrt0L4mJn5GLx2SZpKQ/UVvm4h1kkPAekU279hvOu78Oc4L19RCAZF9+MhGy5DtVljbhU1IqLu1GEnmNPHZHFPNLKHSiThZtu1ryvxMEcqXycg1CH7rkOosG89SqQYVt3BfeUDaC6jGOV9xtOliO+yUkE95C6voBSxZ00aR3qCdqzvKlTutnsPqkofU/9Kqk4soEeQ54PZ1IOosG/txkMDJvMCbK9ujxGwzY6N7UsAmrjYl6CuDyPMDxouJs7UCWH7GB8VxZV8ETf06Ch050oudRmLdsItD/KDXyGybl1xIOOPNnl8ZjHFDxjHBf+MObijDyS+3AWtXFaJVbSIkit7e6bWu+gz+FOArbXa+sSkPcdX2jtS9uQ0tDXnWRwVgp86ecpj+K/TaUOlQTm+0PXxGXNcdDGZq1WaAKuxvCgHJAWOUfpsncx0hJM49AcHFoIymw/G1/3IpESNBEEjEqk9IqkQuw3aBFP2TZTtlOXFU+qHBe6xV4OP1HhV0x21ev7UyScOpGHdPsjSaVVLNYv8f12WSkkRSqiFDB0GwY/Nk7MnQgQl68VuCM65LDpETb8/HNw01xQunPeSdnjGR8xciAMNrwgLipZt9j2KY+AuDpLX3/1h/N796VIixy19BEloqQ1x4lNFrDLWkmFFKRWEB39v841astG266J0FxIPEyJFd3YR9c4V6A+qJNRb5H3gVPWY+WoSa8Piiux+CLmKoLGqSt/+ePa9+++J/V10lGoU9KqQG7lvVb5LcRfqDdlybGuCb6bVYlLguhW+b3e0fY+4udBA6m++qAgq9LRNvR3SydaiyovH4jLZjPZGCoL1fLnL+4pOeKSnIBBkJZp9VZT/RBZ0fpO3+csAhc+SH7lBo8dttMJO1IismL96tTWc4kItbaeMHlRpatolmalxLauihisLQJ/9e2np/fvPjxWgW9EvjP9a6wtiYbwF7cSVo8JK6TWVEcOyXWdx8aMHcvXVhAaEdwU3dwvAsjaNuC0oeh610pJmbiaaBL7PsImrs9frEX6woyU/CZg34kqUZdraD3lV9Pnqu+cr6qwuK7NGVI7YT84Ue1LO5rozkNZM7EqZB9Sheu0yVaro6mlz48iRXDnxZ/U/37+i9hemM2mDV0jIqpixHC8Cjmx0NaWC6W2qa7SjsdMYjGfsXViKI0qUenqleIqVJct4opiwt354mWMxEXI1FUJeuwkVVQmpsq/Y3SMgRwhF00EX9HLgw6ILCpER5Gtl5mqLxC1SdHyybUkTm19MCu5k9BnFymuSLHOi7sxElVK90YdSGjvkf5PX+rxjCP6TRX3cSrDyO5nlRXFc/0s84j6EJoK7EU5ZKV08S6lve1JMFGBp2Du/O2TmMXIkJx7yGsKXAZfVlNtPP23rLrySFTXPNA9PeP7GwSuwKYGVbY4cU0dG69jeZ0rV9f3JQvDMX77jVr+1z/VDz/5WYx+jqJZWiDuB0JSQR1I6hB9DhpjVZYbrMB2uXt/iAFGkKR7kSpkwjhzfC02VVdu8LMoyqLjKd5XwinIiNOFhC2BzuJNyCrhtF+R8vtYj22Q1o1OcRpKMNIQtBF6wgENIEVcDNfMa60sukFLKSJzajR5cVSB/pwlPVI9BnqMlXDhR+TEpZQHh2bOKivqycZk9VKPPdXyFGAN8qL35EkLbpXmRR4YeR2FauxlS6qkDjbv33245vghkYI65BftkSanNT16egz1mGcfUbK/88XfY3/5N7h5pw+ENVSXKfQDkFVj8spAXkCsisuq6rqGmI9YTVHa7y1NTrTO1tcjW1CliZL98j+mauk//459Tg5dvvhMnERYVKy0ChcB8qpBXmM88fYoLoLNaJsmE6X9PlSvp/1ITY2pPVTVD2RyE10bbEG6kKo/xcvjWWXlrLBAWPbI65GKYHvKApmDIZ64AHGx4z52/cBtHVVPJMNpv9E1ab+6EE4XvmzDvNzhjhJSpNVVYRyBQw5/n4OvUMmL3pcuZzrOMIeBporLF9UV2mZUUZvdefFJW+amSKEGpyVJjfu6jnXMZPVIO306H2ugAm9jRvv1uHw8YQKLVYFBdbWIuPqWizQCJ64/t2Vubgp1J6Dn59Pm9KKSlVTVA+3g6YykQYzHchQERoSsLlOI+8p91scktqC67OC1Jru01qNJw+URJ4q/exBKtEJpR20z0e+MtOHuPGTKYh9DXofwQWkds+rL29pwmIl5UFLBRXf80LuQDFR4WaSwiKsUgbruMjHQZDCqUzAhDX2d4sdyRNxwdxYXfQy1UzOeNuRI2KVDecpkNcapvW8qMQ5ashKRldtpdVU4Ldx6IC4Z4hp7QFxBqC5NWn0lfPJnobjUL3/l6rbP2KFsC32frT6GQweZBVrLIRLOQFaViSxXpbT8HDJLPFVmFHwl3EUEsEVctIeJ1I5yXxK8o69j3KDrhW3SImLdc/HdDhvuEmml3FCzJxT1Gu9jWEpFSdptaFA5JiCzN8mMn223pMp86SOZFuoRsKe4CtW15cH1Zcr+Ccl1SCtzaR9HDXdfkVZJsUipTVrkNnkOUk8wMKP1q57hiLv1xHUDoRWnGM8js1S5OawTz8swlm8gDB/QYfXnC2Gt6SF60ue1qkt2I/IsaRWbSSXLmE3Og1TQbn0LaSJvmxH7SmY0X/Xoz1QwSu0jQwsoCeLiDbq+7K3Y5rUk16RFzo4ckBd5dEHieoO0ShgK3rLJPoZSxGXrtNxUAU2JbMABgET5PQINIcUl7ZRuw4Er8mKVRdE+nVzrTSug87s/lvgaeqm71zlfB6rLVB9DqVSRjWrInmpRSypuxZXyMLouyUo4VXF38IgSKzf8vzG/eL68JERe1K1dLHXIKitTnpXefv/ue+q73q8lSCtdoPqNItePhW696GNYO6gSPHL92FLlYBSl1aXnsFZSJF11lVbbuObfvWXSrvRZvJ/PZqFVdJvHvSUu2kPFSmPHo+vdYzLp29zjxd8xVB72rvvh7UR9t+kNaV2ctyR8RPsOl8dPPX+3jM9Pdvbe9lPkvXEJ//E6YmoaCNvYJjMJbS6AuG5PdQw8S03QHrMplaNT6b5hwuqry7JrL50DkdY3v/mdOv+R1TThwqRVAjmSZ4KmyJT/6zxG5xCnSDMfb5Sv7UuhrxtwhWlIZDBVgFHctMZVdIwfeXjdRKSUOrwgsCa9DanzBZW360H3etBy0lI1SEtxmyLJ01Q3BFN+TRWSKWIgG3vZLYLny7Hgu29acdne04dUobDi8lV1FaAXmXLTlEI8UlcbEk9nNy4zuRU77H3anHg7af307a81ad0TIC3VIJJ1oboSzx/dsKky5D1IY+V/iyN676Qqbre1XSZcHNQ0KKA51Ld4rScxNkj2WnGVVFcIC8JEQjvsPJ9rojovD05lPGNVtR0KaVEk+81vf38sQVoNCU9ada3XPKxPMsVEyrDWu8PVdHR/z1UYffky4e87aLo9gklrbDkox2nILoiLySsTdkrAJagRa3p+7/5/A7neofD3DaqWxzuIfvdoTWbR6ywR1lT5VRi1iF2ljyQh8hrXOTqEA4qJgErMFGAcK1WcBEd/gAwOdcDQ55csFOeVC1cY1u1jeKxkN5KTwu+Tk+UInFTfhEuxU/479JPSgpsBz9mRkm86Tfais9uKbvuTecEJk1vR9qmvZJY+jpAmdExctGZ0/+7D3ZCiwBhIK0CQWpBc69ri8vi8wr/JlXwHFHKUW6rULiyUgKRC4JKxWnSR2twsSN8juw4VYAXLVf6ydqZDFdcJpT7iw4BJy8VaVx0HkWGawVkLqK0cZvCAuBjkVNEixTzIpk8kO4NE5Lwq9TF0tB4TIpI6qkthPfxM2a1UBHFV/QdcZo4TPc1P9NT0huqWqa5RxUKNEaadeeJCcHsZuOHgSP8UV1FluA/zmUkpkIPw9cDMgFTXapWACspgIdTa2M9Ou62K49DggaGASeJi8iIn8RQmbIRdbcfUZt/FlqmunYql0SErg0OB96/b4PlThd+TFpJWWwk7DOIqvfhYK6gOcpaPudglZri4v6yiMggx7b3LDtK2Sm+0rYFVbVvIC6QVCnGxUkhBXpVAUXLCh3VGDUeqq1Ifw8Cc60UBj77mIiCwPoeanoHVEvLaBWmFpbhAXtWczvvaXr0YU4Ohqq6AnGvRtb98bxLroo0b0PI1P1L+nKpuCnQ/j0uBBBAKcYG8FsI+q6zW9S1zpLoq9zEskZePa14U0b9xEjU3RLa9ztUzceo0X3tXxVHUdcbPJMFerYCJa4a8DmHWVyBbPKBClpapLB9UV50+hhnPYV+qDYmUHtwS0duuYKNqzb6hIOZUD1pTfBCon7ggLApCobIiIa6CvLjrw27L7UoOh4ov6KTmadsnmSPVtVrHqZMy0CNl9eUqtUVO/ZG+jt5t+4GEbDswPB+mvCb0gBWY7ylEur4PC8IK7BBLEFcFAqNo5LFq3ybEQmH12lB8EYDq2uLzrOo4V+p/mOhf31cy2z6eMlm+RU69YnNW27Zdb3qEyA0ENmA7P+KA1xe1e8Rk9YhTgiMQlj9YOj8/t/bhfHhjpsLueL1INEb3OGp5OjDuF+Uy7Ziqqy7uGw3nzIRHjnWSufYuDntN1NVhnDZOHTgrPQtStxM8j5YTV4nAqDKJ0jbrEdmO1NW4jQUXwCvnmqirtkjpNX/tVF1V/53imAtjpFZev5z9823PgTBFWyYQ16IERikNypevBmqv4syfMdQVAABAC4iLyWuNyasfgAI7K4hKjxxkBQAA0ELimiExIi9KI/q0BnZUIiqkdQAAAEBccwksYQJLhUmsWCTPQVQAAAAgriZElqqr6i0aTVOKRFBTVaocooHUHwAAAIjLtipL+I83VRHlpd9BTgAAACAuAAAAAHCH/wswAKnxMLp29t4nAAAAAElFTkSuQmCC' />
        </div>
        <h1 style="text-align: center;"><strong style="font-size:64px">${userCode}</strong></h1><div style="display:flex;justify-content:center"><img style="border:20px solid #0094d9;border-radius:20px;width:70vw" src='data:image/png;base64,${userCode}' />
        
        </div> <div style="display:flex;justify-content:center;margin-top:24px;font-size:40px;color:rgba(0,0,0,0.45)">Receiver QR Code</div>
        </div>
        </div>`,
        fileName: 'QR_CODE_' + moment().format('DD-MMM-YYYY').toString(),
        directory: 'ucsi',
      };
      let file = await RNHTMLtoPDF.convert(options);
      console.log(file, 'file:/' + file.filePath);
      Share.open({
        // url: `data:image/png;base64,${dataURL}`,
        // url: `data:image/png;base64,${userCode.qrbyte}`,
        url:
          Platform.OS === 'android' ? 'file://' + file.filePath : file.filePath,
        title: 'QR_CODE_' + moment().format('DD-MMM-YYYY').toString(),
        type: 'application/pdf',
      })
        .then(res => {
          console.log(res);
        })
        .catch(error => console.log(error));
    }
  };

  const receiveOptionButton = (
    <View style={{flexDirection: 'row'}}>
      <View style={{flex: 1}}>
        <Button
          title={I18n.t('Account.Home.Receive.enterAmount')}
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
          title={I18n.t('Account.Home.Receive.shareQr')}
          titleStyle={{fontSize: 16, fontWeight: 'bold'}}
          buttonStyle={{
            height:
              windowHeight <= 640 ? windowHeight * 0.08 : windowHeight * 0.11,
            borderRadius: 0,
          }}
          containerStyle={{borderRadius: 0}}
          // onPress={shareQR}
          onPress={() => {
            createPDF();
            // Share.open({
            //   // url: `data:image/png;base64,${dataURL}`,
            //   url: `data:image/png;base64,${userCode.qrbyte}`,
            //   title: "QR Code"
            //   // type: "application/pdf"
            // })
            //   .then(res => {
            //     console.log(res);
            //   })
            //   .catch(error => console.log(error));
          }}
        />
      </View>
    </View>
  );

  const EnterAmountModal = (
    <Modal
      isVisible={amountModalVisible}
      onBackdropPress={() => setAmountModalVisible(false)}>
      <View
        style={{
          backgroundColor: '#fff',
          paddingHorizontal: 12,
          paddingTop: 16,
          paddingBottom: 24,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            paddingBottom: 12,
            marginBottom: 32,
            borderBottomColor: 'rgba(0,0,0,0.35)',
          }}>
          <Text style={{fontSize: 16}}>
            {I18n.t('Account.Home.Receive.enterAmount')}
          </Text>

          <Icon
            name="close"
            type="antdesign"
            color="rgba(0,0,0,0.65)"
            size={20}
            onPress={() => setAmountModalVisible(false)}
          />
        </View>

        <View>
          <CurrencyInput
            style={{
              paddingHorizontal: 24,
              fontSize: 24,
              backgroundColor: '#fff',
              borderColor: PrimaryColor,
              borderWidth: 1,
              borderRadius: 5,
              paddingVertical: 8,
              // borderBottomColor: PrimaryColor,
              // borderBottomWidth: 1,
              // borderTopLeftRadius: 5,
              // borderTopRightRadius: 5,
            }}
            value={currencyAmount}
            keyboardType="numeric"
            onChangeValue={setCurrencyAmount}
            placeholder={I18n.t('Account.Home.Receive.amount')}
            prefix="RM"
            delimiter=","
            separator="."
            minValue={0}
            precision={2}
            onChangeText={formattedValue => {
              console.log(currencyAmount);
              // setValue(
              //   "amount",
              //   formattedValue.replace(/[- #*;,.<>()+N\{\}\[\]\\\/]/gi, "")
              // );
              console.log(formattedValue); // $2,310.46
            }}
          />
          {currencyAmount < 0 && (
            <Text
              style={{
                color: '#f00',
                fontSize: 12,
                textAlign: 'left',
              }}>
              {I18n.t('Account.Home.Receive.amountRequired')}
            </Text>
          )}
        </View>

        <View style={{marginTop: 32, paddingHorizontal: 40}}>
          <Button
            title={I18n.t('Account.Home.Receive.submitAmount')}
            buttonStyle={{borderRadius: 100, paddingVertical: 12}}
            onPress={handleNext}
            disabled={currencyAmount <= 0}
          />
        </View>
      </View>
    </Modal>
  );

  const payQRView = (
    <View
      style={{
        backgroundColor: '#fff',
        height: windowHeight <= 640 ? windowHeight * 0.65 : windowHeight * 0.6,
        marginHorizontal: 24,
        marginTop:
          windowHeight <= 640 ? windowHeight * 0.03 : windowHeight * 0.05,
        borderRadius: 10,
        padding: 16,
        paddingBottom: 28,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
      }}>
      <View style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 18, paddingBottom: 8}}>
              {contextProvider.contextProvider.my_profile.name}
            </Text>
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
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <View
              style={{
                padding:
                  windowHeight <= 640
                    ? windowHeight * 0.045
                    : windowHeight * 0.045,

                backgroundColor: '#fff',
                alignItems: 'center',
              }}>
              <QRCode
                // value={userCode ? userCode + '876545617289' : 'null'}
                value={payQRcode}
                color={PrimaryColor}
                size={
                  windowHeight <= 640
                    ? windowHeight * 0.25
                    : windowHeight * 0.23
                }
                getRef={_svg}
                // logo={require('../../../../assest/image/UcsiIcon/qrcode_ucsi.png')}
                logoSize={55}
                logoBackgroundColor="#fff"
              />
              {/* <TouchableWithoutFeedback onPress={refreshPayQR}>
                <Text>Refresh QR Code</Text>
              </TouchableWithoutFeedback> */}
              {/* <Text>{payQRcode}</Text> */}

              <Button
                title={'Refresh'}
                buttonStyle={{
                  borderRadius: 100,
                  backgroundColor: PrimaryColor,
                  width: 200,
                }}
                titleStyle={{
                  color: '#fff',
                  paddingVertical: 8,
                  fontWeight: 'bold',
                }}
                containerStyle={{marginVertical: 16}}
                onPress={refreshPayQR}
              />
            </View>
            {/* <View>
              <Barcode
                value={userCode.qrbyte ? userCode.qrbyte : "null"}
                maxWidth={windowWidth * 0.6}
                height={windowHeight * 0.05}
                lineColor={PrimaryColor}
                format="CODE128"
              />
            </View> */}
          </View>

          <View style={{paddingHorizontal: 16}}>
            <Text style={{color: '#86989d', textAlign: 'center'}}>
              {I18n.t('Account.Home.Receive.showToCasherMakePayment')}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          backgroundColor: '#fff',
          padding: 8,
          paddingHorizontal: 14,
          bottom: -32,
          left: '46.5%',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.29,
          shadowRadius: 4.65,

          elevation: 7,
          borderRadius: 50,
        }}>
        <View style={{alignItems: 'center'}}>
          <Text>{countDown}</Text>
          <Text style={{fontSize: 10}}>
            {I18n.t('Account.Home.Receive.second')}
          </Text>
        </View>
      </View>
    </View>
  );

  const payOptionButton = (
    <View>
      <Button
        title={I18n.t('Account.Home.Receive.scanbyCasher')}
        titleStyle={{fontSize: 16, fontWeight: 'bold'}}
        buttonStyle={{
          height:
            windowHeight <= 640 ? windowHeight * 0.08 : windowHeight * 0.11,
          borderRadius: 0,
          backgroundColor: '#222d37',
        }}
        containerStyle={{borderRadius: 0}}
      />
    </View>
  );

  const scanQRView = (
    <View style={{flex: 1}}>
      <RNCamera
        style={{flex: 1}}
        captureAudio={false}
        flashMode={
          isFlashOn
            ? RNCamera.Constants.FlashMode.torch
            : RNCamera.Constants.FlashMode.off
        }
        onGoogleVisionBarcodesDetected={barcodeRecognized}>
        <View style={{flex: 1}}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}>
            <View
              style={{
                width: windowWidth * 0.8,
                height: windowWidth * 0.8,
                borderWidth: 7,
                borderColor: 'lime',
                opacity: 0.3,
                justifyContent: 'center',
              }}>
              <View style={{height: 7, backgroundColor: '#f00'}} />
            </View>
            <View
              style={{
                paddingTop: windowHeight * 0.04,
                paddingHorizontal: '20%',
              }}>
              <Text style={{textAlign: 'center', color: '#fff', fontSize: 16}}>
                {I18n.t('Account.Home.Receive.placeBarcode')}
              </Text>
            </View>
          </View>
          <View style={{position: 'absolute', top: 16, right: 8}}>
            <Icon
              type="material"
              name={isFlashOn ? 'flash-on' : 'flash-off'}
              color="#fff"
              onPress={() => setFlashOnOff(!isFlashOn)}
              size={30}
            />
          </View>
        </View>
      </RNCamera>
    </View>
  );

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <StatusBar backgroundColor={PrimaryColor} barStyle="light-content" />
      <View style={{flex: 1}}>
        <View
          style={{
            height: type !== 'Scan' ? windowHeight * 0.34 : 'auto',
            backgroundColor: PrimaryColor,
          }}>
          {option}
          {type === 'Receive'
            ? receiveQRView
            : type === 'Scan'
            ? null
            : type === 'Pay'
            ? payQRView
            : // Pays is for refresh PayQrCode purpose
            // can check the refreshPayQR()
            type === 'Pays'
            ? payQRView
            : null}
        </View>
        {type === 'Scan' && scanQRView}
      </View>
      {type === 'Receive'
        ? // receiveOptionButton
          null
        : type === 'Pay'
        ? payOptionButton
        : // Pays is for refresh PayQrCode purpose
        // can check the refreshPayQR()
        type === 'Pays'
        ? payOptionButton
        : null}
      <View
        style={{
          position: 'absolute',
          top:
            Platform.OS === 'android'
              ? StatusBar.currentHeight + 8
              : insets.top + 8,
          left: 8,
        }}>
        <Icon
          type="material"
          name="close"
          color="#fff"
          size={26}
          onPress={() => navigation.goBack()}
        />
      </View>

      {EnterAmountModal}

      {/* <ActivityIndicator
        toast
        size="large"
        animating={loading}
        text={I18n.t('Account.Home.Receive.loading')}
      /> */}
    </View>
  );
};

export default Receive;

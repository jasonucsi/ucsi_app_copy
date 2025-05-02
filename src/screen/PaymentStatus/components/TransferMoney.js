import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Dimensions,
  Platform,
  TouchableWithoutFeedback,
  StatusBar,
  TouchableOpacity,
  FlatList,
  TouchableHighlight,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  Button,
  Input,
  Divider,
  Avatar,
  ListItem,
  Icon,
} from 'react-native-elements';
import Swiper from 'react-native-swiper';
import {useForm} from 'react-hook-form';
import I18n from '../../../locales';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {PrimaryColor, SecondaryColor} from '../../../tools/Constant/Constant';
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';
import Modal from 'react-native-modal';
import biometricPlugin from '../../../plugin/biometric.plugin/biometric.plugin';
import TransactionApi from '../../../tools/Api/transaction.api';
import {ResponseError} from '../../../tools/ErrorHandler/ErrorHandler';
import AsyncStorage from '@react-native-community/async-storage';
import {Props} from 'react-native-image-zoom-viewer/built/image-viewer.type';
import NotificationPlugin from '../../../plugin/pushNotification.plugin/pushNotification.plugin';
import LinearGradient from 'react-native-linear-gradient';
import CurrencyInput from 'react-native-currency-input';
import SetPin from '../../SecureCode/components/SetPin';
import {ActivityIndicator} from '@ant-design/react-native';
import moment from 'moment';
import {todp} from '../../../tools/Misc/mics';

import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

const TransferMoney = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);
  const [currencyValue, setCurrencyValue] = useState(0);
  const {register, handleSubmit, errors, setValue, getValues} = useForm();
  const [userData, setUserData] = useState({});
  const [contact, setContact] = useState(0);
  const contactInput = useRef();
  const {height, width} = Dimensions.get('window');
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const swiper = useRef(null);
  const [pin, setPin] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [bioStatus, setBioStatus] = useState(false);

  const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      name: 'Lim Giap Weng',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      name: 'Weng Giap Lim',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      name: 'Giap Lim Weng',
    },
  ];

  const onChangeIndex = value => {
    setIndex(value);
  };

  useEffect(() => {
    console.log(route);
    // register(
    //   { name: "contact" },
    //   {
    //     required: I18n.t("LoginPage.ErrorMessage.mobileNumberRequired"),
    //     minLength: {
    //       value: 9,
    //       message: I18n.t("LoginPage.ErrorMessage.mobileNumberInvalid"),
    //     },
    //     maxLength: {
    //       value: 10,
    //       message: I18n.t("LoginPage.ErrorMessage.mobileNumberInvalid"),
    //     },
    //   }
    // );

    // if (
    //   route.params.data.PartnerAmount &&
    //   route.params.data.PartnerAmount > 0
    // ) {
    //   setCurrencyValue(route.params.data.PartnerAmount);
    //   setValue('amount', route.params.data.PartnerAmount);
    // }

    // if (route.params.transferType === 'Money') {
    register(
      {name: 'amount'},
      {
        required: I18n.t('PaymentStatus.errorMessage.amount'),
      },
    );
    // } else {
    //   register(
    //     {name: 'pointTransfer'},
    //     {
    //       required: 'Point is required',
    //     },
    //   );
    // }

    register(
      {name: 'remark'},
      {
        required: I18n.t('PaymentStatus.errorMessage.remark'),
      },
    );

    // GetUserData();
    biometricStatus();
    return () => {};
  }, []);

  const biometricStatus = async () => {
    const res = await RNSecureStorage.get('biometric');
    console.log(res);

    if (res === 'Enabled') {
      setBioStatus(true);
    } else if (res === 'Disabled') {
      setBioStatus(false);
    }
  };

  const biometricVerify = async values => {
    ////////////totp-generator
    // const res = await biometricPlugin.createBiometricCredential('transfer');
    // console.log(res);

    // const Secret = await RNSecureStorage.get('secret');

    // console.log(Secret);

    // const totp = require('totp-generator');

    // // Keys provided must be base32 strings, ie. only containing characters matching (A-Z, 2-7, =).
    // const token = totp(Secret);

    // console.log(token);

    // await TransactionApi.testingTotp({
    //   totp: token,
    // });

    ////////////RNTotp
    // RNTotp.generateOTP(
    //   {
    //     base32String: Secret,
    //     digits: 6,
    //     period: 60,
    //   },
    //   async code => {
    //     console.log('验证码是: ', code);

    //     await TransactionApi.testingTotp({
    //       totp: code,
    //     });
    //     // alert(code);
    //   },
    // );

    try {
      // await NotificationPlugin.sendLocalNotification(
      //   moment().unix(),
      //   I18n.t('PaymentStatus.notification.transferSuccess'),
      //   'RM' +
      //     currencyValue +
      //     I18n.t('PaymentStatus.notification.transferDesc') +
      //     moment().format('DD-MMM-YYYY HH:mm'),
      // );

      const Biometric = await biometricPlugin.createBiometricCredential(
        'transfer',
      );
      console.log(Biometric);

      // if status is error will return
      // if status is ok will continue proceed function
      if (Biometric.status === 'error') {
        return;
      }

      if (currencyValue > route.params.walletBalance) {
        Alert.alert(null, "Transfer amount can't exceed the wallet balance");
      } else {
        setLoading(true);

        var res;

        ////descrypt secret key
        const Secret = await RNSecureStorage.get('secret');

        console.log(Secret);

        const totp = require('totp-generator');

        // Keys provided must be base32 strings, ie. only containing characters matching (A-Z, 2-7, =).
        var now = Math.floor(Date.now());
        const SecretDecrypt = totp(Secret, {
          digits: 6,
          algorithm: 'SHA-512',
          timestamp: now,
        });

        now = Math.floor(now / 1000);
        console.log(SecretDecrypt);

        if (route.params.contact) {
          res = await TransactionApi.walletTransaction({
            // walletId: String,
            contact: {countryCode: '+60', number: route.params.contact},
            // amount: Math.floor(currencyValue * 100),
            amount: todp(currencyValue * 100, 0),
            remark: getValues('remark'),
            totp: SecretDecrypt,
            timestamp: now,
            // pin: pin,
          });
        } else {
          res = await TransactionApi.walletTransaction({
            walletId: route.params.walletId,
            // contact: {countryCode: '+60', number: route.params.contact},
            // amount: Math.floor(currencyValue * 100),
            amount: todp(currencyValue * 100, 0),
            remark: getValues('remark'),
            totp: SecretDecrypt,
            timestamp: now,
            // pin: pin,
          });
        }

        console.log(res);

        if (res.status >= 200 || res.status < 300) {
          setLoading(false);

          await NotificationPlugin.sendLocalNotification(
            moment().unix(),
            I18n.t('PaymentStatus.notification.transferSuccess'),
            'RM ' +
              currencyValue +
              I18n.t('PaymentStatus.notification.transferDesc') +
              moment().format('DD-MMM-YYYY HH:mm'),
            {
              type: {
                amount: todp(currencyValue * 100, 0),
                relativeParty: {
                  name: route.params.fullName,
                },
                remark: getValues('remark'),
                createdAt: res.data.createdAt,
                _id: res.data._id,
              },
              path: 'transactionDetails',
            },
          );

          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'PaymentStatus',
                params: {
                  fullName: route.params.fullName,
                  remark: getValues('remark'),
                  amount: currencyValue,

                  createdAt: res.data.createdAt,
                  _id: res.data._id,
                },
              },
            ],
          });
        } else {
          setLoading(false);
          ResponseError(res);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleNext = async values => {
    try {
      setModalVisible(false);

      if (currencyValue > route.params.walletBalance) {
        Alert.alert(null, "Transfer amount can't exceed the wallet balance");
      } else {
        setLoading(true);

        var res;

        console.log(currencyValue);

        if (route.params.contact) {
          res = await TransactionApi.walletTransaction({
            // walletId: String,
            contact: {countryCode: '+60', number: route.params.contact},
            amount: todp(currencyValue * 100, 0),
            remark: getValues('remark'),
            pin: pin,
          });
        } else {
          res = await TransactionApi.walletTransaction({
            walletId: route.params.walletId,
            amount: todp(currencyValue * 100, 0),
            remark: getValues('remark'),
            pin: pin,
          });
        }

        console.log(res);

        if (res.status >= 200 || res.status < 300) {
          setLoading(false);
          await NotificationPlugin.sendLocalNotification(
            moment().unix(),
            I18n.t('PaymentStatus.notification.transferSuccess'),
            'RM ' +
              currencyValue +
              I18n.t('PaymentStatus.notification.transferDesc') +
              moment().format('DD-MMM-YYYY HH:mm'),
            {
              type: {
                amount: todp(currencyValue * 100, 0),
                relativeParty: {
                  name: route.params.fullName,
                },
                remark: getValues('remark'),
                createdAt: res.data.createdAt,
                _id: res.data._id,
              },
              path: 'transactionDetails',
            },
          );

          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'PaymentStatus',
                params: {
                  fullName: route.params.fullName,
                  remark: getValues('remark'),
                  amount: currencyValue,
                  createdAt: res.data.createdAt,
                  _id: res.data._id,
                },
              },
            ],
          });
        } else {
          setLoading(false);
          ResponseError(res);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const PinModal = (
    <Modal
      isVisible={modalVisible}
      style={{margin: 0, justifyContent: 'flex-end'}}
      onBackdropPress={() => setModalVisible(false)}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{
          backgroundColor: '#fff',
          paddingHorizontal: 12,
          paddingTop: 16,
          paddingBottom: 0,
        }}
        keyboardVerticalOffset={16}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            paddingBottom: 12,
            marginBottom: 32,
            borderBottomColor: 'rgba(0,0,0,0.15)',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{marginRight: 8}}>
              <Text style={{fontSize: 16, fontWeight: '700'}}>
                {I18n.t('PaymentStatus.Label.verifyPin')}
              </Text>
            </View>

            <View>
              <Icon
                name="verified-user"
                type="material"
                color={PrimaryColor}
                size={20}
              />
            </View>
          </View>

          <Icon
            name="close"
            type="antdesign"
            color="rgba(0,0,0,0.65)"
            size={20}
            onPress={() => setModalVisible(false)}
          />
        </View>

        <View>
          <SetPin focus={true} setFirstPin={e => setPin(e)} />
        </View>

        <View style={{marginTop: 24, paddingHorizontal: 40}}>
          <Button
            title={I18n.t('PaymentStatus.button.submit')}
            buttonStyle={{
              borderRadius: 10,
              paddingVertical: 12,
              backgroundColor: PrimaryColor,
            }}
            onPress={handleSubmit(handleNext)}
            disabled={pin.length < 6}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.05)',
            marginTop: 24,
            marginBottom: 24,
            padding: 12,
            borderRadius: 10,
          }}>
          <View style={{flex: 1.5, alignItems: 'flex-start'}}>
            <Icon
              name="verified"
              type="material"
              color={PrimaryColor}
              size={28}
            />
          </View>

          <View style={{flex: 8.5}}>
            <Text style={{color: 'rgba(0,0,0,0.45)'}}>
              Your payments will be processed in a safe and secured environment
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  return (
    <SafeAreaView
      style={{
        paddingHorizontal: 24,
        // backgroundColor: "#fff",
        height: '100%',
      }}>
      <StatusBar
        backgroundColor={PrimaryColor}
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
      />

      <View /* style={{ flexDirection: "column", flex: 1 }} */>
        <View /* style={{ flex: 2 }} */ style={{marginBottom: 40}}>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              //   paddingTop: 24,
              paddingVertical: 16,
              paddingHorizontal: 16,
              //   marginBottom: 24,
              //   flexDirection: "row",
              //   flexWrap: "wrap",
              //   justifyContent: "space-between",

              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Avatar
                rounded
                size="medium"
                title={
                  route.params.fullName[0]
                  // 'L'
                  // route.params.data.PartnerName
                  //   ? route.params.data.PartnerName[0]
                  //   : null
                }
                containerStyle={{
                  backgroundColor: PrimaryColor,
                  marginRight: 12,
                }}
                icon={{name: 'user', type: 'font-awesome'}}
                // source={{
                //   uri:
                //     "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg",
                // }}
              />

              <View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{marginRight: 4}}>
                    {route.params.fullName ? route.params.fullName : 'User'}
                  </Text>
                </View>

                {route.params.contact && (
                  <Text style={{color: 'rgba(0,0,0,0.45)'}}>
                    {'+60 ' + route.params.contact}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>

        <View /* style={{ flex: 1 }} */ style={{marginBottom: 24}}>
          <CurrencyInput
            style={{
              paddingHorizontal: 24,
              fontSize: 24,
              backgroundColor: '#fff',
              borderColor: 'rgba(0,0,0,0.35)',
              borderWidth: 1,
              borderRadius: 5,
              paddingVertical: 8,

              // borderBottomColor: PrimaryColor,
              // borderBottomWidth: 1,
              // borderTopLeftRadius: 5,
              // borderTopRightRadius: 5,
            }}
            // editable is disabled input
            // editable={route.params.data.PartnerAmount > 0 ? false : true}
            value={currencyValue}
            keyboardType="numeric"
            onChangeValue={setCurrencyValue}
            placeholder={I18n.t('PaymentStatus.Label.amount')}
            minValue={0}
            prefix="RM "
            delimiter=","
            separator="."
            precision={2}
            onChangeText={formattedValue => {
              setValue(
                'amount',
                formattedValue.replace(/[- #*;,.<>()+N\{\}\[\]\\\/]/gi, ''),
              );
              console.log(formattedValue); // $2,310.46
            }}
          />
          {errors.amount && (
            <Text
              style={{
                color: '#f00',
                fontSize: 12,
                textAlign: 'left',
              }}>
              {errors.amount.message}
            </Text>
          )}
        </View>

        <View /* style={{ flex: 1 }} */ style={{marginBottom: 40}}>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 5,
              height: 50,
              paddingHorizontal: 8,
              //   flex: 1,
              borderColor: 'rgba(0,0,0,0.35)',
              borderWidth: 1,
            }}>
            <Input
              // placeholderTextColor="grey"
              //   maxLength={10}
              // placeholder={I18n.t('PaymentStatus.Label.writeRemark')}
              placeholder={'Recipient Reference'}
              //   keyboardType="phone-pad"
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
              // ref={contactInput}
              // value={contact}
              onChangeText={e => {
                //   setContact(e.replace(/[- #*;,.<>()+N\{\}\[\]\\\/]/gi, ""));
                setValue('remark', e, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
              onSubmitEditing={
                bioStatus
                  ? handleSubmit(biometricVerify)
                  : handleSubmit(() => setModalVisible(true))
              }
              // onFocus={() => setButtonMargin(0)}
              // onBlur={() =>
              //   setButtonMargin(
              //     Dimensions.get("window").height * 0.08
              //   )
              // }
            />
          </View>
          {errors.remark && (
            <Text
              style={{
                color: '#f00',
                fontSize: 12,
                textAlign: 'left',
              }}>
              {errors.remark.message}
            </Text>
          )}
        </View>

        <View /* style={{ flex: 2 }} */>
          <Button
            title={'Confirm Payment'}
            buttonStyle={{
              borderRadius: 100,
              backgroundColor: PrimaryColor,
              marginBottom: 12,
            }}
            titleStyle={{
              color: '#fff',
              fontWeight: 'bold',
              paddingVertical: 8,
              paddingHorizontal: Dimensions.get('window').width * 0.18,
            }}
            onPress={
              bioStatus
                ? handleSubmit(biometricVerify)
                : handleSubmit(() => setModalVisible(true))
            }
          />

          <Text style={{textAlign: 'center', color: 'rgba(0,0,0,0.45)'}}>
            You are able to transfer up to RM{route.params.walletBalance}
          </Text>

          {/* <Button
            title={'Gesture Demo'}
            onPress={() => navigation.navigate('GestureDemo')}
          /> */}
        </View>

        {PinModal}

        <ActivityIndicator
          toast
          size="large"
          animating={loading}
          text={I18n.t('PaymentStatus.Label.loading')}
        />
      </View>
    </SafeAreaView>
  );
};

export default TransferMoney;

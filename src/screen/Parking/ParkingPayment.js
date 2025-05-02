import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  StatusBar,
  Text,
  Platform,
  KeyboardAvoidingView,
  Alert,
  ScrollView,
} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import {context} from '../../../App';
import {PrimaryColor} from '../../tools/Constant/Constant';
import Currency from 'react-currency-formatter';
import Modal from 'react-native-modal';
import SetPin from '../SecureCode/components/SetPin';
import I18n from 'i18n-js';
import moment from 'moment';
import CarPlateApi from '../../tools/Api/carPlate.api';
import NotificationPlugin from '../../plugin/pushNotification.plugin/pushNotification.plugin';
import {ResponseError} from '../../tools/ErrorHandler/ErrorHandler';
import RNSecureStorage from 'rn-secure-storage';
import totpPlugin from '../../plugin/totp.plugin/totp.plugin';
import biometricPlugin from '../../plugin/biometric.plugin/biometric.plugin';
import {ActivityIndicator} from '@ant-design/react-native';

const ParkingPayment = ({navigation, route}) => {
  const contextProvider = useContext(context);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [fee, setFee] = useState(0);
  const [pin, setPin] = useState('');
  const [bioStatus, setBioStatus] = useState(false);

  useEffect(() => {
    if (route.params.data._id) {
      GetCarPlateFee();
    } else {
      GetFeeByCarPlateNumber();
    }

    biometricStatus();
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

  const verifyBiometric = async () => {
    const Biometric = await biometricPlugin.createBiometricCredential(
      'transfer',
    );

    // if status is error will return
    // if status is ok will continue proceed function
    if (Biometric.status === 'error') {
      return Alert.alert('Invalid Credential');
    }

    handlePay();
  };

  const GetCarPlateFee = async () => {
    setLoading(true);

    const res = await CarPlateApi.getCarPlateFee(route.params.data._id);
    console.log('get car plate fee', res);
    // console.log('===================== car plate fee ========', res);
    // console.log('===id======', route.params.data._id)
    
    if (res.status === 200) {
      setLoading(false);
      setFee(res.data);
    } else {
      setLoading(false);
      ResponseError(res);
    }
  };

  const GetFeeByCarPlateNumber = async () => {
    const carPlate = route.params.data.carPlate;
    setLoading(true);

    const res = await CarPlateApi.getCarPlateFeeByCarPlate({
      carPlate,
    });
    console.log(res);
    if (res.status === 200) {
      setLoading(false);
      setFee(res.data);
    } else {
      setLoading(false);
      ResponseError(res);
    }
  };

  const handleDelete = async values => {
    try {
      setLoading(true);

      const res = await CarPlateApi.deleteCarPlate(route.params.data._id);
      console.log(res);
      if (res.status >= 200 || res.status < 300) {
        setLoading(false);

        Alert.alert(null, 'Delete Car Plate Successful!', [
          {
            text: 'OK',
            onPress: () => {
              navigation.reset({
                index: 1,
                routes: [
                  {
                    name: 'home',
                  },
                  {
                    name: 'Parking',
                  },
                ],
              });
            },
          },
        ]);
      } else {
        setLoading(false);
        Alert.alert(null, res.response.data);
      }
    } catch (error) {
      console.log('handle error', error);
    }
  };

  const handlePay = async values => {
    try {
      setLoading(true);
      
      const {_id, carPlate} = route.params.data;
      console.log('Start', values, pin);
      let method = 'pin';
      let totp = '';
      let timestamp = Math.floor(Date.now());

      if (bioStatus) {
        console.log('Runned', 124);
        method = 'biometric';
        totp = await totpPlugin.signPayQR(timestamp, 1);
      }

      const res = await CarPlateApi.payCarPlate(_id, {
        pin,
        totp,
        method,
        timestamp: Math.floor(timestamp / 1000),
        carPlate: carPlate,
      });
      console.log(res);
      if (res.status === 200) {
        const originalAmount = res.data.amount;
        const amount = (res.data.amount / 100).toFixed(2);
        const ticketNumber = res.data.remark;
        const createdAt = res.data.createdAt;
        const _id = res.data._id;
        setLoading(false);
        if (method === 'pin') {
          setModalVisible(false);
        }

        await NotificationPlugin.sendLocalNotification(
          moment().unix(),
          'Payment Successful!',
          'RM' +
            amount +
            ' has been paid for ' +
            route.params.data.carPlate +
            '\xa0' +
            ' at ' +
            moment().format('DD-MMM-YYYY HH:mm'),
          {
            type: {
              amount: amount,
              remark: route.params.data.carPlate,
              _id: _id,
              createdAt: createdAt,
            },
            path: 'transactionDetails',
          },
        );

        console.log(amount, 172);
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'ParkingStatus',
              params: {
                fullName: route.params.data.name,
                carPlate: route.params.data.carPlate,
                amount: originalAmount,
                ticketNumber: ticketNumber,
                createdAt: moment(createdAt) /* res.data.createdAt */,
                _id: moment().unix() /* res.data._id */,
                payment_status: 'success',
              },
            },
          ],
        });
      } else {
        setLoading(false);
        ResponseError(res);
      }

      // if (currencyValue > route.params.walletBalance) {
      //   Alert.alert(null, "Transfer amount can't exceed the wallet balance");
      // } else {
      //   setLoading(true);

      //   var res;

      //   console.log(currencyValue);

      //   if (route.params.contact) {
      //     res = await TransactionApi.walletTransaction({
      //       // walletId: String,
      //       contact: {countryCode: '+60', number: route.params.contact},
      //       amount: todp(currencyValue * 100, 0),
      //       remark: getValues('remark'),
      //       pin: pin,
      //     });
      //   } else {
      //     res = await TransactionApi.walletTransaction({
      //       walletId: route.params.walletId,
      //       amount: todp(currencyValue * 100, 0),
      //       remark: getValues('remark'),
      //       pin: pin,
      //     });
      //   }

      //   console.log(res);

      //   if (res.status >= 200 || res.status < 300) {
      //     setLoading(false);
      //     await NotificationPlugin.sendLocalNotification(
      //       moment().unix(),
      //       I18n.t('PaymentStatus.notification.transferSuccess'),
      //       'RM ' +
      //         currencyValue +
      //         I18n.t('PaymentStatus.notification.transferDesc') +
      //         moment().format('DD-MMM-YYYY HH:mm'),
      //       {
      //         type: {
      //           amount: todp(currencyValue * 100, 0),
      //           relativeParty: {
      //             name: route.params.fullName,
      //           },
      //           remark: getValues('remark'),
      //           createdAt: res.data.createdAt,
      //           _id: res.data._id,
      //         },
      //         path: 'transactionDetails',
      //       },
      //     );

      //     navigation.reset({
      //       index: 0,
      //       routes: [
      //         {
      //           name: 'PaymentStatus',
      //           params: {
      //             fullName: route.params.fullName,
      //             remark: getValues('remark'),
      //             amount: currencyValue,
      //             createdAt: res.data.createdAt,
      //             _id: res.data._id,
      //           },
      //         },
      //       ],
      //     });
      //   } else {
      //     setLoading(false);
      //     ResponseError(res);
      //   }
      // }
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
            onPress={() => handlePay()}
            disabled={pin.length < 6 || loading}
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

  const topup = (
    <ScrollView
      style={{
        // height: '100%',
        backgroundColor: '#fff',
      }}>
      <StatusBar backgroundColor={PrimaryColor} barStyle="light-content" />

      <View
        style={{
          paddingHorizontal: 24,
          paddingVertical: 40,
          // flex: 1,
        }}>
        <View /* style={{flex: 8}} */>
          <Text
            style={{
              fontSize: 24,
              fontWeight: '600',
              color: '#606264',
              textAlign: 'center',
            }}>
            Car Plate Number
          </Text>
          <Text
            style={{
              fontSize: 32,
              fontWeight: 'bold',
              color: PrimaryColor,
              textAlign: 'center',
              marginBottom: 24,
            }}>
            {route.params.data.carPlate}
          </Text>

          <Text
            style={{
              fontSize: 24,
              fontWeight: '600',
              color: '#606264',
              textAlign: 'center',
            }}>
            Name
          </Text>
          <Text
            style={{
              fontSize: 32,
              fontWeight: 'bold',
              color: PrimaryColor,
              textAlign: 'center',
              marginBottom: 24,
            }}>
            {route.params.data.name}
          </Text>

          <Text
            style={{
              fontSize: 24,
              fontWeight: '600',
              color: '#606264',
              textAlign: 'center',
            }}>
            Ticket Number
          </Text>

          <Text
            style={{
              fontSize: 32,
              fontWeight: 'bold',
              color: PrimaryColor,
              textAlign: 'center',
              marginBottom: 24,
            }}>
            {fee.ticketNumber ? fee.ticketNumber : 'N/A'}
          </Text>

          <Text
            style={{
              fontSize: 24,
              fontWeight: '600',
              color: '#606264',
              textAlign: 'center',
            }}>
            Fees
          </Text>

          <Text
            style={{
              fontSize: 32,
              fontWeight: 'bold',
              color: PrimaryColor,
              textAlign: 'center',
              marginBottom: 24,
            }}>
            {fee.fee ? <Currency currency="MYR" quantity={fee.fee} /> : 'N/A'}
          </Text>

          <Text
            style={{
              fontSize: 24,
              fontWeight: '600',
              color: '#606264',
              textAlign: 'center',
            }}>
            Entry time
          </Text>

          <Text
            style={{
              fontSize: 32,
              fontWeight: 'bold',
              color: PrimaryColor,
              textAlign: 'center',
              marginBottom: 40,
            }}>
            {fee.fee
              ? moment(fee.entryTime).format('DD-MMM-YYYY hh:mm A')
              : 'N/A'}
          </Text>
        </View>

        <View style={{alignItems: 'center' /* , flex: 2 */}}>
          <Button
            title={'Pay Now'}
            disabled={!fee}
            buttonStyle={{
              backgroundColor: PrimaryColor,
              borderRadius: 8,
              paddingHorizontal: 24,
              paddingVertical: 12,
              width: 200,
              marginBottom: 24,
            }}
            // containerStyle={{alignItems: 'center'}}
            titleStyle={{color: '#fff', fontSize: 20, fontWeight: '500'}}
            onPress={() => {
              bioStatus ? verifyBiometric() : setModalVisible(true);
            }}
          />
          <Text
            style={{color: PrimaryColor, fontWeight: '500', fontSize: 16}}
            onPress={() =>
              Alert.alert(null, 'Confirm to delete car plate?', [
                {
                  text: 'Cancel',
                },
                {
                  text: 'Yes',
                  onPress: () => handleDelete(),
                },
              ])
            }>
            Delete Car Plate
          </Text>
        </View>
      </View>

      {PinModal}

      <ActivityIndicator
        toast
        size="large"
        animating={loading}
        text={I18n.t('topUp.Label.loading')}
      />
    </ScrollView>
  );

  return topup;
};

export default ParkingPayment;

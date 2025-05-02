import {useFocusEffect} from '@react-navigation/core';
import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, Alert, Dimensions} from 'react-native';
import TransactionApi from '../../tools/Api/transaction.api';
import AuthApi from '../../tools/Api/auth.api';
import {ResponseError} from '../../tools/ErrorHandler/ErrorHandler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button} from 'react-native-elements';
import {PrimaryColor} from '../../tools/Constant/Constant';
import {useForm} from 'react-hook-form';
import CurrencyInput from 'react-native-currency-input';
import {ActivityIndicator} from '@ant-design/react-native';
import I18n from '../../locales';
import Toast from 'react-native-root-toast';
import DeviceInfo from '../../plugin/deviceInfo.plugin/deviceInfo.plugin';
// import SetPin from "../SecureCode/components/SetPin";

const TopUp = props => {
  const inserts = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const {register, handleSubmit, errors, setValue, getValues} = useForm();
  const [walletBalance, setWalletBalance] = useState(0);
  const [currencyValue, setCurrencyValue] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [toastVisible, setToastVisible] = useState(false);
  const [CardListVisible, setCardListVisible] = useState(false);
  const [CreditDebitCard, setCreditDebitCard] = useState([
    // {
    //   recurringid: "1",
    //   CardName: "Master Credit 1234",
    // },
    // {
    //   recurringid: "2",
    //   CardName: "Visa Credit 5678",
    // },
  ]);
  const AmountList = [
    {
      amount: 10,
    },
    {
      amount: 25,
    },
    {
      amount: 50,
    },
    {
      amount: 100,
    },
    {
      amount: 150,
    },
    {
      amount: 180,
    },
  ];

  useEffect(() => {
    console.log(props);

    GetWalletBalance();
  }, [register]);

  useFocusEffect(
    useCallback(() => {
      register(
        {name: 'amount'},
        {
          min: 10,
          required: I18n.t('topUp.ErrorMessage.minAmount'),
        },
      );
    }, [register]),
  );

  const GetWalletBalance = async () => {
    try {
      setLoading(true);

      const res = await AuthApi.getWallet();
      console.log('wallet', res);

      if (res.status >= 200 || res.status < 300) {
        setLoading(false);
        setWalletBalance(res.data.balance / 100);
      } else {
        setLoading(false);
        ResponseError(res);
      }
    } catch (error) {
      console.log('wallet error', error);
    }
  };

  const WalletTopUp = async () => {
    try {
      // 1. Get screen size
      // 2. User agent
      const userAgent = await DeviceInfo.getUserAgent();
      const width = Dimensions.get('screen').width;
      const height = Dimensions.get('screen').height;

      setLoading(true);
      const res = await TransactionApi.topUp({
        amount: currencyValue * 100,
        screenWidth: width,
        screenHeight: height,
        userAgent,
      });
      console.log('top up', res);

      if (res.status >= 200 || res.status < 300) {
        setLoading(false);

        props.navigation.navigate('ReloadWebview', {
          html: res.data,
        });

        // formData.append('avatar', {
        //   uri: image.assets ? image.assets[0].uri : image.url,
        //   name: image.assets ? image.assets[0].fileName : image.name,
        //   type: image.assets ? image.assets[0].type : image.mimeType,
        // });

        // props.navigation.navigate("ReloadWebview")

        // await NotificationPlugin.sendLocalNotification(
        //   moment().unix(),
        //   'RM' + currencyValue + ' Top Up Successful!',
        //   moment().format('DD-MMM-YYYY HH:mm'),
        //   {
        //     type: {
        //       amount: Math.floor(currencyValue * 100),
        //       remark: 'Reload',
        //       createdAt: res.data.transactions.createdAt,
        //       _id: res.data.transactions._id,
        //     },

        //     path: 'transactionDetails',
        //   },
        // );

        // props.navigation.reset({
        //   index: 0,
        //   routes: [
        //     {
        //       name: 'TopUpStatus',
        //       params: {
        //         amount: currencyValue,
        //       },
        //     },
        //   ],
        // });
      } else {
        setLoading(false);
        ResponseError(res);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const SelectCreditCard = async () => {
    const RemainTopUpBalance = 200 - walletBalance;

    if (currencyValue > RemainTopUpBalance) {
      setLoading(false);
      return Alert.alert(null, "Wallet Balance can't exceed RM200");
    } else {
      setCardListVisible(true);
    }
  };

  const AmountMethod = (
    <View style={{paddingHorizontal: 16}}>
      <View
        /* style={{ flex: 1 }} */ style={{
          marginVertical: 24,
        }}>
        <CurrencyInput
          style={{
            paddingVertical: 12,
            paddingHorizontal: 16,
            fontSize: 24,
            fontWeight: '600',
            backgroundColor: '#fff',
            color: 'rgba(0,0,0,.80)',
            borderColor: PrimaryColor,
            borderWidth: 1,
            borderRadius: 5,
            // borderBottomColor: PrimaryColor,
            // borderBottomWidth: 1,
            // borderTopLeftRadius: 5,
            // borderTopRightRadius: 5,
          }}
          value={currencyValue}
          keyboardType="numeric"
          onChangeValue={setCurrencyValue}
          placeholder="Amount"
          prefix="RM "
          minValue={0}
          maxValue={250}
          delimiter=","
          separator="."
          precision={2}
          onChangeText={formattedValue => {
            console.log(currencyValue);
            setValue('amount', currencyValue);
            console.log(formattedValue); // $2,310.46
          }}
        />
        {currencyValue < 10 && (
          <Text
            style={{
              color: '#f00',
              fontSize: 12,
              textAlign: 'left',
            }}>
            {I18n.t('topUp.ErrorMessage.minAmount')}
          </Text>
        )}
        {/* {errors.amount && (
          <Text
            style={{
              color: "#f00",
              fontSize: 12,
              textAlign: "left",
            }}
          >
            {errors.amount.message}
          </Text>
        )} */}
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}>
        {AmountList.map(v => (
          <View key={v.amount} style={{width: '30%', marginBottom: 16}}>
            <Button
              title={'RM' + v.amount}
              disabled={v.amount + walletBalance > 200}
              buttonStyle={{borderRadius: 100, backgroundColor: PrimaryColor}}
              titleStyle={{fontSize: 18, fontWeight: '600'}}
              onPress={() => {
                setCurrencyValue(v.amount);
                setValue('amount', v.amount);
              }}
            />
          </View>
        ))}
      </View>
    </View>
  );

  const ToastModal = (
    <Toast
      // duration={2000}
      visible={toastVisible}
      position={-40}
      shadow={true}
      animation={true}
      hideOnPress={true}>
      {I18n.t('topUp.Label.redirect')}
    </Toast>
  );

  return (
    <View
      style={{
        // paddingTop: inserts.top,
        paddingBottom: inserts.bottom,
        backgroundColor: '#fff',
        // backgroundColor: '#e0e0e0',
        flex: 1,
      }}>
      {/* <Header
        placement="left"
        barStyle={Platform.select({
          ios: 'dark-content',
          android: 'light-content',
        })}
        backgroundColor={Platform.select({
          ios: '#fff',
          android: PrimaryColor,
        })}
        leftComponent={
          <TouchableOpacity
            style={{paddingLeft: 8}}
            onPress={() => {
              props.navigation.goBack();
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon
                name="arrow-back-outline"
                type="ionicon"
                color={'rgba(0,0,0,.65)'}
              />
              <Text
                style={{
                  paddingLeft: 8,
                  fontSize: 16,
                  color: PrimaryColor,
                  //   fontWeight: "600"
                }}>
                {I18n.t('topUp.Label.selectPaymentMethod')}
              </Text>
            </View>
          </TouchableOpacity>
        }
        containerStyle={{backgroundColor: '#fff'}}
      /> */}
      {/* <StatusBar backgroundColor="#000" barStyle="dark-content" translucent /> */}
      {AmountMethod}
      {/* {ToastModal} */}

      {/* <Button
        title={"Toast"}
        onPress={() => {
          setToastVisible(true);

          setTimeout(() => {
            setToastVisible(false);
          }, 3500);
        }}
      /> */}

      <Button
        title={'Next'}
        buttonStyle={{
          borderRadius: 100,
          height: 60,
          marginHorizontal: 16,
          marginTop: 48,
          backgroundColor: PrimaryColor,
        }}
        titleStyle={{fontSize: 24}}
        onPress={() => {
          // WalletTopUp();
          if (currencyValue < 10) {
            Alert.alert(null, 'Min RM10 is required');
          } else {
            WalletTopUp();
            // props.navigation.navigate('Reload Wallet', {
            //   orderId: '888888888',
            // });
            // props.navigation.navigate('TopUpMethod', {
            //   amount: currencyValue,
            // });
          }
        }}
      />

      <Text
        style={{
          fontSize: 12,
          color: 'rgba(0,0,0,0.35)',
          marginTop: 12,
          textAlign: 'center',
        }}>
        Max top up wallet is RM200
      </Text>

      <ActivityIndicator
        toast
        size="large"
        animating={loading}
        text={I18n.t('topUp.Label.loading')}
      />
    </View>
  );
};

export default TopUp;

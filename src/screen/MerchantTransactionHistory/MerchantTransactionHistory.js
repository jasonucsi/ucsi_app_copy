import React, {useEffect, useState, useContext} from 'react';
import moment from 'moment';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  SafeAreaView,
} from 'react-native';
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';
import Swiper from 'react-native-swiper';
import Currency from 'react-currency-formatter';
import CalendarPicker from 'react-native-calendar-picker';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import {Avatar, Button, Divider, Icon, ListItem} from 'react-native-elements';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {PrimaryColor} from '../../tools/Constant/Constant';
import TransactionApi from '../../tools/Api/transaction.api';
import {ResponseError} from '../../tools/ErrorHandler/ErrorHandler';
import {context} from '../../../App';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import I18n from '../../locales';
import RNPickerSelect from 'react-native-picker-select';

const MerchantTransactionHistory = ({navigation, route}) => {
  const contextProvider = useContext(context);
  const [loading, setLoading] = useState(false);
  const [businessList, setBusinessList] = useState();
  const [merchantWallet, setMerchantWallet] = useState();
  const [totalBalance, setTotalBalance] = useState(0);

  const [walletType, setWalletType] = useState('NormalWallet');

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(
    moment().subtract(7, 'day').startOf('day'),
  );
  const [selectedEndDate, setSelectedEndDate] = useState(moment().endOf('day'));

  const insets = useSafeAreaInsets();

  const [transactionHistory, setTransactionHistory] = useState([
    {
      _id: '1',
      name: 'Jackson Wang',
      type: 'Debit',
      amount: 17.8,
      timestamp: 1655798988,
      remark: 'Receive Testing',
      transactionId: 'UC23567653',
    },
    {
      _id: '2',
      name: 'Jackson Wang',
      type: 'Credit',
      amount: 56.21,
      timestamp: 1655898988,
      remark: 'Transfer Testing',
      transactionId: 'UC75684658',
    },
    {
      _id: '3',
      // name: 'Donnie Yen',
      type: 'Top Up',
      amount: 100,
      timestamp: 1659898988,
      transactionId: 'UC3214626',
    },
    {
      _id: '4',
      name: 'BTS Store',
      type: 'Credit',
      amount: 122.11,
      timestamp: 1669898988,
      remark: 'Buying Staff',
      transactionId: 'UC24804212',
    },
    {
      _id: '5',
      name: 'Hololive Industry',
      type: 'Credit',
      amount: 210.99,
      timestamp: 1671958988,
      remark: 'Buy Merch',
      transactionId: 'UC23906719',
    },

    /////////////////////////////////////////
    // {
    //   purpose: "Nasi Lemak Sdn Bhd",
    //   amount: 17.8,
    //   createdtime: 1647406948,
    //   status: "Successful",
    //   txnType: "Debit",
    //   point: 500,
    //   pointType: "redeem",
    // },
    // {
    //   purpose: "Top up",
    //   amount: 100,
    //   createdtime: 1647416948,
    //   status: "Successful",
    //   txnType: "Topup",
    //   point: 400,
    //   pointType: "given",
    // },
    // {
    //   purpose: "Ban Ban Bob - Sentul Raya",
    //   amount: 59.9,
    //   createdtime: 1647526948,
    //   status: "Successful",
    //   txnType: "Debit",
    //   point: 650,
    //   pointType: "redeem",
    // },
    // {
    //   purpose: "KK Mart | Damansara",
    //   amount: 12.2,
    //   createdtime: 1647536948,
    //   status: "Successful",
    //   txnType: "Debit",
    //   point: 250,
    //   pointType: "redeem",
    // },
    // {
    //   purpose: "Itsuba Dockers - Petaling Jaya",
    //   amount: 17.8,
    //   createdtime: 1647546948,
    //   status: "Successful",
    //   txnType: "Debit",
    //   point: 180,
    //   pointType: "given",
    // },
  ]);

  const [skeletonMap, setSkeletonMap] = useState([
    {
      _id: '1',
    },
    {
      _id: '2',
    },
    {
      _id: '3',
    },
    {
      _id: '4',
    },
    {
      _id: '5',
    },
    {
      _id: '6',
    },
    {
      _id: '7',
    },
    {
      _id: '8',
    },
    {
      _id: '9',
    },
    {
      _id: '10',
    },
    {
      _id: '11',
    },
    {
      _id: '12',
    },
  ]);

  useEffect(() => {
    console.log(contextProvider);
    console.log(route);

    GetBusinessList();
    // WalletTransactionHistory();
    // FilterWalletTransactionHistory();

    return () => {};
  }, [contextProvider, walletType]);

  const GetBusinessList = async () => {
    setLoading(true);

    const res = await TransactionApi.getBusinessList();
    console.log('business list', res);

    if (res.status >= 200 || res.status < 300) {
      setBusinessList(res.data.businesses);

      if (res.data.businesses.length > 0) {
        const ress = await TransactionApi.getBusinessIdWallet(
          res.data.businesses[0]._id,
        );
        console.log('merchant wallet', ress);

        setMerchantWallet(ress.data);

        // set transaction data

        const resss = await TransactionApi.transactionList(
          ress.data.businessId,
          selectedStartDate.unix(),
          selectedEndDate.unix(),
        );
        console.log('transaction history', resss);

        setLoading(false);
        setTransactionHistory(resss.data.transactions);
        setTotalBalance(
          resss.data.currentBalance ? resss.data.currentBalance : 0,
        );
      }
    } else {
      setLoading(false);
      ResponseError(res);
    }
  };

  const WalletTransactionHistory = async (manualStartDate, manualEndDate) => {
    setLoading(true);

    console.log('manualStartDate', moment(manualStartDate).unix());
    console.log('manualEndDate', moment(manualEndDate).unix());

    const res = await TransactionApi.transactionList(
      merchantWallet.businessId,
      manualStartDate
        ? moment(manualStartDate).startOf('day').unix()
        : selectedStartDate.unix(),
      manualEndDate
        ? moment(manualEndDate).endOf('day').unix()
        : selectedEndDate.unix(),
    );
    console.log('history', res);

    if (res.status === 200) {
      setLoading(false);
      setTransactionHistory(res.data.transactions);
    } else {
      setLoading(false);
      ResponseError(res);
    }
  };

  const onDateChange = async (date, type) => {
    let startDate;
    let endDate;

    if (type === 'END_DATE') {
      setSelectedEndDate(date);

      endDate = date;
      console.log(date, moment(date).endOf('d').format('YYYY-MM-DD HH:mm:ss'));

      if (date !== null) {
        WalletTransactionHistory(startDate, endDate);
        // FilterWalletTransactionHistory(startDate, endDate);
        setModalVisible(false);
      }
    } else {
      setSelectedStartDate(date);
      // setSelectedEndDate(null);

      startDate = date;
      console.log(
        date,
        moment(date).startOf('d').format('YYYY-MM-DD HH:mm:ss'),
      );
    }
  };

  const renderTransactionHistory = ({item}) => (
    <ListItem
      containerStyle={{padding: 0}}
      // onPress={() => navigation.navigate('TransactionDetails', { data: item })}
    >
      <TouchableWithoutFeedback
        onPress={() => navigation.navigate('TransactionDetails', {data: item})}>
        <View
          style={{
            // flex: 1,
            // justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexDirection: 'row',
          }}>
          <View style={{flex: 7}}>
            <View>
              <Text style={{fontWeight: 'bold'}} numberOfLines={1}>
                {/* {item.type === 'Top Up' ? 'Top Up' : item.name} */}
                {item.relativeParty?.name
                  ? item.relativeParty?.name
                  : item.remark}
              </Text>
            </View>

            <View>
              <Text style={{fontSize: 12, color: 'grey'}}>
                {moment(item.transactionDate).format('DD MMM YYYY, hh:mm:ssa')}
                {/* {moment.unix(item.timestamp).format('DD MMM YYYY, hh:mm:ssa')} */}
              </Text>
            </View>
          </View>
          <View style={{flex: 3}}>
            <Text
              style={{
                fontWeight: 'bold',
                color: item.amount < 0 ? '#cf1322' : '#389e0d',
                textAlign: 'right',
              }}>
              <Currency currency="MYR" quantity={item.amount / 100} />
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ListItem>
  );

  const DateRangeModal = (
    <Modal
      isVisible={modalVisible}
      useNativeDriver
      hideModalContentWhileAnimating
      style={{
        // justifyContent: "flex-end",
        margin: 0,
      }}
      // onBackButtonPress={() => setModalVisible(false)}
      // onBackdropPress={() => setModalVisible(false)}
    >
      <View style={{backgroundColor: '#fff', padding: 16}}>
        <CalendarPicker
          allowRangeSelection
          allowBackwardRangeSelect
          nextComponent={<Icon type="material" name="chevron-right" />}
          previousComponent={<Icon type="material" name="chevron-left" />}
          todayBackgroundColor="#fff"
          todayTextStyle={{color: '#000'}}
          //   selectedDayColor="#fff"
          selectedDayTextColor="#fff"
          selectedRangeStartStyle={{backgroundColor: PrimaryColor}}
          selectedRangeStyle={{backgroundColor: '#0094d966'}}
          selectedRangeEndStyle={{backgroundColor: PrimaryColor}}
          maxDate={moment().endOf('day')}
          selectedStartDate={
            selectedStartDate ? selectedStartDate.toString() : ''
          }
          selectedEndDate={selectedEndDate ? selectedEndDate.toString() : ''}
          onDateChange={onDateChange}
          // scaleFactor={
          //   Dimensions.get('window').width <= 320
          //     ? Dimensions.get('window').width - 0
          //     : Dimensions.get('window').width - 20
          // }
          restrictMonthNavigation={true}
        />
      </View>
    </Modal>
  );

  return (
    <View style={{backgroundColor: '#fff', flex: 1}}>
      <StatusBar
        backgroundColor={PrimaryColor}
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
      />
      <SafeAreaView>
        <View>
          {loading ? (
            <FlatList
              data={skeletonMap}
              keyExtractor={item => item._id}
              renderItem={({item}) => (
                <SkeletonPlaceholder speed={1000}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}>
                    <View style={{flex: 1}}>
                      <View
                        style={{
                          flex: 1,
                          width: 100,
                          height: 19,
                          marginBottom: 4,
                        }}
                      />
                      <View style={{flex: 1, width: 140, height: 16.3}} />
                    </View>
                    <View style={{flex: 1}}>
                      <View
                        style={{
                          flex: 1,
                          width: 80,
                          height: 19,
                          marginBottom: 4,
                          alignSelf: 'flex-end',
                        }}
                      />
                      <View
                        style={{
                          flex: 1,
                          width: 50,
                          height: 16.3,
                          alignSelf: 'flex-end',
                        }}
                      />
                    </View>

                    <Divider color="#bcbbc1" style={{marginVertical: 12}} />
                  </View>
                </SkeletonPlaceholder>
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                // marginTop: 60,
                paddingVertical: 24,
                paddingHorizontal: 24,
              }}
              ItemSeparatorComponent={() => (
                <Divider color="#bcbbc1" style={{marginVertical: 12}} />
              )}
            />
          ) : (
            <FlatList
              data={transactionHistory}
              keyExtractor={item => item.createdtime}
              renderItem={renderTransactionHistory}
              ListEmptyComponent={
                <View
                  style={{
                    height: Dimensions.get('window').height * 0.2,
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 24,
                      fontWeight: 'bold',
                    }}>
                    {I18n.t('Account.Home.noTransaction')}
                  </Text>
                </View>
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                // marginTop: 60,
                paddingVertical: 24,
                paddingHorizontal: 24,
              }}
              ItemSeparatorComponent={() => (
                <Divider color="#bcbbc1" style={{marginVertical: 12}} />
              )}
              ListHeaderComponent={
                <View
                  style={{
                    marginBottom: 24,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View>
                    <Text
                      style={{
                        backgroundColor: 'rgba(0,0,0,0.15)',
                        paddingHorizontal: 8,
                        paddingVertical: 8,
                        borderRadius: 5,
                        fontSize: 16,
                      }}
                      onPress={() => setModalVisible(true)}>
                      {moment(selectedStartDate).format('DD-MMM-YYYY') +
                        ' ~ ' +
                        moment(selectedEndDate).format('DD-MMM-YYYY')}
                    </Text>
                  </View>

                  <View>
                    <Text>Current Balance</Text>
                    <Text style={{fontWeight: '500', fontSize: 16}}>
                      <Currency currency="MYR" quantity={totalBalance / 100} />
                    </Text>
                  </View>
                </View>
              }
              // ListFooterComponent={
              //   <View
              //     style={{
              //       backgroundColor: PrimaryColor,
              //       borderRadius: 20,
              //       padding: 12,
              //     }}
              //   >
              //     <View style={{ paddingBottom: 12 }}>
              //       <Text style={{ color: "#fff", fontWeight: "bold" }}>
              //         {I18n.t("Account.Home.highlight")}
              //       </Text>
              //     </View>
              //     <FlatList
              //       showsHorizontalScrollIndicator={false}
              //       horizontal
              //       data={highlights}
              //       keyExtractor={(item) => item._id}
              //       renderItem={renderHighlights}
              //       ItemSeparatorComponent={() => (
              //         <View style={{ marginRight: 12 }} />
              //       )}
              //     />
              //   </View>
              // }
              // ListFooterComponentStyle={{
              //   marginTop: 24,
              //   marginBottom: Dimensions.get("window").height * 0.05,
              // }}
            />
          )}
        </View>

        {DateRangeModal}
      </SafeAreaView>
    </View>
  );
};

export default MerchantTransactionHistory;

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    height: 30,
    borderColor: '#86939e',
    borderBottomWidth: 1,
    fontSize: 16,
    // paddingRight: 30,
    color: '#242424',
    paddingBottom: 4,
    paddingLeft: 0,
  },
  inputIOS: {
    height: 30,
    borderColor: '#86939e',
    borderBottomWidth: 1,
    fontSize: 16,
    // paddingRight: 30,
    color: '#242424',
  },
  placeholder: {
    color: '#242424',
    // color: "#86939e",
  },
  iconContainer: {top: 8, right: -12},
  //   inputAndroidContainer: { marginHorizontal: 10, marginBottom: 12 },
  //   inputIOSContainer: { marginHorizontal: 10, marginBottom: 12 }
});

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
import {ActivityIndicator} from '@ant-design/react-native';
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';
import Swiper from 'react-native-swiper';
import Currency from 'react-currency-formatter';
import LinearGradient from 'react-native-linear-gradient';
import {Avatar, Button, Divider, Icon} from 'react-native-elements';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {PrimaryColor} from '../../tools/Constant/Constant';
import AuthApi from '../../tools/Api/auth.api';
import {ResponseError} from '../../tools/ErrorHandler/ErrorHandler';
import {context} from '../../../App';
import I18n from '../../locales';

const TransactionDetails = ({navigation, route}) => {
  const contextProvider = useContext(context);
  const [loading, setLoading] = useState(false);
  const [transactionData, setTransactionData] = useState({});
  const [SwiperImage, setSwiperImage] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    console.log('route', route);

    if (route.params.businessId && route.params.id) {
      NotificationMerchantTransaction(route.params.businessId, route.params.id);
    } else if (route.params.id) {
      NotificationTransaction(route.params.id);
    }

    return () => {};
  }, []);

  const NotificationTransaction = async id => {
    setLoading(true);

    const res = await AuthApi.notificationTransaction(id);
    console.log(res);
    if (res.status >= 200 || res.status < 300) {
      setLoading(false);
      setTransactionData(res.data);
    } else {
      setLoading(false);
      Alert.alert(null, res.response.data);
    }
  };

  const NotificationMerchantTransaction = async (businessId, id) => {
    setLoading(true);

    const res = await AuthApi.notificationMerchantTransaction(businessId, id);
    console.log(res);
    if (res.status >= 200 || res.status < 300) {
      setLoading(false);
      setTransactionData(res.data);
    } else {
      setLoading(false);
      Alert.alert(null, res.response.data);
    }
  };

  const ApiTransactionDetails = (
    <View style={{padding: 24}}>
      <View>
        <Text
          style={{
            color: transactionData.amount < 0 ? '#cf1322' : '#389e0d',
            // color:
            //     route.params.data.type === 'Debit'
            //       ? '#389e0d'
            //       : route.params.data.type === 'Credit'
            //       ? '#cf1322'
            //       : route.params.data.type === 'Top Up'
            //       ? '#389e0d'
            //       : null,
            fontWeight: 'bold',
            fontSize: 32,
          }}>
          {/* {route.params.data.type === 'Debit' ? '+' : '-'} */}
          {/* {route.params.data.amount} */}
          <Currency
            currency="MYR"
            quantity={transactionData.amount ? transactionData.amount / 100 : 0}
          />
        </Text>
      </View>

      <Divider style={[styles.dividerStyle]} />

      {/* <View
      style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <View style={{flex: 1}}>
        <Text style={{color: 'rgba(0,0,0,0.45)', fontSize: 16}}>
          {I18n.t('transactionDetails.Label.transactionType')}
        </Text>
      </View>

      <View style={{flex: 1}}>
        <Text style={[styles.rightContent]}>
          {route.params.data.type}
        </Text>
      </View>
    </View>

    <Divider style={[styles.dividerStyle]} /> */}

      {
        // route.params.data.name
        transactionData.relativeParty?.name && (
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{flex: 1}}>
                <Text style={{color: 'rgba(0,0,0,0.45)', fontSize: 16}}>
                  {I18n.t('transactionDetails.Label.user')}
                </Text>
              </View>

              <View style={{flex: 1}}>
                <Text style={[styles.rightContent]}>
                  {route.params.data.relativeParty?.name
                    ? route.params.data.relativeParty?.name
                    : 'UCSI PAY'}
                </Text>
              </View>
            </View>

            <Divider style={[styles.dividerStyle]} />
          </View>
        )
      }

      {transactionData.remark && (
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{flex: 1}}>
              <Text style={{color: 'rgba(0,0,0,0.45)', fontSize: 16}}>
                Remark
              </Text>
            </View>

            <View style={{flex: 1}}>
              <Text style={[styles.rightContent]}>
                {transactionData.remark ? transactionData.remark : 'N/A'}
              </Text>
            </View>
          </View>
          <Divider style={[styles.dividerStyle]} />
        </View>
      )}

      {transactionData.commission > 0 && (
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{flex: 1}}>
              <Text style={{color: 'rgba(0,0,0,0.45)', fontSize: 16}}>
                Commission (%)
              </Text>
            </View>

            <View style={{flex: 1}}>
              <Text style={[styles.rightContent]}>
                <Currency
                  // currency="MYR"
                  pattern="#,##0."
                  quantity={transactionData.commission}
                />
              </Text>
            </View>
          </View>
          <Divider style={[styles.dividerStyle]} />
        </View>
      )}

      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{flex: 1}}>
          <Text style={{color: 'rgba(0,0,0,0.45)', fontSize: 16}}>
            {I18n.t('transactionDetails.Label.dateTime')}
          </Text>
        </View>

        <View style={{flex: 1}}>
          <Text style={[styles.rightContent]}>
            {moment(transactionData.createdAt).format('DD/MM/YYYY HH:mm:ss')}
            {/* {moment(route.params.data.timestamp).format(
            'DD/MM/YYYY HH:mm:ss',
          )} */}
          </Text>
        </View>
      </View>

      <Divider style={[styles.dividerStyle]} />

      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{flex: 1}}>
          <Text style={{color: 'rgba(0,0,0,0.45)', fontSize: 16}}>
            {I18n.t('transactionDetails.Label.txnId')}
          </Text>
        </View>

        <View style={{flex: 1}}>
          <Text style={[styles.rightContent]}>
            {transactionData._id}
            {/* {route.params.data.transactionId} */}
          </Text>
        </View>
      </View>

      <Divider style={[styles.dividerStyle]} />
    </View>
  );

  const transactionDetails = (
    <View style={{padding: 24}}>
      <View>
        <Text
          style={{
            color: route.params.data.amount < 0 ? '#cf1322' : '#389e0d',
            // color:
            //     route.params.data.type === 'Debit'
            //       ? '#389e0d'
            //       : route.params.data.type === 'Credit'
            //       ? '#cf1322'
            //       : route.params.data.type === 'Top Up'
            //       ? '#389e0d'
            //       : null,
            fontWeight: 'bold',
            fontSize: 32,
          }}>
          {/* {route.params.data.type === 'Debit' ? '+' : '-'} */}
          {/* {route.params.data.amount} */}
          <Currency
            currency="MYR"
            quantity={
              route.params.data.amount ? route.params.data.amount / 100 : 0
            }
          />
        </Text>
      </View>

      <Divider style={[styles.dividerStyle]} />

      {/* <View
      style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <View style={{flex: 1}}>
        <Text style={{color: 'rgba(0,0,0,0.45)', fontSize: 16}}>
          {I18n.t('transactionDetails.Label.transactionType')}
        </Text>
      </View>

      <View style={{flex: 1}}>
        <Text style={[styles.rightContent]}>
          {route.params.data.type}
        </Text>
      </View>
    </View>

    <Divider style={[styles.dividerStyle]} /> */}

      {
        // route.params.data.name
        route.params.data.relativeParty?.name && (
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{flex: 1}}>
                <Text style={{color: 'rgba(0,0,0,0.45)', fontSize: 16}}>
                  {I18n.t('transactionDetails.Label.user')}
                </Text>
              </View>

              <View style={{flex: 1}}>
                <Text style={[styles.rightContent]}>
                  {route.params.data.relativeParty?.name
                    ? route.params.data.relativeParty?.name
                    : 'UCSI PAY'}
                </Text>
              </View>
            </View>

            <Divider style={[styles.dividerStyle]} />
          </View>
        )
      }

      {route.params.data.remark && (
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{flex: 1}}>
              <Text style={{color: 'rgba(0,0,0,0.45)', fontSize: 16}}>
                Remark
              </Text>
            </View>

            <View style={{flex: 1}}>
              <Text style={[styles.rightContent]}>
                {route.params.data.remark ? route.params.data.remark : 'N/A'}
              </Text>
            </View>
          </View>
          <Divider style={[styles.dividerStyle]} />
        </View>
      )}

      {route.params.data.commission > 0 && (
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{flex: 1}}>
              <Text style={{color: 'rgba(0,0,0,0.45)', fontSize: 16}}>
                Commission (%)
              </Text>
            </View>

            <View style={{flex: 1}}>
              <Text style={[styles.rightContent]}>
                <Currency
                  // currency="MYR"
                  pattern="#,##0."
                  quantity={route.params.data.commission}
                />
              </Text>
            </View>
          </View>
          <Divider style={[styles.dividerStyle]} />
        </View>
      )}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{flex: 1}}>
          <Text style={{color: 'rgba(0,0,0,0.45)', fontSize: 16}}>
            {I18n.t('transactionDetails.Label.dateTime')}
          </Text>
        </View>

        <View style={{flex: 1}}>
          <Text style={[styles.rightContent]}>
            {moment(
              route.params.data.transactionDate
                ? route.params.data.transactionDate
                : route.params.data.createdAt,
            ).format('DD MMM YYYY, hh:mm:ssa')}
            {/* {moment(route.params.data.timestamp).format(
            'DD/MM/YYYY HH:mm:ss',
          )} */}
          </Text>
        </View>
      </View>

      <Divider style={[styles.dividerStyle]} />

      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{flex: 1}}>
          <Text style={{color: 'rgba(0,0,0,0.45)', fontSize: 16}}>
            {I18n.t('transactionDetails.Label.txnId')}
          </Text>
        </View>

        <View style={{flex: 1}}>
          <Text style={[styles.rightContent]}>
            {route.params.data._id}
            {/* {route.params.data.transactionId} */}
          </Text>
        </View>
      </View>

      <Divider style={[styles.dividerStyle]} />
    </View>
  );

  return (
    <View style={{backgroundColor: '#fff', flex: 1}}>
      <StatusBar
        backgroundColor={PrimaryColor}
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
      />
      <SafeAreaView>
        <ScrollView>
          {route.params.id && !loading
            ? ApiTransactionDetails
            : !loading
            ? transactionDetails
            : null}
        </ScrollView>
      </SafeAreaView>

      <ActivityIndicator
        toast
        size="large"
        animating={loading}
        text={I18n.t('Account.Home.loading')}
      />
    </View>
  );
};

export default TransactionDetails;

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  rightContent: {
    fontSize: 16,
    textAlign: 'right',
  },

  dividerStyle: {
    marginVertical: 16,
  },
});

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
  Alert,
} from 'react-native';
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';
import Swiper from 'react-native-swiper';
import Currency from 'react-currency-formatter';
import LinearGradient from 'react-native-linear-gradient';
import {Avatar, Button, Divider, Icon} from 'react-native-elements';
import {ActivityIndicator} from '@ant-design/react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {PrimaryColor} from '../../tools/Constant/Constant';
import PromotionApi from '../../tools/Api/promotion.api';
import {ResponseError} from '../../tools/ErrorHandler/ErrorHandler';
import {context} from '../../../App';
import I18n from '../../locales';
import Modal from 'react-native-modal';
import SecureImageLoader from '../../library/SecureImageLoader';

const PromotionDetails = ({navigation, route}) => {
  const contextProvider = useContext(context);
  const [loading, setLoading] = useState(false);
  const [redeemVisible, setRedeemVisible] = useState(false);
  const [promotionDetails, setPromotionDetails] = useState({});
  const insets = useSafeAreaInsets();

  useEffect(() => {
    console.log('route', route);

    GetPromotionDetails(route.params._id);

    return () => {};
  }, []);

  const GetPromotionDetails = async _id => {
    setLoading(true);

    const res = await PromotionApi.getPromotionDetails(_id);
    console.log('res', res);

    if (res.status === 200) {
      setLoading(false);
      setPromotionDetails(res.data);
    } else {
      setLoading(false);
      ResponseError(res);
    }
  };

  const RedeemModal = (
    <Modal
      isVisible={redeemVisible}
      onBackdropPress={() => setRedeemVisible(false)}>
      <View style={{backgroundColor: '#fff', padding: 16}}>
        <Text style={{fontSize: 18, marginBottom: 24}}>
          Confirm to redeem voucher?
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
          <Button
            title={'Cancel'}
            type="outline"
            buttonStyle={{
              width: 100,
              marginRight: 16,
              borderColor: PrimaryColor,
            }}
            titleStyle={{color: PrimaryColor}}
            onPress={() => setRedeemVisible(false)}
          />
          <Button
            title={'OK'}
            buttonStyle={{width: 100, backgroundColor: PrimaryColor}}
            onPress={() => {
              setRedeemVisible(false);
              Alert.alert(null, 'Redeem Voucher Successful!', [
                {text: 'OK', onPress: () => navigation.goBack()},
              ]);
            }}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={{backgroundColor: '#fff', flex: 1}}>
      <ScrollView>
        <StatusBar
          backgroundColor={PrimaryColor}
          barStyle={
            Platform.OS === 'android' ? 'light-content' : 'dark-content'
          }
        />

        <View
          style={{
            paddingVertical: 16,
            paddingHorizontal: 24,
            marginBottom: 70,
          }}>
          <View style={{alignItems: 'center'}}>
            <SecureImageLoader
              source={{uri: promotionDetails?.picture?.url}}
              style={{
                width: Dimensions.get('window').width - 48,
                height: Dimensions.get('window').width * 0.5 - 48,

                marginBottom: 24,
              }}
              resizeMode="contain"
              resizeMethod="scale"
            />
            {/* <Image
              source={{uri: promotionDetails?.picture?.url}}
              style={{
                width: Dimensions.get('window').width - 48,
                height: Dimensions.get('window').width * 0.5 - 48,

                marginBottom: 24,
              }}
              resizeMode="contain"
              resizeMethod="scale"
            /> */}
          </View>

          <Text
            style={{
              fontSize: 24,
              fontWeight: '500',
              textAlign: 'center',
              marginBottom: 16,
            }}>
            {promotionDetails.title}
          </Text>

          <View style={{flexDirection: 'row', marginBottom: 8}}>
            <Text style={{flex: 3, color: 'rgba()'}}>Start Date</Text>

            <Text style={{flex: 1}}>:</Text>

            <Text style={{flex: 6, fontWeight: '500'}}>
              {moment(promotionDetails.startDate).format(
                'DD MMM YYYY, hh:mm:ssa',
              )}
            </Text>
          </View>

          <View style={{flexDirection: 'row', marginBottom: 8}}>
            <Text style={{flex: 3}}>End Date</Text>

            <Text style={{flex: 1}}>:</Text>

            <Text style={{flex: 6, fontWeight: '500'}}>
              {moment(promotionDetails.endDate).format(
                'DD MMM YYYY, hh:mm:ssa',
              )}
            </Text>
          </View>

          <View style={{flexDirection: 'row', marginBottom: 8}}>
            <Text style={{flex: 3}}>T&C</Text>

            <Text style={{flex: 1}}>:</Text>

            <Text style={{flex: 6, fontWeight: '500'}}>
              {promotionDetails.tnc}
            </Text>
          </View>

          <View style={{flexDirection: 'row', marginBottom: 24}}>
            <Text style={{flex: 3}}>FAQ</Text>

            <Text style={{flex: 1}}>:</Text>

            <Text style={{flex: 6, fontWeight: '500'}}>
              {promotionDetails.faq}
            </Text>
          </View>

          <Text style={{color: 'rgba(0,0,0,0.65)'}}>
            {promotionDetails.description}
          </Text>
        </View>
      </ScrollView>

      {/* <View style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>
        <Button
          title={'Redeem Now'}
          titleStyle={{fontSize: 24}}
          buttonStyle={{height: 70, backgroundColor: PrimaryColor}}
          onPress={() => setRedeemVisible(true)}
        />
      </View> */}

      {RedeemModal}

      <View style={{position: 'absolute', top: '45%', left: '50%'}}>
        <ActivityIndicator
          toast
          size="large"
          animating={loading}
          text={'Loading...'}
        />
      </View>
    </View>
  );
};

export default PromotionDetails;

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

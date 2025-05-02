import React, {Component, useState, useEffect, useRef, useContext} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  AppRegistry,
  Animated,
  ScrollView,
  View,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Platform,
  Keyboard,
  // ActivityIndicator
} from 'react-native';
import {Text, Divider, Icon, Button, ListItem} from 'react-native-elements';
import {ActivityIndicator} from '@ant-design/react-native';
import I18n from '../../../locales';
import {
  PrimaryColor,
  windowHeight,
  windowWidth,
} from '../../../tools/Constant/Constant';
import Share from 'react-native-share';
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';
import BusinessApi from '../../../tools/Api/business.api';
import {ResponseError} from '../../../tools/ErrorHandler/ErrorHandler';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {context} from '../../../../App';
import isEmpty from 'is-empty';
import {AuthCredential, AuthHeader} from '../../../tools/Api/api';
import SecureImageLoader from '../../../library/SecureImageLoader';

const MerchantDetails = ({navigation, route}) => {
  const contextProvider = useContext(context);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    contact: {},
    logo: {
      url: '',
    },
  });

  useEffect(() => {
    console.log(contextProvider);

    GetBusinessDetails();

    const keyboardShow = Keyboard.addListener('keyboardDidShow', () => {
      setFlatListVisible(false);
    });
    const keyboardHide = Keyboard.addListener('keyboardDidHide', () => {
      setFlatListVisible(true);
    });

    return () => {
      keyboardShow.remove();
      keyboardHide.remove();
    };
  }, []);

  const GetBusinessDetails = async () => {
    try {
      setLoading(true);
      const res = await BusinessApi.getBusinessDetails(route.params.businessId);
      console.log(res);

      if (res.status >= 200 || res.status < 300) {
        setLoading(false);
        setData(res.data.businesses);
      } else {
        setLoading(false);
        ResponseError(res);
      }
    } catch (error) {
      setLoading(false);
      console.log('error', error);
    }
  };

  return (
    <View style={{backgroundColor: '#fff', flex: 1}}>
      <StatusBar backgroundColor={PrimaryColor} barStyle="light-content" />
      <View style={{padding: 24}}>
        <View style={{alignItems: 'center'}}>
          <SecureImageLoader
            source={{
              uri: data.logo.url,
              // uri: 'https://th.bing.com/th/id/OIP.6wUlt-TBr7pN5S7YShFaugAAAA?pid=ImgDet&rs=1',
            }}
            style={{
              width: Dimensions.get('window').width * 0.3,
              height: Dimensions.get('window').width * 0.3,
              // borderRadius: 100,
              marginBottom: 12,
            }}
            resizeMode="contain"
            resizeMethod="scale"
          />
        </View>

        <Text
          style={{
            textAlign: 'center',
            fontSize: 24,
            fontWeight: '500',
            marginVertical: 16,
          }}>
          {data.displayName}
        </Text>

        <Text
          style={{
            textAlign: 'center',
            fontSize: 18,
            marginBottom: 16,
          }}>
          {data.contact.number && '+60' + data.contact.number}
        </Text>

        <Text
          style={{
            textAlign: 'center',
            fontSize: 18,
          }}>
          {data.email}
        </Text>

        <View style={{justifyContent: 'center'}}>
          <ActivityIndicator toast animating={loading} text="Loading..." />
        </View>
      </View>
    </View>
  );
};

export default MerchantDetails;

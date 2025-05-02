import {useFocusEffect} from '@react-navigation/core';
import {HeaderBackButton} from '@react-navigation/stack';
import React, {useCallback, useState, useContext, useEffect} from 'react';
import {
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  Switch,
  Text,
  TouchableWithoutFeedback,
  View,
  ToastAndroid,
  ImageBackground,
  Dimensions,
} from 'react-native';
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';
import {Avatar, Button, Icon, ListItem} from 'react-native-elements';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import biometricPlugin from '../../../plugin/biometric.plugin/biometric.plugin';
import {
  PrimaryColor,
  windowHeight,
  windowWidth,
} from '../../../tools/Constant/Constant';
import {TouchableOpacity} from 'react-native';
import RNRestart from 'react-native-restart';
import I18n from '../../../locales';
import {ResponseError} from '../../../tools/ErrorHandler/ErrorHandler';
import {WebView} from 'react-native-webview';
import {context} from '../../../../App';
import {ActivityIndicator} from '@ant-design/react-native';
import Modal from 'react-native-modal';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Toast from 'react-native-root-toast';
import NotificationPlugin from '../../../plugin/pushNotification.plugin/pushNotification.plugin';
import moment from 'moment';

const TopUpMethod = ({navigation, route}) => {
  const contextProvider = useContext(context);
  const [loading, setLoading] = useState(false);
  const menu = [
    {
      name: 'Cards',
      title: 'Cards',
      subTitle: 'Use your credit or debit card',
      // icon_name: 'store',
      // icon_type: 'material-community',
      image: require('../../../assest/image/UcsiTopUp/cards.png'),
    },
    // {
    //   name: 'My Points',
    //   title: I18n.t('Account.myPoints'),
    //   // icon_name: "award",
    //   // icon_type: "font-awesome-5",
    //   image: require('../../../assest/image/logo/MyPoints.png'),
    // },
    {
      name: 'Online banking',
      title: 'Online banking',
      subTitle: 'Top up via bank transfer',
      // icon_name: "credit-card",
      // icon_type: "material",
      image: require('../../../assest/image/UcsiTopUp/online_banking.png'),
    },
  ];

  useEffect(() => {
    console.log(contextProvider);
    console.log(route);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 24,
        paddingHorizontal: 16,
      }}>
      {menu.map(item => (
        <ListItem
          bottomDivider
          containerStyle={{
            backgroundColor: '#fff',
            paddingHorizontal: 24,
            paddingVertical: 12,
          }}
          onPress={() => {
            switch (item.name) {
              case 'Cards':
                navigation.navigate('PaymentMethod', {
                  type: 'topUp',
                  amount: route.params.amount,
                });
                break;

              default:
                break;
            }
          }}>
          <View style={{width: 28}}>
            {item.icon_name && (
              <Icon
                color={PrimaryColor}
                type={item.icon_type}
                name={item.icon_name}
              />
            )}
            {item.image && (
              <Image
                source={item.image}
                style={{width: 28, height: 28}}
                // resizeMethod="scale"
                resizeMode="contain"
              />
            )}
          </View>
          <ListItem.Content>
            <ListItem.Title>{item.title}</ListItem.Title>
            <ListItem.Subtitle>{item.subTitle}</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron color={PrimaryColor} />
        </ListItem>
      ))}
    </View>
  );
};

export default TopUpMethod;

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
  Alert,
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

const PaymentMethod = ({navigation, route}) => {
  const contextProvider = useContext(context);
  const [loading, setLoading] = useState(false);
  const menu = [
    {
      name: 'xxxx xxxx xxxx 1234',
      type: 'masterCard',
    },
    {
      name: 'xxxx xxxx xxxx 8888',
      type: 'visa',
    },
  ];

  useEffect(() => {
    console.log(contextProvider);
  }, []);

  const AddNewCard = async () => {
    if (menu.length === 5) {
      Alert.alert(
        'Unable to Add Another Card',
        'You have added the maximium of 5 bank cards. You can remove one of your current cards to add a new card.',
      );
    } else {
      navigation.navigate('AddCard');
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 24,
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{color: PrimaryColor, fontSize: 48, fontWeight: 'bold'}}>
        Coming Soon
      </Text>
    </View>
  );

  //   return (
  //  <View
  //       style={{
  //         flex: 1,
  //         backgroundColor: '#fff',
  //         paddingVertical: 24,
  //         paddingHorizontal: 16,
  //       }}>
  //       {menu.map(item => (
  //         <ListItem
  //           bottomDivider
  //           containerStyle={{
  //             backgroundColor: '#fff',
  //             paddingHorizontal: 24,
  //             paddingVertical: 12,
  //           }}
  //           onPress={() => {
  //             if (route.params.type === 'account') {
  //               navigation.navigate('CardDetails', {
  //                 cardInfo: item,
  //               });
  //             }
  //           }}>
  //           <View style={{width: 28}}>
  //             <Image
  //               source={
  //                 item.type === 'masterCard'
  //                   ? require('../../../assest/image/UcsiTopUp/master_card.png')
  //                   : require('../../../assest/image/UcsiTopUp/visa.png')
  //               }
  //               style={{width: 28, height: 28}}
  //               // resizeMethod="scale"
  //               resizeMode="contain"
  //             />
  //           </View>
  //           <ListItem.Content>
  //             <ListItem.Title>{item.name}</ListItem.Title>
  //           </ListItem.Content>

  //           {route.params.type === 'account' ? (
  //             <ListItem.Chevron color={PrimaryColor} />
  //           ) : (
  //             <Button
  //               title={'Reload'}
  //               titleStyle={{fontSize: 10}}
  //               buttonStyle={{
  //                 backgroundColor: PrimaryColor,
  //                 borderRadius: 100,
  //                 paddingHorizontal: 12,
  //               }}
  //             />
  //           )}
  //         </ListItem>
  //       ))}

  //       <ListItem
  //         bottomDivider
  //         containerStyle={{
  //           backgroundColor: '#fff',
  //           paddingHorizontal: 24,
  //           paddingVertical: 12,
  //         }}
  //         onPress={() => {
  //           AddNewCard();
  //           //   navigation.navigate('Merchant');
  //         }}>
  //         <View style={{width: 28}}>
  //           <Image
  //             source={require('../../../assest/image/UcsiTopUp/add_card.png')}
  //             style={{width: 28, height: 28}}
  //             // resizeMethod="scale"
  //             resizeMode="contain"
  //           />
  //         </View>
  //         <ListItem.Content>
  //           <ListItem.Title style={{color: PrimaryColor}}>
  //             Add Card
  //           </ListItem.Title>
  //         </ListItem.Content>
  //         <ListItem.Chevron color={PrimaryColor} />
  //       </ListItem>

  //       <Text style={{color: PrimaryColor, paddingTop: 24}}>
  //         Note: You can add a maximum of 5 cards only.
  //       </Text>
  //     </View>
  //   )
};

export default PaymentMethod;

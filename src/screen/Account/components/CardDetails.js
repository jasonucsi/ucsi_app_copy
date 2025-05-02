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

const CardDetails = ({navigation, route}) => {
  const contextProvider = useContext(context);
  const [loading, setLoading] = useState(false);
  const [switchStatus, setSwitchStatus] = useState(false);

  useEffect(() => {
    console.log(contextProvider);
    console.log(route);
  }, []);

  const HandleRemoveCard = async () => {
    Alert.alert(null, 'Confirm Remove Card?', [
      {
        text: 'Cancel',
        //   onPress: () => console.log('Cancel Pressed'),
      },
      {
        text: 'OK',
        onPress: () => {
          Alert.alert(null, 'Remove Card Successful!', [
            {
              text: 'OK',
              onPress: () => {
                navigation.goBack();
              },
            },
          ]);
        },
      },
    ]);
  };

  return (
    <View
      style={{
        flex: 1,
        // backgroundColor: '#fff',
        paddingVertical: 24,
        paddingHorizontal: 16,
      }}>
      <View
        style={{
          backgroundColor: '#fff',
          padding: 16,
          borderRadius: 10,
          marginBottom: 16,

          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}>
        <Image
          source={
            route.params.cardInfo.type === 'masterCard'
              ? require('../../../assest/image/UcsiTopUp/master_card.png')
              : require('../../../assest/image/UcsiTopUp/visa.png')
          }
          style={{width: 75, height: 75}}
          // resizeMethod="scale"
          resizeMode="contain"
        />

        <Text style={{marginBottom: 24}}>{route.params.cardInfo.name}</Text>
        <Text style={{color: 'rgba(0,0,0,0.35)'}}>Expiry Date</Text>
        <Text style={{color: 'rgba(0,0,0,0.35)'}}>09/2025</Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: Dimensions.get('window').height * 0.1,
        }}>
        <View>
          <Text style={{color: 'rgba(0,0,0,0.45)'}}>
            Set as primary payment method
          </Text>
        </View>
        <View>
          <Switch
            trackColor={{true: '#ce1e2280'}}
            thumbColor={switchStatus ? PrimaryColor : '#fff'}
            onValueChange={e => setSwitchStatus(e)}
            value={switchStatus}
          />
        </View>
      </View>

      <Button
        title={'Remove Card'}
        buttonStyle={{
          backgroundColor: PrimaryColor,
          borderRadius: 8,
          paddingHorizontal: 24,
          paddingVertical: 12,
          width: 180,
        }}
        containerStyle={{
          alignItems: 'center',
        }}
        titleStyle={{color: '#fff', fontSize: 20, fontWeight: '500'}}
        onPress={() => HandleRemoveCard()}
      />
    </View>
  );
};

export default CardDetails;

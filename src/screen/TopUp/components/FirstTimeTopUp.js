import React, {useEffect, useState, useContext, useRef} from 'react';
import {
  View,
  Image,
  Dimensions,
  StatusBar,
  Text,
  Platform,
  Linking,
  ScrollView,
  ImageBackground,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import {Button} from 'react-native-elements';
import {context} from '../../../../App';
import {PrimaryColor} from '../../../tools/Constant/Constant';

const FirstTimeTopUp = ({navigation, route}) => {
  const contextProvider = useContext(context);
  const [loading, setLoading] = useState(false);

  useEffect(() => {}, []);

  const topup = (
    <View style={{height: '100%' /* , backgroundColor: PrimaryColor */}}>
      <StatusBar backgroundColor={PrimaryColor} barStyle="light-content" />

      <View
        style={{
          // paddingTop: Dimensions.get('window').height * 0.2,
          paddingHorizontal: 24,
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}>
        <Text
          style={{
            fontSize: 30,
            fontWeight: 'bold',
            color: PrimaryColor,
            textAlign: 'center',
          }}>
          Ready to activate your e-wallet?
        </Text>

        <Image
          source={require('../../../assest/image/UcsiIcon/reload.png')}
          style={{
            width: Dimensions.get('window').width * 0.5,
            height: Dimensions.get('window').height * 0.4,
          }}
          resizeMode="contain"
          resizeMethod="auto"
          fadeDuration={800}
        />

        <Text
          style={{
            fontSize: 20,
            fontWeight: '600',
            color: '#606264',
            textAlign: 'center',
            marginBottom: 40,
          }}>
          Top up a minimum RM10 to start using your UCSIPAY eWallet.
        </Text>

        <Button
          title={'Active Now'}
          buttonStyle={{
            backgroundColor: PrimaryColor,
            borderRadius: 8,
            paddingHorizontal: 24,
            paddingVertical: 12,
            width: 200,
            marginBottom: 24,
          }}
          titleStyle={{color: '#fff', fontSize: 20, fontWeight: '500'}}
          onPress={() => navigation.navigate('TopUp')}
        />

        <Text
          style={{color: '#606264', fontSize: 16}}
          onPress={() => navigation.goBack()}>
          Set up later
        </Text>
      </View>
    </View>
  );

  return <View style={{flex: 1, backgroundColor: '#fff'}}>{topup}</View>;
};

export default FirstTimeTopUp;

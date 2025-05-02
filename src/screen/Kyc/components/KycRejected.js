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

const KycRejected = ({navigation, route}) => {
  const contextProvider = useContext(context);
  const [loading, setLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState(
    'The email address or phone number you have entered is invalid.',
  );

  useEffect(() => {
    if (contextProvider.contextProvider.my_profile.rejectedReason) {
      setRejectReason(
        contextProvider.contextProvider.my_profile.rejectedReason,
      );
    }
  }, []);

  const KYCrejected = (
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
          Opps... We had trouble verifying your details.
        </Text>

        <Image
          source={require('../../../assest/image/UcsiIcon/verify_failed.png')}
          style={{
            width: Dimensions.get('window').width * 0.9,
            height: Dimensions.get('window').height * 0.4,
          }}
          resizeMode="contain"
          resizeMethod="auto"
          fadeDuration={800}
        />

        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            color: '#606264',
            textAlign: 'center',
            marginBottom: 40,
          }}>
          {rejectReason}
        </Text>

        <Button
          title={'Retry'}
          buttonStyle={{
            backgroundColor: PrimaryColor,
            borderRadius: 8,
            paddingHorizontal: 24,
            paddingVertical: 12,
            width: 150,
          }}
          titleStyle={{color: '#fff', fontSize: 20, fontWeight: '500'}}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'Kyc',
                  // params: {
                  //   // data: route.params.data,
                  // },
                },
              ],
            })
          }
        />
      </View>
    </View>
  );

  return <View style={{flex: 1, backgroundColor: '#fff'}}>{KYCrejected}</View>;
};

export default KycRejected;

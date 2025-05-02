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

const KycStartExploring = ({navigation, route}) => {
  const contextProvider = useContext(context);
  const [loading, setLoading] = useState(false);

  useEffect(() => {}, []);

  const KYCStartExploring = (
    <View style={{height: '100%' /* , backgroundColor: PrimaryColor */}}>
      <StatusBar backgroundColor="transparent" barStyle="light-content" />
      <ImageBackground
        source={require('../../../assest/image/UcsiLogo/ucsi_splash_background.png')}
        style={{flex: 1}}>
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
              color: '#fff',
              textAlign: 'center',
            }}>
            Thank you! We’re verifying your details.
          </Text>

          <Image
            source={require('../../../assest/image/UcsiIcon/tick_circle.png')}
            style={{
              width: Dimensions.get('window').width * 0.5,
              height: Dimensions.get('window').height * 0.32,
            }}
            resizeMode="contain"
            resizeMethod="auto"
            fadeDuration={800}
          />

          <Text
            style={{
              fontSize: 20,
              fontWeight: '600',
              color: '#fff',
              textAlign: 'center',
              marginBottom: 40,
            }}>
            {`It usually takes a few minutes but it may take up to 2 working days.\n\nWe’ll notify you when it's done.`}
          </Text>

          <Button
            title={'Start Exploring'}
            buttonStyle={{
              backgroundColor: '#fff',
              borderRadius: 8,
              paddingHorizontal: 24,
              paddingVertical: 12,
            }}
            titleStyle={{color: PrimaryColor, fontSize: 20, fontWeight: '500'}}
            onPress={async () => {
              await contextProvider.getUserdata();

              setTimeout(() => {
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'home',
                      // params: {
                      //   // data: route.params.data,
                      // },
                    },
                  ],
                });
              }, 2000);
            }}
          />
        </View>
      </ImageBackground>
    </View>
  );

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>{KYCStartExploring}</View>
  );
};

export default KycStartExploring;

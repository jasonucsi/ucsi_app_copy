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
import {context} from '../../../App';
import {PrimaryColor} from '../../tools/Constant/Constant';
import Currency from 'react-currency-formatter';
import moment from 'moment';

const ParkingStatus = ({navigation, route}) => {
  const contextProvider = useContext(context);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Successful');

  useEffect(() => {
    console.log(route);
  }, []);

  const PaymentSuccessful = (
    <View style={{height: '100%' /* , backgroundColor: PrimaryColor */}}>
      <StatusBar backgroundColor="transparent" barStyle="light-content" />
      <ImageBackground
        source={require('../../assest/image/UcsiLogo/ucsi_splash_background.png')}
        style={{flex: 1}}>
        <View
          style={{
            // paddingTop: Dimensions.get('window').height * 0.2,
            paddingHorizontal: 24,
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}>
          <Image
            source={require('../../assest/image/UcsiIcon/ucsi_shiny.png')}
            style={{
              width: Dimensions.get('window').width * 0.4,
              height: Dimensions.get('window').height * 0.3,
            }}
            resizeMode="contain"
            resizeMethod="auto"
          />
          <Image
            source={require('../../assest/image/UcsiIcon/tick_shiny.png')}
            style={{
              position: 'absolute',
              top: Dimensions.get('window').height * 0.09,
              left: Dimensions.get('window').width * 0.55,

              width: Dimensions.get('window').width * 0.15,
              height: Dimensions.get('window').height * 0.15,
            }}
            resizeMode="contain"
            resizeMethod="auto"
          />

          <Text
            style={{
              fontSize: 30,
              fontWeight: 'bold',
              color: '#fff',
              textAlign: 'center',
              marginBottom: 16,
            }}>
            Payment Successful
          </Text>

          <Text
            style={{
              fontSize: 20,
              fontWeight: '600',
              color: '#fff',
              textAlign: 'center',
            }}>
            You’ve completed your payment
          </Text>

          <View
            style={{
              borderBottomColor: '#fff',
              borderBottomWidth: 1,
              width: '100%',
              marginVertical: 32,
            }}
          />

          <Text style={{color: '#fff', textTransform: 'uppercase'}}>
            PAYMENT AMOUNT
          </Text>

          <Text style={{fontSize: 40, fontWeight: 'bold', color: '#fff'}}>
            <Currency currency="MYR" quantity={route.params.amount / 100} />
          </Text>

          <Text style={{color: '#fff', marginBottom: 8}}>
            {moment(route.params.createdAt).format('DD MMM YYYY,  hh:mm:ss a')}
            {/* {moment().format('DD MMM YYYY,  hh:mm:ss a')} */}
          </Text>

          <Text style={{color: '#fff'}}>Car Plate</Text>

          <Text style={{color: '#fff', marginBottom: 16}}>
            {route.params.carPlate}
          </Text>

          <Text style={{color: '#fff'}}>Name</Text>

          <Text style={{color: '#fff', marginBottom: 16}}>
            {route.params.fullName}
          </Text>

          <Text style={{color: '#fff'}}>Ticket Number</Text>

          <Text style={{color: '#fff'}}>
            {route.params.ticketNumber}
            {/* {moment().unix()} */}
          </Text>

          <View
            style={{
              borderBottomColor: '#fff',
              borderBottomWidth: 1,
              width: '100%',
              marginVertical: 32,
            }}
          />

          <Button
            title={'Done'}
            buttonStyle={{
              backgroundColor: '#FBB048',
              borderRadius: 8,
              paddingHorizontal: 24,
              paddingVertical: 12,
              width: 180,
            }}
            titleStyle={{color: '#fff', fontSize: 20, fontWeight: '500'}}
            onPress={() =>
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
              })
            }
          />
        </View>
      </ImageBackground>
    </View>
  );

  const PaymentFailed = (
    <View style={{height: '100%' /* , backgroundColor: PrimaryColor */}}>
      <StatusBar backgroundColor="transparent" barStyle="light-content" />
      <ImageBackground
        source={require('../../assest/image/UcsiLogo/ucsi_splash_background.png')}
        style={{flex: 1}}>
        <View
          style={{
            // paddingTop: Dimensions.get('window').height * 0.2,
            paddingHorizontal: 24,
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}>
          <Image
            source={require('../../assest/image/UcsiIcon/ucsi_shiny.png')}
            style={{
              width: Dimensions.get('window').width * 0.4,
              height: Dimensions.get('window').height * 0.3,
            }}
            resizeMode="contain"
            resizeMethod="auto"
          />
          <Image
            source={require('../../assest/image/UcsiIcon/close_circle.png')}
            style={{
              position: 'absolute',
              top: Dimensions.get('window').height * 0.27,
              left: Dimensions.get('window').width * 0.55,

              width: Dimensions.get('window').width * 0.15,
              height: Dimensions.get('window').height * 0.15,
            }}
            resizeMode="contain"
            resizeMethod="auto"
          />

          <Text
            style={{
              fontSize: 30,
              fontWeight: 'bold',
              color: '#fff',
              textAlign: 'center',
              marginBottom: 16,
            }}>
            Payment Failed
          </Text>

          <Text
            style={{
              fontSize: 20,
              fontWeight: '600',
              color: '#fff',
              textAlign: 'center',
              marginBottom: 40,
            }}>
            {route.params.message}
            {/* Your payment has been rejected */}
          </Text>

          <Button
            title={'Try Again'}
            buttonStyle={{
              backgroundColor: '#FBB048',
              borderRadius: 8,
              paddingHorizontal: 24,
              paddingVertical: 12,
              width: 180,
            }}
            titleStyle={{color: '#fff', fontSize: 20, fontWeight: '500'}}
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'home',
                    // params: {
                    //   // data: route.params.data,
                    // },
                  },
                  //   {
                  //     name: 'TopUp',
                  //   },
                ],
              })
            }
          />
        </View>
      </ImageBackground>
    </View>
  );

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {route.params.payment_status === 'success'
        ? PaymentSuccessful
        : PaymentFailed}
      {/* {status === 'Successful' ? PaymentSuccessful : PaymentFailed} */}
    </View>
  );
};

export default ParkingStatus;

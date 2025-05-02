import React, {useContext, useEffect, useLayoutEffect} from 'react';
import {SafeAreaView, View, Text, StatusBar} from 'react-native';
import WebView from 'react-native-webview';
import {ActivityIndicator} from '@ant-design/react-native';
import I18n from '../../../locales';
import {Platform} from 'react-native';
import {context} from '../../../../App';
import Share from 'react-native-share';
import NotificationPlugin from '../../../plugin/pushNotification.plugin/pushNotification.plugin';
import moment from 'moment';
import {firebaseAnalyticCustom} from '../../../tools/Constant/Constant';
import analytics from '@react-native-firebase/analytics';

const ReloadWebview = ({navigation, route}) => {
  const contextProvider = useContext(context);
  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerTitle: () => {
  //       return (
  //         <View style={{ alignItems: "center", marginTop: 6 }}>
  //           <Text
  //             style={{
  //               color: "#123abe",
  //               fontSize: 18,
  //               fontWeight: "bold",
  //               marginBottom: 4,
  //             }}
  //           >
  //             About Us
  //           </Text>
  //           {/* <Text style={{ color: "rgba(0,0,0,0.35)", fontWeight: "bold" }}>
  //             Invite others to enjoy benefits!
  //           </Text> */}
  //         </View>
  //       );
  //     },
  //   });
  // }, [route]);

  useEffect(() => {
    console.log(contextProvider);
    console.log(route);

    // console.log(JSON.parse(route.params.html));
  }, []);

  onMessage = async e => {
    console.log('return message', e);
    console.log('parse', JSON.parse(e.nativeEvent.data));

    const NativeEventData = JSON.parse(e.nativeEvent.data);

    try {
      // Capture info
      if (NativeEventData.status === 'success') {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'TopUpStatus',
              params: {
                amount: NativeEventData.amount,
                remark: NativeEventData.remark,
                _id: NativeEventData._id,
                createdAt: NativeEventData.createdAt,
                payment_status: 'success',
              },
            },
          ],
        });

        // await analytics().logEvent(firebaseAnalyticCustom.topUp, {
        //   amount: "RM" + route.params.currency.toFixed(2),
        // });

        await NotificationPlugin.sendLocalNotification(
          moment().unix(),
          'Reload Successful!',
          'RM' +
            (NativeEventData.amount / 100).toFixed(2) +
            ' reload to your wallet on ' +
            moment().format('DD-MMM-YYYY HH:mm'),
          {
            type: {
              amount: Math.floor(NativeEventData.amount),
              remark: NativeEventData.remark,
              createdAt: NativeEventData.createdAt,
              _id: NativeEventData._id,
            },

            path: 'transactionDetails',
          },
        );
      } else {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'TopUpStatus',
              params: {
                message: NativeEventData.message,
                payment_status: 'fail',
              },
            },
          ],
        });
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <SafeAreaView style={{backgroundColor: '#fff', flex: 1}}>
      <StatusBar
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
      />
      <View style={{flex: 1, marginTop: 8}}>
        <WebView
          domStorageEnabled={true}
          source={{
            // uri: route.params.html,
            html: route.params.html,
          }}
          onMessage={onMessage}
          startInLoadingState={true}
          renderLoading={() => (
            <ActivityIndicator
              toast
              size="large"
              animating={true}
              text={'Loading...'}
            />
          )}
          // androidHardwareAccelerationDisabled={true}
          androidLayerType="hardware"
          onRenderProcessGone={syntheticEvent => {
            const {nativeEvent} = syntheticEvent;
            console.warn('WebView Crashed: ', nativeEvent.didCrash);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ReloadWebview;

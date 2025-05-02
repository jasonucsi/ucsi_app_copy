import React, {useContext, useEffect, useLayoutEffect} from 'react';
import {SafeAreaView, View, Text, StatusBar} from 'react-native';
import WebView from 'react-native-webview';
import {ActivityIndicator} from '@ant-design/react-native';
import I18n from '../../../locales';
import {Platform} from 'react-native';
import {context} from '../../../../App';
import Share from 'react-native-share';

const UcsiPayWebview = ({navigation, route}) => {
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
  //             Privacy Policy
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
  }, []);

  return (
    <SafeAreaView style={{backgroundColor: '#fff', flex: 1}}>
      <StatusBar
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
      />
      <View style={{flex: 1, marginTop: 8}}>
        <WebView
          domStorageEnabled={true}
          source={{
            uri: 'https://www.ucsipay.com',
          }}
          //   onMessage={onMessage}
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

export default UcsiPayWebview;

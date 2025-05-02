import React from 'react';
import { Platform, View, StyleSheet, ActivityIndicator, Text} from 'react-native';
import { WebView } from 'react-native-webview';

const BusView = () => {
  const uri = 'https://busapps.ucsiuniversity.edu.my/';

  return (
    <View style={styles.container}> 
      <View style={styles.messageContainer}>
        {/* <Text style={styles.messageText}>1st time access to CN only available after course selection approved by faculty.</Text> */}
      </View>
      <WebView
        style={styles.webview}
        source={{ uri }}
        onMessage={(event) => console.log(event.nativeEvent.data)}
        // style={{ width: screenWidth,
        // height: screenWidth * 0.75,
        // }}
        sharedCookiesEnabled={true}
        scalesPageToFit={true}
        // injectedJavaScript={`document.body.style.backgroundColor = 'red';`}
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    // backgroundColor: '#c92626',
    justifyContent: 'flex-start',
    // paddingTop: Platform.OS === 'ios' ? 50 : 0,
    // paddingTop: 50, // Add padding to illustrate
    // paddingBottom: 15,
    // paddingHorizontal: 5,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    textAlign: 'center', // Justify text  
    margin: 10,
    fontSize: 9,
    fontWeight: 'bold',
    color: 'black',
  },
})

export default BusView ;

import React from 'react';
import { Platform, View, StyleSheet, ActivityIndicator, TouchableOpacity, Text} from 'react-native';
import { WebView } from 'react-native-webview';

const IisView = () => {
  const uri = 'https://ucsiis-portal.vercel.app/';

  return (
    <View style={styles.container}> 
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
      {/* <TouchableOpacity
        onPress={() => navigation.navigate('Download')}
        style={styles.downloadButton}
      >
        <Text style={styles.downloadButtonText}>Click Here for Manual</Text>
      </TouchableOpacity> */}
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
  downloadButton: {
    position: 'absolute',
    top: '50%',  // Adjust this to position it vertically
    left: '50%',
    transform: [{ translateX: -150 }, { translateY: -25 }], // Centers the button horizontally
    backgroundColor: '#FF0000',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
})

export default IisView ;

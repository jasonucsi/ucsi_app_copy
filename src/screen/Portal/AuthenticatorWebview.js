import React from 'react';
import { Platform, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

const AuthenticatorView = () => {
  const uri = 'https://ucsiuniversity073-my.sharepoint.com/:w:/g/personal/1001955461_ucsiuniversity_edu_my/EX29oRNvNR5Ak1lm30pyHA0BBRSEhjAFFmdYXe5XoGrLdg?e=79eIeE';

  return (
    <View style={styles.container}>
      <WebView
        style={styles.webview}
        source={{ uri }}
        onMessage={(event) => console.log(event.nativeEvent.data)}
        sharedCookiesEnabled={true}
        scalesPageToFit={true}
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
        startInLoadingState={true} // Show loading indicator when WebView is loading
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Background color for the container
  },
  header: {
    height: 60, // Height of the header
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50', // Header background color
    paddingTop: Platform.OS === 'ios' ? 20 : 0, // Padding for iOS status bar
  },
  headerText: {
    fontSize: 20,
    color: '#ffffff', // Header text color
    fontWeight: 'bold',
  },
  webview: {
    flex: 1, // Make WebView take the remaining space
    width: '100%',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AuthenticatorView;

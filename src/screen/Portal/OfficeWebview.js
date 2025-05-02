// MsView.js
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';

const MsView = () => {
  const uri = 'https://login.microsoftonline.com/';
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity
        onPress={() => navigation.navigate('AuthenticatorScreen', { url: 'https://example.com/iisv2' })}
        style={styles.button}
      >
        <Text style={styles.label}>Click Here Learn How to Use Authenticator</Text>
      </TouchableOpacity> */}
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
        startInLoadingState={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  button: {
    padding: 10,
    backgroundColor: '#FF0000',
    margin: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
  },
  webview: {
    flex: 1,
    width: '100%',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MsView;

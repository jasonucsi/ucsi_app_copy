import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, View, Text, StatusBar, TextInput, Button } from 'react-native';
import WebView from 'react-native-webview';
import { ActivityIndicator } from '@ant-design/react-native';
import I18n from '../../../locales';
import { Platform } from 'react-native';
import { context } from '../../../../App';
import Share from 'react-native-share';

const AuthenticationWebview = ({ navigation, route }) => {
  const contextProvider = useContext(context);

  // State for the student ID and URL
  const [studentId, setStudentId] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [webviewError, setWebviewError] = useState(null);

  useEffect(() => {
    console.log(contextProvider);
  }, []);

  // Handle input change for the student ID
  const handleInputChange = (text) => {
    setStudentId(text);
  };

  // Handle submit to update the URL for WebView
  const handleSubmit = () => {
    if (studentId.trim()) {
      setLoading(true);
      const newUrl = `https://www.thecn.com/${studentId.trim()}`;
      setUrl(newUrl);
    } else {
      alert('Please enter a valid student ID');
    }
  };

  // Handle WebView error
  const handleWebViewError = (error) => {
    console.error('WebView error:', error);
    setWebviewError('Failed to load the page. Please check your internet connection or the URL.');
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
      <StatusBar
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
      />
      <View style={{ flex: 1, marginTop: 8 }}>
        {/* Input field for student ID */}
        <View style={{ padding: 16 }}>
          <TextInput
            style={{
              borderColor: '#ccc',
              borderWidth: 1,
              borderRadius: 4,
              padding: 8,
              marginBottom: 12,
            }}
            placeholder="Enter Student ID"
            keyboardType="numeric"
            value={studentId}
            onChangeText={handleInputChange}
          />
          <Button title="Load ePortfolio" onPress={handleSubmit} />
        </View>

        {/* Display WebView or Error Message */}
        {webviewError ? (
          <Text style={{ textAlign: 'center', marginTop: 20, color: 'red' }}>
            {webviewError}
          </Text>
        ) : url ? (
          <WebView
            domStorageEnabled={true}
            source={{ uri: url }}
            startInLoadingState={true}
            renderLoading={() => (
              <ActivityIndicator
                toast
                size="large"
                animating={true}
                text={'Loading...'}
              />
            )}
            androidLayerType="hardware"
            onError={handleWebViewError}
            onNavigationStateChange={(navState) => {
              if (!navState.loading) {
                console.log('Navigation completed:', navState);
              }
            }}
            onRenderProcessGone={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn('WebView Crashed: ', nativeEvent.didCrash);
            }}
          />
        ) : (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            Please enter a student ID
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AuthenticationWebview;

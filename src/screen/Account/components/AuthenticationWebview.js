import React, { useState, useEffect, useContext } from 'react';
import { 
  SafeAreaView, 
  View, 
  Text, 
  StatusBar, 
  TextInput, 
  Button,
  ActivityIndicator,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import WebView from 'react-native-webview';
import I18n from '../../../locales';
import { Platform } from 'react-native';
import { context } from '../../../../App';
import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage';
import axios from 'axios';

const AuthenticationWebview = ({ navigation, route }) => {
  const contextProvider = useContext(context);
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [unlinkPassword, setUnlinkPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    // Get the JWT token from secure storage when component mounts
    const fetchToken = async () => {
      try {
        const jwt = await RNSecureStorage.get("jwt");
        if (jwt) {
          setToken(jwt);
          // Print token to console
          console.log('Retrieved Token:', jwt);
          setDebugInfo(prev => prev + `Token retrieved: ${jwt.substring(0, 20)}...\n`);
        } else {
          setDebugInfo(prev => prev + "No token found in secure storage\n");
        }
      } catch (error) {
        console.error('Error fetching token:', error);
        setDebugInfo(prev => prev + `Error fetching token: ${error.message}\n`);
      }
    };
    
    fetchToken();
  }, []);

  const handleSubmit = async () => {
    if (!studentId.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
  
    setLoading(true);
    setDebugInfo(prev => prev + `Attempting authentication with student ID: ${studentId}\n`);
  
    try {
      console.log('Using token for request:', token);
      setDebugInfo(prev => prev + `Using token: ${token.substring(0, 20)}...\n`);
  
      // First check if student number is already linked to this account
      const accountInfoResponse = await axios.get(
        'https://ewallet1-api.ucsipay.com/api/account/',
        {
          headers: {
            'Authorization': token
          }
        }
      );
  
      // Check if studentNo already exists in the account info
      if (accountInfoResponse.data?.studentNo) {
        Alert.alert(
          'Already Linked', 
          `This account already has a student number linked: ${accountInfoResponse.data.studentNo}`
        );
        return;
      }
  
      // If no studentNo is linked, proceed with linking
      const response = await axios.patch(
        'https://ewallet1-api.ucsipay.com/api/account/studentNo',
        {
          studentNo: studentId.trim(),
          password: password.trim()
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          }
        }
      );
  
      console.log('API Response:', response.data);
      setDebugInfo(prev => prev + `API Response: ${JSON.stringify(response.data)}\n`);
      
      Alert.alert("Success", "Student ID successfully linked!");
      
    } catch (error) {
      console.error('API Error:', error);
      setDebugInfo(prev => prev + `API Error: ${error.message}\n`);
      
      let errorMessage = 'Failed to authenticate. Please try again.';
      
      if (error.response) {
        console.log('Error response data:', error.response.data);
        console.log('Error response status:', error.response.status);
        setDebugInfo(prev => prev + `Error status: ${error.response.status}\n`);
        setDebugInfo(prev => prev + `Error data: ${JSON.stringify(error.response.data)}\n`);
        
        if (error.response.status === 401) {
          errorMessage = 'Unauthorized: Invalid credentials or token';
        } else if (error.response.status === 409) {
          errorMessage = 'This student ID is already linked to another account';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlinkSubmit = async () => {
    if (!password.trim()) {
      Alert.alert('Error', 'Please fill in password');
      return;
    }
    
    setLoading(true);
    setDebugInfo(prev => prev + `Attempting to unlink student ID\n`);
  
    try {
      console.log('Using token for request:', token);
      setDebugInfo(prev => prev + `Using token: ${token.substring(0, 20)}...\n`);
  
      // First check current account status
      const accountInfoResponse = await axios.get(
        'https://ewallet1-api.ucsipay.com/api/account/',
        {
          headers: {
            'Authorization': token
          }
        }
      );
  
      // Check if studentNo is already empty
      if (!accountInfoResponse.data?.studentNo || accountInfoResponse.data.studentNo.trim() === '') {
        Alert.alert(
          'Already Unlinked', 
          'There is no student number linked to this account.'
        );
        return; // Exit the function if already unlinked
      }
  
      // Only proceed with unlink if there was a student number
      const response = await axios.patch(
        'https://ewallet1-api.ucsipay.com/api/account/studentNo',
        {
          studentNo: "",
          password: password.trim()
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          }
        }
      );
  
      console.log('API Response:', response.data);
      setDebugInfo(prev => prev + `API Response: ${JSON.stringify(response.data)}\n`);
      Alert.alert("Success", "Successfully Unlinked Student ID");
      
    } catch (error) {
      console.error('API Error:', error);
      setDebugInfo(prev => prev + `API Error: ${error.message}\n`);
      
      let errorMessage = 'Failed to unlink student ID. Please try again.';
      
      if (error.response) {
        console.log('Error response data:', error.response.data);
        console.log('Error response status:', error.response.status);
        setDebugInfo(prev => prev + `Error status: ${error.response.status}\n`);
        setDebugInfo(prev => prev + `Error data: ${JSON.stringify(error.response.data)}\n`);
        
        if (error.response.status === 401) {
          errorMessage = 'Unauthorized: Invalid credentials or token';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
      <StatusBar
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
      />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Student ID Input */}
        <Text style={{marginTop: 20, marginBottom: 20, fontSize: 24, fontWeight: 'bold'}}>Link Student ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Student ID"
          keyboardType="numeric"
          value={studentId}
          onChangeText={setStudentId}
        />
        
        {/* Password Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* <Button
          title="Authenticate"
          onPress={handleSubmit}
          disabled={loading || !token}
        />
        
        {loading && <ActivityIndicator size="large" style={styles.loader} />} */}
        
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading || !token}
          style={[
            styles.button,
            (loading || !token) && styles.buttonDisabled // Disabled state
          ]}
        >
          <Text style={styles.buttonText}>Authenticate</Text>
        </TouchableOpacity>


        {/* Debug Information Section */}
        {/* <View style={styles.debugContainer}>
          <Text style={styles.debugTitle}>Debug Information:</Text>
          <Text style={styles.debugText}>Token (first 20 chars): {token.substring(0, 20)}...</Text>
          <Text style={styles.debugText}>Full Token (check console): Printed to console</Text>
          <Text style={styles.debugText}>Request Headers:</Text>
          <Text style={styles.debugCode}>
            {JSON.stringify({
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token.substring(0, 20)}...`
            }, null, 2)}
          </Text>
          <Text style={styles.debugText}>Request Body:</Text>
          <Text style={styles.debugCode}>
            {JSON.stringify({
              studentNo: studentId.trim(),
              password: '••••••••' // Don't show actual password
            }, null, 2)}
          </Text>
          <Text style={styles.debugTitle}>Debug Log:</Text>
          <Text style={styles.debugText}>{debugInfo}</Text>
        </View> */}
        <Text style={{marginTop:40, marginBottom: 20, fontSize: 24, fontWeight: 'bold'}}>Unlink Student ID</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          secureTextEntry
          value={unlinkPassword}
          onChangeText={setUnlinkPassword}
        />

        <TouchableOpacity
          onPress={handleUnlinkSubmit}
          disabled={loading || !token}
          style={[
            styles.button,
            (loading || !token) && styles.buttonDisabled
          ]}
        >
          <Text style={styles.buttonText}>Unlink</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  loader: {
    marginTop: 20,
  },
  button: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10, // Rounded corners
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  buttonDisabled: {
    backgroundColor: 'gray', // Change color when disabled
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  debugContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  debugTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  debugText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 12,
    marginBottom: 5,
  },
  debugCode: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 10,
    backgroundColor: '#eee',
    padding: 5,
    borderRadius: 3,
    marginBottom: 10,
  }
});

export default AuthenticationWebview;
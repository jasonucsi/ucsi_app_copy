import React, { useCallback, useState, useEffect, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, View, Text } from 'react-native';
import Modal from 'react-native-modal';
import { context } from '../../../../App';
import biometricPlugin from '../biometric.plugin';
import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage';

const EnrollBiometric = () => {
  const contextProvider = useContext(context);
  const [modalVisible, setModalVisible] = useState(false);
  useFocusEffect(
    useCallback(() => {
      if (contextProvider.contextProvider.biometricVisible) {
        Alert.alert(
          'Enable Biometric',
          'Do you want to enable biometric payment?',
          [
            {
              text: 'No',
              onPress: async () => {
                const biometricEnable = await RNSecureStorage.set(
                  'biometricEnable',
                  'No',
                  { accessible: ACCESSIBLE.WHEN_UNLOCKED }
                );
                contextProvider.setBiometricEnable('No');
                console.log(biometricEnable);
                contextProvider.setBiometricVisible();
              }
            },
            {
              text: 'Yes',
              onPress: async () => {
                // setModalVisible(true);
                const res = await biometricPlugin.createBiometricCredential();
                console.log(res);

                if (res.status === 'ok') {
                  const biometricEnable = await RNSecureStorage.set(
                    'biometricEnable',
                    'Yes',
                    { accessible: ACCESSIBLE.WHEN_UNLOCKED }
                  );
                  contextProvider.setBiometricEnable('Yes');
                  console.log(biometricEnable);
                  contextProvider.setBiometricVisible();
                  Alert.alert(
                    'Successful',
                    'Biometric payment protection activated.'
                  );
                } else {
                  Alert.alert(
                    'Failed',
                    'Failed to read your biometric data. Please try again later.'
                  );
                }
              }
            }
          ],
          { cancelable: false }
        );
      }
    }, [])
  );

  return (
    modalVisible && (
      <View style={{ backgroundColor: '#f0f' }}>
        {/* {biometricPlugin.createBiometricCredential()} */}
      </View>
    )
    // <View style={{flex: 1}}>
    //   <Modal isVisible={modalVisible}>
    //     <View style={{backgroundColor: '#f0f', borderRadius: 20, padding: 20}}>
    //       <Text>Enable Biometric</Text>
    //       {/* {biometricPlugin.createBiometricCredential()} */}
    //     </View>
    //   </Modal>
    // </View>
  );
};

export default EnrollBiometric;

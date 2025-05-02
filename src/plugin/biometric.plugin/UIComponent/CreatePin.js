import React, { useCallback, useState, useContext } from "react";
import Modal from "react-native-modal";
import {
  View,
  Text,
  Platform,
  Dimensions,
  TouchableWithoutFeedback,
  Alert
} from "react-native";
import { useSafeArea } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Input, Button } from "react-native-elements";
import { ActivityIndicator } from "@ant-design/react-native";
import { Keyboard } from "react-native";
import { context } from "../../../../App";
import RNSecureStorage, { ACCESSIBLE } from "rn-secure-storage";
import { StatusBar } from "react-native";
import biometricPlugin from "../biometric.plugin";
import EnrollBiometric from "./EnrollBiometric";
import { TabRouter } from "react-navigation";
// import settingApi from '../../../tools/api/setting.api';

const CreatePin = props => {
  const insets = useSafeArea();
  const [newOtp, setNewOtp] = useState([]);
  const [confirmOtp, setConfirmOtp] = useState([]);
  const newOtpTextInput = [];
  const confirmOtpTextInput = [];
  const [animating, setAnimating] = useState(false);
  const contextProvider = useContext(context);
  const [modalVisible, setModalVisible] = useState(false);
  const [biometricVisible, setBiometricVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      //   biometricPlugin.removePin();
      //   if (props.visible) {
      Alert.alert(
        "eWallet Account Approved",
        "Congratulations! Your eWallet account has been approved! You may set up your 6-digit PIN for your future transactions.",
        [{ text: "Set Up Now", onPress: () => setModalVisible(true) }],
        { cancelable: false }
      );
      //   }

      return () => {
        setNewOtp([]);
        setConfirmOtp([]);
      };
    }, [])
  );

  const onSubmit = async () => {
    setAnimating(true);
    if (!comparePIN(newOtp, confirmOtp)) {
      setAnimating(false);
      Alert.alert("PINs Not Match", "Both PINs must be the same", [
        {
          text: "Ok",
          onPress: () => {
            var otps = [...confirmOtp];
            otps = [];
            setConfirmOtp(otps);
          }
        }
      ]);
    } else {
      const pin = await RNSecureStorage.set("pin", JSON.stringify(newOtp), {
        accessible: ACCESSIBLE.WHEN_UNLOCKED
      });
      console.log(pin);
      const res = await biometricPlugin.generateKey();
      console.log(res);
      if (res.status === "ok") {
        console.log(res);

        // const enrollRsaPublic = await settingApi.enrollPublicKey(res.data);
        // console.log(enrollRsaPublic);

        setAnimating(false);
        // setModalVisible(false);
        const biometric = await biometricPlugin.checkBiometric();
        console.log(biometric);

        if (biometric.status === "ok") {
          setModalVisible(false);
          setBiometricVisible(true);
        } else if (biometric.status === "error") {
          // const biometricEnable =
          await RNSecureStorage.set("biometricEnable", "No", {
            accessible: ACCESSIBLE.WHEN_UNLOCKED
          });
          contextProvider.setBiometricEnable("No");
          Alert.alert(
            biometric.message,
            "Biometric is not supported on your device.",
            [
              {
                text: "Ok",
                onPress: () => {
                  setModalVisible(false);
                }
              }
            ]
          );
        } else if (biometric.status === "not enroll") {
          // const biometricEnable =
          await RNSecureStorage.set("biometricEnable", "No", {
            accessible: ACCESSIBLE.WHEN_UNLOCKED
          });
          contextProvider.setBiometricEnable("No");
          Alert.alert(
            "Failed to enable biometric payment",
            `${
              biometric.message
            } You may enable biometric payment at 'Account' page later.`,
            [
              {
                text: "Ok",
                onPress: () => {
                  setModalVisible(false);
                }
              }
            ],
            { cancelable: false }
          );
        }
      } else {
        setAnimating(false);
        alert(res.message);
      }
    }
  };

  const renderInputs = type => {
    const inputs = Array(6).fill(0);
    const txt = inputs.map((i, j) => (
      <View key={j}>
        <Input
          inputStyle={{
            textAlign: "center",
            fontSize: Dimensions.get("window").width <= 320 ? 12 : 14
          }}
          inputContainerStyle={{
            borderWidth: 1,
            borderRadius: 10,
            width: Dimensions.get("window").width <= 320 ? 38 : 46
          }}
          containerStyle={{ paddingHorizontal: 0 }}
          keyboardType="numeric"
          onChangeText={value => focusNext(j, value, type)}
          onKeyPress={e => focusPrevious(e.nativeEvent.key, j, type)}
          ref={ref =>
            type === "new"
              ? (newOtpTextInput[j] = ref)
              : (confirmOtpTextInput[j] = ref)
          }
          secureTextEntry={true}
          value={
            type === "new" ? newOtp[j] : type === "confirm" && confirmOtp[j]
          }
          maxLength={1}
        />
      </View>
    ));

    return txt;
  };

  const focusPrevious = (key, index, type) => {
    if (key === "Backspace" && index !== 0) {
      if (type === "new") {
        newOtpTextInput[index - 1].focus();
      } else if (type === "confirm") {
        confirmOtpTextInput[index - 1].focus();
      }
    }
  };

  const focusNext = (index, value, type) => {
    if (type === "new") {
      if (index < newOtpTextInput.length - 1 && value) {
        newOtpTextInput[index + 1].focus();
      }
      if (index === newOtpTextInput.length - 1) {
        confirmOtpTextInput[0].focus();
      }
    } else if (type === "confirm") {
      if (index < confirmOtpTextInput.length - 1 && value) {
        confirmOtpTextInput[index + 1].focus();
      }
      if (index === confirmOtpTextInput.length - 1) {
        confirmOtpTextInput[index].blur();
      }
    }

    if (type === "new") {
      const otps = [...newOtp];
      otps[index] = value;
      setNewOtp(otps);
    } else if (type === "confirm") {
      const otps = [...confirmOtp];
      otps[index] = value;
      setConfirmOtp(otps);
    }
  };

  const comparePIN = (a, b) => {
    return (
      Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index])
    );
  };

  const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );

  const createPinModal = (
    <View style={{ flex: 1 }}>
      <Modal
        isVisible={modalVisible}
        style={{
          margin: 0,
          justifyContent: "flex-end"
          //   marginTop: Platform.OS === 'ios' ? insets.top : null,
        }}
        avoidKeyboard={true}
        onModalShow={() =>
          setTimeout(() => {
            newOtpTextInput[0].focus();
          }, 100)
        }
        onModalHide={() => {
          if (biometricVisible) {
            contextProvider.setBiometricVisible();
            contextProvider.check6DigitPin();
          }
        }}
      >
        {/* <DismissKeyboard> */}
        <View
          style={{
            backgroundColor: "#fff",
            // flex: 1,
            // height:
            //   Dimensions.get('window').height -
            //   (Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight),
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            // marginTop: Platform.OS === 'ios' ? insets.top : null,
            // alignItems: 'center',
            // padding: Dimensions.get('window').width <= 320 ? 12 : 20,
            padding: 20
          }}
        >
          <View>
            <Text
              style={{
                color: "#58585a",
                fontSize: Dimensions.get("window").width <= 320 ? 16 : 20,
                fontWeight: "bold"
              }}
            >
              Create 6-digit PIN
            </Text>
            <Text
              style={{
                color: "#6d6e70",
                fontSize: Dimensions.get("window").width <= 320 ? 10 : 14
              }}
            >
              This 6-digit PIN will be asked when you transact.
            </Text>
          </View>
          <View
            style={{
              paddingTop: 28,
              paddingBottom: 8
            }}
          >
            <Text style={{ fontWeight: "bold", color: "#58585a" }}>
              Set your PIN
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            {renderInputs("new")}
          </View>
          <View
            style={{
              paddingTop: 24,
              paddingBottom: 8
            }}
          >
            <Text style={{ fontWeight: "bold", color: "#58585a" }}>
              Confirm your PIN
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            {renderInputs("confirm")}
          </View>
          <Button
            title="Submit"
            containerStyle={{
              paddingTop: 32,
              paddingLeft: 10,
              paddingRight: 10
            }}
            buttonStyle={{
              borderRadius: 20,
              backgroundColor: "#FDCA2B"
            }}
            titleStyle={{
              color: "#947816",
              fontWeight: "bold",
              fontSize: Dimensions.get("window").width <= 320 ? 12 : 16
            }}
            //   onPress={() => {
            //     alert('Verify 6-digit PIN!');
            //     navigation.navigate('New Pin');
            //   }}
            // onPress={loadingToast}
            onPress={() => {
              //   setAnimating(true);

              onSubmit();
              // setAnimating(false);
              //   }, 1000);
            }}
            disabled={
              newOtp.length === 6 && confirmOtp.length === 6 ? false : true
            }
          />
        </View>
        {/* </DismissKeyboard> */}
        <ActivityIndicator
          toast
          animating={animating}
          size="large"
          text="Loading..."
        />
      </Modal>
    </View>
  );

  return <>{createPinModal}</>;
};

export default CreatePin;

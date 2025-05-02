import React, { Component, useEffect } from "react";
import FingerprintScanner from "react-native-fingerprint-scanner";
import { Platform, View, Alert } from "react-native";
import RNSimpleCrypto from "react-native-simple-crypto";
import DeviceInfo from "../deviceInfo.plugin/deviceInfo.plugin";
import RNSecureStorage, { ACCESSIBLE } from "rn-secure-storage";
import I18n from "../../locales";
// import { KJUR } from 'jsrsasign';
// import base64 from 'react-native-base64';
import moment from "moment";
export default {
  checkBiometric: async () => {
    var biometric = "";
    try {
      biometric = await FingerprintScanner.isSensorAvailable();

      switch (biometric) {
        case "Face ID":
          return {
            status: "ok",
            data: { type: I18n.t("biometricPlugin.Label.faceId") }
          };

        case "Touch ID":
          return {
            status: "ok",
            data: { type: I18n.t("biometricPlugin.Label.touchId") }
          };

        case "Biometrics":
          return {
            status: "ok",
            data: { type: I18n.t("biometricPlugin.Label.biometric") }
          };

        default:
          return {
            status: "error",
            data: { type: biometric },
            message: I18n.t("biometricPlugin.errorMessage.notSupport")
          };
      }
    } catch (error) {
      console.log(error, error.message);
      return {
        status: "error",
        data: { type: biometric },
        message: error.message
      };
    }
  },

  createBiometricCredential: async screen => {
    var biometryType = "";
    try {
      FingerprintScanner.release();
      biometryType = await FingerprintScanner.isSensorAvailable();
      console.log(biometryType);
      var result;
      switch (biometryType) {
        case "Face ID":
          result = await FingerprintScanner.authenticate({
            description: I18n.t("biometricPlugin.Description.faceTouchId")
          });

          break;

        case "Touch ID":
          result = await FingerprintScanner.authenticate({
            description: I18n.t("biometricPlugin.Description.faceTouchId")
          });
          break;

        case "Biometrics":
          result = await FingerprintScanner.authenticate({
            title:
              screen === "transfer"
                ? I18n.t("biometricPlugin.Description.biometricTransfer")
                : I18n.t("biometricPlugin.Description.biometricLogin")
          });
          break;

        default:
          console.log("Biometric auth not support, Password Login");
          break;
      }
      console.log("bio plugin", result);

      // FingerprintScanner.release();
      if (result) {
        return {
          status: "ok",
          message: I18n.t("biometricPlugin.successMessage.enabled")
        };
      } else {
        return {
          status: "error",
          message: I18n.t("biometricPlugin.errorMessage.enrollFail")
        };
      }
    } catch (error) {
      console.log(error.message);
      // Alert.alert(
      //   'Failed',
      //   'Failed to read your biometric data. Please try again later.'
      // );
      // FingerprintScanner.release();
      biometryType = "";
      return { status: "error", message: error.message };
      // Promp password
    }
  },

  removePin: async () => {
    try {
      await RNSecureStorage.remove("pin");
    } catch (error) {
      console.log(error);
    }
  }

  // generateKey: async () => {
  //   try {
  //     // Enroll Key
  //     // 1. Get 6 Digits Pin
  //     // 2. Enable Biometric
  //     // 3. Gen RSA Key pair
  //     // 4. Enroll Key pair in Database
  //     const rsaKeys = await RNSimpleCrypto.RSA.generateKeys(4096);
  //     console.log(rsaKeys.private);
  //     console.log(rsaKeys.public);
  //     await RNSecureStorage.set('rsa_public', rsaKeys.public, {
  //       accessible: ACCESSIBLE.WHEN_UNLOCKED
  //     });

  //     await RNSecureStorage.set('rsa_private', rsaKeys.private, {
  //       accessible: ACCESSIBLE.WHEN_UNLOCKED
  //     });

  //     const deviceInfo = await DeviceInfo.getDeviceInfo();
  //     console.log(deviceInfo);

  //     // Enroll key to server
  //     // 1. public key (Base64)
  //     // 2. device info
  //     return {
  //       status: 'ok',
  //       data: { ...deviceInfo, rsa_public_key: base64.encode(rsaKeys.public) }
  //     };
  //   } catch (error) {
  //     console.log(error);
  //     return {
  //       status: 'error',
  //       message: error
  //     };
  //   }
  // },

  // signTransaction: async (data = Object) => {
  //   try {
  //     const rsa_private = await RNSecureStorage.get('rsa_private');
  //     // const rsa_public = await RNSecureStorage.get('rsa_public');
  //     const deviceInfo = await DeviceInfo.getDeviceInfo();
  //     const token = await KJUR.jws.JWS.sign(
  //       'RS384',
  //       // header
  //       { alg: 'RS384', typ: 'token' },
  //       // Content
  //       {
  //         iss: 'KEMM-user',
  //         ...data,
  //         ...deviceInfo,
  //         iat: Math.floor(Date.now() / 1000),
  //         maxAge: 300000
  //       },
  //       rsa_private
  //     );
  //     console.log(token);
  //     // console.log(rsa_public);
  //     // Backend only accept base64 rsaKey
  //     // console.log(base64.encode(rsa_public));

  //     return {
  //       status: 'ok',
  //       data: token
  //     };
  //   } catch (error) {
  //     console.log(error);
  //     return {
  //       status: 'error',
  //       message: error
  //     };
  //   }
  // }
};

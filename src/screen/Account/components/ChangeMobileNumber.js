import {useFocusEffect} from '@react-navigation/core';
import {HeaderBackButton} from '@react-navigation/stack';
import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useContext,
} from 'react';
import {
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
  View,
  Platform,
  Text,
  Alert,
  Dimensions,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {Button, Input, Icon, ListItem} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import {PrimaryColor, windowHeight} from '../../../tools/Constant/Constant';
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';
import I18n from '../../../locales';
import AuthApi from '../../../tools/Api/auth.api';
import {ResponseError} from '../../../tools/ErrorHandler/ErrorHandler';
import {useForm} from 'react-hook-form';
import {context} from '../../../../App';
import {ActivityIndicator} from '@ant-design/react-native';
import Modal from 'react-native-modal';
import CountryPicker from 'react-native-country-picker-modal';
import analytics from '@react-native-firebase/analytics';
import {firebaseAnalyticCustom} from '../../../tools/Constant/Constant';
import {VirtualKeyboard} from 'react-native-screen-keyboard';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import {wait} from '../../../tools/Misc/mics';
import RNPermission from '../../../plugin/permission.plugin/permission.plugin';

const ChangeMobileNumber = ({navigation, route}) => {
  const contextProvider = useContext(context);
  const {register, setValue: setValues, handleSubmit, errors} = useForm();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const [oldNumber, setOldNumber] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(true);

  const [page, setPage] = useState(1);
  const [radioValue, setRadioValue] = useState(true);
  const radio_props = [
    {label: 'Identity Card', value: true},
    {label: 'Passport', value: false},
  ];

  const [value, setValue] = useState('');
  const CELL_COUNT = 6;
  const [buttonMargin, setButtonMargin] = useState(
    Dimensions.get('window').height * 0.08,
  );
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const [countryCode, setCountryCode] = useState('MY');
  const [countryNumber, setCountryNumber] = useState('60');
  const [checkExistContact, setCheckExistContact] = useState(false);

  const [otpCountDown, setOtpCountDown] = useState(60);
  const [otpLoading, setOtpLoading] = useState(false);

  const [imagePickerModalVisible, setImagePickerModalVisible] = useState(false);
  const [imageType, setImageType] = useState('');
  const [icFrontPhoto, setIcFrontPhoto] = useState();
  const [icBackPhoto, setIcBackPhoto] = useState();
  const [passportPhoto, setPassportPhoto] = useState();
  const [selfiePhoto, setSelfiePhoto] = useState();

  const [virtualKeyboardVisible, setVirtualKeyboardVisible] = useState(false);

  useEffect(() => {
    console.log(contextProvider);
    console.log(errors);

    ChangeContactPermission();

    setOldNumber(
      contextProvider.contextProvider.my_profile.contact.countryCode +
        contextProvider.contextProvider.my_profile.contact.number,
    );

    const keyboardShow = Keyboard.addListener('keyboardDidShow', () => {
      setButtonVisible(false);
    });
    const keyboardHide = Keyboard.addListener('keyboardDidHide', () => {
      setButtonVisible(true);
    });

    return () => {
      keyboardShow.remove();
      keyboardHide.remove();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      register('oldnumber', {
        // min: 9,
        // required: "Old Number is required",
      });

      register('newNumber', {
        // min: 9,
        required: I18n.t('Account.ChangeMobileNumber.newNumberRequired'),
        validate: CheckChangeContactExist,
      });

      if (radioValue) {
        register('icFrontPhoto', {
          required: 'IC Front Photo is required',
        });

        register('icBackPhoto', {
          required: 'IC Back Photo is required',
        });
      } else {
        register('passportPhoto', {
          required: 'Passport Photo is required',
        });
      }

      register('selfiePhoto', {
        required: 'Selfie Photo is required',
      });

      const keyboardShow = Keyboard.addListener('keyboardDidShow', () => {
        setButtonVisible(false);
      });
      const keyboardHide = Keyboard.addListener('keyboardDidHide', () => {
        setButtonVisible(true);
      });

      return () => {
        keyboardShow.remove();
        keyboardHide.remove();
      };
    }, [register]),
  );

  const ChangeContactPermission = async () => {
    try {
      setLoading(true);

      const res = await AuthApi.changeContactPermission();
      console.log('res', res);

      if (res.status >= 200 || res.status < 300) {
        setLoading(false);

        if (res.data?.submission?.status === 'new') {
          Alert.alert(
            null,
            'Your new number has been submitted and pending for approval.',
            [
              {
                text: 'Ok',
                onPress: () => {
                  navigation.goBack();
                },
              },
            ],
          );
        } else if (res.data?.submission?.status === 'rejected') {
          Alert.alert(
            'Your new number has been rejected.',
            'Rejected Reason : ' + res.data?.submission?.rejectedReason,
            [
              {
                text: 'Ok',
                // onPress: () => {
                //   navigation.goBack();
                // },
              },
            ],
          );
        }
      } else {
        setLoading(false);
        ResponseError(res);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const CheckChangeContactExist = async value => {
    // setLoading(true);

    const res = await AuthApi.checkChangeContactExist(value);
    console.log('check contact', res);

    if (res.status >= 200 || res.status < 300) {
      // setLoading(false);

      setCheckExistContact(res.data.exists);
    } else {
      // setLoading(false);
      ResponseError(res);
    }
  };

  const ResendOtp = async () => {
    setOtpModalVisible(true);
    setOtpLoading(true);

    // var countdown = otpCountDown;
    // var countDownInterval = setInterval(() => {
    //   countdown -= 1;
    //   setOtpCountDown(countdown);

    //   if (countdown === -1) {
    //     clearInterval(countDownInterval);
    //     setOtpLoading(false);
    //     setOtpCountDown(60);
    //   }
    // }, 1000);

    const res = await AuthApi.requestChangeContactOtp({
      contact: {
        countryCode: '+60',
        number: newNumber,
      },
    });

    console.log(res);

    if (res.status >= 200 || res.status < 300) {
      var countdown = otpCountDown;
      var countDownInterval = setInterval(() => {
        countdown -= 1;
        setOtpCountDown(countdown);

        if (countdown === -1) {
          clearInterval(countDownInterval);
          setOtpLoading(false);
          setOtpCountDown(60);
        }
      }, 1000);
    } else {
      setOtpModalVisible(false);
      setOtpLoading(false);

      ResponseError(res);
    }
  };

  const handleChangeMobile = async values => {
    try {
      console.log(values);

      if (radioValue) {
        delete values.passportPhoto;
      } else {
        delete values.icFrontPhoto;
        delete values.icBackPhoto;
      }

      delete values.oldnumber;
      delete values.newNumber;

      // return;

      setLoading(true);
      const formData = new FormData();

      for (const data in values) {
        console.log(data);

        switch (data) {
          case 'icFrontPhoto':
            formData.append('icFrontPhoto', {
              uri: icFrontPhoto.assets
                ? icFrontPhoto.assets[0].uri
                : icFrontPhoto.url,
              name: icFrontPhoto.assets
                ? icFrontPhoto.assets[0].fileName
                : icFrontPhoto.name,
              type: icFrontPhoto.assets
                ? icFrontPhoto.assets[0].type
                : icFrontPhoto.mimeType,
            });
            break;

          case 'icBackPhoto':
            formData.append('icBackPhoto', {
              uri: icBackPhoto.assets
                ? icBackPhoto.assets[0].uri
                : icBackPhoto.url,
              name: icBackPhoto.assets
                ? icBackPhoto.assets[0].fileName
                : icBackPhoto.name,
              type: icBackPhoto.assets
                ? icBackPhoto.assets[0].type
                : icBackPhoto.mimeType,
            });
            break;

          case 'passportPhoto':
            formData.append('passportPhoto', {
              uri: passportPhoto.assets
                ? passportPhoto.assets[0].uri
                : passportPhoto.url,
              name: passportPhoto.assets
                ? passportPhoto.assets[0].fileName
                : passportPhoto.name,
              type: passportPhoto.assets
                ? passportPhoto.assets[0].type
                : passportPhoto.mimeType,
            });
            break;

          case 'selfiePhoto':
            formData.append('selfiePhoto', {
              uri: selfiePhoto.assets
                ? selfiePhoto.assets[0].uri
                : selfiePhoto.url,
              name: selfiePhoto.assets
                ? selfiePhoto.assets[0].fileName
                : selfiePhoto.name,
              type: selfiePhoto.assets
                ? selfiePhoto.assets[0].type
                : selfiePhoto.mimeType,
            });
            break;

          default:
            formData.append(data, values[data]);
            break;
        }
      }

      formData.append('countryCode', '+60');

      formData.append('contactNumber', newNumber);

      formData.append('otp', value);

      const res = await AuthApi.submitChangeContact(formData);
      console.log(res);
      if (res.status >= 200 || res.status < 300) {
        setLoading(false);

        Alert.alert(
          null,
          'Successful Submission of New Number, Pending For Approval.',
          [
            {
              text: 'Ok',
              onPress: () => {
                navigation.goBack();
              },
            },
          ],
        );
      } else {
        setLoading(false);
        Alert.alert(null, res.response.data);
      }
    } catch (error) {
      console.log('handle error', error);
    }
  };

  const handleOpenCamera = async type => {
    try {
      setImagePickerModalVisible(false);
      if (Platform.OS === 'ios') {
        await wait(0.5);
      }

      const reqCamera = await RNPermission.requestCameraPermission();

      if (reqCamera !== 'granted') {
        alert('Fail to open camera, permission denied');
        return;
      }

      launchCamera(
        {
          mediaType: 'photo',
          storageOptions: {skipBackup: true, path: 'UCSI'},
        },
        response => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log(`ImagePicker Error: ${response.error}`);
          } else if (response.customButton) {
            console.log(`User tapped custom button: ${response.customButton}`);
          } else {
            const source = response;
            console.log('launch camera ', response);

            if (type === 'icFront') {
              setIcFrontPhoto(source);

              setValues('icFrontPhoto', source, {
                shouldValidate: true,
                shouldDirty: true,
              });
            } else if (type === 'icBack') {
              setIcBackPhoto(source);

              setValues('icBackPhoto', source, {
                shouldValidate: true,
                shouldDirty: true,
              });
            } else if (type === 'passport') {
              setPassportPhoto(source);

              setValues('passportPhoto', source, {
                shouldValidate: true,
                shouldDirty: true,
              });
            } else if (type === 'selfie') {
              setSelfiePhoto(source);

              setValues('selfiePhoto', source, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }
          }
        },
      );
    } catch (error) {
      console.log('camera error', error);
    }
  };

  const handlePickImage = async type => {
    setImagePickerModalVisible(false);
    console.log('type', type);

    if (Platform.OS === 'ios') {
      await wait(0.5);
    }
    launchImageLibrary(
      {
        mediaType: 'photo',
        storageOptions: {skipBackup: true, path: 'UCSI'},
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log(`ImagePicker Error: ${response.error}`);
        } else if (response.customButton) {
          console.log(`User tapped custom button: ${response.customButton}`);
        } else {
          const source = response;
          console.log('select photo', response);

          if (type === 'icFront') {
            setIcFrontPhoto(source);

            setValues('icFrontPhoto', source, {
              shouldValidate: true,
              shouldDirty: true,
            });

            // if (Platform.OS === 'android') {
            //   const fileName = response.fileName
            //     ? response.fileName
            //     : response.path.substring(
            //         response.path.lastIndexOf('/') + 1,
            //         response.path.length,
            //       );

            //   setIcFrontFileList({
            //     uri: response.uri,
            //     name: fileName,
            //     type: response.type,
            //   });
            // } else {
            //   const fileName = response.fileName
            //     ? response.fileName
            //     : response.uri.substring(
            //         response.uri.lastIndexOf('/') + 1,
            //         response.uri.length,
            //       );

            //   setIcFrontFileList({
            //     uri: response.uri,
            //     name: fileName,
            //     type: response.type,
            //   });
            // }
          } else if (type === 'icBack') {
            setIcBackPhoto(source);

            setValues('icBackPhoto', source, {
              shouldValidate: true,
              shouldDirty: true,
            });

            // if (Platform.OS === 'android') {
            //   const fileName = response.fileName
            //     ? response.fileName
            //     : response.path.substring(
            //         response.path.lastIndexOf('/') + 1,
            //         response.path.length,
            //       );

            //   setIcBackFileList({
            //     uri: response.uri,
            //     name: fileName,
            //     type: response.type,
            //   });
            // } else {
            //   const fileName = response.fileName
            //     ? response.fileName
            //     : response.uri.substring(
            //         response.uri.lastIndexOf('/') + 1,
            //         response.uri.length,
            //       );
            //   setIcBackFileList({
            //     uri: response.uri,
            //     name: fileName,
            //     type: response.type,
            //   });
            // }
          } else if (type === 'passport') {
            setPassportPhoto(source);

            setValues('passportPhoto', source, {
              shouldValidate: true,
              shouldDirty: true,
            });
          } else if (type === 'selfie') {
            setSelfiePhoto(source);

            setValues('selfiePhoto', source, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }
        }
      },
    );
  };

  const RadioButtonFunction = e => {
    setRadioValue(e);

    if (e) {
      register('passportPhoto', {
        required: false,
      });

      register('icFrontPhoto', {
        required: 'IC Front Photo is required',
      });

      register('icBackPhoto', {
        required: 'IC Back Photo is required',
      });
    } else {
      register('icFrontPhoto', {
        required: false,
      });

      register('icBackPhoto', {
        required: false,
      });

      register('passportPhoto', {
        required: 'Passport Photo is required',
      });
    }

    setTimeout(() => {
      setIcFrontPhoto(undefined);
      setValues('icFrontPhoto', undefined, {
        shouldDirty: true,
        shouldValidate: true,
      });

      setIcBackPhoto(undefined);
      setValues('icBackPhoto', undefined, {
        shouldDirty: true,
        shouldValidate: true,
      });

      setPassportPhoto(undefined);
      setValues('passportPhoto', undefined, {
        shouldDirty: true,
        shouldValidate: true,
      });

      // setSelfiePhoto(undefined);
      // setValues('selfiePhoto', undefined, {
      //   shouldDirty: true,
      //   shouldValidate: true,
      // });
    }, 100);
  };

  const ImagePickerModal = (
    <Modal
      isVisible={imagePickerModalVisible}
      onBackdropPress={() => setImagePickerModalVisible(false)}>
      <View
        style={{
          backgroundColor: '#fff',
          paddingHorizontal: 16,
          paddingBottom: 8,
        }}>
        <ListItem
          bottomDivider
          onPress={() => {
            handleOpenCamera(imageType);
          }}>
          <ListItem.Content>
            <ListItem.Title>Camera</ListItem.Title>
          </ListItem.Content>
        </ListItem>
        <ListItem
          onPress={() => {
            handlePickImage(imageType);
          }}>
          <ListItem.Content>
            <ListItem.Title>Select Photo</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </View>
    </Modal>
  );

  const OtpModal = (
    <Modal
      isVisible={otpModalVisible}
      // onBackdropPress={() => {
      //   setOtpModalVisible(false);
      //   setValue();
      // }}
    >
      <View
        style={{
          backgroundColor: '#fff',
          paddingHorizontal: 12,
          paddingTop: 16,
          paddingBottom: 24,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            paddingBottom: 12,
            marginBottom: 24,
            borderBottomColor: 'rgba(0,0,0,0.35)',
          }}>
          <Text style={{fontSize: 16}}>
            {I18n.t('Account.ChangeMobileNumber.verifyMobile')}
          </Text>

          <Icon
            name="close"
            type="antdesign"
            color="rgba(0,0,0,0.65)"
            size={20}
            onPress={() => {
              setOtpModalVisible(false);
              setValue();
            }}
          />
        </View>

        <View style={{alignItems: 'center'}}>
          <Text style={{marginBottom: 16, textAlign: 'center'}}>
            {I18n.t('Account.ChangeMobileNumber.verifyDescription')}
          </Text>

          <Text>{I18n.t('Account.ChangeMobileNumber.existNumber')}</Text>
          <Text
            style={{
              backgroundColor: 'rgba(0,0,0,0.15)',
              padding: 12,
              borderRadius: 5,
              fontWeight: 'bold',
              fontSize: 18,
              marginBottom: 16,
            }}>
            {oldNumber}
          </Text>

          <Text>{I18n.t('Account.ChangeMobileNumber.newNumber')}</Text>
          <Text
            style={{
              backgroundColor: 'rgba(0,0,0,0.15)',
              padding: 12,
              borderRadius: 5,
              fontWeight: 'bold',
              fontSize: 18,
              marginBottom: 24,
            }}>
            +60{newNumber}
          </Text>
        </View>

        {/* <Button
          disabled={otpLoading}
          title={
            otpLoading
              ? 'Request OTP here in' + ' ' + otpCountDown + 's'
              : 'Resend OTP'
          }
          containerStyle={{width: '100%', marginBottom: 24}}
          titleStyle={{paddingVertical: 8}}
          buttonStyle={{
            borderRadius: 10,
            backgroundColor: PrimaryColor,
          }}
          onPress={() => ResendOtp()}
          // onPress={handleSubmit(handleSuccess)}
        /> */}

        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          keyboardType="phone-pad"
          textContentType="oneTimeCode"
          onFocus={() => setButtonMargin(0)}
          onBlur={() => setButtonMargin(Dimensions.get('window').height * 0.08)}
          renderCell={({index, symbol, isFocused}) => (
            <Text
              key={index}
              style={{
                width: Dimensions.get('window').width <= 320 ? 38 : 46,
                height: 45,
                lineHeight: 45,
                fontSize: Dimensions.get('window').width <= 320 ? 14 : 16,
                borderWidth: isFocused ? 1 : 0,
                borderRadius: 10,
                borderColor: isFocused ? '#edf3f4' : 'transparent',
                textAlign: 'center',
                backgroundColor: isFocused ? '#fff' : '#edf3f4',
                overflow: 'hidden',
                color: isFocused ? PrimaryColor : '#000',
              }}
              onLayout={getCellOnLayoutHandler(index)}>
              {symbol || (isFocused ? <Cursor cursorSymbol="" /> : null)}
            </Text>
          )}
        />

        <View style={{alignItems: 'center', marginTop: 32}}>
          <Button
            loading={loading}
            title={I18n.t('Account.ChangeMobileNumber.submitOTP')}
            containerStyle={{width: '100%'}}
            titleStyle={{paddingVertical: 8}}
            buttonStyle={{
              borderRadius: 10,
              backgroundColor: PrimaryColor,
            }}
            onPress={handleSubmit(handleChangeMobile)}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
      <StatusBar
        barStyle={Platform.select({
          ios: 'dark-content',
          android: 'light-content',
        })}
      />
      <View style={{paddingHorizontal: 16, paddingVertical: 24, flex: 1}}>
        <View style={{marginBottom: 24}}>
          <Text style={{fontWeight: 'bold', fontSize: 16}}>
            {I18n.t('Account.ChangeMobileNumber.existNumber')}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                backgroundColor: '#edf3f4',
                borderRadius: 5,
                height: 50,
                paddingHorizontal: 8,
                flex: 1,
              }}>
              <Input
                // placeholderTextColor="grey"
                disabled
                // maxLength={11}
                // placeholder="Your phone exist number"
                keyboardType="phone-pad"
                inputStyle={{
                  color: 'rgba(0,0,0,.85)',
                  fontSize: 16,
                  paddingTop: Platform.OS === 'ios' ? 10 : 0,
                  marginTop: Platform.OS === 'android' ? 10 : 0,
                }}
                renderErrorMessage={false}
                inputContainerStyle={{
                  borderBottomColor: 'transparent',
                }}
                //   ref={contactInput}
                value={oldNumber}
                onChangeText={e => {
                  setOldNumber(e.replace(/[- #*;,.<>()+N\{\}\[\]\\\/]/gi, ''));
                  setValues(
                    'oldnumber',
                    e.replace(/[- #*;,.<>()+N\{\}\[\]\\\/]/gi, ''),
                    {
                      shouldDirty: true,
                      shouldValidate: true,
                    },
                  );
                }}
                //   onSubmitEditing={handleSubmit(handleLogin)}
                // onFocus={() => setButtonMargin(0)}
                // onBlur={() =>
                //   setButtonMargin(
                //     Dimensions.get("window").height * 0.08
                //   )
                // }
              />
            </View>
          </View>
          {/* {oldNumber.length < 10 && (
            <Text
              style={{
                color: "#f00",
                fontSize: 12,
                textAlign: "left",
              }}
            >
              Exist Number is required
            </Text>
          )} */}
        </View>

        <View style={{marginBottom: 24}}>
          <Text style={{fontWeight: 'bold', fontSize: 16}}>
            {I18n.t('Account.ChangeMobileNumber.newNumber')}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                backgroundColor: '#edf3f4',
                borderRadius: 5,
                height: 50,
                paddingHorizontal: 12,
                paddingTop: 12,
                marginRight: 10,
                // borderColor: "rgba(0,0,0,0.35)",
                // borderWidth: 1,
                flexDirection: 'row',
              }}>
              <CountryPicker
                withFlag
                withEmoji
                withCallingCode
                withAlphaFilter
                countryCode={countryCode}
                onSelect={e => {
                  console.log(e);
                  setCountryCode(e.cca2);
                  setCountryNumber(e.callingCode[0]);
                }}
              />
              <Text
                style={{
                  color: 'rgba(0,0,0,.85)',
                  fontSize: 16,
                  paddingTop: 3,
                }}>
                +{countryNumber}
              </Text>
              {/* <Text style={{ color: "rgba(0,0,0,.85)", fontSize: 16 }}>
                MY +60
              </Text> */}
            </View>

            <View
              style={{
                backgroundColor: '#edf3f4',
                borderRadius: 5,
                height: 50,
                paddingHorizontal: 8,
                flex: 1,
              }}>
              <Input
                // placeholderTextColor="grey"
                maxLength={11}
                placeholder={I18n.t('Account.ChangeMobileNumber.newNumber')}
                keyboardType="phone-pad"
                inputStyle={{
                  color: 'rgba(0,0,0,.85)',
                  fontSize: 16,
                  paddingTop: Platform.OS === 'ios' ? 10 : 0,
                  marginTop: Platform.OS === 'android' ? 10 : 0,
                }}
                // renderErrorMessage={true}
                errorMessage={
                  newNumber.length < 9
                    ? 'New Number is Required'
                    : checkExistContact
                    ? 'Number Exist'
                    : null
                }
                errorStyle={{
                  marginTop: 12,
                  marginLeft: -0,
                }}
                inputContainerStyle={{
                  borderBottomColor: 'transparent',
                }}
                ///// Virtual Keyboard Control //////
                // onFocus={() => setVirtualKeyboardVisible(true)}
                // onBlur={() => setVirtualKeyboardVisible(false)}
                // showSoftInputOnFocus={false}
                // editable={false}
                ///// Virtual Keyboard Control *//////

                focus
                //   ref={contactInput}
                value={newNumber}
                onChangeText={e => {
                  setNewNumber(e.replace(/[- #*;,.<>()+N\{\}\[\]\\\/]/gi, ''));
                  setValues(
                    'newNumber',
                    e.replace(/[- #*;,.<>()+N\{\}\[\]\\\/]/gi, ''),
                    {
                      shouldDirty: true,
                      shouldValidate: true,
                    },
                  );
                }}
                //   onSubmitEditing={handleSubmit(handleLogin)}
                // onFocus={() => setButtonMargin(0)}
                // onBlur={() =>
                //   setButtonMargin(
                //     Dimensions.get("window").height * 0.08
                //   )
                // }
              />
            </View>
          </View>
          {/* {newNumber.length < 9 && !checkExistContact ? (
            <Text
              style={{
                color: '#f00',
                fontSize: 12,
                textAlign: 'left',
                padding: 4,
              }}>
              {I18n.t('Account.ChangeMobileNumber.newNumberRequired')}
            </Text>
          ) : newNumber.length < 9 && checkExistContact ? (
            <Text
              style={{
                color: '#f00',
                fontSize: 12,
                textAlign: 'left',
                padding: 4,
              }}>
              Contact Number Exist
            </Text>
          ) : null} */}
        </View>

        <View style={{marginBottom: 16, marginTop: 16}}>
          <RadioForm
            initial={radioValue}
            formHorizontal={true}
            animation={true}>
            {/* To create radio buttons, loop through your array of options */}
            {radio_props.map((obj, i) => (
              <RadioButton labelHorizontal={true} key={i}>
                {/*  You can set RadioButtonLabel before RadioButtonInput */}
                <RadioButtonInput
                  obj={obj}
                  index={i}
                  isSelected={radioValue === obj.value}
                  onPress={e => {
                    RadioButtonFunction(e);
                  }}
                  borderWidth={1}
                  buttonInnerColor={PrimaryColor}
                  buttonOuterColor={PrimaryColor}
                  buttonSize={15}
                  buttonOuterSize={25}
                  buttonStyle={{}}
                  buttonWrapStyle={{marginLeft: 16}}
                />
                <RadioButtonLabel
                  obj={obj}
                  index={i}
                  labelHorizontal={true}
                  onPress={e => console.log(e)}
                  labelStyle={{fontSize: 16, color: PrimaryColor}}
                  labelWrapStyle={{}}
                />
              </RadioButton>
            ))}
          </RadioForm>
        </View>

        {radioValue ? (
          <View>
            <View style={{paddingHorizontal: 8}}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 16,
                  color: '#86939e',
                  marginBottom: 16,
                }}>
                IC Front Photo
              </Text>

              {icFrontPhoto ? (
                <TouchableWithoutFeedback
                  onPress={() => {
                    Alert.alert(null, 'Confirm delete IC Front Photo?', [
                      {
                        text: 'Cancel',
                        //   onPress: () => console.log('Cancel Pressed'),
                      },
                      {
                        text: 'OK',
                        onPress: () => {
                          setIcFrontPhoto();

                          setValues('icFrontPhoto', null, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        },
                      },
                    ]);
                  }}>
                  <Image
                    source={{
                      uri: icFrontPhoto?.assets
                        ? icFrontPhoto?.assets[0]?.uri
                        : icFrontPhoto.url,
                    }}
                    style={{
                      height: 120,
                      width: 120,
                    }}
                    resizeMode="contain"
                    // resizeMethod="scale"
                  />
                </TouchableWithoutFeedback>
              ) : (
                <TouchableWithoutFeedback
                  onPress={() => {
                    setImagePickerModalVisible(true);
                    setImageType('icFront');
                  }}>
                  <View
                    style={{
                      borderWidth: 1,
                      borderStyle: 'dashed',
                      width: 120,
                      height: 120,

                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Icon
                      name="plus"
                      type="antdesign"
                      style={{marginBottom: 5}}
                    />

                    <Text>Upload</Text>
                  </View>
                </TouchableWithoutFeedback>
              )}

              <View style={{margin: 5}}>
                <Text style={{color: '#f00', fontSize: 12}}>
                  {errors.icFrontPhoto ? errors.icFrontPhoto.message : ''}
                </Text>
              </View>
            </View>

            <View style={{paddingHorizontal: 8}}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 16,
                  color: '#86939e',
                  marginBottom: 16,
                }}>
                IC Back Photo
              </Text>

              {icBackPhoto ? (
                <TouchableWithoutFeedback
                  onPress={() => {
                    Alert.alert(null, 'Confirm delete IC Back Photo?', [
                      {
                        text: 'Cancel',
                        //   onPress: () => console.log('Cancel Pressed'),
                      },
                      {
                        text: 'OK',
                        onPress: () => {
                          setIcBackPhoto();

                          setValues('icBackPhoto', null, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        },
                      },
                    ]);
                  }}>
                  <Image
                    source={{
                      uri: icBackPhoto?.assets
                        ? icBackPhoto?.assets[0]?.uri
                        : icBackPhoto.url,
                    }}
                    style={{
                      height: 120,
                      width: 120,
                    }}
                    resizeMode="contain"
                    // resizeMethod="scale"
                  />
                </TouchableWithoutFeedback>
              ) : (
                <TouchableWithoutFeedback
                  onPress={() => {
                    setImagePickerModalVisible(true);
                    setImageType('icBack');
                  }}>
                  <View
                    style={{
                      borderWidth: 1,
                      borderStyle: 'dashed',
                      width: 120,
                      height: 120,

                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Icon
                      name="plus"
                      type="antdesign"
                      style={{marginBottom: 5}}
                    />

                    <Text>Upload</Text>
                  </View>
                </TouchableWithoutFeedback>
              )}

              <View style={{margin: 5}}>
                <Text style={{color: '#f00', fontSize: 12}}>
                  {errors.icBackPhoto ? errors.icBackPhoto.message : ''}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={{paddingHorizontal: 8}}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 16,
                color: '#86939e',
                marginBottom: 16,
              }}>
              Passport Photo
            </Text>

            {passportPhoto ? (
              <TouchableWithoutFeedback
                onPress={() => {
                  Alert.alert(null, 'Confirm delete Passport Photo?', [
                    {
                      text: 'Cancel',
                      //   onPress: () => console.log('Cancel Pressed'),
                    },
                    {
                      text: 'OK',
                      onPress: () => {
                        setPassportPhoto();

                        setValues('passportPhoto', null, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      },
                    },
                  ]);
                }}>
                <Image
                  source={{
                    uri: passportPhoto?.assets
                      ? passportPhoto?.assets[0]?.uri
                      : passportPhoto.url,
                  }}
                  style={{
                    height: 120,
                    width: 120,
                  }}
                  resizeMode="contain"
                  // resizeMethod="scale"
                />
              </TouchableWithoutFeedback>
            ) : (
              <TouchableWithoutFeedback
                onPress={() => {
                  setImagePickerModalVisible(true);
                  setImageType('passport');
                }}>
                <View
                  style={{
                    borderWidth: 1,
                    borderStyle: 'dashed',
                    width: 120,
                    height: 120,

                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon
                    name="plus"
                    type="antdesign"
                    style={{marginBottom: 5}}
                  />

                  <Text>Upload</Text>
                </View>
              </TouchableWithoutFeedback>
            )}

            <View style={{margin: 5}}>
              <Text style={{color: '#f00', fontSize: 12}}>
                {errors.passportPhoto ? errors.passportPhoto.message : ''}
              </Text>
            </View>
          </View>
        )}

        <View style={{paddingHorizontal: 8}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 16,
              color: '#86939e',
              marginBottom: 16,
            }}>
            Selfie Photo
          </Text>

          {selfiePhoto ? (
            <TouchableWithoutFeedback
              onPress={() => {
                Alert.alert(null, 'Confirm delete Selfie Photo?', [
                  {
                    text: 'Cancel',
                    //   onPress: () => console.log('Cancel Pressed'),
                  },
                  {
                    text: 'OK',
                    onPress: () => {
                      setSelfiePhoto();

                      setValues('selfiePhoto', null, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    },
                  },
                ]);
              }}>
              <Image
                source={{
                  uri: selfiePhoto?.assets
                    ? selfiePhoto?.assets[0]?.uri
                    : selfiePhoto.url,
                }}
                style={{
                  height: 120,
                  width: 120,
                }}
                resizeMode="contain"
                // resizeMethod="scale"
              />
            </TouchableWithoutFeedback>
          ) : (
            <TouchableWithoutFeedback
              onPress={() => {
                setImagePickerModalVisible(true);
                setImageType('selfie');
              }}>
              <View
                style={{
                  borderWidth: 1,
                  borderStyle: 'dashed',
                  width: 120,
                  height: 120,

                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon name="plus" type="antdesign" style={{marginBottom: 5}} />

                <Text>Upload</Text>
              </View>
            </TouchableWithoutFeedback>
          )}

          <View style={{margin: 5}}>
            <Text style={{color: '#f00', fontSize: 12}}>
              {errors.selfiePhoto ? errors.selfiePhoto.message : ''}
            </Text>
          </View>
        </View>

        <View
          style={{
            alignItems: 'center',
            marginTop: windowHeight * 0.02,
          }}>
          <Button
            disabled={checkExistContact || otpLoading}
            title={
              otpLoading
                ? 'Request OTP in' + ' ' + otpCountDown + 's'
                : 'Request OTP'
            }
            containerStyle={{width: '70%'}}
            titleStyle={{paddingVertical: 8}}
            buttonStyle={{
              borderRadius: 10,
              backgroundColor: PrimaryColor,
            }}
            // onPress={() => {
            // if (newNumber.length > 8) {
            //   ResendOtp();
            // }
            // }}
            onPress={handleSubmit(ResendOtp)}
          />
        </View>

        {/* {virtualKeyboardVisible && (
          <VirtualKeyboard
            onChange={(e) => setNewNumber(e)}
            keyboardStyle={{ borderColor: "rgba(0,0,0,0.15)", borderWidth: 1 }}
            keyStyle={{ borderColor: "rgba(0,0,0,0.15)", borderWidth: 1 }}
            onCustomKey={() => setNewNumber("")}
            keyboard={[
              [1, 2, 3],
              [4, 5, 6],
              [7, 8, 9],
              [
                <Icon
                  name="close"
                  type="antdesign"
                  color="rgba(0,0,0,0.65)"
                  size={24}
                  // onPress={() => setNewNumber(null)}
                />,
                0,

                <Icon
                  name="backspace-outline"
                  type="ionicon"
                  color="rgba(0,0,0,0.65)"
                  size={24}
                />,
              ],
            ]}
            keyboardCustomKeyImage={
              <Icon
                name="close"
                type="antdesign"
                color="rgba(0,0,0,0.65)"
                size={24}
              />
            }
            // onRef={(ref) => (keyboard = ref)}
            // keyDown={keyDown.bind(this)}
          />
        )} */}

        <ActivityIndicator
          toast
          size="large"
          animating={loading}
          text={I18n.t('Account.ChangeMobileNumber.loading')}
        />

        {ImagePickerModal}
        {OtpModal}
      </View>
    </ScrollView>
  );
};

export default ChangeMobileNumber;

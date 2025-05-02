import React, {useEffect, useState, useContext, useRef, use} from 'react';
import {
  View,
  Image,
  Dimensions,
  StatusBar,
  Text,
  Platform,
  Linking,
  ScrollView,
  ImageBackground,
  TouchableWithoutFeedback,
  StyleSheet,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import {ActivityIndicator} from '@ant-design/react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {context} from '../../../App';
import pushNotificationPlugin from '../../plugin/pushNotification.plugin/pushNotification.plugin';
import Modal from 'react-native-modal';
import {Button, Icon, Input, ListItem} from 'react-native-elements';
import {
  PrimaryColor,
  MalaysiaStateList,
  BankList,
} from '../../tools/Constant/Constant';
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';
import AuthApi from '../../tools/Api/auth.api';
import {ResponseError} from '../../tools/ErrorHandler/ErrorHandler';
import {useForm} from 'react-hook-form';
import RNPickerSelect from 'react-native-picker-select';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import PermissionPlugin from '../../plugin/permission.plugin/permission.plugin';
import SecureImageLoader from '../../library/SecureImageLoader';
import {ApiUrl, GenerateMediaLinkFromUID} from '../../tools/Api/api';

const Kyc = ({navigation, route}) => {
  const {register, handleSubmit, errors, setValue} = useForm();
  const contextProvider = useContext(context);
  const [loading, setLoading] = useState(false);
  const [switchType, setSwitchType] = useState(false);
  const [imagePickerModalVisible, setImagePickerModalVisible] = useState(false);
  const [imageType, setImageType] = useState('');

  const [icFrontPhoto, setIcFrontPhoto] = useState();
  const [icBackPhoto, setIcBackPhoto] = useState();
  const [passportPhoto, setPassportPhoto] = useState();

  //generateMediaLinkFromUID
  const [icFrontPhotoGenerate, setIcFrontPhotoGenerate] = useState();
  const [icBackPhotoGenerate, setIcBackPhotoGenerate] = useState();
  const [passportPhotoGenerate, setPassportPhotoGenerate] = useState();

  const [name, setName] = useState();
  const [identityCard, setIdentityCard] = useState();
  const [passportNumber, setPassportNumber] = useState();
  const [address, setAddress] = useState();
  const [state, setState] = useState();
  const [city, setCity] = useState();
  const [postcode, setPostcode] = useState();
  const [bankAccountName, setBankAccountName] = useState();
  const [bankName, setBankName] = useState();
  const [bankAccountNumber, setBankAccountNumber] = useState();

  const [cityList, setCityList] = useState([]);
  const [postcodeList, setPostcodeList] = useState([]);

  const NameInput = useRef();
  const identityCardInput = useRef();
  const passportCardInput = useRef();
  const addressInput = useRef();
  const cityInput = useRef();
  const stateInput = useRef();
  const postcodeInput = useRef();
  const bankAccountNameInput = useRef();
  const bankNameInput = useRef();
  const bankAccountNumberInput = useRef();

  const [radioValue, setRadioValue] = useState(true);
  const radio_props = [
    {label: 'Identity Card', value: true},
    {label: 'Passport', value: false},
  ];

  useEffect(() => {
    console.log('context', contextProvider);

    register('name', {
      required: 'Name is required',
    });

    if (contextProvider.contextProvider.my_profile.passportNumber) {
      register(
        {name: 'passportNumber'},
        {
          required: 'Passport Number is required',
          // minLength: {
          //   value: 1,
          //   message: 'Please insert valid Passport Number',
          // },
          // maxLength: {
          //   value: 12,
          //   message: 'Please insert valid Passport Number',
          // },
        },
      );

      register('passportPhoto', {
        required: 'Passport Photo is required',
      });
    } else {
      register(
        {name: 'icNumber'},
        {
          required: 'Identity Card Number is required',
          minLength: {
            value: 12,
            message: 'Please insert valid Identity Card Number',
          },
          maxLength: {
            value: 12,
            message: 'Please insert valid Identity Card Number',
          },
        },
      );

      register('icFrontPhoto', {
        required: 'IC Front Photo is required',
      });

      register('icBackPhoto', {
        required: 'IC Back Photo is required',
      });
    }

    register('address', {
      required: 'Address is required',
    });

    register('state', {
      required: 'Please Select State',
    });

    register('city', {
      required: 'Please Select City',
    });

    register('postal_code', {
      required: 'Please Select Postalcode',
    });

    register('bank_account_name', {
      required: 'Bank Account Name is required',
    });

    register('bank_name', {
      required: 'Please Select Bank Name',
    });

    register('bank_account_number', {
      required: 'Bank Account Number is required',
    });

    if (
      contextProvider.contextProvider.my_profile.verificationStatus ===
      'rejected'
    ) {
      // radio button check validation if rejected //
      if (contextProvider.contextProvider.my_profile.passportNumber) {
        register(
          {name: 'icNumber'},
          {
            required: false,
          },
        );

        register('icFrontPhoto', {
          required: false,
        });

        register('icBackPhoto', {
          required: false,
        });

        register(
          {name: 'passportNumber'},
          {
            required: 'Passport Number is required',
            // minLength: {
            //   value: 1,
            //   message: 'Please insert valid Passport Number',
            // },
            // maxLength: {
            //   value: 12,
            //   message: 'Please insert valid Passport Number',
            // },
          },
        );

        register('passportPhoto', {
          required: 'Passport Photo is required',
        });
      } else {
        register(
          {name: 'passportNumber'},
          {
            required: false,
          },
        );

        register('passportPhoto', {
          required: false,
        });

        register(
          {name: 'icNumber'},
          {
            required: 'Identity Card Number is required',
            minLength: {
              value: 12,
              message: 'Please insert valid Identity Card Number',
            },
            maxLength: {
              value: 12,
              message: 'Please insert valid Identity Card Number',
            },
          },
        );

        register('icFrontPhoto', {
          required: 'IC Front Photo is required',
        });

        register('icBackPhoto', {
          required: 'IC Back Photo is required',
        });
      }
      // radio button check validation if rejected ^ //

      setName(contextProvider.contextProvider.my_profile.name);
      setValue('name', contextProvider.contextProvider.my_profile.name, {
        shouldValidate: true,
        shouldDirty: true,
      });

      setRadioValue(
        contextProvider.contextProvider.my_profile.icNumber ? true : false,
      );

      setIdentityCard(contextProvider.contextProvider.my_profile?.icNumber);
      setValue(
        'icNumber',
        contextProvider.contextProvider.my_profile.icNumber,
        {
          shouldValidate: true,
          shouldDirty: true,
        },
      );

      setIcFrontPhoto(
        contextProvider.contextProvider.my_profile?.icPhoto?.front,
      );
      setValue(
        'icFrontPhoto',
        contextProvider.contextProvider.my_profile?.icPhoto?.front,
        {
          shouldValidate: true,
          shouldDirty: true,
        },
      );

      setIcBackPhoto(contextProvider.contextProvider.my_profile?.icPhoto?.back);
      setValue(
        'icBackPhoto',
        contextProvider.contextProvider.my_profile?.icPhoto?.back,
        {
          shouldValidate: true,
          shouldDirty: true,
        },
      );

      setPassportNumber(
        contextProvider.contextProvider.my_profile?.passportNumber,
      );
      setValue(
        'passportNumber',
        contextProvider.contextProvider.my_profile.passportNumber,
        {
          shouldValidate: true,
          shouldDirty: true,
        },
      );

      setPassportPhoto(
        contextProvider.contextProvider.my_profile?.passportPhoto,
      );
      setValue(
        'passportPhoto',
        contextProvider.contextProvider.my_profile?.passportPhoto,
        {
          shouldValidate: true,
          shouldDirty: true,
        },
      );

      setAddress(contextProvider.contextProvider.my_profile.address.street);
      setValue(
        'address',
        contextProvider.contextProvider.my_profile.address.street,
        {
          shouldValidate: true,
          shouldDirty: true,
        },
      );

      setState(contextProvider.contextProvider.my_profile.address.state);
      setValue(
        'state',
        contextProvider.contextProvider.my_profile.address.state,
        {
          shouldValidate: true,
          shouldDirty: true,
        },
      );

      setCity(contextProvider.contextProvider.my_profile.address.city);
      setValue(
        'city',
        contextProvider.contextProvider.my_profile.address.city,
        {
          shouldValidate: true,
          shouldDirty: true,
        },
      );

      setTimeout(() => {
        setPostcode(
          contextProvider.contextProvider.my_profile.address.postcode,
        );
        setValue(
          'postal_code',
          contextProvider.contextProvider.my_profile.address.postcode,
          {
            shouldValidate: true,
            shouldDirty: true,
          },
        );
      }, 100);
    }
  }, []);

  const handleKyc = async values => {
    try {
      console.log(values);

      if (radioValue) {
        delete values.passportNumber;
        delete values.passportPhoto;
      } else {
        delete values.icNumber;
        delete values.icFrontPhoto;
        delete values.icBackPhoto;
      }

      // return;

      setLoading(true);
      const formData = new FormData();

      for (const data in values) {
        console.log(data);

        switch (data) {
          case 'icFrontPhoto':
            if (icFrontPhoto.uid) {
              break;
            } else {
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
            }

          case 'icBackPhoto':
            if (icBackPhoto.uid) {
              break;
            } else {
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
            }

          case 'passportPhoto':
            if (passportPhoto.uid) {
              break;
            } else {
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
            }

          default:
            formData.append(data, values[data]);
            break;
        }
      }

      formData.append('type', radioValue);

      const res = await AuthApi.setupKyc(formData);
      console.log(res);
      if (res.status >= 200 || res.status < 300) {
        setLoading(false);

        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'KycStartExploring',
              // params: {
              //   // data: route.params.data,
              // },
            },
          ],
        });
      } else {
        setLoading(false);
        Alert.alert(null, res.response.data);
      }
    } catch (error) {
      console.log('handle error', error);
    }
  };

  const handleOpenCamera = async type => {
    setImagePickerModalVisible(false);
    console.log('type', type);

    var reqCamera;
    if (Platform.OS === 'android') {
      reqCamera = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        // {
        //   title: 'Camera',
        //   message: 'This app would like to use your camera.',
        //   buttonPositive:"OK"
        // },
      );
    }

    console.log('reqCamera', reqCamera);

    if (reqCamera === 'granted' || Platform.OS === 'ios') {
      console.log('Runned', 395);
      await PermissionPlugin.requestCameraPermission();
      setTimeout(
        () => {
          launchCamera(
            {
              // mediaType: 'photo',
              // storageOptions: {skipBackup: true, path: 'UCSI'},
            },
            response => {
              if (response.didCancel) {
                console.log('User cancelled image picker');
              } else if (response.error) {
                console.log(`ImagePicker Error: ${response.error}`);
              } else if (response.customButton) {
                console.log(
                  `User tapped custom button: ${response.customButton}`,
                );
              } else {
                const source = response;
                console.log('launch camera ', response);

                if (type === 'icFront') {
                  setIcFrontPhoto(source);

                  setValue('icFrontPhoto', source, {
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

                  setValue('icBackPhoto', source, {
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

                  setValue('passportPhoto', source, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }
              }
            },
          );
        },
        Platform.OS === 'ios' ? 500 : 0,
      );
    }
  };

  const handlePickImage = async type => {
    setImagePickerModalVisible(false);
    console.log('type', type);
    await PermissionPlugin.requestGalleryPermission();
    setTimeout(
      () => {
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
              console.log(
                `User tapped custom button: ${response.customButton}`,
              );
            } else {
              const source = response;
              console.log('select photo', response);

              if (type === 'icFront') {
                setIcFrontPhoto(source);

                setValue('icFrontPhoto', source, {
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

                setValue('icBackPhoto', source, {
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

                setValue('passportPhoto', source, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }
            }
          },
        );
      },
      Platform.OS === 'ios' ? 500 : 0,
    );
  };

  const RadioButtonFunction = e => {
    setRadioValue(e);

    if (e) {
      register(
        {name: 'passportNumber'},
        {
          required: false,
        },
      );

      register('passportPhoto', {
        required: false,
      });

      register(
        {name: 'icNumber'},
        {
          required: 'Identity Card Number is required',
          minLength: {
            value: 12,
            message: 'Please insert valid Identity Card Number',
          },
          maxLength: {
            value: 12,
            message: 'Please insert valid Identity Card Number',
          },
        },
      );

      register('icFrontPhoto', {
        required: 'IC Front Photo is required',
      });

      register('icBackPhoto', {
        required: 'IC Back Photo is required',
      });
    } else {
      register(
        {name: 'icNumber'},
        {
          required: false,
        },
      );

      register('icFrontPhoto', {
        required: false,
      });

      register('icBackPhoto', {
        required: false,
      });

      register(
        {name: 'passportNumber'},
        {
          required: 'Passport Number is required',
          // minLength: {
          //   value: 1,
          //   message: 'Please insert valid Passport Number',
          // },
          // maxLength: {
          //   value: 12,
          //   message: 'Please insert valid Passport Number',
          // },
        },
      );

      register('passportPhoto', {
        required: 'Passport Photo is required',
      });
    }

    setTimeout(() => {
      setIdentityCard(undefined);
      setValue('icNumber', undefined, {
        shouldDirty: true,
        shouldValidate: true,
      });

      setPassportNumber(undefined);
      setValue('passportNumber', undefined, {
        shouldDirty: true,
        shouldValidate: true,
      });

      setIcFrontPhoto(undefined);
      setValue('icFrontPhoto', undefined, {
        shouldDirty: true,
        shouldValidate: true,
      });

      setIcBackPhoto(undefined);
      setValue('icBackPhoto', undefined, {
        shouldDirty: true,
        shouldValidate: true,
      });

      setPassportPhoto(undefined);
      setValue('passportPhoto', undefined, {
        shouldDirty: true,
        shouldValidate: true,
      });

      if (name) {
        setValue('name', name, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }

      if (address) {
        setValue('address', address, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }

      if (state) {
        setValue('state', state, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }

      if (city) {
        setValue('city', city, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }

      if (postcode) {
        setValue('postal_code', postcode, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    }, 100);
  };

  useEffect(() => {
    if (icFrontPhoto?.uid && icBackPhoto?.uid) {
      generateMediaLinkFromUID();
    } else if (passportPhoto?.uid) {
      generateMediaLinkFromUID();
    }
  }, [icFrontPhoto, icBackPhoto, passportPhoto]);

  const generateMediaLinkFromUID = () => {
    if (icFrontPhoto?.uid && icBackPhoto?.uid) {
      setTimeout(() => {
        setIcFrontPhotoGenerate(GenerateMediaLinkFromUID(icFrontPhoto.uid));
        setIcBackPhotoGenerate(GenerateMediaLinkFromUID(icBackPhoto.uid));
      }, 100);
    } else if (passportPhoto?.uid) {
      setTimeout(() => {
        setPassportPhotoGenerate(GenerateMediaLinkFromUID(passportPhoto.uid));
      }, 100);
    }
  };

  const KycVerification = (
    <View>
      <Input
        ref={NameInput}
        label={'Name as per NRIC/Passport'}
        placeholder={'John Doe'}
        onChangeText={e => {
          setName(e);
          setValue('name', e, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
        // onSubmitEditing={() => identityCardInput.current.focus()}
        errorMessage={errors.name && errors.name.message}
        value={name}
      />

      <View style={{marginBottom: 16}}>
        <RadioForm initial={radioValue} formHorizontal={true} animation={true}>
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
        <Input
          // placeholderTextColor="grey"
          ref={identityCardInput}
          label="Identity Card Number"
          maxLength={12}
          placeholder={'97XXXXXXXXXX'}
          keyboardType="phone-pad"
          renderErrorMessage={true}
          value={identityCard}
          onChangeText={e => {
            setIdentityCard(e.replace(/[- #*;,.<>()+N\{\}\[\]\\\/]/gi, ''));
            setValue(
              'icNumber',
              e.replace(/[- #*;,.<>()+N\{\}\[\]\\\/]/gi, ''),
              {
                shouldDirty: true,
                shouldValidate: true,
              },
            );
          }}
          errorMessage={errors.icNumber && errors.icNumber.message}
          onSubmitEditing={() => addressInput.current.focus()}
          // onSubmitEditing={handleSubmit(handleLogin)}
          // onFocus={() => setButtonMargin(0)}
          // onBlur={() =>
          //   setButtonMargin(
          //     Dimensions.get("window").height * 0.08
          //   )
          // }
        />
      ) : (
        <Input
          // placeholderTextColor="grey"
          ref={passportCardInput}
          label="Passport Number"
          // maxLength={12}
          placeholder={'A75268621'}
          // keyboardType="phone-pad"
          renderErrorMessage={true}
          value={passportNumber}
          onChangeText={e => {
            setPassportNumber(e);
            setValue('passportNumber', e, {
              shouldDirty: true,
              shouldValidate: true,
            });

            // setIdentityCard(e.replace(/[- #*;,.<>()+N\{\}\[\]\\\/]/gi, ''));
            // setValue('icNumber', e.replace(/[- #*;,.<>()+N\{\}\[\]\\\/]/gi, ''), {
            //   shouldDirty: true,
            //   shouldValidate: true,
            // });
          }}
          errorMessage={errors.passportNumber && errors.passportNumber.message}
          onSubmitEditing={() => addressInput.current.focus()}
          // onSubmitEditing={handleSubmit(handleLogin)}
          // onFocus={() => setButtonMargin(0)}
          // onBlur={() =>
          //   setButtonMargin(
          //     Dimensions.get("window").height * 0.08
          //   )
          // }
        />
      )}

      <Input
        ref={addressInput}
        label={'Address'}
        placeholder={'Your Address...'}
        onChangeText={e => {
          setAddress(e);
          setValue('address', e, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
        // onSubmitEditing={() => identityCardInput.current.focus()}
        errorMessage={errors.address && errors.address.message}
        value={address}
      />

      <View style={{paddingHorizontal: 8}}>
        <Text style={{fontWeight: 'bold', fontSize: 16, color: '#86939e'}}>
          State
        </Text>
        <RNPickerSelect
          placeholder={{
            label: 'Press here select State',
            value: null,
          }}
          useNativeAndroidPickerStyle={false}
          style={{
            ...pickerSelectStyles,
          }}
          Icon={() => {
            return (
              <Icon
                type="font-awesome"
                name="caret-down"
                color="#6d6e70"
                size={16}
              />
            );
          }}
          onValueChange={e => {
            if (!e) {
              console.log('state', e);
              setCityList([]);
              setPostcodeList([]);

              setState(null);
              setCity(null);
              setPostcode(null);

              setValue('state', null, {
                shouldValidate: true,
                shouldDirty: true,
              });

              setValue('city', null, {
                shouldValidate: true,
                shouldDirty: true,
              });

              setValue('postal_code', null, {
                shouldValidate: true,
                shouldDirty: true,
              });
            } else {
              console.log('state', e);
              setState(e);
              setValue('state', e, {
                shouldValidate: true,
                shouldDirty: true,
              });
              const cityList = MalaysiaStateList.filter(v => v.name === e)[0]
                .children;

              setCityList(cityList);
              setPostcode('');
            }
          }}
          items={MalaysiaStateList.map(value => ({
            label: value.name,
            value: value.name,
          }))}
          value={state}
          ref={stateInput}
        />
        <View style={{margin: 5}}>
          <Text style={{color: '#f00', fontSize: 12}}>
            {errors.state ? errors.state.message : ''}
          </Text>
        </View>
      </View>

      <View style={{paddingHorizontal: 8}}>
        <Text style={{fontWeight: 'bold', fontSize: 16, color: '#86939e'}}>
          City
        </Text>
        <RNPickerSelect
          placeholder={{
            label: 'Press here select City',
            value: null,
          }}
          useNativeAndroidPickerStyle={false}
          style={{
            ...pickerSelectStyles,
          }}
          Icon={() => {
            return (
              <Icon
                type="font-awesome"
                name="caret-down"
                color="#6d6e70"
                size={16}
              />
            );
          }}
          onValueChange={e => {
            if (!e) {
              console.log('city', e);
              setPostcodeList([]);

              setCity(null);
              setPostcode(null);

              setValue('city', null, {
                shouldValidate: true,
                shouldDirty: true,
              });

              setValue('postal_code', null, {
                shouldValidate: true,
                shouldDirty: true,
              });
            } else {
              console.log('city', e);
              setCity(e);
              setValue('city', e, {
                shouldValidate: true,
                shouldDirty: true,
              });
              const postcodeList = cityList.filter(v => v.name === e)[0]
                .children;

              setPostcodeList(postcodeList);
            }
          }}
          items={cityList.map(value => ({
            label: value.name,
            value: value.name,
          }))}
          value={city}
          ref={cityInput}
        />
        <View style={{margin: 5}}>
          <Text style={{color: '#f00', fontSize: 12}}>
            {errors.city ? errors.city.message : ''}
          </Text>
        </View>
      </View>

      <View style={{paddingHorizontal: 8}}>
        <Text style={{fontWeight: 'bold', fontSize: 16, color: '#86939e'}}>
          Postcode
        </Text>
        <RNPickerSelect
          placeholder={{
            label: 'Press here select Postcode',
            value: null,
          }}
          useNativeAndroidPickerStyle={false}
          style={{
            ...pickerSelectStyles,
          }}
          Icon={() => {
            return (
              <Icon
                type="font-awesome"
                name="caret-down"
                color="#6d6e70"
                size={16}
              />
            );
          }}
          onValueChange={e => {
            console.log('postcode', e);
            // setIdType(e);
            setPostcode(e);
            setValue('postal_code', e, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
          items={postcodeList.map(value => ({
            label: value.name,
            value: value.name,
          }))}
          value={postcode}
          ref={postcodeInput}
        />
        <View style={{margin: 5}}>
          <Text style={{color: '#f00', fontSize: 12}}>
            {errors.postal_code ? errors.postal_code.message : ''}
          </Text>
        </View>
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

            {icFrontPhoto && contextProvider.contextProvider.my_profile ? (
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

                        setValue('icFrontPhoto', null, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      },
                    },
                  ]);
                }}>
                <SecureImageLoader
                  source={{
                    // uri: icFrontPhoto?.assets
                    //   ? icFrontPhoto?.assets[0]?.uri
                    //   : icFrontPhoto.url,

                    uri: icFrontPhoto?.assets
                      ? icFrontPhoto?.assets[0]?.uri
                      : icFrontPhotoGenerate,
                  }}
                  style={{
                    height: 120,
                    width: 120,
                  }}
                  resizeMode="stretch"
                  // resizeMethod="scale"
                />
                {/* <Image
                  source={{
                    uri: icFrontPhoto?.assets
                      ? icFrontPhoto?.assets[0]?.uri
                      : icFrontPhoto.url,
                  }}
                  style={{
                    height: 120,
                    width: 120,
                  }}
                  resizeMode="stretch"
                  // resizeMethod="scale"
                /> */}
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

                        setValue('icBackPhoto', null, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      },
                    },
                  ]);
                }}>
                <SecureImageLoader
                  source={{
                    // uri: icBackPhoto?.assets
                    //   ? icBackPhoto?.assets[0]?.uri
                    //   : icBackPhoto.url,

                    uri: icBackPhoto?.assets
                      ? icBackPhoto?.assets[0]?.uri
                      : icBackPhotoGenerate,
                  }}
                  style={{
                    height: 120,
                    width: 120,
                  }}
                  resizeMode="stretch"
                  // resizeMethod="scale"
                />
                {/* <Image
                  source={{
                    uri: icBackPhoto?.assets
                      ? icBackPhoto?.assets[0]?.uri
                      : icBackPhoto.url,
                  }}
                  style={{
                    height: 120,
                    width: 120,
                  }}
                  resizeMode="stretch"
                  // resizeMethod="scale"
                /> */}
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

                      setValue('passportPhoto', null, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    },
                  },
                ]);
              }}>
              <SecureImageLoader
                source={{
                  // uri: passportPhoto?.assets
                  //   ? passportPhoto?.assets[0]?.uri
                  //     : passportPhoto.url,

                  uri: passportPhoto?.assets
                    ? passportPhoto?.assets[0]?.uri
                    : passportPhotoGenerate,
                }}
                style={{
                  height: 120,
                  width: 120,
                }}
                resizeMode="stretch"
              />
              {/* <Image
                source={{
                  uri: passportPhoto?.assets
                    ? passportPhoto?.assets[0]?.uri
                    : passportPhoto.url,
                }}
                style={{
                  height: 120,
                  width: 120,
                }}
                resizeMode="stretch"
                // resizeMethod="scale"
              /> */}
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
                <Icon name="plus" type="antdesign" style={{marginBottom: 5}} />

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

      <View
        style={{
          backgroundColor: '#fffbe6',
          padding: 12,
          borderColor: '#ffe58f',
          borderWidth: 1,
          marginVertical: 24,
        }}>
        <Text style={{textAlign: 'center'}}>
          For withdraw and purposal account closing
        </Text>
      </View>

      <Input
        ref={bankAccountNameInput}
        label={'Bank Account Name'}
        placeholder={'John Doe'}
        onChangeText={e => {
          setBankAccountName(e);
          setValue('bank_account_name', e, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
        // onSubmitEditing={() => identityCardInput.current.focus()}
        errorMessage={
          errors.bank_account_name && errors.bank_account_name.message
        }
        value={bankAccountName}
      />

      <View style={{paddingHorizontal: 8}}>
        <Text style={{fontWeight: 'bold', fontSize: 16, color: '#86939e'}}>
          Bank Name
        </Text>
        <RNPickerSelect
          placeholder={{
            label: 'Press here select Bank Name',
            value: null,
          }}
          useNativeAndroidPickerStyle={false}
          style={{
            ...pickerSelectStyles,
          }}
          Icon={() => {
            return (
              <Icon
                type="font-awesome"
                name="caret-down"
                color="#6d6e70"
                size={16}
              />
            );
          }}
          onValueChange={e => {
            console.log('bank name', e);
            setBankName(e);
            setValue('bank_name', e, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
          items={BankList.map(value => ({
            label: value.value,
            value: value.value,
          }))}
          value={bankName}
          ref={bankNameInput}
        />
        <View style={{margin: 5}}>
          <Text style={{color: '#f00', fontSize: 12}}>
            {errors.bank_name ? errors.bank_name.message : ''}
          </Text>
        </View>
      </View>

      <Input
        ref={bankAccountNumberInput}
        label={'Bank Account Number'}
        keyboardType="phone-pad"
        placeholder={'123456789012'}
        onChangeText={e => {
          setBankAccountNumber(e.replace(/[- #*;,.<>()+N\{\}\[\]\\\/]/gi, ''));
          setValue(
            'bank_account_number',
            e.replace(/[- #*;,.<>()+N\{\}\[\]\\\/]/gi, ''),
            {
              shouldDirty: true,
              shouldValidate: true,
            },
          );
        }}
        onSubmitEditing={() => {
          console.log('erorrs', errors);

          handleSubmit(handleKyc)();
        }}
        errorMessage={
          errors.bank_account_number && errors.bank_account_number.message
        }
        value={bankAccountNumber}
      />
    </View>
  );

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

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle="light-content" backgroundColor={PrimaryColor} />

      <ScrollView
        style={{flex: 1, backgroundColor: '#fff'}}
        automaticallyAdjustKeyboardInsets={true}>
        <View style={{paddingHorizontal: 16, paddingVertical: 24}}>
          <Text
            style={{
              fontWeight: 'bold',
              color: PrimaryColor,
              fontSize: 24,
              marginBottom: 24,
            }}>
            Setup Your KYC
          </Text>

          <View
            style={{
              backgroundColor: '#fffbe6',
              borderColor: '#ffe58f',
              borderWidth: 2,
              padding: 8,
              borderRadius: 8,
              marginBottom: 16,
            }}>
            <Text>
              The UCSIPAY Electronic Know-Your-Customer (e-KYC) process requires
              you to submit a digital copy of your National Registration
              Identity Card Number (NRIC)/Passport, as well as your bank account
              details to be verified electronically.
            </Text>
            <Text />
            <Text>
              Your NRIC/Passport number verification is under the NRIC section,
              and the bank account verification for any future refunds is
              verified under the Bank section.
            </Text>
            <Text />
            <Text>
              *All your personal information will be kept confidential, and we
              are committed to protecting your privacy.
            </Text>
          </View>

          {KycVerification}

          <View
            style={{
              // flex: 1,
              // justifyContent: 'flex-end',
              alignItems: 'flex-end',
              paddingTop: 16,
              paddingRight: 8,
              // paddingBottom: 64,
            }}>
            <TouchableWithoutFeedback
              onPress={() => {
                console.log('erorrs', errors);

                handleSubmit(handleKyc)();
              }}>
              <Image
                source={require('../../assest/image/UcsiIcon/arrow_right_circle.png')}
                style={{
                  // position: 'absolute',
                  height: 50,
                  width: 50,
                  // right: 40,
                  // bottom: 64,
                  //   zIndex: -1,
                }}
                // resizeMode="stretch"
                // resizeMethod="scale"
              />
            </TouchableWithoutFeedback>
          </View>
        </View>

        {ImagePickerModal}

        <ActivityIndicator
          toast
          animating={loading}
          size="large"
          text="Loading..."
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Kyc;

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    height: 30,
    borderColor: '#86939e',
    borderBottomWidth: 1,
    fontSize: 16,
    // paddingRight: 30,
    color: '#242424',
    paddingBottom: 4,
    paddingLeft: 0,
  },
  inputIOS: {
    height: 30,
    borderColor: '#86939e',
    borderBottomWidth: 1,
    fontSize: 16,
    // paddingRight: 30,
    color: '#242424',
  },
  placeholder: {
    color: '#86939e',
  },
  iconContainer: {top: 8, right: 6},
  //   inputAndroidContainer: { marginHorizontal: 10, marginBottom: 12 },
  //   inputIOSContainer: { marginHorizontal: 10, marginBottom: 12 }
});

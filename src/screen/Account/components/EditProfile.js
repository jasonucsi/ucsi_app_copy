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
import CountryPicker from 'react-native-country-picker-modal';
import {SafeAreaView} from 'react-native-safe-area-context';
import {context} from '../../../../App';
import pushNotificationPlugin from '../../../plugin/pushNotification.plugin/pushNotification.plugin';
import Modal from 'react-native-modal';
import {Button, Icon, Input, ListItem} from 'react-native-elements';
import {
  PrimaryColor,
  MalaysiaStateList,
  Countries,
  BankList,
} from '../../../tools/Constant/Constant';
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';
import AuthApi from '../../../tools/Api/auth.api';
import {ResponseError} from '../../../tools/ErrorHandler/ErrorHandler';
import I18n from '../../../locales';
import SetPin from '../../SecureCode/components/SetPin';
import {useForm} from 'react-hook-form';
import RNPickerSelect from 'react-native-picker-select';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import SecureImageLoader from '../../../library/SecureImageLoader';

const EditProfile = ({navigation, route}) => {
  const {register, handleSubmit, errors, getValues, setValue} = useForm();
  const contextProvider = useContext(context);
  const [loading, setLoading] = useState(false);
  const [emailExist, setEmailExist] = useState(false);
  const [icFrontPhoto, setIcFrontPhoto] = useState();
  const [icBackPhoto, setIcBackPhoto] = useState();
  const [passportPhoto, setPassportPhoto] = useState();

  const [otpCountDown, setOtpCountDown] = useState(60);
  const [otpLoading, setOtpLoading] = useState(false);

  const [pin, setPin] = useState('');
  const [otpModalVisible, setOtpModalVisible] = useState(false);

  const [name, setName] = useState();
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState();
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

  const [companyName, setCompanyName] = useState();
  
  const [workAddress, setWorkAddress] = useState();
  const [workState, setWorkState] = useState();
  const [workCity, setWorkCity] = useState();
  const [workPostcode, setWorkPostcode] = useState();
  const [workCountry, setWorkCountry] = useState();
  
  const [workCountryCode, setWorkCountryCode] = useState();
  const [workCountryISO, setWorkCountryISO] = useState();
  const [workNumber, setWorkNumber] = useState();

  const [url, setUrl] = useState();

  const NameInput = useRef();
  const contactInput = useRef();
  const workNumberInput = useRef();
  const emailInput = useRef();
  const identityCardInput = useRef();
  const passportCardInput = useRef();
  const addressInput = useRef();
  const cityInput = useRef();
  const stateInput = useRef();
  const postcodeInput = useRef();
  const workAddressInput = useRef();
  const workPostcodeInput = useRef();
  const workCityInput = useRef();
  const workStateInput = useRef();
  const workCountryInput = useRef();
  const companyNameInput = useRef();
  const urlInput = useRef();
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

    GetWalletBalance();

    register('name', {
      required: 'Name is required',
    });

    register(
      {name: 'phone'},
      {
        required: 'Mobile Number is required',
        minLength: {
          value: 9,
          message: 'Please insert valid mobile number',
        },
        maxLength: {
          value: 10,
          message: 'Please insert valid mobile number',
        },
      },
    );

    register('email', {
      required: 'Email Address is required',
      pattern: {
        value: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
        message: 'Invalid email address',
      },
      validate: CheckEmailExist,
    });

    if (contextProvider.contextProvider.my_profile.icNumber) {
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

    register('url');
    register('workCountryCode');
    register('workNumber');
    register('companyName');
    register('workAddress');
    register('workPostcode');
    register('workCity');
    register('workState');
    register('workCountry');

    setName(contextProvider.contextProvider.my_profile.name);
    setValue('name', contextProvider.contextProvider.my_profile.name, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setContact(contextProvider.contextProvider.my_profile.contact.number);
    setValue(
      'phone',
      contextProvider.contextProvider.my_profile.contact.number,
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );

    setEmail(contextProvider.contextProvider.my_profile.email);
    setValue('email', contextProvider.contextProvider.my_profile.email, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setRadioValue(
      contextProvider.contextProvider.my_profile.icNumber ? true : false,
    );

    setIdentityCard(contextProvider.contextProvider.my_profile?.icNumber);
    setValue('icNumber', contextProvider.contextProvider.my_profile.icNumber, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setIcFrontPhoto(contextProvider.contextProvider.my_profile?.icPhoto?.front);
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

    setPassportPhoto(contextProvider.contextProvider.my_profile?.passportPhoto);
    setValue(
      'passportPhoto',
      contextProvider.contextProvider.my_profile?.passportPhoto,
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );

    setAddress(contextProvider.contextProvider.my_profile.address?.street);
    setValue(
      'address',
      contextProvider.contextProvider.my_profile.address?.street,
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );

    setState(contextProvider.contextProvider.my_profile.address?.state);
    setValue(
      'state',
      contextProvider.contextProvider.my_profile.address?.state,
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );

    setCity(contextProvider.contextProvider.my_profile.address?.city);
    setValue('city', contextProvider.contextProvider.my_profile.address?.city, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setWorkCountryCode(
      contextProvider.contextProvider.my_profile.workContact?.countryCode,
    );
    setValue(
      'workCountryCode',
      contextProvider.contextProvider.my_profile.workContact?.countryCode,
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );

    var iso = Countries.filter(
      v =>
        v.phoneCode ===
        contextProvider.contextProvider.my_profile.workContact?.countryCode,
    )[0]?.iso2;
    setWorkCountryISO(iso ?? 'MY');

    setWorkNumber(
      contextProvider.contextProvider.my_profile.workContact?.number,
    );
    setValue(
      'workNumber',
      contextProvider.contextProvider.my_profile.workContact?.number,
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );

    setWorkAddress(
      contextProvider.contextProvider.my_profile.workAddress?.street,
    );
    setValue(
      'workAddress',
      contextProvider.contextProvider.my_profile.workAddress?.street,
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );

    setWorkCountry(
      contextProvider.contextProvider.my_profile.workAddress?.country,
    );
    setValue(
      'workCountry',
      contextProvider.contextProvider.my_profile.workAddress?.country,
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );

    setWorkState(contextProvider.contextProvider.my_profile.workAddress?.state);
    setValue(
      'workState',
      contextProvider.contextProvider.my_profile.workAddress?.state,
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );

    setWorkCity(contextProvider.contextProvider.my_profile.workAddress?.city);
    setValue(
      'workCity',
      contextProvider.contextProvider.my_profile.workAddress?.city,
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );

    setWorkPostcode(
      contextProvider.contextProvider.my_profile.workAddress?.postcode,
    );
    setValue(
      'workPostcode',
      contextProvider.contextProvider.my_profile.workAddress?.postcode,
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );

    setWorkCountry(
      contextProvider.contextProvider.my_profile.workAddress?.country,
    );
    setValue(
      'workCountry',
      contextProvider.contextProvider.my_profile.workAddress?.country,
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );

    setTimeout(() => {
      setPostcode(contextProvider.contextProvider.my_profile.address?.postcode);
      setValue(
        'postal_code',
        contextProvider.contextProvider.my_profile.address?.postcode,
        {
          shouldValidate: true,
          shouldDirty: true,
        },
      );
    }, 100);
    

    setUrl(contextProvider.contextProvider.my_profile.url,
    );
    setValue('url', contextProvider.contextProvider.my_profile.url, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setCompanyName(contextProvider.contextProvider.my_profile.companyName,
      );
    setValue('companyName', contextProvider.contextProvider.my_profile.companyName, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, []);

  const GetWalletBalance = async () => {
    try {
      setLoading(true);

      const res = await AuthApi.getWallet();
      console.log('wallet', res);

      if (res.status >= 200 || res.status < 300) {
        setLoading(false);

        setBankAccountName(res.data.bankAccountName);
        setValue('bank_account_name', res.data.bankAccountName, {
          shouldDirty: true,
          shouldValidate: true,
        });

        setBankName(res.data.bankName);
        setValue('bank_name', res.data.bankName, {
          shouldValidate: true,
          shouldDirty: true,
        });

        setBankAccountNumber(
          res.data.bankAccountNumber.replace(
            /[- #*;,.<>()+N\{\}\[\]\\\/]/gi,
            '',
          ),
        );
        setValue(
          'bank_account_number',
          res.data.bankAccountNumber.replace(
            /[- #*;,.<>()+N\{\}\[\]\\\/]/gi,
            '',
          ),
          {
            shouldDirty: true,
            shouldValidate: true,
          },
        );
      } else {
        setLoading(false);
        ResponseError(res);
      }
    } catch (error) {
      console.log('wallet error', error);
    }
  };

  const ResendOtp = async values => {
    console.log('values', values);

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

    const res = await AuthApi.requestChangeEmailOtp();

    console.log('res', res);

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

  const ChangeProfile = async values => {
    console.log(values);
    console.log('getValues', getValues());

    setLoading(true);

    const res = await AuthApi.changeProfile({
      otp: pin,
      email: values.email,

      address: {
        street: getValues('address'),
        postcode: getValues('postal_code'),
        city: getValues('city'),
        state: getValues('state'),
      },

      bankAccountName: getValues('bank_account_name'),
      bankAccountNumber: getValues('bank_account_number'),
      bankName: getValues('bank_name'),

      url: getValues('url'),

      companyName: getValues('companyName'),

      workAddress: {
        street: getValues('workAddress'),
        postcode: getValues('workPostcode'),
        city: getValues('workCity'),
        state: getValues('workState'),
        country: getValues('workCountry'),
      },

      workContact: {
        number: getValues('workNumber'),
        countryCode: getValues('workCountryCode'),
      },
    });
    console.log(res);
    if (res.status >= 200 || res.status < 300) {
      setLoading(false);
      setOtpModalVisible(false);

      Alert.alert(null, 'Change Profile Successful!', [
        {
          text: 'Ok',
          onPress: () => {
            contextProvider.getUserdata();

            navigation.goBack();
          },
        },
      ]);
    } else {
      setLoading(false);
      Alert.alert(null, res.response.data);
    }
  };

  const CheckEmailExist = async value => {
    // setLoading(true);

    const res = await AuthApi.checkEmailExist(value);
    console.log('check contact', res);

    if (res.status >= 200 || res.status < 300) {
      // setLoading(false);

      setEmailExist(res.data.exists);
    } else {
      // setLoading(false);
      ResponseError(res);
    }
  };

  // const handleKyc = async values => {
  //   try {
  //     console.log(values);

  //     if (radioValue) {
  //       delete values.passportNumber;
  //       delete values.passportPhoto;
  //     } else {
  //       delete values.icNumber;
  //       delete values.icFrontPhoto;
  //       delete values.icBackPhoto;
  //     }

  //     // return;

  //     setLoading(true);
  //     const formData = new FormData();

  //     for (const data in values) {
  //       console.log(data);

  //       switch (data) {
  //         case 'icFrontPhoto':
  //           formData.append('icFrontPhoto', {
  //             uri: icFrontPhoto.assets
  //               ? icFrontPhoto.assets[0].uri
  //               : icFrontPhoto.url,
  //             name: icFrontPhoto.assets
  //               ? icFrontPhoto.assets[0].fileName
  //               : icFrontPhoto.name,
  //             type: icFrontPhoto.assets
  //               ? icFrontPhoto.assets[0].type
  //               : icFrontPhoto.mimeType,
  //           });
  //           break;

  //         case 'icBackPhoto':
  //           formData.append('icBackPhoto', {
  //             uri: icBackPhoto.assets
  //               ? icBackPhoto.assets[0].uri
  //               : icBackPhoto.url,
  //             name: icBackPhoto.assets
  //               ? icBackPhoto.assets[0].fileName
  //               : icBackPhoto.name,
  //             type: icBackPhoto.assets
  //               ? icBackPhoto.assets[0].type
  //               : icBackPhoto.mimeType,
  //           });
  //           break;

  //         case 'passportPhoto':
  //           formData.append('passportPhoto', {
  //             uri: passportPhoto.assets
  //               ? passportPhoto.assets[0].uri
  //               : passportPhoto.url,
  //             name: passportPhoto.assets
  //               ? passportPhoto.assets[0].fileName
  //               : passportPhoto.name,
  //             type: passportPhoto.assets
  //               ? passportPhoto.assets[0].type
  //               : passportPhoto.mimeType,
  //           });
  //           break;

  //         default:
  //           formData.append(data, values[data]);
  //           break;
  //       }
  //     }

  //     formData.append('type', radioValue);

  //     const res = await AuthApi.setupKyc(formData);
  //     console.log(res);
  //     if (res.status >= 200 || res.status < 300) {
  //       setLoading(false);

  //       navigation.reset({
  //         index: 0,
  //         routes: [
  //           {
  //             name: 'KycStartExploring',
  //             // params: {
  //             //   // data: route.params.data,
  //             // },
  //           },
  //         ],
  //       });
  //     } else {
  //       setLoading(false);
  //       Alert.alert(null, res.response.data);
  //     }
  //   } catch (error) {
  //     console.log('handle error', error);
  //   }
  // };

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
            }}
          />
        </View>

        <View style={{alignItems: 'center'}}>
          <Text style={{marginBottom: 16, textAlign: 'center'}}>
            Verification code has been sent by SMS to your mobile number for
            change permission
          </Text>

          <Text
            style={{
              backgroundColor: 'rgba(0,0,0,0.15)',
              padding: 12,
              borderRadius: 5,
              fontWeight: 'bold',
              fontSize: 18,
              marginBottom: 24,
            }}>
            +60{contextProvider.contextProvider.my_profile.contact.number}
          </Text>
        </View>

        <View>
          <SetPin focus={true} setFirstPin={e => setPin(e)} />
        </View>

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
            onPress={handleSubmit(ChangeProfile)}
          />
        </View>
      </View>
    </Modal>
  );

  const Profile = (
    <View style={{paddingHorizontal: 16, paddingVertical: 24}}>
      <View
        style={{
          backgroundColor: PrimaryColor,
          borderColor: PrimaryColor,
          padding: 12,
          borderWidth: 1,
          marginVertical: 24,
        }}>
        <Text style={{fontWeight: 'bold', textAlign: 'center', color: 'white'}}>
          Personal Information
        </Text>
      </View>
      <Input
        ref={NameInput}
        label={'Name as per NRIC/Passport'}
        disabled
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

      <Input
        // placeholderTextColor="grey"
        ref={contactInput}
        label="Mobile Number"
        disabled
        maxLength={10}
        leftIcon={
          <Text style={{fontSize: 18, color: 'rgba(0,0,0,0.45)'}}>+60</Text>
        }
        inputStyle={{transform: [{translateY: 1}]}}
        placeholder={'123456789'}
        keyboardType="phone-pad"
        renderErrorMessage={true}
        value={contact}
        onChangeText={e => {
          setContact(e.replace(/[- #*;,.<>()+N\{\}\[\]\\\/]/gi, ''));
          setValue('phone', e.replace(/[- #*;,.<>()+N\{\}\[\]\\\/]/gi, ''), {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
        // errorMessage={
        //   contact.length < 9
        //     ? 'New Number is Required'
        //     : checkExistContact
        //     ? 'Number Exist'
        //     : null
        // }
        // onSubmitEditing={() => fullNameInput.current.focus()}
        // onSubmitEditing={handleSubmit(handleLogin)}
        // onFocus={() => setButtonMargin(0)}
        // onBlur={() =>
        //   setButtonMargin(
        //     Dimensions.get("window").height * 0.08
        //   )
        // }
      />

      <Input
        ref={emailInput}
        label={'Email Address'}
        placeholder={'ucsi_pay@gmail.com'}
        keyboardType="email-address"
        onChangeText={e => {
          setEmail(e);
          setValue('email', e, {shouldValidate: true, shouldDirty: true});
        }}
        errorMessage={errors.email && errors.email.message}
        // errorMessage={
        //   errors.email
        //     ? errors.email.message
        //     : emailExist
        //     ? 'Email Exist'
        //     : null
        // }
        // onSubmitEditing={handleSubmit(handleSetUpMobileNumber)}
        // errorMessage={
        //     errors.email && !validateEmail
        //       ? errors.email.message
        //       : !errors.email && validateEmail
        //       ? I18n.t("SignUpDetails.errorMessage.emailExist")
        //       : null
        //   }
        value={email}
      />

      {radioValue ? (
        <Input
          // placeholderTextColor="grey"
          ref={identityCardInput}
          label="Identity Card Number"
          disabled
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
          disabled
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
        // disabled
        placeholder={'Your Address...'}
        onChangeText={e => {
          setAddress(e);
          setValue('address', e, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
        // onSubmitEditing={() => identityCardInput.current.focus()}
        errorMessage={errors.address && errors.address?.message}
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
          // disabled
          useNativeAndroidPickerStyle={false}
          style={{
            ...pickerSelectStyles,
          }}
          // Icon={() => {
          //   return (
          //     <Icon
          //       type="font-awesome"
          //       name="caret-down"
          //       color="#6d6e70"
          //       size={16}
          //     />
          //   );
          // }}
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
          // disabled
          useNativeAndroidPickerStyle={false}
          style={{
            ...pickerSelectStyles,
          }}
          // Icon={() => {
          //   return (
          //     <Icon
          //       type="font-awesome"
          //       name="caret-down"
          //       color="#6d6e70"
          //       size={16}
          //     />
          //   );
          // }}
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
          // disabled
          useNativeAndroidPickerStyle={false}
          style={{
            ...pickerSelectStyles,
          }}
          // Icon={() => {
          //   return (
          //     <Icon
          //       type="font-awesome"
          //       name="caret-down"
          //       color="#6d6e70"
          //       size={16}
          //     />
          //   );
          // }}
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

      <Input
        ref={urlInput}
        label={'Url'}
        placeholder={'Your Url...'}
        onChangeText={e => {
          setUrl(e);
          setValue('url', e, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
        errorMessage={errors.url && errors.url.message}
        value={url}
      />

      {radioValue ? (
        <View>
          <View style={{paddingHorizontal: 8, marginBottom: 24}}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 16,
                color: '#86939e',
                marginBottom: 16,
              }}>
              IC Front Photo
            </Text>

            {icFrontPhoto && (
              <SecureImageLoader
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
              />
              // <Image
              //   source={{
              //     uri: icFrontPhoto?.assets
              //       ? icFrontPhoto?.assets[0]?.uri
              //       : icFrontPhoto.url,
              //   }}
              //   style={{
              //     height: 120,
              //     width: 120,
              //   }}
              //   resizeMode="stretch"
              //   // resizeMethod="scale"
              // />
            )}
          </View>

          <View style={{paddingHorizontal: 8, marginBottom: 24}}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 16,
                color: '#86939e',
                marginBottom: 16,
              }}>
              IC Back Photo
            </Text>

            {icBackPhoto && (
              <SecureImageLoader
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
              />
              // <Image
              //   source={{
              //     uri: icBackPhoto?.assets
              //       ? icBackPhoto?.assets[0]?.uri
              //       : icBackPhoto.url,
              //   }}
              //   style={{
              //     height: 120,
              //     width: 120,
              //   }}
              //   resizeMode="stretch"
              //   // resizeMethod="scale"
              // />
            )}
          </View>
        </View>
      ) : (
        <View style={{paddingHorizontal: 8, marginBottom: 24}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 16,
              color: '#86939e',
              marginBottom: 16,
            }}>
            Passport Photo
          </Text>

          {passportPhoto && (
            <SecureImageLoader
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
            />
            // <Image
            //   source={{
            //     uri: passportPhoto?.assets
            //       ? passportPhoto?.assets[0]?.uri
            //       : passportPhoto.url,
            //   }}
            //   style={{
            //     height: 120,
            //     width: 120,
            //   }}
            //   resizeMode="stretch"
            //   // resizeMethod="scale"
            // />
          )}
        </View>
      )}
      <View
        style={{
          backgroundColor: PrimaryColor,
          borderColor: PrimaryColor,
          padding: 12,
          borderWidth: 1,
          marginVertical: 24,
        }}>
        <Text style={{fontWeight: 'bold', textAlign: 'center', color: 'white'}}>
          Work Information
        </Text>
      </View>

      <Input
        ref={workNumberInput}
        label="Work Number"
        maxLength={10}
        leftIcon={
          <CountryPicker
            countryCode={workCountryISO}
            withFilter
            withFlag
            withCallingCodeButton
            withCallingCode
            withEmoji
            preferredCountries={["MY","SG"]}
            onSelect={selectedCountry => {
              if (selectedCountry) {
                setWorkCountryISO(selectedCountry.cca2);

                const callingCode = selectedCountry.callingCode[0];
                const formattedCallingCode = callingCode.startsWith('+')
                  ? callingCode
                  : `+${callingCode}`;

                setWorkCountryCode(formattedCallingCode);
                setValue('workCountryCode', formattedCallingCode, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }
            }}
          />
        }
        inputStyle={{transform: [{translateY: 1}]}}
        placeholder={'123456789'}
        keyboardType="phone-pad"
        renderErrorMessage={true}
        value={workNumber}
        onChangeText={e => {
          setWorkNumber(e.replace(/[- #*;,.<>()+N\{\}\[\]\\\/]/gi, ''));
          setValue('workNumber', e.replace(/[- #*;,.<>()+N\{\}\[\]\\\/]/gi, ''), {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
      />

      <Input  
        ref={companyNameInput}
        label={'Company Name'}
        // disabled
        placeholder={'Your Company Name...'}
        onChangeText={e => {
          setCompanyName(e);
          setValue('companyName', e, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
        errorMessage={errors.companyName && errors.companyName.message}
        value={companyName}
      />
      <Input  
        ref={workAddressInput}
        label={'Work Address'}
        // disabled
        placeholder={'Your Work Address...'}
        onChangeText={e => {
          setWorkAddress(e);
          setValue('workAddress', e, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
        errorMessage={errors.workAddress && errors.workAddress.message}
        value={workAddress}
      />
      <Input
        ref={workCountryInput}
        label={'Work Country'}
        // disabled
        placeholder={'Your Country...'}
        onChangeText={e => {
          setWorkCountry(e);
          setValue('workCountry', e, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
        errorMessage={errors.workAddress && errors.workAddress.message}
        value={workCountry}
      />
      <Input
        ref={workStateInput}
        label={'Work State'}
        // disabled
        placeholder={'Your Work State...'}
        onChangeText={e => {
          setWorkState(e);
          setValue('workState', e, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
        errorMessage={errors.workState && errors.workState.message}
        value={workState}
      />
      <Input
        ref={workCityInput}
        label={'Work City'}
        // disabled
        placeholder={'Your Work City...'}
        onChangeText={e => {
          setWorkCity(e);
          setValue('workCity', e, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
        errorMessage={errors.workCity && errors.workCity.message}
        value={workCity}
      />
      <Input
        ref={workPostcodeInput}
        label={'Work PostCode'}
        keyboardType="phone-pad"
        maxLength={6}
        // disabled
        placeholder={'Your Work Postcode...'}
        onChangeText={e => {
          setWorkPostcode(e);
          setValue('workPostcode', e, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
        errorMessage={errors.workPostcode && errors.workPostcode.message}
        value={workPostcode}
      />
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
        // disabled
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
          // disabled
          useNativeAndroidPickerStyle={false}
          style={{
            ...pickerSelectStyles,
          }}
          // Icon={() => {
          //   return (
          //     <Icon
          //       type="font-awesome"
          //       name="caret-down"
          //       color="#6d6e70"
          //       size={16}
          //     />
          //   );
          // }}
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
        // disabled
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

          // handleSubmit(handleKyc)();
        }}
        errorMessage={
          errors.bank_account_number && errors.bank_account_number.message
        }
        value={bankAccountNumber}
      />

      <Button
        disabled={otpLoading}
        title={
          otpLoading
            ? 'Request OTP in' + ' ' + otpCountDown + 's'
            : 'Request OTP'
        }
        buttonStyle={{
          borderRadius: 100,
          backgroundColor: PrimaryColor,
        }}
        titleStyle={{
          color: '#fff',
          fontWeight: 'bold',
          paddingVertical: 8,
          paddingHorizontal: Dimensions.get('window').width * 0.18,
        }}
        onPress={() => {
          console.log('errors', errors);

          handleSubmit(ResendOtp)();

          // if (emailExist) {
          //   Alert.alert(null, 'Email Exist', [
          //     {
          //       text: 'Ok',
          //     },
          //   ]);
          // } else {
          //   setOtpModalVisible(true);
          //   ResendOtp();
          // }

          // Alert.alert(null, 'Confirm Change Email?', [
          //   {
          //     text: 'Cancel',
          //   },
          //   {
          //     text: 'Ok',
          //     onPress: () => {
          //       handleSubmit(ChangeProfile)();
          //     },
          //   },
          // ]);
        }}
      />
    </View>
  );

  return (
    <ScrollView
      style={{flex: 1, backgroundColor: '#fff'}}
      automaticallyAdjustKeyboardInsets={true}>
      <StatusBar barStyle="light-content" backgroundColor={PrimaryColor} />

      {Profile}
      {OtpModal}

      <ActivityIndicator
        toast
        animating={loading}
        size="large"
        text="Loading..."
      />
    </ScrollView>
  );
};

export default EditProfile;

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    height: 30,
    borderColor: '#86939e',
    borderBottomWidth: 1,
    fontSize: 16,
    // paddingRight: 30,
    color: '#242424',
    // color: 'rgba(0,0,0,0.45)',
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
    // color: 'rgba(0,0,0,0.45)',
  },
  placeholder: {
    color: '#86939e',
  },
  iconContainer: {top: 8, right: 6},
  //   inputAndroidContainer: { marginHorizontal: 10, marginBottom: 12 },
  //   inputIOSContainer: { marginHorizontal: 10, marginBottom: 12 }
});

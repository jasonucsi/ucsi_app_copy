import React, {useEffect, useState, useContext, useRef} from 'react';
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
} from 'react-native';
import {ActivityIndicator, Flex} from '@ant-design/react-native';
import {context} from '../../../../App';
import pushNotificationPlugin from '../../../plugin/pushNotification.plugin/pushNotification.plugin';
import Modal from 'react-native-modal';
import {Button, Icon, Input} from 'react-native-elements';
import {PrimaryColor} from '../../../tools/Constant/Constant';
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';
import AuthApi from '../../../tools/Api/auth.api';
import {ResponseError} from '../../../tools/ErrorHandler/ErrorHandler';
import {useForm} from 'react-hook-form';

const SignUpMobileNumber = ({navigation, route}) => {
  const {register, handleSubmit, errors, setValue, getValues} = useForm();
  const contextProvider = useContext(context);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const [checkExistContact, setCheckExistContact] = useState(false);
  const [contact, setContact] = useState('');
  const [fullName, setFullName] = useState();
  const [email, setEmail] = useState();

  const contactInput = useRef();
  const fullNameInput = useRef();
  const emailInput = useRef();

  useEffect(() => {
    console.log('context', contextProvider);

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
        validate: CheckChangeContactExist,
      },
    );

    register('fullName', {
      required: 'Name is required',
    });

    register('email', {
      required: 'Email Address is required',
      pattern: {
        value: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
        message: 'Invalid email address',
      },
      // validate: ValidateEmail
    });
  }, []);

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

  const handleSetUpMobileNumber = async values => {
    console.log(values);

    if (checkExistContact) {
      return;
    } else {
      contextProvider.setSignUpStep({
        step: 1,
        mobile_number: values.phone,
        data: values,
      });
    }
  };

  const SetUpMobileNumber = (
    <View>
      <Input
        // placeholderTextColor="grey"
        ref={contactInput}
        label="Mobile Number"
        maxLength={10}
        leftIcon={<Text style={{fontSize: 18}}>+60</Text>}
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
        errorMessage={
          contact.length < 9
            ? 'New Number is Required'
            : checkExistContact
            ? 'Number Exist'
            : null
        }
        onSubmitEditing={() => fullNameInput.current.focus()}
        // onSubmitEditing={handleSubmit(handleLogin)}
        // onFocus={() => setButtonMargin(0)}
        // onBlur={() =>
        //   setButtonMargin(
        //     Dimensions.get("window").height * 0.08
        //   )
        // }
      />

      <Input
        ref={fullNameInput}
        label={'Name as per NRIC/Passport'}
        placeholder={'John Doe'}
        onChangeText={e => {
          setFullName(e);
          setValue('fullName', e, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
        onSubmitEditing={() => emailInput.current.focus()}
        errorMessage={errors.fullName && errors.fullName.message}
        value={fullName}
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
        onSubmitEditing={handleSubmit(handleSetUpMobileNumber)}
        // errorMessage={
        //     errors.email && !validateEmail
        //       ? errors.email.message
        //       : !errors.email && validateEmail
        //       ? I18n.t("SignUpDetails.errorMessage.emailExist")
        //       : null
        //   }
        value={email}
      />
    </View>
  );

  return (
    <View>
      <View style={{paddingHorizontal: 24}}>
        <Text
          style={{
            fontWeight: 'bold',
            color: PrimaryColor,
            fontSize: 24,
            marginBottom: 12,
          }}>
          Set up your mobile number
        </Text>
        <Text style={{color: '#606264', fontSize: 16, marginBottom: 12}}>
          UCSI Pay will send you a 6-digit verification code
        </Text>

        {SetUpMobileNumber}
      </View>

      <View
        style={{
          // flex: 1,
          // justifyContent: 'flex-end',
          alignItems: 'flex-end',
          paddingTop: 16,
          paddingRight: 32,
          // paddingBottom: 64,
        }}>
        <TouchableWithoutFeedback
          onPress={handleSubmit(handleSetUpMobileNumber)}>
          <Image
            source={require('../../../assest/image/UcsiIcon/arrow_right_circle.png')}
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
  );
};

export default SignUpMobileNumber;

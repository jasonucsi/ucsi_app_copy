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
  Alert,
} from 'react-native';
import {ActivityIndicator, Flex} from '@ant-design/react-native';
import {context} from '../../../../App';
import pushNotificationPlugin from '../../../plugin/pushNotification.plugin/pushNotification.plugin';
import Modal from 'react-native-modal';
import {Button, Icon, Input} from 'react-native-elements';
import {PrimaryColor} from '../../../tools/Constant/Constant';
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';
import {ResponseError} from '../../../tools/ErrorHandler/ErrorHandler';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {useForm} from 'react-hook-form';

const SignUpMobileNumber = ({navigation, route}) => {
  const {register, handleSubmit, errors, setValue} = useForm();
  const contextProvider = useContext(context);
  const [loading, setLoading] = useState(false);
  const [DOBModalVisible, setDOBModalVisible] = useState(false);
  const [DOB, setDOB] = useState();

  const [fullName, setFullName] = useState();
  const [cardNumber, setCardNumber] = useState();
  const [expiryDate, setExpiryDate] = useState();
  const [cvv, setCvv] = useState();

  const fullNameInput = useRef();
  const cardNumberInput = useRef();
  const expiryDateInput = useRef();
  const cvvInput = useRef();

  useEffect(() => {
    console.log('context', contextProvider);

    register('fullName', {
      required: 'Name on card is required',
    });

    register(
      {name: 'cardNumber'},
      {
        required: 'Card Number is required',
        minLength: {
          value: 16,
          message: 'Please insert valid card number',
        },
        maxLength: {
          value: 16,
          message: 'Please insert valid card number',
        },
      },
    );

    register(
      {name: 'expiryDate'},
      {
        required: 'Expiry Date is required',
        minLength: {
          value: 5,
          message: 'Please insert valid expiry date',
        },
        maxLength: {
          value: 5,
          message: 'Please insert valid expiry date',
        },
      },
    );

    register(
      {name: 'cvv'},
      {
        required: 'CVV is required',
        minLength: {
          value: 3,
          message: 'Please insert valid cvv',
        },
        maxLength: {
          value: 3,
          message: 'Please insert valid cvv',
        },
      },
    );
  }, []);

  const handleSubmitCard = async values => {
    console.log(values);

    Alert.alert(null, 'Confirm Card Details?', [
      {
        text: 'Cancel',
        //   onPress: () => console.log('Cancel Pressed'),
      },
      {
        text: 'OK',
        onPress: () => {
          Alert.alert(null, 'Add Card Successful!', [
            {
              text: 'OK',
              onPress: () => {
                navigation.goBack();
              },
            },
          ]);
        },
      },
    ]);

    // contextProvider.setSignUpStep({
    //   step: 1,
    //   mobile_number: values.phone,
    // });
  };

  const SetUpMobileNumber = (
    <View>
      <Input
        ref={fullNameInput}
        label={'Name on card'}
        placeholder={'John Doe'}
        onChangeText={e => {
          setFullName(e);
          setValue('fullName', e, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
        onSubmitEditing={() => cardNumberInput.current.focus()}
        errorMessage={errors.fullName && errors.fullName.message}
        value={fullName}
      />

      <Input
        // placeholderTextColor="grey"
        ref={cardNumberInput}
        label="Card Number"
        maxLength={16}
        placeholder={'1234 5678 9999 8888'}
        keyboardType="phone-pad"
        renderErrorMessage={true}
        value={cardNumber}
        onChangeText={e => {
          setCardNumber(e.replace(/[- #*;,.<>()+N\{\}\[\]\\\/]/gi, ''));
          setValue(
            'cardNumber',
            e.replace(/[- #*;,.<>()+N\{\}\[\]\\\/]/gi, ''),
            {
              shouldDirty: true,
              shouldValidate: true,
            },
          );
        }}
        errorMessage={errors.cardNumber && errors.cardNumber.message}
        // onSubmitEditing={() => fullNameInput.current.focus()}
        // onSubmitEditing={handleSubmit(handleLogin)}
        // onFocus={() => setButtonMargin(0)}
        // onBlur={() =>
        //   setButtonMargin(
        //     Dimensions.get("window").height * 0.08
        //   )
        // }
      />

      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 16,
          marginHorizontal: 10,
          color: '#86939e',
        }}>
        Expiry Date
      </Text>
      <TouchableWithoutFeedback onPress={() => setDOBModalVisible(true)}>
        <View
          style={{
            height: 49,
            borderColor: '#86939e',
            borderBottomWidth: 1,
            marginHorizontal: 8,
            // marginBottom: 24,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: !DOB ? '#86939e' : '#242424',
              fontSize: 16,
              marginHorizontal: 6,
            }}>
            {!DOB ? 'MM/YY' : moment(DOB).format('MM/YY')}
          </Text>
        </View>
      </TouchableWithoutFeedback>

      <View style={{margin: 5, paddingHorizontal: 10}}>
        <Text style={{color: '#f00', fontSize: 12}}>
          {errors.expiryDate ? errors.expiryDate.message : ''}
        </Text>
      </View>

      <Input
        // placeholderTextColor="grey"
        ref={cvvInput}
        label="CVV"
        maxLength={3}
        placeholder={'321'}
        keyboardType="phone-pad"
        renderErrorMessage={true}
        value={cvv}
        onChangeText={e => {
          setCvv(e.replace(/[- #*;,.<>()+N\{\}\[\]\\\/]/gi, ''));
          setValue('cvv', e.replace(/[- #*;,.<>()+N\{\}\[\]\\\/]/gi, ''), {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
        errorMessage={errors.cvv && errors.cvv.message}
        // onSubmitEditing={() => cvvInput.current.focus()}
        onSubmitEditing={handleSubmit(handleSubmitCard)}
        // onFocus={() => setButtonMargin(0)}
        // onBlur={() =>
        //   setButtonMargin(
        //     Dimensions.get("window").height * 0.08
        //   )
        // }
      />

      <View>
        <Button
          title={'Save'}
          buttonStyle={{
            backgroundColor: PrimaryColor,
            borderRadius: 8,
            paddingHorizontal: 24,
            paddingVertical: 12,
            width: 200,
          }}
          containerStyle={{
            alignItems: 'center',
            marginTop: 40,
            marginBottom: 8,
          }}
          titleStyle={{color: '#fff', fontSize: 20, fontWeight: '500'}}
          onPress={handleSubmit(handleSubmitCard)}
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
          <Text>By proceeding, I agree to the </Text>
          <Text style={{color: PrimaryColor}}>Terms and Conditions </Text>
          <Text>and </Text>
          <Text style={{color: PrimaryColor}}>Privacy Policy </Text>
          <Text>of UCSI Pay.</Text>
        </View>
      </View>
    </View>
  );

  const DOBModal = (
    <DateTimePickerModal
      isVisible={DOBModalVisible}
      minimumDate={
        moment().toDate()
        // new Date(
        //   moment().format("YYYY"),
        //   moment().format("M"),
        //   moment().format("D")
        // )
      }
      mode="date"
      headerTextIOS={'Select Expiry Date'}
      display="spinner"
      // display={"default"}
      onConfirm={date => {
        console.log(date);
        setDOB(date);
        setValue('expiryDate', moment(date).unix(), {
          shouldDirty: true,
          shouldValidate: true,
        });
        setDOBModalVisible(false);
      }}
      onCancel={() => setDOBModalVisible(false)}
    />
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 24,
        paddingHorizontal: 16,
      }}>
      {SetUpMobileNumber}

      {DOBModal}
    </View>
  );
};

export default SignUpMobileNumber;

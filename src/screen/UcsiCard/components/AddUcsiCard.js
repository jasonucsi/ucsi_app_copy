import React, {useEffect, useState, useContext, useRef} from 'react';
import moment from 'moment';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  SafeAreaView,
  Alert,
} from 'react-native';
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';
import Swiper from 'react-native-swiper';
import Currency from 'react-currency-formatter';
import LinearGradient from 'react-native-linear-gradient';
import {Avatar, Button, Divider, Icon, Input} from 'react-native-elements';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {PrimaryColor} from '../../../tools/Constant/Constant';
import AuthApi from '../../../tools/Api/auth.api';
import {ResponseError} from '../../../tools/ErrorHandler/ErrorHandler';
import {context} from '../../../../App';
import I18n from '../../../locales';
import {useForm} from 'react-hook-form';

const AddUcsiCard = ({navigation, route}) => {
  const contextProvider = useContext(context);
  const {register, handleSubmit, errors, setValue, getValues} = useForm();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const [SwiperImage, setSwiperImage] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const insets = useSafeAreaInsets();

  const [cardId, setCardId] = useState();
  const [campusId, setCampusId] = useState();

  const cardIdInput = useRef();

  useEffect(() => {
    console.log('route', route);

    register('cardId', {
      required: 'UCSI Card ID is required',
    });

    register('campusId', {
      required: 'Campus ID is required',
    });

    return () => {};
  }, []);

  const AddUCSICard = async values => {
    try {
      Alert.alert(null, 'Confirm UCSI CARD ID is correct?', [
        {
          text: 'Cancel',
          //   onPress: () => console.log('Cancel Pressed'),
        },
        {
          text: 'Submit',
          onPress: async () => {
            console.log(values);
            setLoading(true);

            const res = await AuthApi.addUCSICard(values.cardId, {
              bind: true,
              cardId: values.cardId,
              campusId: values.campusId,
            });
            console.log(res);
            if (res.status >= 200 || res.status < 300) {
              setLoading(false);

              Alert.alert(null, 'UCSI CARD Successfully Added!', [
                {
                  text: 'Ok',
                  onPress: () => {
                    navigation.goBack();
                  },
                },
              ]);
            } else {
              setLoading(false);
              Alert.alert(null, res.response.data);
            }
          },
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{backgroundColor: '#fff', flex: 1, padding: 24}}>
      <StatusBar
        backgroundColor={PrimaryColor}
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
      />
      <View>
        <Input
          ref={cardIdInput}
          label={'UCSI CARD ID'}
          placeholder={'UC89583275910'}
          onChangeText={e => {
            setCardId(e);
            setValue('cardId', e, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
          // onSubmitEditing={() => handleSubmit(AddUCSICard)()}
          errorMessage={errors.cardId && errors.cardId.message}
          value={cardId}
        />

        <Input
          ref={cardIdInput}
          label={'Campus ID'}
          placeholder={'CID0005'}
          onChangeText={e => {
            setCampusId(e);
            setValue('campusId', e, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
          // onSubmitEditing={() => handleSubmit(AddUCSICard)()}
          errorMessage={errors.cardId && errors.cardId.message}
          value={campusId}
        />

        <Button
          title={'Confirm'}
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
          onPress={handleSubmit(AddUCSICard)}
        />
      </View>
    </View>
  );
};

export default AddUcsiCard;

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  rightContent: {
    fontSize: 16,
    textAlign: 'right',
  },

  dividerStyle: {
    marginVertical: 16,
  },
});

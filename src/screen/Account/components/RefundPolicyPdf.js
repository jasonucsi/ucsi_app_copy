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
import Pdf from 'react-native-pdf';

const RefundPolicyPdf = ({navigation, route}) => {
  const contextProvider = useContext(context);
  const {register, handleSubmit, errors, setValue, getValues} = useForm();
  const [loading, setLoading] = useState(false);
  const [refundPolicyPdf, setRefundPolicyPdf] = useState({
    url: '',
  });
  const [authorization, setauthorization] = useState('');
  const [SwiperImage, setSwiperImage] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const insets = useSafeAreaInsets();

  const [cardId, setCardId] = useState();

  const cardIdInput = useRef();

  useEffect(() => {
    console.log('route', route);

    AuthToken();
    TncPrivacyPolicy();

    return () => {};
  }, []);

  const TncPrivacyPolicy = async () => {
    setLoading(true);

    const res = await AuthApi.tncPrivacyPolicy();
    console.log(res);
    if (res.status >= 200 || res.status < 300) {
      setLoading(false);
      setRefundPolicyPdf(res.data.refundPolicy);
    } else {
      setLoading(false);
      Alert.alert(null, res.response.data);
    }
  };

  const AuthToken = async () => {
    try {
      const token = await RNSecureStorage.get('jwt');
      if (token) {
        setauthorization(token);
      }
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
      <View style={styles.container}>
        <Pdf
          trustAllCerts={false}
          source={{
            // uri: 'http://samples.leanpub.com/thereactnativebook-sample.pdf',
            uri: refundPolicyPdf.url,
            headers: {
              authorization,
            },
          }}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`Current page: ${page}`);
          }}
          onError={error => {
            console.log(error);
          }}
          onPressLink={uri => {
            console.log(`Link pressed: ${uri}`);
          }}
          style={styles.pdf}
        />
      </View>
    </View>
  );
};

export default RefundPolicyPdf;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

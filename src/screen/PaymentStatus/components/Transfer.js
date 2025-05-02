import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Dimensions,
  Platform,
  TouchableWithoutFeedback,
  StatusBar,
  TouchableOpacity,
  FlatList,
  TouchableHighlight,
  Keyboard,
  Alert,
  PermissionsAndroid,
  KeyboardAvoidingView,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Button, Input, Divider, Avatar, ListItem} from 'react-native-elements';
import Swiper from 'react-native-swiper';
import {useForm} from 'react-hook-form';
import I18n from '../../../locales';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';
import TransactionApi from '../../../tools/Api/transaction.api';
import {PrimaryColor, SecondaryColor} from '../../../tools/Constant/Constant';
import AsyncStorage from '@react-native-community/async-storage';
import {Props} from 'react-native-image-zoom-viewer/built/image-viewer.type';
import NotificationPlugin from '../../../plugin/pushNotification.plugin/pushNotification.plugin';
import {ActivityIndicator} from '@ant-design/react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import CountryPicker from 'react-native-country-picker-modal';
import {ResponseError} from '../../../tools/ErrorHandler/ErrorHandler';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import Contacts from 'react-native-contacts';

const Stack = createStackNavigator();

const Transfer = ({navigation, route}) => {
  const {register, handleSubmit, errors, setValue} = useForm();
  const [loading, setLoading] = useState(false);
  const [androidContact, setAndroidContact] = useState([]);
  const [recentTransfer, setRecentTransfer] = useState([
    // {
    //   id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    //   name: 'Lim Giap Weng',
    //   mobileno: '0123456789',
    // },
    // {
    //   id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    //   name: 'Oh Chin Chin',
    //   mobileno: '0159858294',
    // },
    // {
    //   id: '58694a0f-3da1-471f-bd96-145571e29d72',
    //   name: 'Poh Jean Fai',
    //   mobileno: '0169783721',
    // },
    // {
    //   id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28dba',
    //   name: 'Tan Jung Kook',
    //   mobileno: '0108573612',
    // },
    // {
    //   id: '3ac68afc-c605-48d3-a4f8-fbd91aa97ff63',
    //   name: 'Kim Tae Hyung',
    //   mobileno: '0178472658',
    // },
    // {
    //   id: '58694a0f-3da1-471f-bd96-145571e29gd72',
    //   name: 'Park Ji Min',
    //   mobileno: '0168675728',
    // },
  ]);
  const [deviceContact, setDeviceContact] = useState();
  const [contact, setContact] = useState(0);
  const [fullName, setFullName] = useState('');
  const contactInput = useRef();
  const {height, width} = Dimensions.get('window');
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const swiper = useRef(null);
  const [buttonVisible, setButtonVisible] = useState(true);

  const [countryCode, setCountryCode] = useState('MY');
  const [countryNumber, setCountryNumber] = useState('60');

  const [skeletonMap, setSkeletonMap] = useState([
    {
      _id: '1',
    },
    {
      _id: '2',
    },
    {
      _id: '3',
    },
    {
      _id: '4',
    },
    {
      _id: '5',
    },
    {
      _id: '6',
    },
    {
      _id: '7',
    },
  ]);

  const onChangeIndex = value => {
    setIndex(value);
  };

  useEffect(() => {
    console.log(route);

    // getDeviceContact();
    GetRecentContact();

    register(
      {name: 'contact'},
      {
        required: I18n.t('LoginPage.ErrorMessage.mobileNumberRequired'),
        minLength: {
          value: 9,
          message: I18n.t('LoginPage.ErrorMessage.mobileNumberInvalid'),
        },
        maxLength: {
          value: 11,
          message: I18n.t('LoginPage.ErrorMessage.mobileNumberInvalid'),
        },
      },
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

  const GetRecentContact = async () => {
    try {
      setLoading(true);

      const res = await TransactionApi.getRecentContact();
      console.log('Recent', res);

      if (res.status >= 200 || res.status < 300) {
        setLoading(false);
        setRecentTransfer(res.data.contacts);
      } else {
        setLoading(false);
        ResponseError(res);
      }
    } catch (error) {
      setLoading(false);
      console.log('error', error);
    }
  };

  const handleLogin = async (values, transferType) => {
    try {
      setLoading(true);

      const res = await TransactionApi.getValidateNumber(values.contact);
      console.log('Recent', res);

      if (res.status >= 200 || res.status < 300) {
        setLoading(false);

        navigation.navigate('TransferMoney', {
          data: res.data,
          fullName: res.data.user.name,
          contact: values.contact,
          walletBalance: route.params.walletBalance,
          // barcodes: route.params.barcodes,
          // walletType: route.params.walletType,
          // refWallet: route.params.refWallet,
          // transferType: route.params.transferType,
          // point: route.params.point,
          // emailid: route.params.emailid,
          // mobileno: route.params.mobileno,
        });

        // setFullName(null);
        // setContact(null);
      } else {
        setLoading(false);
        Alert.alert(null, res.response.data);
      }
    } catch (error) {
      setLoading(false);
      console.log('error', error);
    }
  };

  const RequestContactList = async () => {
    const reqContact = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        title: 'Contacts',
        message: 'This app would like to view your contacts.',
        buttonPositive: 'Please accept bare mortal',
      },
    );

    console.log('reqContact', reqContact);

    if (reqContact === 'granted') {
      const allContact = await Contacts.getAll();

      console.log('get all contact', allContact);

      await RNSecureStorage.set('deviceContact', JSON.stringify(allContact), {
        accessible: ACCESSIBLE.WHEN_UNLOCKED,
      });

      // setContact(
      //   allContact[0].phoneNumbers[0].number.replace('-', '').replace(' ', ''),
      // );
    }

    // .then(
    //   Contacts.getAll()
    //     .then(contacts => {
    //       // work with contacts
    //       console.log('contacts', contacts);
    //     })
    //     .catch(e => {
    //       console.log('error', e);
    //     }),
    // );
    // };
  };

  const getDeviceContact = async () => {
    try {
      const res = await RNSecureStorage.get('deviceContact');
      console.log('device contact', res);

      if (res) {
        setDeviceContact(res);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const RecentList = (
    <View style={{flex: 1}}>
      <View style={{flex: 1, flexDirection: 'column'}}>
        <View style={{flex: 2 /* marginBottom: 24 */}}>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                backgroundColor: '#edf3f4',
                borderRadius: 5,
                height: 50,
                paddingHorizontal: 12,
                paddingTop: 12,
                marginRight: 10,
                borderColor: 'rgba(0,0,0,0.35)',
                borderWidth: 1,
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
                borderColor: 'rgba(0,0,0,0.35)',
                borderWidth: 1,
              }}>
              <Input
                // placeholderTextColor="grey"
                maxLength={11}
                placeholder={I18n.t('PaymentStatus.Label.mobileNumber')}
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
                ref={contactInput}
                value={contact}
                onChangeText={e => {
                  setContact(e.replace(/[- #*;,.<>()+N\{\}\[\]\\\/]/gi, ''));
                  setValue(
                    'contact',
                    e.replace(/[- #*;,.<>()+N\{\}\[\]\\\/]/gi, ''),
                    {
                      shouldDirty: true,
                      shouldValidate: true,
                    },
                  );
                }}
                // onSubmitEditing={() => Keyboard.dismiss()}
                onSubmitEditing={handleSubmit(handleLogin)}
                // onFocus={() => setButtonMargin(0)}
                // onBlur={() =>
                //   setButtonMargin(
                //     Dimensions.get("window").height * 0.08
                //   )
                // }
              />
            </View>
          </View>
          {errors.contact && (
            <Text
              style={{
                color: '#f00',
                fontSize: 12,
                textAlign: 'right',
              }}>
              {errors.contact.message}
            </Text>
          )}
        </View>
      </View>

      {loading ? (
        <View style={{flex: 6}}>
          <Text style={{fontSize: 16, paddingTop: !buttonVisible ? 24 : 0}}>
            Recent Trx
          </Text>
          <FlatList
            data={skeletonMap}
            keyExtractor={item => item._id}
            renderItem={({item}) => (
              <SkeletonPlaceholder speed={1000}>
                <ListItem
                  bottomDivider
                  containerStyle={{
                    backgroundColor: '#fff',
                    // paddingHorizontal: 16,
                    // paddingVertical: 12,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 16,
                      paddingTop: 12,
                    }}>
                    <View
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 100,
                        marginRight: 12,
                      }}
                    />

                    <View>
                      <View style={{width: 100, height: 19, marginBottom: 4}} />
                      <View style={{width: 70, height: 19}} />
                    </View>
                  </View>
                </ListItem>
              </SkeletonPlaceholder>
            )}
            showsVerticalScrollIndicator={false}
            // contentContainerStyle={{
            //   marginTop: 18,
            //   paddingHorizontal: 24,
            // }}
            ItemSeparatorComponent={() => (
              <Divider color="#bcbbc1" style={{marginVertical: 12}} />
            )}
          />
        </View>
      ) : !loading && recentTransfer.length > 0 ? (
        <View style={{flex: 6}}>
          <Text style={{fontSize: 16, paddingTop: !buttonVisible ? 24 : 0}}>
            Recent Trx
          </Text>
          <FlatList
            data={recentTransfer}
            showsVerticalScrollIndicator={false}
            style={{marginBottom: 24}}
            renderItem={({item}) => (
              <ListItem
                bottomDivider
                containerStyle={{
                  backgroundColor: '#fff',
                  //   paddingHorizontal: 24,
                  paddingVertical: 12,
                }}
                onPress={() => {
                  console.log(item.contact.number);

                  // var SubContact = item.mobileno.substring(
                  //   1,
                  //   item.mobileno.length
                  // );

                  setContact(item.contact.number);
                  setFullName(item.name);
                  setValue('contact', item.contact.number);

                  handleSubmit(handleLogin)();
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Avatar
                    rounded
                    size="small"
                    title={item.name[0]}
                    containerStyle={{
                      backgroundColor: PrimaryColor,
                      marginRight: 12,
                    }}

                    //   icon={{ name: "user", type: "font-awesome" }}
                    // source={{
                    //   uri:
                    //     "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg",
                    // }}
                  />

                  <View>
                    <Text>{item.name}</Text>
                    <Text style={{color: 'rgba(0,0,0,0.35)'}}>
                      +60 {item.contact.number}
                    </Text>
                  </View>
                </View>
              </ListItem>
            )}
            keyExtractor={item => item.id}
          />
        </View>
      ) : (
        <View style={{flex: 6}}>
          <Text
            style={{
              fontSize: 20,
              paddingTop: 16,
              textAlign: 'center',
              marginBottom: 24,
              color: '#606264',
              fontWeight: '500',
            }}>
            {/* Please allow access to Contacts through the app settings */}
            Oops... There’s isn’t any recent transfer of money listing.
            {/* {I18n.t("PaymentStatus.Label.noRecentTransferDesc")} */}
          </Text>

          {/* <Button
            title={'Manage Settings'}
            buttonStyle={{
              backgroundColor: PrimaryColor,
              borderRadius: 8,
              paddingHorizontal: 24,
              paddingVertical: 12,
              width: 240,
            }}
            containerStyle={{alignItems: 'center'}}
            titleStyle={{color: '#fff', fontSize: 20, fontWeight: '500'}}
            onPress={() => RequestContactList()}
          /> */}
        </View>
      )}

      {(buttonVisible || Platform.OS === 'ios') && (
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={Platform.OS === 'ios' && 240}
          // style={{flex: 1.3}}
        >
          <Button
            disabled={loading}
            title={'Transfer'}
            buttonStyle={{
              borderRadius: 100,
              backgroundColor: PrimaryColor,
              marginBottom: 12,
            }}
            titleStyle={{
              color: '#fff',
              fontWeight: 'bold',
              paddingVertical: 8,
              paddingHorizontal: Dimensions.get('window').width * 0.18,
            }}
            onPress={() => {
              handleSubmit(handleLogin)();
            }}
          />

          <Text style={{textAlign: 'center', color: 'rgba(0,0,0,0.45)'}}>
            You are able to transfer up to RM{route.params.walletBalance}
          </Text>
        </KeyboardAvoidingView>
        // <View style={{ flex: 2 }}>
        //   <Button
        //     disabled={loading}
        //     title={"Transfer Money"}
        //     buttonStyle={{
        //       borderRadius: 100,
        //       backgroundColor: "#0094d9",
        //       marginBottom: 16,
        //     }}
        //     titleStyle={{
        //       color: "#fff",
        //       fontWeight: "bold",
        //       paddingVertical: 8,
        //       paddingHorizontal: Dimensions.get("window").width * 0.18,
        //     }}
        //     onPress={() => {
        //       handleSubmit(handleLogin)("Money");
        //     }}
        //   />

        //   <Button
        //     disabled={loading}
        //     title={"Transfer Point"}
        //     buttonStyle={{
        //       borderRadius: 100,
        //       backgroundColor: "#0094d9",
        //     }}
        //     titleStyle={{
        //       color: "#fff",
        //       fontWeight: "bold",
        //       paddingVertical: 8,
        //       paddingHorizontal: Dimensions.get("window").width * 0.18,
        //     }}
        //     onPress={() => {
        //       handleSubmit(handleLogin)("Point");
        //     }}
        //   />
        // </View>
      )}
    </View>
  );

  const DeviceContact = (
    <View style={{flex: 1}}>
      <View style={{flex: 1, flexDirection: 'column'}}>
        <View style={{flex: 2 /* marginBottom: 24 */}}>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                backgroundColor: '#edf3f4',
                borderRadius: 5,
                height: 50,
                paddingHorizontal: 12,
                paddingTop: 12,
                marginRight: 10,
                borderColor: 'rgba(0,0,0,0.35)',
                borderWidth: 1,
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
                borderColor: 'rgba(0,0,0,0.35)',
                borderWidth: 1,
              }}>
              <Input
                // placeholderTextColor="grey"
                maxLength={11}
                placeholder={I18n.t('PaymentStatus.Label.mobileNumber')}
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
                ref={contactInput}
                value={contact}
                onChangeText={e => {
                  setContact(e.replace(/[- #*;,.<>()+N\{\}\[\]\\\/]/gi, ''));
                  setValue(
                    'contact',
                    e.replace(/[- #*;,.<>()+N\{\}\[\]\\\/]/gi, ''),
                    {
                      shouldDirty: true,
                      shouldValidate: true,
                    },
                  );
                }}
                // onSubmitEditing={() => Keyboard.dismiss()}
                onSubmitEditing={handleSubmit(handleLogin)}
                // onFocus={() => setButtonMargin(0)}
                // onBlur={() =>
                //   setButtonMargin(
                //     Dimensions.get("window").height * 0.08
                //   )
                // }
              />
            </View>
          </View>
          {errors.contact && (
            <Text
              style={{
                color: '#f00',
                fontSize: 12,
                textAlign: 'right',
              }}>
              {errors.contact.message}
            </Text>
          )}
        </View>
      </View>

      {loading ? (
        <View style={{flex: 6}}>
          <Text style={{fontSize: 16, paddingTop: !buttonVisible ? 24 : 0}}>
            {I18n.t('PaymentStatus.Label.recent')}
          </Text>
          <FlatList
            data={skeletonMap}
            keyExtractor={item => item._id}
            renderItem={({item}) => (
              <SkeletonPlaceholder speed={1000}>
                <ListItem
                  bottomDivider
                  containerStyle={{
                    backgroundColor: '#fff',
                    // paddingHorizontal: 16,
                    // paddingVertical: 12,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 16,
                      paddingTop: 12,
                    }}>
                    <View
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 100,
                        marginRight: 12,
                      }}
                    />

                    <View>
                      <View style={{width: 100, height: 19, marginBottom: 4}} />
                      <View style={{width: 70, height: 19}} />
                    </View>
                  </View>
                </ListItem>
              </SkeletonPlaceholder>
            )}
            showsVerticalScrollIndicator={false}
            // contentContainerStyle={{
            //   marginTop: 18,
            //   paddingHorizontal: 24,
            // }}
            ItemSeparatorComponent={() => (
              <Divider color="#bcbbc1" style={{marginVertical: 12}} />
            )}
          />
        </View>
      ) : !loading && recentTransfer.length > 0 ? (
        <View style={{flex: 6}}>
          <Text style={{fontSize: 16, paddingTop: !buttonVisible ? 24 : 0}}>
            {I18n.t('PaymentStatus.Label.recent')}
          </Text>
          <FlatList
            data={recentTransfer}
            showsVerticalScrollIndicator={false}
            style={{marginBottom: 24}}
            renderItem={({item}) => (
              <ListItem
                bottomDivider
                containerStyle={{
                  backgroundColor: '#fff',
                  //   paddingHorizontal: 24,
                  paddingVertical: 12,
                }}
                onPress={() => {
                  console.log(item.mobileno.length);

                  // var SubContact = item.mobileno.substring(
                  //   1,
                  //   item.mobileno.length
                  // );

                  setContact(item.mobileno);
                  setFullName(item.name);
                  setValue('contact', item.mobileno);
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Avatar
                    rounded
                    size="small"
                    title={item.name[0]}
                    containerStyle={{
                      backgroundColor: PrimaryColor,
                      marginRight: 12,
                    }}

                    //   icon={{ name: "user", type: "font-awesome" }}
                    // source={{
                    //   uri:
                    //     "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg",
                    // }}
                  />

                  <View>
                    <Text>{item.name}</Text>
                    <Text style={{color: 'rgba(0,0,0,0.35)'}}>
                      {item.mobileno}
                    </Text>
                  </View>
                </View>
              </ListItem>
            )}
            keyExtractor={item => item.id}
          />
        </View>
      ) : (
        <View style={{flex: 6}}>
          <Text
            style={{
              fontSize: 20,
              paddingTop: 16,
              textAlign: 'center',
              marginBottom: 24,
              color: '#606264',
              fontWeight: '500',
            }}>
            {/* Please allow access to Contacts through the app settings */}
            Oops... There’s isn’t any recent transfer of money listing.
            {/* {I18n.t("PaymentStatus.Label.noRecentTransferDesc")} */}
          </Text>

          {/* <Button
            title={'Manage Settings'}
            buttonStyle={{
              backgroundColor: PrimaryColor,
              borderRadius: 8,
              paddingHorizontal: 24,
              paddingVertical: 12,
              width: 240,
            }}
            containerStyle={{alignItems: 'center'}}
            titleStyle={{color: '#fff', fontSize: 20, fontWeight: '500'}}
            onPress={() => RequestContactList()}
          /> */}
        </View>
      )}

      {buttonVisible && (
        <View style={{flex: 1.3}}>
          <Button
            disabled={loading}
            title={'Transfer'}
            buttonStyle={{
              borderRadius: 100,
              backgroundColor: PrimaryColor,
              marginBottom: 12,
            }}
            titleStyle={{
              color: '#fff',
              fontWeight: 'bold',
              paddingVertical: 8,
              paddingHorizontal: Dimensions.get('window').width * 0.18,
            }}
            onPress={() => {
              handleSubmit(handleLogin)();
            }}
          />

          <Text style={{textAlign: 'center', color: 'rgba(0,0,0,0.45)'}}>
            You are able to transfer up to RM{route.params.walletBalance}
          </Text>
        </View>
        // <View style={{ flex: 2 }}>
        //   <Button
        //     disabled={loading}
        //     title={"Transfer Money"}
        //     buttonStyle={{
        //       borderRadius: 100,
        //       backgroundColor: "#0094d9",
        //       marginBottom: 16,
        //     }}
        //     titleStyle={{
        //       color: "#fff",
        //       fontWeight: "bold",
        //       paddingVertical: 8,
        //       paddingHorizontal: Dimensions.get("window").width * 0.18,
        //     }}
        //     onPress={() => {
        //       handleSubmit(handleLogin)("Money");
        //     }}
        //   />

        //   <Button
        //     disabled={loading}
        //     title={"Transfer Point"}
        //     buttonStyle={{
        //       borderRadius: 100,
        //       backgroundColor: "#0094d9",
        //     }}
        //     titleStyle={{
        //       color: "#fff",
        //       fontWeight: "bold",
        //       paddingVertical: 8,
        //       paddingHorizontal: Dimensions.get("window").width * 0.18,
        //     }}
        //     onPress={() => {
        //       handleSubmit(handleLogin)("Point");
        //     }}
        //   />
        // </View>
      )}
    </View>
  );

  return (
    <SafeAreaView
      style={{
        paddingHorizontal: 24,
        backgroundColor: '#fff',
        height: '100%',
      }}>
      <StatusBar backgroundColor={PrimaryColor} barStyle="light-content" />

      {/* {DeviceContact} */}
      {RecentList}

      <ActivityIndicator
        toast
        size="large"
        animating={loading}
        text={I18n.t('PaymentStatus.Label.loading')}
      />
    </SafeAreaView>
  );
};

export default Transfer;

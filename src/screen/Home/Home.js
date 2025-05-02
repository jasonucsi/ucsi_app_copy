import React, {useEffect, useState, useContext, useCallback} from 'react';
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
  TouchableNativeFeedback,
  RefreshControl,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { WebView } from 'react-native-webview';
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';
import Swiper from 'react-native-swiper';
import Currency from 'react-currency-formatter';
import LinearGradient from 'react-native-linear-gradient';
import {Avatar, Button, Divider, Icon, ListItem} from 'react-native-elements';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {PrimaryColor} from '../../tools/Constant/Constant';
import I18n from '../../locales';
import AuthApi from '../../tools/Api/auth.api';
import PromotionApi from '../../tools/Api/promotion.api';
import {ResponseError} from '../../tools/ErrorHandler/ErrorHandler';
import {context} from '../../../App';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import RNPickerSelect from 'react-native-picker-select';
import {ActivityIndicator} from '@ant-design/react-native';
import Modal from 'react-native-modal';
import Video from 'react-native-video';
import LottieView from 'lottie-react-native';
import {load} from 'npm';
import DropShadow from 'react-native-drop-shadow';
import SecureImageLoader from '../../library/SecureImageLoader';
// import NumberFormat from 'react-number-format';

const { height } = Dimensions.get('window');

const home = ({navigation, route}) => {
  const contextProvider = useContext(context);
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState();
  const [refreshLoading, setRefreshloading] = useState(false);
  const [kycModalVisible, setKycModalVisible] = useState(false);

  const [walletDetails, setWalletDetails] = useState();
  const [walletBalance, setWalletBalance] = useState(0);

  const insets = useSafeAreaInsets();

  const menu = [
    // {
    //   name: "Top Up",
    //   icon_type: "feather",
    //   icon_name: "dollar-sign"
    // },
    {
      name: 'Scan',
      title: I18n.t('Account.Home.scan'),
      image: require('../../assest/image/UcsiIcon/scan.png'),
    },
    {
      name: 'Pay',
      title: I18n.t('Account.Home.pay'),
      image: require('../../assest/image/UcsiIcon/pay.png'),
    },
    {
      name: 'Transfer',
      title: I18n.t('Account.Home.transfer'),
      image: require('../../assest/image/UcsiIcon/transfer.png'),
    },
    {
      name: 'Receive',
      title: 'Receive Money',
      image: require('../../assest/image/UcsiIcon/receive.png'),
    },
  ];

  const subMenu = [
    {
      name: 'Education',
      title: 'Education',
      // html: 'https://www.mrca.org.my/memberdirectory',
      image: require('../../assest/image/UcsiIcon/education.png'),
    },
    {
      name: 'Food & Drinks',
      title: 'Food & Drinks',
      image: require('../../assest/image/UcsiIcon/food.png'),
    },
    {
      name: 'Promotions',
      title: 'Promotions',
      image: require('../../assest/image/UcsiIcon/promotions.png'),
    },
    {
      name: 'Healthcare',
      title: 'Healthcare',
      image: require('../../assest/image/UcsiIcon/healthcare.png'),
    },
    {
      name: 'Stays',
      title: 'Stays',
      image: require('../../assest/image/UcsiIcon/stays.png'),
    },
    {
      name: 'Delivery',
      title: 'Delivery',
      image: require('../../assest/image/UcsiIcon/delivery.png'),
    },
    {
      name: 'Milestone',
      title: 'Milestone',
      image: require('../../assest/image/UcsiIcon/milestone.png'),
    },
    {
      name: 'Others',
      title: 'Others',
      image: require('../../assest/image/UcsiIcon/others.png'),
    },
  ];

  const [latestDeal, setLatestDeal] = useState([
    // {
    //   _id: '1',
    //   // name: 'DJI',
    //   // html: 'https://www.dji.com/',
    //   // image: require('../../assest/image/demo/ucsi_card_1.png'),
    // },
    // {
    //   _id: '2',
    //   // name: 'DJI',
    //   // html: 'https://www.dji.com/',
    //   // image: require('../../assest/image/demo/ucsi_card_1.png'),
    // },
    // {
    //   _id: '3',
    //   // name: 'DJI',
    //   // html: 'https://www.dji.com/',
    //   // image: require('../../assest/image/demo/ucsi_card_1.png'),
    // },
  ]);

  const MoreMenu = [
    // {
    //   name: 'Dependents',
    //   title: 'Dependents',
    //   image: require('../../assest/image/Icon/network.png'),
    // },
    // {
    //   name: 'Utility',
    //   title: 'Utility',
    //   image: require('../../assest/image/Icon/bill.png'),
    // },
    // {
    //   name: 'Health',
    //   title: 'Health',
    //   image: require('../../assest/image/Icon/healthcare.png'),
    // },
    // {
    //   name: 'Insurance',
    //   title: 'Insurance',
    //   image: require('../../assest/image/Icon/insurance.png'),
    // },
    // {
    //   name: 'Prepaid',
    //   title: 'Prepaid',
    //   image: require('../../assest/image/Icon/e-wallet.png'),
    // },
  ];

  const [transactionHistory, setTransactionHistory] = useState([
    {
      _id: '1',
      name: 'Jackson Wang',
      type: 'Debit',
      amount: 17.8,
      timestamp: 1655798988,
      remark: 'Receive Testing',
      transactionId: 'UC23567653',
    },
    {
      _id: '2',
      name: 'Jackson Wang',
      type: 'Credit',
      amount: 56.21,
      timestamp: 1655898988,
      remark: 'Transfer Testing',
      transactionId: 'UC75684658',
    },
    {
      _id: '3',
      // name: 'Donnie Yen',
      type: 'Top Up',
      amount: 100,
      timestamp: 1659898988,
      transactionId: 'UC3214626',
    },
    {
      _id: '4',
      name: 'BTS Store',
      type: 'Credit',
      amount: 122.11,
      timestamp: 1669898988,
      remark: 'Buying Staff',
      transactionId: 'UC24804212',
    },
    {
      _id: '5',
      name: 'Hololive Industry',
      type: 'Credit',
      amount: 210.99,
      timestamp: 1671958988,
      remark: 'Buy Merch',
      transactionId: 'UC23906719',
    },

    /////////////////////////////////////////
    // {
    //   purpose: "Nasi Lemak Sdn Bhd",
    //   amount: 17.8,
    //   createdtime: 1647406948,
    //   status: "Successful",
    //   txnType: "Debit",
    //   point: 500,
    //   pointType: "redeem",
    // },
    // {
    //   purpose: "Top up",
    //   amount: 100,
    //   createdtime: 1647416948,
    //   status: "Successful",
    //   txnType: "Topup",
    //   point: 400,
    //   pointType: "given",
    // },
    // {
    //   purpose: "Ban Ban Bob - Sentul Raya",
    //   amount: 59.9,
    //   createdtime: 1647526948,
    //   status: "Successful",
    //   txnType: "Debit",
    //   point: 650,
    //   pointType: "redeem",
    // },
    // {
    //   purpose: "KK Mart | Damansara",
    //   amount: 12.2,
    //   createdtime: 1647536948,
    //   status: "Successful",
    //   txnType: "Debit",
    //   point: 250,
    //   pointType: "redeem",
    // },
    // {
    //   purpose: "Itsuba Dockers - Petaling Jaya",
    //   amount: 17.8,
    //   createdtime: 1647546948,
    //   status: "Successful",
    //   txnType: "Debit",
    //   point: 180,
    //   pointType: "given",
    // },
  ]);
  const highlights = [
    // {
    //   _id: '1',
    //   img: require('../../assest/image/media/ads1.jpeg'),
    // },
    // {
    //   _id: '2',
    //   img: require('../../assest/image/media/ads2.jpeg'),
    // },
    // {
    //   _id: '3',
    //   img: require('../../assest/image/media/ads3.jpeg'),
    // },
    // {
    //   _id: "1",
    //   image:
    //     "https://paultan.org/image/2021/09/Honda-Malaysia-September-savings-promotion-1.jpg",
    // },
    // {
    //   _id: "2",
    //   image:
    //     "https://cache.dominos.com/wam/prod/market/MY/_en/images/promo/65f9eb91-ba2a-4d4e-b61d-467406e7ba19.jpg",
    // },
  ];

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

  useEffect(() => {
    console.log(contextProvider);

    if (
      contextProvider.contextProvider.my_profile.verificationStatus === 'new'
    ) {
      setKycModalVisible(true);
    } else {
      // PinFunction()
      InitialData();
    }

    return () => {};
  }, [contextProvider]);

  const InitialData = async e => {
    await Promise.all([
      GetWalletBalance(),
      WalletTransactionHistory(),
      GetPromotionList(),
      // GetUserData(value),
      // GetUserSpecialWallet(value),
      // GetUserPoint(value),
      // GetProfileImage(),
    ]);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const GetWalletBalance = async () => {
    try {
      setLoading(true);

      const res = await AuthApi.getWallet();
      console.log('wallet', res);

      if (res.status >= 200 || res.status < 300) {
        setWalletDetails(res.data);
        setWalletBalance(res.data.balance / 100);
      } else {
        // setLoading(false);
        // ResponseError(res);
      }
    } catch (error) {
      console.log('wallet error', error);
    }
  };

  const WalletTransactionHistory = async () => {
    setLoading(true);

    const res = await AuthApi.getTransaction();
    console.log('history', res);

    if (res.status === 200) {
      // setLoading(false);
      setTransactionHistory(res.data.transactions);
    } else {
      setLoading(false);
      ResponseError(res);
    }
  };

  const GetPromotionList = async () => {
    setLoading(true);

    const res = await PromotionApi.getPromotionList();
    console.log('latestDeal', res);

    if (res.status === 200) {
      // setLoading(false);
      setLatestDeal(res.data.promotions);
    } else {
      setLoading(false);
      ResponseError(res);
    }
  };

  const onRefresh = useCallback(() => {
    InitialData();

    // setLoading(true);
    // setTimeout(() => {
    //   setLoading(false);
    // }, 2000);
  });

  const renderTransactionHistory = ({item}) => (
    <ListItem
      containerStyle={{padding: 0}}
      // onPress={() => navigation.navigate('TransactionDetails', { data: item })}
    >
      <TouchableWithoutFeedback
        onPress={() => navigation.navigate('TransactionDetails', {data: item})}>
        <View
          style={{
            // flex: 1,
            // justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexDirection: 'row',
          }}>
          <View style={{flex: 7}}>
            <View>
              <Text style={{fontWeight: 'bold'}} numberOfLines={1}>
                {/* {item.type === 'Top Up' ? 'Top Up' : item.name} */}
                {item.relativeParty?.name
                  ? item.relativeParty?.name
                  : item.remark}
              </Text>
            </View>

            <View>
              <Text style={{fontSize: 12, color: 'grey'}}>
                {moment(item.transactionDate).format('DD MMM YYYY, hh:mm:ssa')}
                {/* {moment.unix(item.timestamp).format('DD MMM YYYY, hh:mm:ssa')} */}
              </Text>
            </View>
          </View>
          <View style={{flex: 3}}>
            <Text
              style={{
                fontWeight: 'bold',
                color: item.amount < 0 ? '#cf1322' : '#389e0d',
                textAlign: 'right',
              }}>
              <Currency currency="MYR" quantity={item.amount / 100} />
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ListItem>
  );

  const renderHighlights = ({item}) => (
    //   <View
    //   style={{
    //     // paddingHorizontal: 16,
    //     marginBottom: 24,
    //     height: 140
    //   }}>
    //   <Swiper
    //     height={140}
    //     showsButtons={false}
    //     paginationStyle={{
    //       transform: [{ translateY: 16 }, { translateX: -0 }]
    //     }}
    //     activeDotColor="#fff">
    //     {SwiperImage.map(value => (
    //       <View style={[styles.slide1, { borderRadius: 4 }]} key={value.uid}>
    //         <Image
    //           source={{ uri: value.image[0].url }}
    //           style={{
    //             // width: Dimensions.get('window').width,
    //             width: '100%',
    //             height: '100%',
    //             borderRadius: 10
    //           }}
    //           resizeMode="stretch"
    //         />
    //       </View>
    //     ))}
    //   </Swiper>
    // </View>
    <View style={{borderRadius: 20}}>
      <Image
        source={item.img}
        // source={{ uri: item.image }}
        style={{
          width: Dimensions.get('window').width,
          height: 120,
          borderRadius: 20,
        }}
        resizeMethod="scale"
        resizeMode="cover"
      />
    </View>
  );

  const KycModal = (
    <Modal
      isVisible={kycModalVisible}
      style={
        {
          // margin: 0,
          // justifyContent: "flex-end",
          //   marginTop: Platform.OS === 'ios' ? insets.top : null,
        }
      }
      // onBackdropPress={() => {
      //   setKycModalVisible(false);
      // }}
    >
      <View
        style={{
          backgroundColor: '#fff',
          paddingHorizontal: 24,
          paddingBottom: 24,
          borderRadius: 8,
          justifyContent: 'center',
        }}>
        <Image
          source={require('../../assest/image/UcsiIcon/doc_orange_form.gif')}
          style={{
            width: Dimensions.get('window').width * 0.8,
            height: Dimensions.get('window').width * 0.8,
          }}
          resizeMode="contain"
          resizeMethod="scale"
        />

        <Button
          title={'Setup Your KYC Now'}
          buttonStyle={{
            backgroundColor: PrimaryColor,
            borderRadius: 100,
          }}
          titleStyle={{
            fontSize: 22,
            fontWeight: 'bold',
          }}
          onPress={() => {
            setKycModalVisible(false);

            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'Kyc',
                  // params: {
                  //   // data: route.params.data,
                  // },
                },
              ],
            });
          }}
        />
      </View>
    </Modal>
  );

  return (
    <View style={{backgroundColor: '#fff', flex: 1}}>
      <StatusBar backgroundColor="transparent" barStyle="light-content" />
      <ScrollView
        automaticallyAdjustKeyboardInsets={true}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshLoading} onRefresh={onRefresh} />
        }>
        <ImageBackground
          source={require('../../assest/image/UcsiOnBoarding/background1.png')}
          style={{
            position: 'absolute',
            height: Dimensions.get('window').height * 0.39,
            width: Dimensions.get('window').width,
          }}
          resizeMode="stretch"
          resizeMethod="scale"
        />
        {/* <LinearGradient
          // colors={[PrimaryColor, "#b3e7ff"]}
          // start={{ x: 0.0, y: 0.5 }}
          // end={{ x: 0.75, y: 1.0 }}
          colors={['#b1803b', '#707d6b', '#337a99']}
          start={{x: 0, y: 0.5}}
          end={{x: 1, y: 0.5}}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: Dimensions.get('window').height * 0.44,
          }}>
     
        </LinearGradient> */}
        <View
          style={{
            zIndex: 100,
            marginTop:
              Platform.OS === 'ios'
                ? insets.top + 12
                : StatusBar.currentHeight + 12,
            paddingHorizontal: 24,
            marginBottom: 32,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{flex: 1}}>
              <View>
                <Text
                  // style={[
                  //   styles.walletFontColor,
                  //   {fontSize: 16, marginRight: 8},
                  // ]}
                  style={{fontSize: 24, fontWeight: '600', color: '#fff'}}>
                  UCSIPAY Balance
                  {/* {walletName} Balances */}
                </Text>

                <Text
                  style={[
                    styles.walletFontColor,
                    {fontSize: 30, fontWeight: 'bold'},
                  ]}>
                  <Currency
                    // quantity={128.96}
                    quantity={walletBalance ? walletBalance : 0}
                    currency="MYR"
                    pattern="! ##,###.00"
                  />
                </Text>
              </View>
            </View>
            <View>
              <View>
                {profilePicture ? (
                  <Avatar
                    // icon={{
                    //   type: "font-awesome",
                    //   name: "user",
                    //   color: "#fff",
                    //   // size: 40,
                    // }}
                    containerStyle={{borderWidth: 2, borderColor: '#fff'}}
                    // source={require("../../assest/image/demo/white-chocolate-macadamia-side.jpg")}
                    // source={{
                    //   uri: "https://randomuser.me/api/portraits/men/36.jpg",
                    // }}
                    source={{uri: `data:image/jpeg;base64,${profilePicture}`}}
                    rounded
                    onPress={() => navigation.navigate('Done')}
                    size={48}
                  />
                ) : (
                  <Avatar
                    icon={{
                      type: 'font-awesome',
                      name: 'user',
                      color: '#fff',
                      // size: 40,
                    }}
                    containerStyle={{borderWidth: 2, borderColor: '#fff'}}
                    // source={require("../../assest/image/demo/white-chocolate-macadamia-side.jpg")}
                    // source={{
                    //   uri: "https://randomuser.me/api/portraits/men/36.jpg",
                    // }}
                    rounded
                    onPress={() => navigation.navigate('Account')}
                    size={48}
                  />
                )}
              </View>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 12,
              marginBottom: 24,
            }}>
            <Button
              title={
                <Text
                  style={{
                    color: '#606264',
                    fontWeight: 'bold',
                    fontSize: 18,
                  }}>
                  Reload
                </Text>
              }
              icon={{
                type: 'entypo',
                name: 'plus',
                color: PrimaryColor,
                size: 20,
              }}
              TouchableComponent={TouchableWithoutFeedback}
              buttonStyle={{
                borderRadius: 100,
                backgroundColor: '#fff',
                height: 50,
                width: 140,
                paddingRight: 24,
                // paddingVertical: 4,
              }}
              onPress={() => {
                if (walletBalance > 0) {
                  navigation.navigate('TopUp', {
                    walletBalance,
                  });
                } else {
                  navigation.navigate('FirstTimeTopUp');
                }
              }}
            />

            <Button
              type="outline"
              title={'Parking'}
              icon={{
                type: 'font-awesome-5',
                name: 'car',
                color: '#fff',
                size: 20,
              }}
              TouchableComponent={TouchableWithoutFeedback}
              buttonStyle={{
                borderColor: '#fff',
                borderWidth: 2,
                borderRadius: 100,
                height: 50,
                width: 140,
              }}
              titleStyle={{color: '#fff', fontSize: 18, paddingLeft: 4}}
              onPress={() => navigation.navigate('Parking')}
            />
          </View>

          <View
            style={{
              // backgroundColor: '#eaf2fd',
              backgroundColor: '#fff',
              borderRadius: 10,
              paddingTop: 24,
              paddingHorizontal: 16,
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',

              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
            }}>
            {menu.map(val =>
              val.name !== '' ? (
                <TouchableWithoutFeedback
                  key={val.name}
                  onPress={() => {
                    switch (val.name) {
                      case 'Receive':
                        navigation.navigate('Receive', {
                          type: 'Receive',
                          walletDetails,
                          walletBalance,
                        });
                        break;

                      case 'Pay':
                        navigation.navigate('Receive', {
                          type: 'Pay',
                          walletDetails,
                          walletBalance,
                        });
                        break;

                      case 'Scan':
                        navigation.navigate('Receive', {
                          type: 'Scan',
                          walletDetails,
                          walletBalance,
                        });
                        break;

                      case 'Transfer':
                        navigation.navigate('Transfer', {
                          walletDetails,
                          walletBalance,
                        });
                        break;

                      case 'Shop':
                        navigation.navigate('Shop');
                        // setShopModalVisible(true);
                        break;

                      case 'Jobs':
                        setJobModalVisible(true);
                        break;

                      default:
                        break;
                    }
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 24,
                      paddingHorizontal: 12,
                      flex: 2,
                    }}>
                    {val.image && (
                      <Image
                        source={val.image}
                        style={{
                          width: Dimensions.get('window').width * 0.1,
                          height: Dimensions.get('window').width * 0.1,

                          marginBottom: 8,
                        }}
                        resizeMode="contain"
                        resizeMethod="scale"
                      />
                    )}
                    {val.icon_name && (
                      <View
                        style={{
                          width: Dimensions.get('window').width * 0.12,
                          height: Dimensions.get('window').width * 0.12,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Icon
                          type={val.icon_type}
                          name={val.icon_name}
                          color={PrimaryColor}
                          size={Dimensions.get('window').width * 0.09}
                        />
                      </View>
                    )}
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 12,
                        paddingTop: 2,
                      }}>
                      {val.title}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              ) : (
                <View
                  style={{
                    paddingHorizontal: 12,
                    marginBottom: 24,
                  }}
                  key={val.name}>
                  <View
                    style={{
                      width: Dimensions.get('window').width * 0.12,
                      height: Dimensions.get('window').width * 0.12,
                    }}
                  />
                </View>
              ),
            )}
          </View>
        </View>
        {/* <ScrollView> */}

        <View>
          <View
            style={{
              overflow: 'hidden',
            }}>
            <View
              style={{
                zIndex: -1,
                backgroundColor: '#fff',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5,

                marginBottom: 12,
                // paddingTop: 28,
                paddingHorizontal: 24,
                paddingBottom: 8,

                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text>{I18n.t('Account.Home.transactionHistory')}</Text>

              <TouchableWithoutFeedback
                onPress={() => navigation.navigate('TransactionHistory')}>
                <Text style={{fontSize: 12, color: 'rgba(0,0,0,0.35)'}}>
                  {I18n.t('Account.Home.viewMore')}
                </Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
          {loading ? (
            <FlatList
              data={skeletonMap}
              keyExtractor={item => item._id}
              renderItem={({item}) => (
                <SkeletonPlaceholder speed={1000}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}>
                    <View style={{flex: 1}}>
                      <View
                        style={{
                          flex: 1,
                          width: 100,
                          height: 19,
                          marginBottom: 4,
                        }}
                      />
                      <View style={{flex: 1, width: 140, height: 16.3}} />
                    </View>
                    <View style={{flex: 1}}>
                      <View
                        style={{
                          flex: 1,
                          width: 80,
                          height: 19,
                          marginBottom: 4,
                          alignSelf: 'flex-end',
                        }}
                      />
                      <View
                        style={{
                          flex: 1,
                          width: 50,
                          height: 16.3,
                          alignSelf: 'flex-end',
                        }}
                      />
                    </View>

                    <Divider color="#bcbbc1" style={{marginVertical: 12}} />
                  </View>
                </SkeletonPlaceholder>
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                // marginVertical: 12,
                marginTop: 8,
                marginBottom: 24,
                paddingHorizontal: 24,
              }}
              ItemSeparatorComponent={() => (
                <Divider color="#bcbbc1" style={{marginVertical: 12}} />
              )}
            />
          ) : (
            <FlatList
              data={transactionHistory}
              keyExtractor={item => item._id}
              renderItem={renderTransactionHistory}
              ListEmptyComponent={
                <View
                  style={{
                    height: Dimensions.get('window').height * 0.2,
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 24,
                      fontWeight: 'bold',
                    }}>
                    {I18n.t('Account.Home.noTransaction')}
                  </Text>
                </View>
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                // marginVertical: 12,
                marginTop: 8,
                marginBottom: 24,
                paddingHorizontal: 24,
              }}
              ItemSeparatorComponent={() => (
                <Divider color="#bcbbc1" style={{marginVertical: 12}} />
              )}
              // ListFooterComponent={
              //   <View
              //     style={{
              //       backgroundColor: PrimaryColor,
              //       borderRadius: 20,
              //       padding: 12,
              //     }}
              //   >
              //     <View style={{ paddingBottom: 12 }}>
              //       <Text style={{ color: "#fff", fontWeight: "bold" }}>
              //         {I18n.t("Account.Home.highlight")}
              //       </Text>
              //     </View>
              //     <FlatList
              //       showsHorizontalScrollIndicator={false}
              //       horizontal
              //       data={highlights}
              //       keyExtractor={(item) => item._id}
              //       renderItem={renderHighlights}
              //       ItemSeparatorComponent={() => (
              //         <View style={{ marginRight: 12 }} />
              //       )}
              //     />
              //   </View>
              // }
              // ListFooterComponentStyle={{
              //   marginTop: 24,
              //   marginBottom: Dimensions.get("window").height * 0.05,
              // }}
            />
          )}
        </View>

        {/* <TouchableWithoutFeedback
          onPress={() => navigation.navigate('DiscoverMerchant')}>
          <View
            style={{
              backgroundColor: PrimaryColor,
              borderRadius: 10,
              padding: 16,
              margin: 24,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View>
                <Icon
                  name="shopping-bag"
                  type="font-awesome"
                  color="#fff"
                  size={28}
                />
              </View>

              <View>
                <Text
                  style={{
                    color: '#fff',
                    textAlign: 'center',
                    paddingLeft: 16,
                    fontSize: 18,
                  }}>
                  Discover Merchants
                </Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback> */}

        {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 24,
            marginBottom: 32,
          }}>
          <View
            style={{
              backgroundColor: PrimaryColor,
              borderRadius: 10,
              padding: 16,
              flex: 5,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View>
                <Icon
                  name="shopping-bag"
                  type="font-awesome"
                  color="#fff"
                  size={28}
                />
              </View>

              <View>
                <Text
                  style={{color: '#fff', textAlign: 'center', paddingLeft: 16}}>
                  Discover Merchants
                </Text>
              </View>
            </View>
          </View>

          <View style={{flex: 1}} />

          <View
            style={{
              backgroundColor: PrimaryColor,
              borderRadius: 10,
              padding: 16,
              flex: 5,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View>
                <Icon
                  name="gift"
                  type="material-community"
                  color="#fff"
                  size={28}
                />
              </View>

              <View>
                <Text
                  style={{color: '#fff', textAlign: 'center', paddingLeft: 16}}>
                  Use Reward Points
                </Text>
              </View>
            </View>
          </View>
        </View> */}

        {/* <View style={{ marginVertical: 24 }}>
          <Video
            source={require("../../assest/image/video/fom_final2.mp4")} // Can be a URL or a local file.
            style={{
              width: Dimensions.get("window").width,
              height: 200
            }}
            // controls
            muted
            resizeMode={"contain"}
            // paused
            repeat
          />
        </View> */}
        <View style={{paddingHorizontal: 24}}>
          {/* <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 24,
            }}>
            <View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: 'rgba(0,0,0,0.65)',
                  marginRight: 16,
                }}>
                Offers you may like
              </Text>
            </View>

            <View
              style={{
                backgroundColor: 'rgba(0,0,0,0.10)',
                padding: 4,
                borderRadius: 100,
              }}>
              <Icon
                name="arrowright"
                type="antdesign"
                color="rgba(0,0,0,0.35)"
                size={16}
                onPress={() => navigation.navigate('MyPoints')}
              />
            </View>
          </View> */}

          {/* <View>
            <Swiper
              height={170}
              showsButtons={false}
              paginationStyle={{
                transform: [{translateY: 16}, {translateX: -0}],
              }}
              activeDotColor="#fff"
              showsPagination={false}
              autoplay>
              {youMayLike.map(value => (
                <View
                  style={[styles.slide1, {borderRadius: 4}]}
                  key={value._id}>
                  <TouchableWithoutFeedback
                    onPress={() =>
                      navigation.navigate('LastDealsWebView', {
                        name: 'WOWNATIONS',
                        html: 'https://www.wownations.com/',
                      })
                    }
                    // onPress={() => navigation.navigate("MyPoints")}
                  >
                    <Image
                      source={value.image}
                      style={{
                        // width: Dimensions.get('window').width,
                        width: '100%',
                        height: '100%',
                        borderRadius: 10,
                      }}
                      resizeMode="stretch"
                    />
                  </TouchableWithoutFeedback>
                </View>
              ))}
            </Swiper>
          </View> */}

          <View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: 'rgba(0,0,0,0.65)',
                marginRight: 16,
                marginTop: 24,
              }}>
              UCSI Marketplace
            </Text>
            <View style={{Margintop: 50, backgroundColor: '#f0f0f0'}}>
            <TouchableWithoutFeedback onPress={() => navigation.navigate('Marketplace')}>
              <View style={styles.marketplacebutton}>
                <Image
                  source={require('../../assest/image/icons/checklist_on_2x.png')}
                  style={styles.marketplaceimage}
                />
                <Text style={styles.marketplacelabel}>Marketplace</Text>
              </View>
            </TouchableWithoutFeedback>
            </View>
          </View>

          <View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: 'rgba(0,0,0,0.65)',
                  marginRight: 16,
                  marginTop: 24,
                }}>
                UCSI Portal
              </Text>
              <View style={styles.buttonSection}> 
                <View style={styles.section}>
                  <View style={styles.buttonRow}>
                    <TouchableWithoutFeedback
                    onPress={() => navigation.navigate('Arrival')} style={styles.button}>
                    <View>
                      <Image
                        source={require('../../assest/image/icons/checklist_on_2x.png')} style={styles.image}/>
                        <Text style={styles.label}>Arrival</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback
                    onPress={() => navigation.navigate('IIsV2')} style={styles.button}>
                    <View>
                      <Image
                        source={require('../../assest/image/icons/ico_IIS2_on_2x.png')} style={styles.image}/>
                        <Text style={styles.label}>IIS2</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback
                    onPress={() => navigation.navigate('TheCN')} style={styles.button}>
                    <View>
                      <Image
                        source={require('../../assest/image/icons/ico_cn_on_2x.png')} style={styles.image}/>
                        <Text style={styles.label}>TheCN</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback
                    onPress={() => navigation.navigate('Library')} style={styles.button}>
                    <View>
                      <Image
                        source={require('../../assest/image/icons/ico_library_on_2x.png')} style={styles.image}/>
                        <Text style={styles.label}>Library</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  </View>
                </View>
                <View style={styles.section}>
                  <View style={styles.buttonRow2}>
                  <TouchableWithoutFeedback
                    onPress={() => navigation.navigate('Office365')} style={styles.button}>
                    <View>
                      <Image
                        source={require('../../assest/image/icons/ico_o365_on_2x.png')} style={styles.image}/>
                        <Text style={styles.label}>Office365</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback
                    onPress={() => navigation.navigate('VPN')} style={styles.button}>
                    <View>
                      <Image
                        source={require('../../assest/image/icons/ico_vpn_on_2x.png')} style={styles.image}/>
                        <Text style={styles.label}>VPN</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback
                    onPress={() => navigation.navigate('Email')} style={styles.button}>
                    <View>
                      <Image
                        source={require('../../assest/image/icons/ico_email_on_2x.png')} style={styles.image}/>
                        <Text style={styles.label}>Email</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback
                    onPress={() => navigation.navigate('Resources')} style={styles.button}>
                    <View>
                      <Image
                        source={require('../../assest/image/icons/resources_on_2x.png')} style={styles.image}/>
                        <Text style={styles.label}>Resources</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
              <View style={styles.section}>
                <View style={styles.buttonRow3}>
                  <TouchableWithoutFeedback
                  onPress={() => navigation.navigate('UCSI Bus')} style={styles.button}>
                  <View>
                    <Image
                    source={require('../../assest/image/icons/ico_ucsibus_on_2x.png')} style={styles.image}/>
                    <Text style={styles.label}>UCSI Bus</Text>
                  </View>
                  </TouchableWithoutFeedback>
                  <View style={styles.button4}>
                  <TouchableWithoutFeedback
                  onPress={() => navigation.navigate('Coop')} style={styles.button}>
                  <View>
                    <Image
                    source={require('../../assest/image/icons/ico_ucsibus_off_2x.png')} style={styles.image}/>
                    <Text style={styles.label}>Coop</Text>
                  </View>
                </TouchableWithoutFeedback>
                </View>
              </View>
            </View>
          </View>
        </View> 

          <View
            style={{
              marginTop: 24,
              marginBottom: 16,
            }}>
            <View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: 'rgba(0,0,0,0.65)',
                  marginRight: 16,
                }}>
                UCSIPAY Merchants
              </Text>
            </View>
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate('DiscoverMerchant')}>
              <View>
                <Image
                  source={require('../../assest/image/UcsiMerchant/banner_merchant.png')}
                  style={{
                    width: Dimensions.get('window').width - 48,
                    height: undefined,
                    aspectRatio: 3 / 1,
                    borderRadius: 10,
                    marginTop: 15,
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>

          <View
            style={{
              marginTop: 24,
              marginBottom: 16,
            }}>
            <View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: 'rgba(0,0,0,0.65)',
                  marginRight: 16,
                }}>
                UCSI 1Card Merchants
              </Text>
            </View>
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate('Ucsi1CardWebview')}>
              <View>
                <Image
                  source={require('../../assest/image/UCSI1Card/showcard_ucsi1card_webbanner.jpg')}
                  style={{
                    width: Dimensions.get('window').width - 48,
                    height: undefined,
                    aspectRatio: 3 / 1,
                    borderRadius: 10,
                    marginTop: 15,
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>

          {/* <View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: 'rgba(0,0,0,0.65)',
                marginRight: 16,
                marginTop: 24,
                marginBottom: 16,
              }}>
              Announcements and Deals
            </Text>
            <View style={styles.announcementSection}>
              <View style={styles.webviewContainer}>
                <WebView
                  source={{ uri: 'https://iframe-portal.vercel.app' }}
                  style={styles.webview}
                />
              </View>
            </View>
          </View> */}

            {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{color: '#606264', marginRight: 8}}>See More</Text>

              <View
                style={{
                  backgroundColor: 'rgba(0,0,0,0.10)',
                  padding: 4,
                  borderRadius: 100,
                }}>
                <Icon
                  name="arrowright"
                  type="antdesign"
                  color="#606264"
                  size={16}
                />
              </View>
            </View> */}


          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            data={latestDeal}
            keyExtractor={item => item._id}
            renderItem={({item}) => (
              <View
                style={{
                  // flexDirection: 'row',
                  // borderColor: "rgba(0,0,0,0.15)",
                  // borderRadius: 5,
                  // borderWidth: 1,
                  // padding: 8,
                  width: Dimensions.get('window').width,

                  borderRadius: 10,
                }}>
                <TouchableWithoutFeedback
                  // onPress={() =>
                  //   navigation.navigate('LastDealsWebView', {
                  //     name: item.name,
                  //     html: item.html,
                  //   })
                  // }
                  // onPress={() => navigation.navigate("MyPoints")}
                  onPress={() =>
                    navigation.navigate('PromotionDetails', {
                      _id: item._id,
                    })
                  }>
                  <View>
                    <SecureImageLoader
                      source={{uri: item?.picture?.url}}
                      // source={item.image}
                      style={{
                        width: Dimensions.get('window').width - 48,
                        height: undefined,
                        aspectRatio: 16 / 9,
                        borderRadius: 10,
                      }}
                      resizeMode="cover"
                      // resizeMode="contain"
                    />
                    {/* <Image
                      source={{uri: item?.picture?.url}}
                      // source={item.image}
                      style={{
                        width: Dimensions.get('window').width * 0.8,
                        height:
                          ((Dimensions.get('window').width * 0.8) / 16) * 9,
                        borderRadius: 10,
                      }}
                      // resizeMethod="scale"
                      resizeMode="cover"
                    /> */}
                  </View>
                </TouchableWithoutFeedback>
              </View>
            )}
            style={{marginBottom: Platform.OS === 'ios' ? 120 : 24}}
            ItemSeparatorComponent={() => <View style={{marginRight: 12}} />}
          />
        </View>

        <View style={{position: 'absolute', top: '38%', left: '50%'}}>
          <ActivityIndicator
            toast
            size="large"
            animating={loading}
            text={I18n.t('Account.Home.loading')}
          />
        </View>

        {KycModal}
      </ScrollView>
    </View>
  );
};

export default home;

const styles = StyleSheet.create({
  walletFontColor: {
    color: '#fff',
  },

  buttonSection: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  section: {
    width: '100%',
    borderColor: '#000',
    borderRadius: 20,
    marginBottom: 20,
    alignSelf: 'center',
    // paddingVertical: 20,
  },
  announcementSection: {
    flex: 1,
    width: '100%',
    backgroundColor: '#f0f0f0',
    marginTop: 24,
    marginBottom: 16,
  },
  webviewContainer: {
    flex: 1,
    width: '100%',
    height: height * 0.5,
    // marginTop: 1
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: -20,
    // padding: -100,
  },
  buttonRow2: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: -40,
    // gap: -25,  
  },
  buttonRow3: {
    flexDirection: 'row',         // Arrange items in a row
    justifyContent: 'flex-start', // Align items to the left (default behavior)
    alignItems: 'center',         // Vertically center items (optional)
    left: 20,
    width: '100%',                // Optional, ensures it takes the full width
    marginTop: -40,
  },
  button4:{
    left: 40,
  },
  // button: {
  //   width: 100,
  //   height: 120,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  image: {
    width: 48,
    // height: 100,
    resizeMode: 'contain',
  },
  label: {
    marginTop: -30,
    fontSize: 9,
    color: 'black',
    textAlign: 'center',  // Centers the text horizontally
    justifyContent: 'center'
  },
  authButtonContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  authButtonTouchable: {
    width: 300, // Set width to desired size
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: '#FF0000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 16, // Adjust font size if needed
  },
  downloadButtonContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  downloadButton: {
    position: 'absolute',
    top: '50%',  // Adjust this to position it vertically
    left: '50%',
    transform: [{ translateX: -150 }, { translateY: -25 }], // Centers the button horizontally
    backgroundColor: '#FF0000',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  bottomSection: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 20,
  },
  footerButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerImage2: {
    width: 50,
    height: 40,
    resizeMode: 'contain',
  },
  webview: {
    flex: 1,
  },

  slide1: {
    flex: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  marketplacebutton: {
    alignItems: 'center',      // center children horizontally
    justifyContent: 'center',  // center children vertically
    padding: 10,
  },
  marketplaceimage: {
    marginTop: 5,
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  marketplacelabel: {
    fontSize: 9,
    color: '#333',
    textAlign: 'center',
  },
});

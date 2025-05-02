import React, {useEffect, useState, useContext, useRef} from 'react';
import {
  View,
  Image,
  Dimensions,
  StatusBar,
  Text,
  Platform,
  ScrollView,
  ImageBackground,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import {Flex} from '@ant-design/react-native';
import {context} from '../../../App';
import pushNotificationPlugin from '../../plugin/pushNotification.plugin/pushNotification.plugin';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Modal from 'react-native-modal';
import {Button, Icon, Input, Divider, ListItem} from 'react-native-elements';
import {PrimaryColor} from '../../tools/Constant/Constant';
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';
import AuthApi from '../../tools/Api/auth.api';
import {ResponseError} from '../../tools/ErrorHandler/ErrorHandler';
import moment from 'moment';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Currency from 'react-currency-formatter';
import {useIsFocused} from '@react-navigation/native';
import Slider from '@react-native-community/slider';

const UcsiCard = ({navigation, route}) => {
  const contextProvider = useContext(context);
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [moreModalVisible, setMoreModalVisible] = useState(false);
  const [limitSpendVisible, setLimitSpendVisible] = useState(false);
  const [cardId, setCardId] = useState();
  const [campusId, setCampusId] = useState();
  const [limitSpend, setLimitSpend] = useState(0);
  const [flatListIndex, setFlatListIndex] = useState(0);

  const [ucsiCardList, setUcsiCardList] = useState([
    // {
    //   _id: '1',
    //   name: 'Jackson Wang',
    //   cardNumber: 'UC68545883438',
    //   expiryDate: 1832980242,
    // },
  ]);

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

  const [transactionHistory, setTransactionHistory] = useState([
    // {
    //   _id: '1',
    //   name: 'Jackson Wang',
    //   type: 'Debit',
    //   amount: 17.8,
    //   timestamp: 1655798988,
    //   remark: 'Receive Testing',
    //   transactionId: 'UC23567653',
    // },
  ]);

  const isFocused = useIsFocused();

  useEffect(() => {
    console.log('context', contextProvider);

    if (isFocused) {
      GetCardList();
    }

    console.log('flatListIndex', flatListIndex);
  }, [isFocused, flatListIndex]);

  const onViewRef = useRef(viewableItems => {
    console.log(viewableItems);
    // Use viewable items in state or as intended

    setFlatListIndex(viewableItems.viewableItems[0]?.index);
  });

  const viewConfigRef = useRef({viewAreaCoveragePercentThreshold: 80});

  const GetCardList = async () => {
    setLoading(true);

    const res = await AuthApi.getCardList();
    console.log('card', res);

    if (res.status === 200) {
      // setLoading(false);
      // setUcsiCardList(res.data.cards);

      let cardArray = res.data.cards;

      if (cardArray.length < 5) {
        cardArray.splice(cardArray.length, 0, {
          _id: '123',
          type: 'add',
        });
      }

      setUcsiCardList(cardArray);

      // UCSI Card Transaction History API //

      if (cardArray.length > 1 && cardArray[flatListIndex]._id !== '123') {
        const res = await AuthApi.getCardTransaction(
          cardArray[flatListIndex]?._id,
        );
        console.log('history', res);

        if (res.status === 200 && cardArray[flatListIndex]?.id !== undefined) {
          setLoading(false);
          setTransactionHistory(res.data.transactions);
        } else {
          setLoading(false);
          ResponseError(res);
        }
      } else {
        setTransactionHistory([]);
      }

      console.log('transactionHistory', transactionHistory);

      // UCSI Card Transaction History API ^ //
    } else {
      setLoading(false);
      ResponseError(res);
    }

    setLoading(false);
  };

  // const CardTransactionHistory = async viewableItemsIndex => {
  //   try {
  //     setLoading(true);

  //     const res = await AuthApi.getCardTransaction(
  //       transactionHistory[viewableItemsIndex]._id,
  //     );
  //     console.log('history', res);

  //     if (res.status === 200) {
  //       setLoading(false);
  //       setTransactionHistory(res.data.transactions);
  //     } else {
  //       setLoading(false);
  //       ResponseError(res);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const RemoveCard = async () => {
    try {
      setMoreModalVisible(false);

      Alert.alert(null, 'Confirm Remove Card?', [
        {
          text: 'Cancel',
          //   onPress: () => console.log('Cancel Pressed'),
        },
        {
          text: 'Submit',
          onPress: async () => {
            setLoading(true);

            const res = await AuthApi.addUCSICard(cardId, {
              bind: false,
              cardId,
              campusId,
            });
            console.log(res);
            if (res.status >= 200 || res.status < 300) {
              setLoading(false);

              Alert.alert(null, 'Remove Card Successful!', [
                {
                  text: 'Ok',
                  onPress: () => {
                    navigation.reset({
                      index: 0,
                      routes: [
                        {
                          name: 'Account',
                          // params: {

                          // },
                        },
                      ],
                    });
                    // GetCardList();
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

  const SpendingLimit = async () => {
    try {
      Alert.alert(null, 'Confirm Set Spending Limit?', [
        {
          text: 'Cancel',
          //   onPress: () => console.log('Cancel Pressed'),
        },
        {
          text: 'Submit',
          onPress: async () => {
            setLoading(true);

            const res = await AuthApi.spendingLimit(cardId, {
              spendingLimit: Math.floor(limitSpend),
              cardId,
              campusId,
            });
            console.log(res);
            if (res.status >= 200 || res.status < 300) {
              setLoading(false);
              setLimitSpendVisible(false);
              setLimitSpend(0);

              Alert.alert(null, 'Set Spending Limit Successful!', [
                {
                  text: 'Ok',
                  onPress: () => {
                    GetCardList();
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

  const UCSIcard = (
    <View>
      <Text style={{fontSize: 24, fontWeight: '700', color: '#fff'}}>
        UCSI Student / Staff ID
      </Text>
      <Text style={{color: '#fff', marginBottom: 12}}>
        You can add up to 5 cards
      </Text>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={ucsiCardList}
        decelerationRate={'fast'}
        keyExtractor={item => item._id}
        viewabilityConfig={viewConfigRef.current}
        onViewableItemsChanged={onViewRef.current}
        snapToAlignment="center"
        snapToInterval={
          Dimensions.get('window').width * 0.75 +
          (Platform.OS === 'android' ? 12 : 16)
        }
        renderItem={({item}) => (
          <View
            style={{
              //   flexDirection: 'row',
              borderColor: 'rgba(0,0,0,0.15)',
              backgroundColor: '#fff',
              borderRadius: 10,
              borderWidth: 1,
              //   padding: 16,
              width: Dimensions.get('window').width * 0.75,

              marginRight: 12,
            }}>
            {item.type === 'add' ? (
              <TouchableWithoutFeedback
                onPress={() => navigation.navigate('AddUcsiCard')}>
                <View
                  style={{
                    flex: ucsiCardList.length > 1 ? 1 : 0,
                    height: ucsiCardList.length === 1 ? 150 : '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon
                    name="pluscircle"
                    type="antdesign"
                    color={PrimaryColor}
                    size={48}
                  />

                  <Text style={{textAlign: 'center', marginTop: 8}}>
                    Add New Card
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            ) : (
              <TouchableWithoutFeedback>
                <View>
                  <View style={{padding: 16}}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: 'rgba(0,0,0,0.65)',
                      }}
                      numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: 'rgba(0,0,0,0.45)',
                        fontWeight: '500',
                        marginBottom: 8,
                      }}>
                      {item.id} ({item.campusId})
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: 'rgba(0,0,0,0.45)',
                        fontWeight: '500',
                        marginBottom: 8,
                      }}>
                      Daily Limit :
                      {item.dailySpendLimit
                        ? `RM ${item.dailySpendLimit}`
                        : ' No limit'}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: 'rgba(0,0,0,0.45)',
                        fontWeight: '500',
                        marginBottom: 8,
                      }}>
                      Today's Usage : RM
                      {item.todaySpending}
                    </Text>
                  </View>

                  <View
                    style={{
                      padding: 12,
                      backgroundColor: 'rgba(0,0,0,0.1)',
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Button
                      title={'More'}
                      buttonStyle={{
                        backgroundColor: PrimaryColor,
                        borderRadius: 100,
                        paddingHorizontal: 16,
                      }}
                      containerStyle={{width: '100%'}}
                      onPress={() => {
                        setMoreModalVisible(true);
                        setCardId(item.id);
                        setCampusId(item.campusId);
                        setLimitSpend(
                          item.dailySpendLimit ? item.dailySpendLimit : 0,
                        );
                      }}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>
        )}
        style={{marginBottom: 24, marginRight: 12}}
        // ItemSeparatorComponent={() => <View style={{marginRight: 12}} />}
      />
    </View>
  );

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

  const TransactionHistory = (
    <View style={{flex: 1}}>
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
          <Text>Transaction History</Text>

          <TouchableWithoutFeedback
            onPress={() => {
              if (ucsiCardList.length > 1) {
                navigation.navigate('UcsiCardHistory', {
                  id:
                    ucsiCardList.length - 1 === flatListIndex
                      ? ucsiCardList[flatListIndex - 1].id
                      : ucsiCardList[flatListIndex].id,
                });
              }
            }}>
            <Text style={{fontSize: 12, color: 'rgba(0,0,0,0.35)'}}>
              View More
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
                No Transaction
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
  );

  const MoreModal = (
    <View style={{flex: 1}}>
      <Modal
        useNativeDriver
        hideModalContentWhileAnimating
        isVisible={moreModalVisible}
        style={{
          margin: 0,
          justifyContent: 'flex-end',
          //   marginTop: Platform.OS === 'ios' ? insets.top : null,
        }}
        onBackdropPress={() => {
          setMoreModalVisible(false);
        }}>
        {/* <DismissKeyboard> */}
        <View
          style={{
            backgroundColor: '#fff',
            // flex: 1,
            // height:
            //   Dimensions.get('window').height -
            //   (Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight),
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            // marginTop: Platform.OS === 'ios' ? insets.top : null,
            // alignItems: 'center',
            // padding: Dimensions.get('window').width <= 320 ? 12 : 20,
            padding: 20,
          }}>
          <Button
            title={'Limited Spend'}
            type="clear"
            TouchableComponent={TouchableWithoutFeedback}
            onPress={() => {
              setMoreModalVisible(false);
              setTimeout(
                () => {
                  setLimitSpendVisible(true);
                },
                Platform.OS === 'ios' ? 400 : 0,
              );
            }}
          />
          {/* <Text style={{fontSize: 16}}>Limited Spend</Text> */}
          <Divider style={{marginVertical: 12}} />
          <Button
            title={'Remove Card'}
            type="clear"
            titleStyle={{color: 'red'}}
            TouchableComponent={TouchableWithoutFeedback}
            onPress={() => RemoveCard()}
          />
          {/* <Text style={{fontSize: 16, color: 'red'}}>Remove Card</Text> */}
        </View>
      </Modal>
    </View>
  );

  const LimitSpendModal = (
    <Modal
      useNativeDriver
      isVisible={limitSpendVisible}
      hideModalContentWhileAnimating
      style={
        {
          // margin: 0,
          // justifyContent: 'flex-end',
          //   marginTop: Platform.OS === 'ios' ? insets.top : null,
        }
      }
      onBackdropPress={() => {
        setLimitSpendVisible(false);
        setLimitSpend(0);
      }}>
      {/* <DismissKeyboard> */}
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 20,
          padding: 20,
        }}>
        <Slider
          style={{/* width: 200, */ height: 48}}
          minimumValue={0}
          maximumValue={200}
          thumbTintColor={PrimaryColor}
          minimumTrackTintColor={PrimaryColor}
          maximumTrackTintColor="#000000"
          value={limitSpend}
          onValueChange={e => setLimitSpend(e)}
        />
        <Text
          style={{
            color: 'rgba(0,0,0,.45)',
            fontSize: 12,
            fontStyle: 'italic',
            paddingLeft: 10,
            marginBottom: 16,
          }}>
          *Slide to adjust limit
        </Text>

        <Text
          style={{
            textAlign: 'center',
            marginBottom: 24,
            fontSize: 16,
            fontWeight: '700',
          }}>
          Limited Spend : RM {Math.floor(limitSpend)}
        </Text>

        <Button
          title={'Confirm'}
          containerStyle={{
            alignItems: 'center',
          }}
          buttonStyle={{
            width: Dimensions.get('window').width * 0.5,
            backgroundColor: PrimaryColor,
            borderRadius: 100,
          }}
          onPress={() => SpendingLimit()}
        />
      </View>
    </Modal>
  );

  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets
      style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={{paddingBottom: 24, flex: 1}}>
        {/* <StatusBar barStyle="light-content" backgroundColor={PrimaryColor} /> */}
        <StatusBar backgroundColor="transparent" barStyle="light-content" />

        <ImageBackground
          source={require('../../assest/image/UcsiLogo/account_background_ps.png')}
          style={{
            // position: 'absolute',
            height: Dimensions.get('window').height * 0.5,
            width: Dimensions.get('window').width,

            marginBottom: 24,
            //   zIndex: -1,
          }}
          resizeMode="stretch"
          resizeMethod="scale">
          <View
            style={{
              paddingLeft: 24,
              paddingTop:
                Platform.OS === 'android'
                  ? StatusBar.currentHeight + 12
                  : insets.top + 12,
            }}>
            <View style={{flexDirection: 'row', marginBottom: 16}}>
              <Icon
                name="arrow-left"
                type="feather"
                color="#fff"
                size={28}
                onPress={() => {
                  // navigation.goBack();

                  navigation.reset({
                    index: 1,
                    routes: [
                      {
                        name: 'home',
                        //  params: { },
                      },
                      {
                        name: 'Account',
                        //  params: { },
                      },
                    ],
                  });
                }}
              />
            </View>

            {UCSIcard}
            {MoreModal}
            {LimitSpendModal}
          </View>
        </ImageBackground>

        {TransactionHistory}
      </View>
    </ScrollView>
  );
};

export default UcsiCard;

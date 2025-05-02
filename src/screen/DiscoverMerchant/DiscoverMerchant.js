import React, {Component, useState, useEffect, useRef, useContext} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  AppRegistry,
  Animated,
  ScrollView,
  View,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Platform,
  Keyboard,
  // ActivityIndicator
} from 'react-native';
import {Text, Divider, Icon, Button, ListItem} from 'react-native-elements';
import {ActivityIndicator} from '@ant-design/react-native';
import I18n from '../../locales';
import {
  PrimaryColor,
  windowHeight,
  windowWidth,
} from '../../tools/Constant/Constant';
import Share from 'react-native-share';
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';
import BusinessApi from '../../tools/Api/business.api';
import {ResponseError} from '../../tools/ErrorHandler/ErrorHandler';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {context} from '../../../App';
import isEmpty from 'is-empty';
import {AuthCredential, AuthHeader} from '../../tools/Api/api';
import SecureImageLoader from '../../library/SecureImageLoader';

const DiscoverMerchant = ({navigation, route}) => {
  const contextProvider = useContext(context);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([
    // {
    //   _id: '1',
    //   name: 'Starbuck',
    //   distance: '2.6KM',
    //   address: 'Lot 170-G-38, 39, Gurney Plaza, 10250 George Town, Penang',
    //   geometry: {
    //     location: {
    //       lng: 100.3100775,
    //       lat: 5.4376426,
    //     },
    //   },
    //   icon: require('../../assest/image/demo/starbucks.png'),
    // },
  ]);
  const [merchantList, setMerchantList] = useState([]);

  useEffect(() => {
    console.log(contextProvider);

    GetBusinessList();

    const keyboardShow = Keyboard.addListener('keyboardDidShow', () => {
      setFlatListVisible(false);
    });
    const keyboardHide = Keyboard.addListener('keyboardDidHide', () => {
      setFlatListVisible(true);
    });

    return () => {
      keyboardShow.remove();
      keyboardHide.remove();
    };
  }, []);

  const GetBusinessList = async () => {
    try {
      setLoading(true);

      const res = await BusinessApi.getBusinessList();
      console.log(res);

      if (res.status >= 200 || res.status < 300) {
        setLoading(false);
        setMerchantList(res.data.businesses);
      } else {
        setLoading(false);
        ResponseError(res);
      }
    } catch (error) {
      setLoading(false);
      console.log('error', error);
    }
  };

  const MerchantList = (
    <View
      style={{
        paddingHorizontal: 16,
        paddingTop: 24,
        // paddingVertical: 24,
        flexDirection: 'row',
        flexWrap: 'wrap',
        // justifyContent: 'space-between',
      }}>
      {merchantList.map(val => (
        <TouchableWithoutFeedback
          key={val._id}
          onPress={() =>
            navigation.navigate('MerchantDetails', {
              businessId: val._id,
            })
          }>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: Dimensions.get('window').width * 0.3,
              marginBottom: 16,
            }}>
            <View
            // style={{
            //   backgroundColor: '#fff',
            //   padding: 12,
            //   marginBottom: 8,
            //   width: 65,
            //   height: 65,
            //   alignItems: 'center',
            //   justifyContent: 'center',

            //   borderWidth: 1,
            //   borderColor: 'rgba(0,0,0,0.05)',
            //   borderRadius: 100,

            //   shadowColor: '#000',
            //   shadowOffset: {
            //     width: 0,
            //     height: 1,
            //   },
            //   shadowOpacity: 0.2,
            //   shadowRadius: 1.41,

            //   elevation: 2,
            // }}
            >
              <SecureImageLoader
                source={{
                  uri: val.logo.url,
                  // uri: 'https://ewallet1-api.ucsipay.com/api/media/62f9d2a189435c4e8cd3a508-1660539702068-F6F5AA18-63C8-43D8-AC56-DD4C8A54F6AF.jpg',
                }}
                style={{
                  width: Dimensions.get('window').width * 0.2,
                  height: Dimensions.get('window').width * 0.2,
                  // borderRadius: 100,
                  marginBottom: 12,
                }}
                resizeMode="contain"
                resizeMethod="scale"
              />
              {/* <Image
                source={{
                  // uri: val.logo.url,
                  uri: 'https://ewallet1-api.ucsipay.com/api/media/62f9d2a189435c4e8cd3a508-1660539702068-F6F5AA18-63C8-43D8-AC56-DD4C8A54F6AF.jpg',
                  headers: {
                    // authorization:
                    //   'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmYwZWQ1ZmMxOTgwYzc0ZmZjMDBhYzMiLCJpYXQiOjE2NjAzNzUwNjksImV4cCI6MTY2Mjk2NzA2OX0.qfEgkqwVbYnF3rz3r6MLeHJP-ORCYhJBJtIiIdjmKVU',
                    ...async () => {
                      const res = await AuthCredential();
                      console.log(res, 147);
                      return res;
                    },
                  },
                }}
                style={{
                  width: Dimensions.get('window').width * 0.2,
                  height: Dimensions.get('window').width * 0.2,
                  borderRadius: 100,
                  marginBottom: 12,
                }}
                resizeMode="contain"
                resizeMethod="scale"
              /> */}
            </View>

            <Text
              style={{
                textAlign: 'center',
                fontSize: 14,
                color: 'rgba(0,0,0,0.85)',
                marginBottom: 16,
                fontWeight: 'bold',
              }}>
              {val.displayName}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      ))}
    </View>
  );

  return (
    <ScrollView style={{backgroundColor: '#fff', flex: 1}}>
      <StatusBar backgroundColor={PrimaryColor} barStyle="light-content" />
      {MerchantList}

      {/* <FlatList
        showsHorizontalScrollIndicator={false}
        // horizontal
        data={data}
        keyExtractor={item => item._id}
        renderItem={({item}) => {
          return (
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={{paddingHorizontal: 16, flexDirection: 'row'}}>
                <View style={{height: 64, width: 64, marginRight: 16}}>
                  <Image source={item.icon} style={{height: 64, width: 64}} />
                </View>
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                      width: Dimensions.get('window').width - 104,
                    }}>
                    <Text style={{fontWeight: 'bold', fontSize: 16}}>
                      {item.name}
                    </Text>
                  
                  </View>

                  <View>
                    <Text
                      style={{
                        color: 'rgba(0,0,0,0.45)',
                        width: Dimensions.get('window').width - 104,
                      }}>
                      {item.address}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          );
        }}
        scroll
        contentContainerStyle={{paddingVertical: 16}}
        // style={{ marginVertical: 24 }}
        ItemSeparatorComponent={() => (
          <Divider color="#bcbbc1" style={{marginVertical: 12}} />
        )}
      /> */}

      {loading && (
        <View
          style={{
            position: 'absolute',
            top: Dimensions.get('window').height * 0.4,
            // left: Dimensions.get("window").width * 0.5,
            alignSelf: 'center',
            padding: 32,
            backgroundColor: 'rgba(0,0,0,0.45)',
            borderRadius: 16,
          }}>
          <ActivityIndicator toast text="Loading..." />
        </View>
      )}

      {/* <ActivityIndicator
           animating
           size="large"
           color="#fff"
           style={{
             position: "absolute",
             top: Dimensions.get("window").height * 0.3,
              left: Dimensions.get("window").width * 0.5,
             alignSelf: "center",
             padding: 32,
             backgroundColor: "rgba(0,0,0,0.45)",
             borderRadius: 16
           }}
         /> */}
    </ScrollView>
  );
};

export default DiscoverMerchant;

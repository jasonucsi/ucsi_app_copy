import React, {Component} from 'react';
import {
  Platform,
  View,
  StatusBar,
  Linking,
  Text,
  Image,
  Dimensions,
  AppState,
  PermissionsAndroid,
  ImageBackground,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {PrimaryColor} from '../../tools/Constant/Constant';
import home from '../Home/Home';

// Need import library

function HomeBottomTab() {
  const insets = useSafeAreaInsets();
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarLabel: ({focused, color, size}) => {},
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          console.log(route);

          if (route.name === 'HomePage') {
            // iconName = focused
            //   ? require("../../assest/image/category/home_reversed_1.png")
            //   : require("../../assest/image/category/home_1.png");

            return (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {/* <Image
                  source={iconName}
                  style={{ width: 25, height: 25, resizeMode: "contain" }}
                /> */}
                <Image
                  source={require('../../assest/image/UcsiIcon/home.png')}
                  style={{
                    width: 22,
                    height: 22,
                    resizeMode: 'contain',
                    tintColor: focused ? PrimaryColor : '#B0B0B0',
                  }}
                />
                {/* <Icon
                  name="home"
                  type="entypo"
                  color={focused ? "#FF8300" : "#B0B0B0"}
                  size={25}
                /> */}
                <Text
                  style={{
                    // color: color,
                    color: focused ? PrimaryColor : '#B0B0B0',
                    paddingBottom: insets.bottom,
                    fontSize: Dimensions.get('window').width < 375 ? 12 : 14,
                  }}>
                  Home
                </Text>
              </View>
            );
          } else if (route.name === 'Activity') {
            // iconName = focused
            //   ? require("../../assest/image/category/cart_reversed_1.png")
            //   : require("../../assest/image/category/cart_1.png");

            return (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {/* <Image
                  source={iconName}
                  style={{ width: 25, height: 25, resizeMode: "contain" }}
                /> */}
                <Image
                  source={require('../../assest/image/UcsiIcon/activity.png')}
                  style={{
                    width: 22,
                    height: 22,
                    resizeMode: 'contain',
                    tintColor: focused ? PrimaryColor : '#B0B0B0',
                  }}
                />
                {/* <Icon
                  name="home"
                  type="entypo"
                  color={focused ? "#FF8300" : "#B0B0B0"}
                  size={25}
                /> */}
                <Text
                  style={{
                    // color: color,
                    color: focused ? PrimaryColor : '#B0B0B0',
                    paddingBottom: insets.bottom,
                    fontSize: Dimensions.get('window').width < 375 ? 12 : 14,
                  }}>
                  {/* Cart */}
                  Activity
                </Text>
              </View>
            );
          } else if (route.name === 'Rewards') {
            // iconName = focused
            //   ? require("../../assest/image/category/orders_reversed_1.png")
            //   : require("../../assest/image/category/orders_1.png");

            return (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {/* <Image
                  source={iconName}
                  style={{ width: 25, height: 25, resizeMode: "contain" }}
                /> */}
                <Image
                  source={require('../../assest/image/UcsiIcon/rewards.png')}
                  style={{
                    width: 22,
                    height: 22,
                    resizeMode: 'contain',
                    tintColor: focused ? PrimaryColor : '#B0B0B0',
                  }}
                />
                {/* <Icon
                  name="home"
                  type="entypo"
                  color={focused ? "#FF8300" : "#B0B0B0"}
                  size={25}
                /> */}
                <Text
                  style={{
                    // color: color,
                    color: focused ? PrimaryColor : '#B0B0B0',
                    paddingBottom: insets.bottom,
                    fontSize: Dimensions.get('window').width < 375 ? 12 : 14,
                  }}>
                  {/* Order  */}
                  Rewards
                </Text>
              </View>
            );
          } else if (route.name === 'Messages') {
            // iconName = focused
            //   ? require("../../assest/image/category/account_reversed_1.png")
            //   : require("../../assest/image/category/account_1.png");

            return (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {/* <Image
                  source={iconName}
                  style={{ width: 25, height: 25, resizeMode: "contain" }}
                /> */}
                <Image
                  source={require('../../assest/image/UcsiIcon/messages.png')}
                  style={{
                    width: 22,
                    height: 22,
                    resizeMode: 'contain',
                    tintColor: focused ? PrimaryColor : '#B0B0B0',
                  }}
                />
                {/* <Icon
                  name="ticket-alt"
                  type="font-awesome-5"
                  color={focused ? PrimaryColor : '#B0B0B0'}
                  size={22}
                /> */}
                <Text
                  style={{
                    // color: color,
                    color: focused ? PrimaryColor : '#B0B0B0',
                    paddingBottom: insets.bottom,
                    fontSize: Dimensions.get('window').width < 375 ? 12 : 14,
                  }}>
                  Messages
                </Text>
              </View>
            );
          } else if (route.name === 'Account') {
            // iconName = focused
            //   ? require("../../assest/image/category/account_reversed_1.png")
            //   : require("../../assest/image/category/account_1.png");

            return (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {/* <Image
                  source={iconName}
                  style={{ width: 25, height: 25, resizeMode: "contain" }}
                /> */}
                <Image
                  source={require('../../assest/image/UcsiIcon/account.png')}
                  style={{
                    width: 22,
                    height: 22,
                    resizeMode: 'contain',
                    tintColor: focused ? PrimaryColor : '#B0B0B0',
                  }}
                />
                {/* <Icon
                  name="user-circle-o"
                  type="font-awesome"
                  color={focused ? PrimaryColor : '#B0B0B0'}
                  size={22}
                /> */}
                <Text
                  style={{
                    // color: color,
                    color: focused ? PrimaryColor : '#B0B0B0',
                    paddingBottom: insets.bottom,
                    fontSize: Dimensions.get('window').width < 375 ? 12 : 14,
                  }}>
                  {/* Account  */}
                  Account
                </Text>
              </View>
            );
          }
        },
      })}
      tabBarOptions={{
        activeTintColor: '#014f86',
        inactiveTintColor: '#014f86',
        style: {backgroundColor: '#fff', paddingTop: 8, paddingBottom: 4},
      }}
      // initialRouteName="SocialMarketing"
    >
      <Tab.Screen name="HomePage" component={home} />
      <Tab.Screen name="Activity" component={home} />
      <Tab.Screen name="Rewards" component={home} />
      <Tab.Screen name="Messages" component={home} />
      <Tab.Screen name="Account" component={home} />
    </Tab.Navigator>
  );
}

export default HomeBottomTab;

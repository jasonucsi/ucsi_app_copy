import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Dimensions,
  TouchableWithoutFeedback,
  StatusBar,
} from 'react-native';
import {Button} from 'react-native-elements';
import Swiper from 'react-native-swiper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {PrimaryColor} from '../../tools/Constant/Constant';

const OnBoardingPage = ({navigation, route}) => {
  const {height, width} = Dimensions.get('window');
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const swiper = useRef(null);
  const onChangeIndex = value => {
    setIndex(value);
  };

  const SwiperImage = [
    {
      id: 1,
      // background: require('../../assest/image/UcsiOnBoarding/background1.png'),
      image: require('../../assest/image/UcsiOnBoarding/image1.png'),
      title: 'Welcome to UCSIPAY!',
      description:
        'Dive into a whole new world of seamless payment - reload, transfer and pay at ease',
    },
    {
      id: 2,
      image: require('../../assest/image/UcsiOnBoarding/image2.png'),
      title: 'Enjoy Discounts',
      description:
        'Dive into a whole new world of seamless payment - reload, transfer and pay at ease',
    },
    {
      id: 3,
      image: require('../../assest/image/UcsiOnBoarding/image3.png'),
      title: 'One-stop payment',
      description:
        'Dive into a whole new world of seamless payment - reload, transfer and pay at ease',
    },
    {
      id: 4,
      image: require('../../assest/image/UcsiOnBoarding/image4.png'),
      title: 'Earn Rewards',
      description:
        'Dive into a whole new world of seamless payment - reload, transfer and pay at ease',
    },
  ];

  const swiperItems = SwiperImage.map((item, key) => (
    <View style={styles.slide1} key={key}>
      <View style={styles.containerSwiper}>
        <Image
          source={item.image}
          style={{height: height * 0.55, width: width * 0.8}}
          resizeMode="contain"
          resizeMethod="scale"
        />
        <Text numberOfLines={2} style={styles.title}>
          {item.title}
        </Text>
        <Text numberOfLines={3} style={styles.description}>
          {item.description}
        </Text>
      </View>
    </View>
  ));

  return (
    <View style={{flex: 1, paddingTop: insets.top, backgroundColor: '#fff'}}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={{flex: 1}}>
        <ImageBackground
          source={require('../../assest/image/UcsiOnBoarding/background1.png')}
          style={{
            position: 'absolute',
            height: height * 0.43,
            width: width,
            zIndex: -1,
          }}
          resizeMode="stretch"
          resizeMethod="scale"
        />
        {/* <ImageBackground
        source={require('../../assest/image/UcsiOnBoarding/background1.png')}
        style={{
          position: 'absolute',
          height: height,
          width: width,
          zIndex: -1,
        }}
        resizeMode="cover"
        resizeMethod="scale"
      /> */}
        <Swiper
          style={{zIndex: 10}}
          ref={swiper}
          loop={false}
          showsButtons={false}
          index={index}
          activeDotStyle={styles.dotActive}
          activeDotColor={PrimaryColor}
          dotStyle={styles.dot}
          paginationStyle={[styles.pagination, {bottom: width - width * 0.5}]}
          onChangeIndex={onChangeIndex}>
          {swiperItems}
        </Swiper>

        <View
          style={{
            position: 'absolute',
            flex: 1,
            width: '100%',
            bottom: height * 0.08,
          }}>
          <View style={{alignItems: 'center'}}>
            <Button
              title="Sign in"
              buttonStyle={{
                width: width * 0.6,
                borderRadius: 100,
                backgroundColor: PrimaryColor,
              }}
              titleStyle={{paddingVertical: 8}}
              onPress={() => {
                // navigation.reset({
                //   index: 0,
                //   routes: [
                //     {
                //       name: 'LoginPage',
                //       // params: {
                //       //   // data: route.params.data,
                //       // },
                //     },
                //   ],
                // });
                navigation.navigate('LoginPage');
              }}
            />

            <Button
              title="New User? Register an account."
              type="clear"
              buttonStyle={{
                paddingVertical: 8,
                borderRadius: 100,

                marginTop: 8,
              }}
              titleStyle={{
                textDecorationLine: 'underline',
                color: 'rgba(0,0,0,.65)',
                fontWeight: '600',
              }}
              onPress={() => {
                // navigation.reset({
                //   index: 0,
                //   routes: [
                //     {
                //       name: 'StepList',
                //       // params: {
                //       //   // data: route.params.data,
                //       // },
                //     },
                //   ],
                // });
                navigation.navigate('StepList');
              }}
              TouchableComponent={TouchableWithoutFeedback}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default OnBoardingPage;

const styles = StyleSheet.create({
  containerSwiper: {
    // flex: 1,
    // margin: 10
    alignItems: 'center',
  },
  pagination: {
    left: 0,
  },
  slide1: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    color: PrimaryColor,
    fontWeight: 'bold',
    paddingHorizontal: 25,
    fontSize: 26,
  },
  description: {
    textAlign: 'center',
    color: '#606264',
    fontWeight: '500',
    paddingVertical: 8,
    paddingHorizontal: 25,
    fontSize: 16,
  },
  // dotActive: {
  //   backgroundColor: PrimaryColor,
  //   width: 20,
  //   height: 10,
  //   borderRadius: 5,
  //   marginLeft: 3,
  //   marginRight: 3,
  //   marginTop: 10,
  //   marginBottom: 10
  // },
  dot: {
    backgroundColor: '#BDCDF3',
    width: 15,
    height: 10,
    borderRadius: 5,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 10,
    marginBottom: 0,
  },
  dotActive: {
    backgroundColor: PrimaryColor,
    width: 30,
    height: 10,
    borderRadius: 5,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 10,
    marginBottom: 0,
  },
});

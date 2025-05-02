import React, {useEffect, useState, useContext, useRef} from 'react';
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
import {useForm} from 'react-hook-form';
import Modal from 'react-native-modal';
import {
  Avatar,
  Button,
  Divider,
  Icon,
  ListItem,
  Input,
} from 'react-native-elements';
import I18n from 'i18n-js';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {PrimaryColor} from '../../tools/Constant/Constant';
import {ResponseError} from '../../tools/ErrorHandler/ErrorHandler';
import {context} from '../../../App';
import {useIsFocused} from '@react-navigation/native';
import CarPlateApi from '../../tools/Api/carPlate.api';
import {ActivityIndicator} from '@ant-design/react-native';

const _mode = {
  add: {
    code: 'Add',
  },
};
const Parking = ({navigation, route}) => {
  const contextProvider = useContext(context);
  const {register, handleSubmit, errors, setValue} = useForm();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('Add');
  const [maxCarPlate, setMaxCarPlate] = useState(0);
  const [data, setData] = useState([
    // {
    //   _id: '1',
    //   displayName: 'Jackson Wang',
    //   carPlate: 'PPP1234',
    //   // amount: 5000,
    // },
    // {
    //   _id: '2',
    //   displayName: 'John Doe',
    //   carPlate: 'WWW6789',
    //   // amount: 3000,
    // },
  ]);

  const [modalVisible, setModalVisible] = useState(false);

  const [carPlate, setCarPlate] = useState();
  const [name, setName] = useState();

  const carPlateInput = useRef();
  const nameInput = useRef();

  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();

  useEffect(() => {
    console.log(contextProvider);
    console.log(route);

    register('carPlate', {
      required: 'Car Plate is required',
    });

    register('displayName', {
      required: 'Name is required',
    });

    if (isFocused) {
      GetCarPlate();
    }

    return () => {};
  }, [contextProvider, isFocused]);

  const GetCarPlate = async () => {
    setLoading(true);

    const res = await CarPlateApi.getCarPlate();
    const ress = await CarPlateApi.getMaxCarPlate();
    console.log('get car plate', res);
    console.log('get car max plate', ress);
    if (res.status === 200) {
      setLoading(false);
      setData(res.data);
      setMaxCarPlate(ress.data.maxSaveCarPlate);
    } else {
      setLoading(false);
      ResponseError(res);
    }
  };

  const handleAddCarPlate = async values => {
    try {
      console.log(values);
      setLoading(true);

      const res = await CarPlateApi.registerCarPlate(values);
      console.log(res);
      if (res.status >= 200 || res.status < 300) {
        setLoading(false);
        setModalVisible(false);
        setCarPlate();
        setValue('carPlate', null);
        setName();
        setValue('displayName', null);
        Alert.alert(null, 'Add New Car Plate Successful!', [
          {
            text: 'Yes',
            onPress: () => GetCarPlate(),
          },
        ]);
      } else {
        setLoading(false);
        ResponseError(res);
      }
    } catch (error) {
      console.log('handle error', error);
    }
  };

  const handlePayCarPlate = async values => {
    try {
      console.log(values, 130);

      setModalVisible(false);
      setCarPlate();
      setValue('carPlate', null);
      setName();
      setValue('displayName', null);

      navigation.navigate('ParkingPayment', {
        data: {
          carPlate: values.carPlate,
          name: values.displayName,
        },
      });
    } catch (error) {
      console.log('handle error', error);
    }
  };

  const renderParkingList = ({item}) => (
    <ListItem containerStyle={{padding: 0}}>
      <TouchableWithoutFeedback
        onPress={() =>
          navigation.navigate('ParkingPayment', {
            data: {
              carPlate: item.carPlate,
              name: item.displayName,
              _id: item._id,
              amount: item.amount,
            },
          })
        }>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <View style={{flex: 7}}>
            <View>
              <Text
                style={{fontWeight: 'bold', fontSize: 16}}
                numberOfLines={1}>
                {item.carPlate}
              </Text>
            </View>

            <View>
              <Text style={{color: 'grey'}}>{item.displayName}</Text>
            </View>
          </View>
          <View style={{flex: 3}}>
            <Text
              style={{
                fontWeight: 'bold',
                color: '#cf1322',
                textAlign: 'right',
                fontSize: 16,
              }}>
              Pay >
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ListItem>
  );

  const AddCarPlateModal = (
    <Modal
      isVisible={modalVisible}
      useNativeDriver
      avoidKeyboard
      hideModalContentWhileAnimating
      onBackButtonPress={() => {
        setModalVisible(false);
      }}
      onBackdropPress={() => {
        setModalVisible(false);
      }}
      style={
        {
          // justifyContent: 'center',
          // margin: 0,
        }
      }
      // onBackButtonPress={() => setModalVisible(false)}
      // onBackdropPress={() => setModalVisible(false)}
    >
      <View
        style={{
          backgroundColor: '#fff',
          paddingVertical: 24,
          paddingHorizontal: 24,
          borderRadius: 16,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            paddingBottom: 12,
            marginBottom: 24,
            borderBottomColor: 'rgba(0,0,0,.25)',
          }}>
          <Text style={{fontSize: 16, fontWeight: '700'}}>
            {mode === _mode.add.code ? 'Add Car Plate' : 'Pay Car Plate'}
          </Text>

          <Icon
            name="close"
            type="antdesign"
            color="rgba(0,0,0,0.65)"
            size={20}
            onPress={() => {
              setModalVisible(false);

              setCarPlate();
              setValue('carPlate', null);
              setName();
              setValue('displayName', null);
            }}
          />
        </View>

        <Input
          autoFocus
          ref={carPlateInput}
          label={'Car Plate'}
          placeholder={'WA1234C (No spacing)'}
          autoCapitalize = {"characters"}
          onChangeText={e => {
            if (/^[A-Za-z0-9]*$/.test(e) || e === "") {
              setCarPlate(e);
              setValue('carPlate', e, {
                shouldDirty: true,
                shouldValidate: true,
              });
            }
          }}
          onSubmitEditing={() => nameInput.current.focus()}
          errorMessage={errors.carPlate && errors.carPlate.message}
          value={carPlate}
        />

        <Input
          ref={nameInput}
          label={'Name'}
          placeholder={'John Doe'}
          onChangeText={e => {
            setName(e);
            setValue('displayName', e, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
          onSubmitEditing={
            mode === 'Add'
              ? handleSubmit(handleAddCarPlate)
              : handleSubmit(handlePayCarPlate)
          }
          errorMessage={errors.name && errors.name.message}
          value={name}
        />

        <Button
          title={mode === 'Add' ? 'Add New Car Plate' : 'Pay Car Plate'}
          buttonStyle={{
            borderRadius: 100,
            backgroundColor: PrimaryColor,
            marginTop: 24,
          }}
          titleStyle={{fontSize: 18, fontWeight: '600'}}
          onPress={
            mode === 'Add'
              ? handleSubmit(handleAddCarPlate)
              : handleSubmit(handlePayCarPlate)
          }
        />
      </View>
    </Modal>
  );

  return (
    <View style={{backgroundColor: '#fff', flex: 1}}>
      <StatusBar
        backgroundColor={PrimaryColor}
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
      />
      <SafeAreaView>
        <View style={{height: Dimensions.get('window').height * 0.8}}>
          <FlatList
            data={data}
            keyExtractor={item => item._id}
            renderItem={renderParkingList}
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
                  There's no any car plate yet...
                </Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingVertical: 24,
              paddingHorizontal: 24,
            }}
            ItemSeparatorComponent={() => (
              <Divider color="#bcbbc1" style={{marginVertical: 12}} />
            )}
            ListHeaderComponent={
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  marginBottom: 24,
                }}>
                <Text
                  style={{
                    fontWeight: '500',
                    color: 'rgba(0,0,0,0.45)',
                    fontSize: 16,
                  }}>
                  Max {maxCarPlate} Car Plate
                </Text>

                <Button
                  title={'Add Car Plate'}
                  buttonStyle={{
                    backgroundColor: PrimaryColor,
                    borderColor: PrimaryColor,
                    borderRadius: 100,
                    width: 150,
                  }}
                  containerStyle={{alignItems: 'flex-end'}}
                  onPress={() => {
                    setModalVisible(true);
                    setMode('Add');
                  }}
                />
              </View>
            }

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
        </View>

        <Button
          title={'Pay Car Plate'}
          buttonStyle={{
            borderRadius: 100,
            backgroundColor: PrimaryColor,
            marginTop: 16,
            marginHorizontal: 24,
          }}
          titleStyle={{fontSize: 18, fontWeight: '600'}}
          onPress={() => {
            setModalVisible(true);
            setMode('Pay');
          }}
        />

        {AddCarPlateModal}
        <ActivityIndicator
          toast
          size="large"
          animating={loading}
          text={I18n.t('topUp.Label.loading')}
        />
      </SafeAreaView>
    </View>
  );
};

export default Parking;

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    height: 30,
    borderColor: '#86939e',
    borderBottomWidth: 1,
    fontSize: 16,
    // paddingRight: 30,
    color: '#242424',
    paddingBottom: 4,
    paddingLeft: 0,
  },
  inputIOS: {
    height: 30,
    borderColor: '#86939e',
    borderBottomWidth: 1,
    fontSize: 16,
    // paddingRight: 30,
    color: '#242424',
  },
  placeholder: {
    color: '#242424',
    // color: "#86939e",
  },
  iconContainer: {top: 8, right: -12},
  //   inputAndroidContainer: { marginHorizontal: 10, marginBottom: 12 },
  //   inputIOSContainer: { marginHorizontal: 10, marginBottom: 12 }
});

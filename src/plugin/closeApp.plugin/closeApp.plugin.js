import RNExitApp from 'react-native-exit-app';
import {Alert} from 'react-native';

export default (title = String, description = String) => {
  Alert.alert(
    title,
    description,
    [
      {
        text: 'Close App',
        onPress: () => RNExitApp.exitApp(),
        style: 'cancel',
      },
    ],
    {cancelable: false},
  );
  return true;
};

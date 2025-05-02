import {Alert} from 'react-native';
import RNSecureStorage from 'rn-secure-storage';
import RNRestart from 'react-native-restart';
export const ResponseError = res => {
  switch (res.response.data.message) {
    // ------------------ Authentication issue ------------------
    case 'Credential not found':
      RNSecureStorage.remove('jwt').then();
      // RNRestart.Restart();
      return;

    case 'Invalid credential':
      RNSecureStorage.remove('jwt').then();
      RNRestart.Restart();
      return;

    case 'Credential expired':
      RNSecureStorage.remove('jwt').then();
      RNRestart.Restart();
      return;

    case 'User not found':
      RNSecureStorage.remove('jwt').then();
      RNRestart.Restart();
      return;

    case 'User is banned from login':
      // RNSecureStorage.remove('jwt').then();
      // RNRestart.Restart();
      return;

    case 'Credential not found':
      RNSecureStorage.remove('jwt').then();
      RNRestart.Restart();
      // RNRestart.Restart();
      return;
    // ------------------ Authentication issue ------------------

    default:
      console.log(res.status, res.response.status, res.response.data);
      if (res.status === 521) {
        // Cloudflare network down
        return Alert.alert(
          'Network Error',
          res.response.data.message
            ? res.response.data.message
            : res.response.data,
          [
            {
              text: 'Close',
              style: 'cancel',
            },
          ],
        );
      } else if (
        res.response.status === 403 &&
        res.response.data === 'Account Banned'
      ) {
        // Account Banned
        return Alert.alert(
          'Account Banned',
          res.response.data.message
            ? res.response.data.message
            : res.response.data,
          [
            {
              text: 'Close',
              style: 'cancel',
              onPress: () => {
                RNSecureStorage.remove('jwt').then();
                RNRestart.Restart();
              },
            },
          ],
        );
      } else if (res.response.status === 440) {
        // Timed Out
        return Alert.alert(
          'Duplicate Login',
          res.response.data.message
            ? res.response.data.message
            : res.response.data,
          [
            {
              text: 'Close',
              style: 'cancel',
              onPress: () => {
                RNSecureStorage.remove('jwt').then();
                RNRestart.Restart();
              },
            },
          ],
        );
      } else {
        Alert.alert(
          'Oops',
          res.response.data.message
            ? res.response.data.message
            : res.response.data,
          [
            {
              text: 'Close',
              style: 'cancel',
            },
          ],
        );
      }
      // return message.error("Validation Error");
      return;
  }
};

export const SocketResponseError = res => {
  if (res.status === 'ok') {
    return;
  }
  switch (res.message) {
    case 'User is banned from login.':
      // Modal.error({
      //   title: "Account banned from login",
      //   content: (
      //     <div>
      //       Your account are prevented from login, please contact admin for
      //       help. Our support email : support@kemm-advisory.com
      //     </div>
      //   )
      // });
      return;

    case 'Credential not found':
      return;

    default:
      console.log(res);
      Alert.alert('Error', res.message, [
        {
          text: 'Close',
          style: 'cancel',
        },
      ]);
      // return message.error("Validation Error");
      return;
  }
};

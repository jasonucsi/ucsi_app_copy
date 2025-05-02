import React, {useState, useMemo} from 'react';
import {Image} from 'react-native';
import RNSecureStorage from 'rn-secure-storage';
import {Avatar} from 'react-native-elements';

const SecureAvatarLoader = ({source, ...props}) => {
  const [jwt, setJWT] = useState('');

  useMemo(async () => {
    const token = await RNSecureStorage.get('jwt');
    setJWT(token);
  }, [jwt]);

  return !jwt ? (
    <Avatar {...props} />
  ) : (
    <Avatar
      source={{
        ...source,
        headers: {
          authorization: jwt,
        },
      }}
      {...props}
    />
  );
};

export default SecureAvatarLoader;

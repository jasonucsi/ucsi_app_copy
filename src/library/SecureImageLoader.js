import React, {useState, useMemo, useEffect} from 'react';
import {Image} from 'react-native';
import RNSecureStorage from 'rn-secure-storage';

const SecureImageLoader = ({source, ...props}) => {
  const [jwt, setJWT] = useState('');

  useEffect(() => {
    console.log(source, 9);
  }, []);

  useMemo(async () => {
    const token = await RNSecureStorage.get('jwt');
    setJWT(token);
  }, [jwt]);

  return !jwt ? (
    <Image {...props} />
  ) : (
    <Image
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

export default SecureImageLoader;

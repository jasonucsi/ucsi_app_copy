import RNSecureStorage from 'rn-secure-storage';
import totp from 'totp-generator';

export default {
  signPayQR: async (time, period = 1) => {
    const Secret = await RNSecureStorage.get('secret');
    console.log(Secret, 777);
    const SecretDecrypt = totp(Secret, {
      digits: 6,
      period: period,
      timestamp: time, // Math.floor(Date.now(),
      algorithm: 'SHA-512',
    });

    console.log(Secret, time, SecretDecrypt);
    return SecretDecrypt;
  },
};

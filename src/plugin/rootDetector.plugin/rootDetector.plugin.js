import JailMonkey from 'jail-monkey';

export default {
  validateEnvironment: () => {
    return JailMonkey.isJailBroken();
  },
};

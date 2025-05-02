import * as RNLocalize from 'react-native-localize';
import I18n from 'i18n-js';
import memoize from 'lodash.memoize';

import en from './en';
import zh from './zh';
import ms from './ms';
import RNSecureStorage from 'rn-secure-storage';

const locales = RNLocalize.getLocales();
console.log(locales);
// if (Array.isArray(locales)) {
//   I18n.locale = locales[0].languageTag;
// }

RNSecureStorage.get('appsLanguage')
  .then(res => {
    console.log('localeIndex', JSON.stringify(res));
    if (res) {
      I18n.locale = res;
    }
  })
  .catch(error => console.log(error));

I18n.translations = {
  default: en,
  en,
  zh,
  ms,
};

I18n.fallbacks = true;
export default I18n;

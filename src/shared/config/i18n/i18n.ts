import i18n, {LanguageDetectorAsyncModule} from 'i18next';
import {initReactI18next} from 'react-i18next';
import {getLocalize} from '../../lib/intl/getLocalize';
import {LanguageList, LanguageType} from './model/types/localize';

import en from '../locales/en/translation.json';
import ru from '../locales/ru/translation.json';

const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  detect: callback => {
    try {
      const languageCode = getLocalize<LanguageType>();
      callback(languageCode);
    } catch (error) {
      console.error('Error detecting language:', error);
    }
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    fallbackLng: LanguageList.EN,
    resources: {
      en,
      ru,
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

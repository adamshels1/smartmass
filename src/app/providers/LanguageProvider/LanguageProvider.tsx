import moment from 'moment';
import 'moment/locale/ru';
import 'moment/locale/tr';
import 'moment/locale/ar';
import 'moment/locale/es';
import 'moment/locale/fr';
import {FC, ReactNode, useEffect} from 'react';
import i18n from 'shared/config/i18n';

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: FC<LanguageProviderProps> = ({children}) => {
  // const language = useAppSelector(getLanguage);
  const language = 'en';

  useEffect(() => {
    if (language) {
      moment.locale(language);
      i18n.changeLanguage(language);
    }
  }, [language]);

  // Возвращаем элемент React
  return <>{children}</>;
};

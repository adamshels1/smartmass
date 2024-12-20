import moment from 'moment';
import 'moment/locale/ru';
import {FC, ReactNode, useEffect} from 'react';
import i18n from 'shared/config/i18n';

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: FC<LanguageProviderProps> = ({children}) => {
  // const language = useAppSelector(getLanguage);
  const language = 'ru';

  useEffect(() => {
    if (language) {
      moment.locale(language);
      i18n.changeLanguage(language);
    }
  }, [language]);

  // Возвращаем элемент React
  return <>{children}</>;
};

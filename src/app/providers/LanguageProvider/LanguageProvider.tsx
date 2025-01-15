import moment from 'moment';
import 'moment/locale/ru';
import 'moment/locale/tr';
import 'moment/locale/ar';
import 'moment/locale/es';
import 'moment/locale/fr';
import {FC, ReactNode, useEffect} from 'react';
import i18n from 'shared/config/i18n';
import {useSelector} from 'react-redux';
import {RootState} from 'app/providers/StoreProvider';

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: FC<LanguageProviderProps> = ({children}) => {
  const {user} = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user?.language) {
      moment.locale(user?.language);
      i18n.changeLanguage(user?.language);
    }
  }, [user?.language]);

  // Возвращаем элемент React
  return <>{children}</>;
};

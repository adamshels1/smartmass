import React, {
  useEffect,
  useCallback,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import BackgroundFetch from 'react-native-background-fetch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, {Notification} from '@notifee/react-native';
import moment from 'moment';

interface NotificationProviderProps {
  children: ReactNode;
}

interface NotificationContextValue {}

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined,
);

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const requestNotificationPermission = useCallback(async () => {
    try {
      await notifee.requestPermission();
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        sound: 'default',
      });
    } catch (error) {
      console.log('Notification permission error:', error);
    }
  }, []);

  const checkLastLoginAndNotify = useCallback(async () => {
    try {
      const lastNotificationDate = await AsyncStorage.getItem(
        'lastNotificationDate',
      );
      const today = moment().format('YYYY-MM-DD');

      if (lastNotificationDate !== today) {
        // Отправка уведомления, если сегодня ещё не было уведомлений
        await notifee.displayNotification({
          title: 'Напоминание',
          body: 'Не забудьте запланировать рацион на завтра',
          android: {
            channelId: 'default',
          },
        } as Notification);

        // Сохранение сегодняшней даты как последней отправки уведомления
        await AsyncStorage.setItem('lastNotificationDate', today);
      }
    } catch (error) {
      console.log('Error checking last login time:', error);
    }
  }, []);

  const configureBackgroundFetch = useCallback(() => {
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 15, // Интервал 15 минут
        stopOnTerminate: false,
        startOnBoot: true,
      },
      async (taskId: string) => {
        console.log('[BackgroundFetch] task start:', taskId);
        await checkLastLoginAndNotify();
        BackgroundFetch.finish(taskId);
      },
      () => {
        console.log('[BackgroundFetch] configure error');
      },
    );
  }, [checkLastLoginAndNotify]);

  const resetBadgeCount = useCallback(async () => {
    try {
      await notifee.setBadgeCount(0);
    } catch (error) {
      console.log('Error resetting badge count:', error);
    }
  }, []);

  useEffect(() => {
    const initNotifications = async () => {
      // await requestNotificationPermission();
      // configureBackgroundFetch();
      await resetBadgeCount(); // Reset badge count when the app opens
    };

    initNotifications();
  }, [
    // requestNotificationPermission,
    // configureBackgroundFetch,
    resetBadgeCount,
  ]);

  return (
    <NotificationContext.Provider value={{}}>
      {children}
    </NotificationContext.Provider>
  );
};

// Хук для использования контекста (если понадобится)
export const useNotification = (): NotificationContextValue | undefined =>
  useContext(NotificationContext);

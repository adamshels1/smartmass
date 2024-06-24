import notifee, {TriggerType} from '@notifee/react-native';

interface NotificationData {
  title: string;
  body: string;
  android?: {
    channelId: string;
    sound?: string; // Optional sound filename
    pressAction?: {
      id: string;
      launchActivity?: string; // Optional launch activity for Android
    };
  };
}

interface Trigger {
  type: TriggerType.TIMESTAMP;
  timestamp: number; // Milliseconds since epoch
}

export const createTriggerNotification = async (
  timestamp: number,
  title: string,
  body: string,
  notificationData?: NotificationData,
) => {
  console.log('timestamp:', timestamp);
  try {
    // Create a time-based trigger (30 minutes before timestamp)
    const trigger: Trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: timestamp - 1000 * 30, // 30 seconds in milliseconds
    };

    // Create the notification channel (optional, can be created elsewhere)
    await notifee.createChannel({
      id: 'mealtime',
      name: 'Default Channel',
      sound: 'doorbell', // Optional default sound
    });

    // Create a trigger notification
    const notification: NotificationData = {
      title,
      body,
      ...(notificationData || {}), // Merge optional notification data
    };

    const res = await notifee.createTriggerNotification(notification, trigger);
    console.log('createTriggerNotification:', res);
  } catch (error) {
    console.error('Error creating trigger notification:', error);
  }
};

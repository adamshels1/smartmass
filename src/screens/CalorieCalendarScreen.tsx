import React from 'react';
import CalorieCalendar from 'features/meal/ui/CalorieCalendar';
import {AppLayout} from 'shared/ui/AppLayout/AppLayout.tsx';
import SubscriptionManager from 'entities/subscription/ui/SubscriptionManager.tsx';

const CalorieCalendarScreen: React.FC = () => {
  return (
    <AppLayout>
      <SubscriptionManager />
    </AppLayout>
  );
};

export default CalorieCalendarScreen;

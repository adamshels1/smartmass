import React from 'react';
import CalorieCalendar from 'features/meal/ui/CalorieCalendar';
import {AppLayout} from 'shared/ui/AppLayout/AppLayout.tsx';

const CalorieCalendarScreen: React.FC = () => {
  return (
    <AppLayout>
      <CalorieCalendar />
    </AppLayout>
  );
};

export default CalorieCalendarScreen;

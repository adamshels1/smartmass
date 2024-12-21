import React from 'react';
import DailyMeals from 'features/meal/ui/dailyMeals/DailyMeals.tsx';
import {AppLayout} from 'shared/ui/AppLayout/AppLayout.tsx';

const DailyMealsScreen: React.FC = () => {
  return (
    <AppLayout>
      <DailyMeals />
    </AppLayout>
  );
};

export default DailyMealsScreen;

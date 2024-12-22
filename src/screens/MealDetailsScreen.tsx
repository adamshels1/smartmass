import React from 'react';
import MealDetails from 'features/meal/ui/mealDetails/MealDetails.tsx';
import {AppLayout} from 'shared/ui/AppLayout/AppLayout.tsx';

const MealDetailsScreen: React.FC = () => {
  return (
    <AppLayout>
      <MealDetails />
    </AppLayout>
  );
};

export default MealDetailsScreen;

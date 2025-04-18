import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  UserDetails,
  Goal,
  UserDetailsState,
} from 'entities/userDetails/model/types/userDetailsTypes.ts';
import apiInstance from 'shared/api/apiInstance';
import {RootState} from 'app/providers/StoreProvider/config/store';
import {ALERT_TYPE, Toast} from 'react-native-alert-notification';
import i18n from 'i18next';

const initialState: UserDetailsState = {
  userDetails: {
    weight: null,
    height: null,
    targetWeight: null,
    goal: null,
    preferredFoods: [],
    avoidFoods: [],
    allergens: [],
    maxMealPerDay: null,
    dailyMealStartTime: null,
    dailyMealEndTime: null,
    age: null,
    gender: null,
    dailyCalories: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  status: 'idle',
  error: null,
};

export const fetchUserDetails = createAsyncThunk<UserDetails>(
  'userDetails/fetchUserDetails',
  async () => {
    const response = await apiInstance.get<UserDetails>(
      '/userDetails/getUserDetails',
    );
    return response.data;
  },
);

export const updateUserDetails = createAsyncThunk<
  void,
  void,
  {state: RootState}
>('userDetails/updateUserDetails', async (_, {getState}) => {
  const userDetails = getState().userDetails.userDetails;
  console.log('userDetails', userDetails);
  await apiInstance.post('/userDetails/updateUserDetails', {userDetails});
});

export const deleteUserDetails = createAsyncThunk<void, void>(
  'userDetails/deleteUserDetails',
  async () => {
    await apiInstance.delete('/userDetails/deleteUserAndDetails');
    Toast.show({
      type: ALERT_TYPE.SUCCESS,
      title: i18n.t('User deleted successfully'),
      textBody: '',
    });
    console.log('User details deleted successfully');
  },
);

const userDetailsSlice = createSlice({
  name: 'userDetails',
  initialState,
  reducers: {
    updateGoal: (state, action: PayloadAction<Goal>) => {
      state.userDetails.goal = action.payload;
    },
    updatePersonalData: (
      state,
      action: PayloadAction<Partial<UserDetails>>,
    ) => {
      state.userDetails = {...state.userDetails, ...action.payload};
    },
    updateMealData: (state, action: PayloadAction<Partial<UserDetails>>) => {
      state.userDetails = {...state.userDetails, ...action.payload};
    },
    updateFoodPreferences: (
      state,
      action: PayloadAction<Partial<UserDetails>>,
    ) => {
      state.userDetails = {...state.userDetails, ...action.payload};
    },
    updateDailyCalories: (state, action: PayloadAction<number>) => {
      state.userDetails.dailyCalories = action.payload;
    },
    resetUserDetailsState: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserDetails.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userDetails = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(updateUserDetails.pending, state => {
        state.status = 'loading';
      })
      .addCase(updateUserDetails.fulfilled, state => {
        state.status = 'succeeded';
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(deleteUserDetails.pending, state => {
        state.status = 'loading';
      })
      .addCase(deleteUserDetails.fulfilled, state => {
        state.status = 'succeeded';
      })
      .addCase(deleteUserDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export const {
  updateGoal,
  updatePersonalData,
  updateMealData,
  updateFoodPreferences,
  updateDailyCalories,
  resetUserDetailsState,
} = userDetailsSlice.actions;

export default userDetailsSlice.reducer;

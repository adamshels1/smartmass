import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {
  Referral,
  ReferralsState,
} from 'features/referrals/model/types/referralTypes.ts';
import {getUserReferrals} from 'features/referrals/model/api/referralsApi';

const initialState: ReferralsState = {
  referrals: [],
  status: 'idle',
  error: null,
};

export const fetchUserReferrals = createAsyncThunk<Referral[]>(
  'referrals/fetchUserReferrals',
  async () => {
    const response = await getUserReferrals();
    return response;
  },
);

const referralsSlice = createSlice({
  name: 'referrals',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUserReferrals.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchUserReferrals.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.referrals = action.payload;
      })
      .addCase(fetchUserReferrals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export default referralsSlice.reducer;

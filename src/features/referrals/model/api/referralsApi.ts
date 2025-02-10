import apiInstance from 'shared/api/apiInstance.ts';
import {Referral} from 'features/referrals/model/types/referralTypes.ts';

// Function to get user referrals
export const getUserReferrals = async (): Promise<Referral[]> => {
  try {
    const response = await apiInstance.get<Referral[]>(
      '/referrals/getUserReferrals',
    );
    return response.data;
  } catch (error) {
    console.error('Error getting user referrals:', error);
    throw error;
  }
};

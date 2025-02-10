export interface Referral {
  id: number;
  email: string;
  name: string;
  googleId?: string;
  appleId?: string;
  lastLogin?: Date;
  country?: string;
  city?: string;
  emailVerified?: boolean;
  verificationCode?: string | null;
  timezone: string;
  language: string;
  referralId?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReferralsState {
  referrals: Referral[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

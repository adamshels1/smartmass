import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {
  signInWithEmail,
  signInWithGoogle,
  registerWithEmail,
  registerWithGoogle,
} from '../api/authApi';
import {AuthState, AuthResponse} from '../types/authTypes';

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  message: '',
};

// Асинхронные действия
export const loginWithEmail = createAsyncThunk(
  'auth/loginWithEmail',
  async ({email, password}: {email: string; password: string}) => {
    const data = await signInWithEmail(email, password);
    return data;
  },
);

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (idToken: string) => {
    const data = await signInWithGoogle(idToken);
    return data;
  },
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }) => {
    const data = await registerWithEmail(email, password, name);
    return data;
  },
);

export const registerWithGoogleAuth = createAsyncThunk(
  'auth/registerWithGoogleAuth',
  async (idToken: string) => {
    const data = await registerWithGoogle(idToken);
    return data;
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setMessage(state, action: PayloadAction<string>) {
      state.message = action.payload;
    },
    logout(state) {
      state.user = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginWithEmail.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginWithEmail.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.user = action.payload.user;
        },
      )
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to login';
      })
      .addCase(loginWithGoogle.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginWithGoogle.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.user = action.payload.user;
        },
      )
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to login with Google';
      })
      .addCase(registerUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.user = action.payload.user;
        },
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to register';
      })
      .addCase(registerWithGoogleAuth.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        registerWithGoogleAuth.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.user = action.payload.user;
        },
      )
      .addCase(registerWithGoogleAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to register with Google';
      });
  },
});

export const {setMessage, logout} = authSlice.actions;
export default authSlice.reducer;

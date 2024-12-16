import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {
  signInWithEmail,
  signInWithGoogle,
  registerWithEmail,
  registerWithGoogle,
} from '../api/authApi.ts';
import {AuthState, AuthResponse} from '../types/authTypes.ts';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  message: '',
  isAuth: false,
};

// Асинхронные действия
export const loginWithEmail = createAsyncThunk(
  'auth/loginWithEmail',
  async ({email, password}: {email: string; password: string}) => {
    const data = await signInWithEmail(email, password);
    await AsyncStorage.setItem('userToken', data.token); // Сохранение токена
    return data;
  },
);

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (idToken: string) => {
    const data = await signInWithGoogle(idToken);
    await AsyncStorage.setItem('userToken', data.token); // Сохранение токена
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
    await AsyncStorage.setItem('userToken', data.token); // Сохранение токена
    return data;
  },
);

export const registerWithGoogleAuth = createAsyncThunk(
  'auth/registerWithGoogleAuth',
  async (idToken: string) => {
    const data = await registerWithGoogle(idToken);
    await AsyncStorage.setItem('userToken', data.token); // Сохранение токена
    return data;
  },
);

// Действие для проверки состояния аутентификации
export const fetchAuth = createAsyncThunk('auth/fetchAuth', async () => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    // Пример проверки токена, для полноты тебе нужно будет добавить проверку на валидность токена
    const user = {token}; // Нужно заменить на реальную проверку
    return {user, isAuth: true};
  } else {
    return {user: null, isAuth: false};
  }
});

// Действие для выхода из аккаунта
export const fetchLogout = createAsyncThunk('auth/fetchLogout', async () => {
  await AsyncStorage.removeItem('userToken');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setMessage(state, action: PayloadAction<string>) {
      state.message = action.payload;
    },
    resetAuthState(state) {
      state.user = null;
      state.isAuth = false;
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
          state.isAuth = true;
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
          state.isAuth = true;
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
          state.isAuth = true;
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
          state.isAuth = true;
        },
      )
      .addCase(registerWithGoogleAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to register with Google';
      })
      .addCase(fetchAuth.fulfilled, (state, action) => {
        // state.user = action.payload.user;
        state.isAuth = action.payload.isAuth;
      })
      .addCase(fetchLogout.fulfilled, state => {
        state.user = null;
        state.isAuth = false;
      });
  },
});

export const {setMessage, resetAuthState} = authSlice.actions;
export default authSlice.reducer;

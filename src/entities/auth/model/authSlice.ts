import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {
  signInWithEmail,
  signInWithGoogle,
  registerWithEmail,
  verifyEmail, // Импортируем функцию для верификации email
} from '../api/authApi.ts';
import {
  AuthState,
  AuthResponse,
  VerifyEmailResponse,
} from '../types/authTypes.ts';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  message: '',
  isAuth: false,
  showWelcomeScreen: true,
};

// Асинхронные действия
export const loginWithEmail = createAsyncThunk(
  'auth/loginWithEmail',
  async (
    {email, password}: {email: string; password: string},
    {rejectWithValue},
  ) => {
    try {
      const data = await signInWithEmail(email, password);
      await AsyncStorage.setItem('userToken', data.token); // Сохранение токена
      return data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  },
);

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (idToken: string, {rejectWithValue}) => {
    try {
      const data = await signInWithGoogle(idToken);
      await AsyncStorage.setItem('userToken', data.token); // Сохранение токена
      return data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  },
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (
    {email, password, name}: {email: string; password: string; name: string},
    {rejectWithValue},
  ) => {
    try {
      const data = await registerWithEmail(email, password, name);
      // await AsyncStorage.setItem('userToken', data.token); // Сохранение токена
      return data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  },
);

// Действие для проверки состояния аутентификации
export const fetchAuth = createAsyncThunk(
  'auth/fetchAuth',
  async (_, {rejectWithValue}) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        // Пример проверки токена, для полноты тебе нужно будет добавить проверку на валидность токена
        const user = {token}; // Нужно заменить на реальную проверку
        return {user, isAuth: true};
      } else {
        return {user: null, isAuth: false};
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

// Действие для выхода из аккаунта
export const fetchLogout = createAsyncThunk(
  'auth/fetchLogout',
  async (_, {rejectWithValue}) => {
    try {
      await AsyncStorage.removeItem('userToken');
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

// Действие для верификации email
export const verifyEmailCode = createAsyncThunk(
  'auth/verifyEmailCode',
  async ({email, code}: {email: string; code: string}, {rejectWithValue}) => {
    try {
      const data = await verifyEmail(email, code);
      return data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  },
);

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
    setShowWelcomeScreen(state, action: PayloadAction<boolean>) {
      state.showWelcomeScreen = action.payload;
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
          console.log('User:', action.payload.user); // Логирование пользователя
          state.loading = false;
          state.user = action.payload.user;
          state.isAuth = true;
          state.error = null; // Обнуление ошибки
        },
      )
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          'Failed to login';
      })
      .addCase(loginWithGoogle.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginWithGoogle.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          console.log('User:', action.payload.user); // Логирование пользователя
          state.loading = false;
          state.user = action.payload.user;
          state.isAuth = true;
          state.error = null; // Обнуление ошибки
        },
      )
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          'Failed to login with Google';
      })
      .addCase(registerUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          console.log('User:', action.payload.user); // Логирование пользователя
          state.loading = false;
          state.error = null; // Обнуление ошибки
        },
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          'Failed to register';
      })
      .addCase(fetchAuth.fulfilled, (state, action) => {
        // state.user = action.payload.user;
        state.isAuth = action.payload.isAuth;
      })
      .addCase(fetchLogout.fulfilled, state => {
        state.user = null;
        state.isAuth = false;
      })
      .addCase(verifyEmailCode.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        verifyEmailCode.fulfilled,
        (state, action: PayloadAction<VerifyEmailResponse>) => {
          state.loading = false;
          state.message = action.payload.message;
        },
      )
      .addCase(verifyEmailCode.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          'Failed to verify email';
      });
  },
});

export const {setMessage, resetAuthState, setShowWelcomeScreen} =
  authSlice.actions;
export default authSlice.reducer;

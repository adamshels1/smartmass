export interface User {
  id: string;
  email: string;
  name: string;
  language?: string;
  timezone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  message: string;
  isAuth: boolean;
  showWelcomeScreen: boolean;
}

export interface VerifyEmailResponse {
  message: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

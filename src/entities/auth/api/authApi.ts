import apiInstance from 'shared/api/apiInstance.ts';

interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
}

export const signInWithEmail = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  try {
    const response = await apiInstance.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Error logging in with email:', error);
    throw error;
  }
};

export const signInWithGoogle = async (
  idToken: string,
): Promise<AuthResponse> => {
  try {
    const response = await apiInstance.post<AuthResponse>('/auth/googleAuth', {
      idToken,
    });
    return response.data;
  } catch (error) {
    console.error('Error logging in with Google:', error);
    throw error;
  }
};

export const registerWithEmail = async (
  email: string,
  password: string,
  name: string,
): Promise<AuthResponse> => {
  try {
    const response = await apiInstance.post<AuthResponse>('/auth/register', {
      email,
      password,
      name,
    });
    return response.data;
  } catch (error) {
    console.error('Error registering with email:', error);
    throw error;
  }
};

export const registerWithGoogle = async (
  idToken: string,
): Promise<AuthResponse> => {
  try {
    const response = await apiInstance.post<AuthResponse>('/auth/googleAuth', {
      idToken,
    });
    return response.data;
  } catch (error) {
    console.error('Error registering with Google:', error);
    throw error;
  }
};

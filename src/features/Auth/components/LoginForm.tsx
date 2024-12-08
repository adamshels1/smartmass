import React, {useState} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {loginWithEmail, loginWithGoogle} from '../model/authSlice';
import {RootState} from 'app/providers/StoreProvider/config/store';

const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {loading, error} = useSelector((state: RootState) => state.auth);

  const handleLogin = () => {
    dispatch(loginWithEmail({email, password}));
  };

  const handleGoogleLogin = () => {
    const idToken = ''; // Получите idToken из Google Sign-In
    dispatch(loginWithGoogle(idToken));
  };

  return (
    <View>
      <Text>Email:</Text>
      <TextInput value={email} onChangeText={setEmail} />
      <Text>Password:</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Login" onPress={handleLogin} disabled={loading} />
      <Button
        title="Login with Google"
        onPress={handleGoogleLogin}
        disabled={loading}
      />
      {error && <Text style={{color: 'red'}}>{error}</Text>}
    </View>
  );
};

export default LoginForm;

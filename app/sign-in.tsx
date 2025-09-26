import { useSession } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { getLoginStyles } from '@/styles/styles';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { isDark } = useTheme();
  const { signIn } = useSession();
  const styles = getLoginStyles(isDark);

  const handleSignIn = () => {
    console.log('Sign In button pressed');
    signIn();
    // Navigate after signing in. The auth state will automatically update the root navigator.
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginCard}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <TextInput
          style={styles.input}
          placeholder='Email'
          placeholderTextColor={isDark ? '#888' : '#999'}
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
          autoCapitalize='none'
        />

        <TextInput
          style={styles.input}
          placeholder='Password'
          placeholderTextColor={isDark ? '#888' : '#999'}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleSignIn}>
          <Text style={styles.loginButtonText}>Sign In</Text>
        </TouchableOpacity>

        <Text style={styles.demoText}>
          This is a demo login screen.{'\n'}
          Just tap the Sign In button to continue!
        </Text>
      </View>
    </View>
  );
}

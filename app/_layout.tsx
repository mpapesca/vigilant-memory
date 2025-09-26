import { Stack } from "expo-router";
import { SplashScreenController } from '../components/SplashScreenController';
import { SessionProvider, useSession } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SessionProvider>
        <SplashScreenController />
        <RootNavigator />
      </SessionProvider>
    </ThemeProvider>
  );
}

function RootNavigator() {
  const { session, isLoading } = useSession();

  // Don't render navigation until auth state is loaded
  if (isLoading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name='(app)' />
      </Stack.Protected>

      <Stack.Protected guard={!session}>
        <Stack.Screen name='sign-in' />
      </Stack.Protected>
    </Stack>
  );
}

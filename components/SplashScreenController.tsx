import { useSession } from '@/contexts/AuthContext';
import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';

// Prevent the splash screen from auto-hiding before authentication is determined
SplashScreen.preventAutoHideAsync();

export function SplashScreenController() {
  const { isLoading } = useSession();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  return null;
}

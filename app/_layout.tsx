import { Stack } from "expo-router";
import { ThemeProvider } from '../contexts/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack initialRouteName='login'>
        <Stack.Screen name='login' options={{ headerShown: false }} />
        <Stack.Screen name='(drawer)' options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}

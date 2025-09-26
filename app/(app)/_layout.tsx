import { Stack } from 'expo-router';

export default function AppLayout() {
  // This renders the navigation stack for all authenticated app routes.
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(drawer)" />
    </Stack>
  );
}

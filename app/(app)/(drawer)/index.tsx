import { useTheme } from "@/contexts/ThemeContext";
import { getHomeStyles } from "@/styles/styles";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const { isDark } = useTheme();
  const styles = getHomeStyles(isDark);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Vigilant Memory!</Text>
      
      <Text style={styles.subtitle}>
        This app demonstrates native drawer navigation with Expo Router.
      </Text>

      <View style={styles.card}>
        <Text style={styles.title}>🏠 Home Screen</Text>
        <Text style={styles.instructionText}>
          You are currently on the Home screen. This is the default screen that loads when the app starts.
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push('/settings')}
      >
        <Text style={styles.buttonText}>Go to Settings</Text>
      </TouchableOpacity>

      <Text style={styles.instructionText}>
        💡 Try these navigation methods:
        {'\n'}• Tap the hamburger menu (☰) in the header
        {'\n'}• Swipe from the left edge of the screen
        {'\n'}• Use the button above
      </Text>
    </View>
  );
}

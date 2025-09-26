import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const { isDark } = useTheme();
  const dynamicStyles = getStyles(isDark);

  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.title}>Welcome to Vigilant Memory!</Text>
      
      <Text style={dynamicStyles.subtitle}>
        This app demonstrates native drawer navigation with Expo Router.
      </Text>

      <View style={dynamicStyles.card}>
        <Text style={dynamicStyles.cardTitle}>🏠 Home Screen</Text>
        <Text style={dynamicStyles.cardText}>
          You are currently on the Home screen. This is the default screen that loads when the app starts.
        </Text>
      </View>

      <TouchableOpacity 
        style={dynamicStyles.button}
        onPress={() => router.push('/settings')}
      >
        <Text style={dynamicStyles.buttonText}>Go to Settings</Text>
      </TouchableOpacity>

      <Text style={dynamicStyles.instructions}>
        💡 Try these navigation methods:
        {'\n'}• Tap the hamburger menu (☰) in the header
        {'\n'}• Swipe from the left edge of the screen
        {'\n'}• Use the button above
      </Text>
    </View>
  );
}

// Dynamic styles function for dark mode support
const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: isDark ? "#000000" : "#f0f8ff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: isDark ? "#ffffff" : "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: isDark ? "#8e8e93" : "#666",
    fontStyle: "italic",
  },
  card: {
    backgroundColor: isDark ? "#1c1c1e" : "white",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
    shadowColor: isDark ? "#ffffff" : "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: isDark ? "#ffffff" : "#000",
  },
  cardText: {
    fontSize: 14,
    color: isDark ? "#8e8e93" : "#555",
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  instructions: {
    fontSize: 14,
    color: isDark ? "#8e8e93" : "#666",
    textAlign: "center",
    lineHeight: 22,
  },
});

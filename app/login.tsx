import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isDark } = useTheme();
  const dynamicStyles = getStyles(isDark);

  const handleLogin = () => {
    router.replace("/(drawer)");
  };

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.loginCard}>
        <Text style={dynamicStyles.title}>Welcome Back!</Text>
        <Text style={dynamicStyles.subtitle}>Sign in to continue</Text>

        <TextInput
          style={dynamicStyles.input}
          placeholder="Email"
          placeholderTextColor={isDark ? '#888' : '#999'}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={dynamicStyles.input}
          placeholder="Password"
          placeholderTextColor={isDark ? '#888' : '#999'}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={dynamicStyles.loginButton}
          onPress={handleLogin}
        >
          <Text style={dynamicStyles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <Text style={dynamicStyles.demoText}>
          This is a demo login screen.{'\n'}
          Just tap the Login button to continue!
        </Text>
      </View>
    </View>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? "#000" : "#f0f8ff",
    justifyContent: "center",
    padding: 20,
  },
  loginCard: {
    backgroundColor: isDark ? "#1a1a1a" : "white",
    borderRadius: 16,
    padding: 30,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: isDark ? "#fff" : "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: isDark ? "#ccc" : "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: isDark ? "#444" : "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: isDark ? "#2a2a2a" : "#f9f9f9",
    color: isDark ? "#fff" : "#000",
  },
  loginButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  demoText: {
    fontSize: 14,
    color: isDark ? "#888" : "#999",
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 20,
  },
});

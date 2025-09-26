import { useTheme } from "@/contexts/ThemeContext";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Settings() {
  const { themeMode, isDark, setThemeMode } = useTheme();
  const dynamicStyles = getStyles(isDark);

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.settingSection}>
        <Text style={dynamicStyles.settingText}>Theme Mode</Text>
        <View style={dynamicStyles.buttonGroup}>
          <TouchableOpacity 
            style={[
              dynamicStyles.themeButton, 
              themeMode === 'system' && dynamicStyles.themeButtonActive
            ]}
            onPress={() => setThemeMode('system')}
          >
            <Text style={[
              dynamicStyles.themeButtonText,
              themeMode === 'system' && dynamicStyles.themeButtonTextActive
            ]}>
              System
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              dynamicStyles.themeButton, 
              themeMode === 'light' && dynamicStyles.themeButtonActive
            ]}
            onPress={() => setThemeMode('light')}
          >
            <Text style={[
              dynamicStyles.themeButtonText,
              themeMode === 'light' && dynamicStyles.themeButtonTextActive
            ]}>
              Light
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              dynamicStyles.themeButton, 
              themeMode === 'dark' && dynamicStyles.themeButtonActive
            ]}
            onPress={() => setThemeMode('dark')}
          >
            <Text style={[
              dynamicStyles.themeButtonText,
              themeMode === 'dark' && dynamicStyles.themeButtonTextActive
            ]}>
              Dark
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: isDark ? "#000" : "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: isDark ? "#fff" : "#000",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: isDark ? "#1a1a1a" : "white",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 2,
  },
  settingText: {
    fontSize: 16,
    fontWeight: "500",
    color: isDark ? "#fff" : "#000",
  },
  settingSection: {
    backgroundColor: isDark ? "#1a1a1a" : "white",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 2,
  },
  buttonGroup: {
    flexDirection: "row",
    marginTop: 10,
    backgroundColor: isDark ? "#2a2a2a" : "#f0f0f0",
    borderRadius: 8,
    padding: 2,
  },
  themeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 1,
  },
  themeButtonActive: {
    backgroundColor: "#007AFF",
  },
  themeButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: isDark ? "#ccc" : "#666",
  },
  themeButtonTextActive: {
    color: "white",
    fontWeight: "600",
  },
  themeValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  description: {
    fontSize: 14,
    color: isDark ? "#888" : "#666",
    textAlign: "center",
    marginTop: 30,
    fontStyle: "italic",
  },
});

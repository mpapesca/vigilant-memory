import { useTheme } from "@/contexts/ThemeContext";
import { getSettingsStyles } from "@/styles/styles";
import { Text, TouchableOpacity, View } from "react-native";

export default function Settings() {
  const { themeMode, isDark, setThemeMode } = useTheme();
  const styles = getSettingsStyles(isDark);

  return (
    <View style={styles.container}>
      <View style={styles.settingSection}>
        <Text style={styles.settingText}>Theme Mode</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity 
            style={[
              styles.themeButton, 
              themeMode === 'system' && styles.themeButtonActive
            ]}
            onPress={() => setThemeMode('system')}
          >
            <Text style={[
              styles.themeButtonText,
              themeMode === 'system' && styles.themeButtonTextActive
            ]}>
              System
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.themeButton, 
              themeMode === 'light' && styles.themeButtonActive
            ]}
            onPress={() => setThemeMode('light')}
          >
            <Text style={[
              styles.themeButtonText,
              themeMode === 'light' && styles.themeButtonTextActive
            ]}>
              Light
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.themeButton, 
              themeMode === 'dark' && styles.themeButtonActive
            ]}
            onPress={() => setThemeMode('dark')}
          >
            <Text style={[
              styles.themeButtonText,
              themeMode === 'dark' && styles.themeButtonTextActive
            ]}>
              Dark
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

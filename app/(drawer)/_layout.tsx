import { useTheme } from "@/contexts/ThemeContext";
import Constants from 'expo-constants';
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

function CustomDrawerContent(props: any) {
  const router = useRouter();
  const { isDark } = useTheme();

  const handleLogout = () => {
    router.replace("/login");
  };

  const navigateToScreen = (screenName: string) => {
    props.navigation.navigate(screenName);
  };

  // Convert app name to human-readable format
  const formatAppName = (name: string) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const appName = Constants.expoConfig?.name 
    ? formatAppName(Constants.expoConfig.name)
    : 'Vigilant Memory';

  // Dynamic styles based on color scheme
  const dynamicStyles = getStyles(isDark);

  return (
    <View style={dynamicStyles.drawerContainer}>
      <View style={dynamicStyles.topSection}>
        <Text style={dynamicStyles.drawerTitle}>Menu</Text>
        
        <TouchableOpacity 
          style={dynamicStyles.drawerItem}
          onPress={() => navigateToScreen("index")}
        >
          <Text style={dynamicStyles.drawerItemText}>🏠 Home</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={dynamicStyles.drawerItem}
          onPress={() => navigateToScreen("settings")}
        >
          <Text style={dynamicStyles.drawerItemText}>⚙️ Settings</Text>
        </TouchableOpacity>
      </View>

      <View style={dynamicStyles.bottomSection}>
        <TouchableOpacity 
          style={[dynamicStyles.drawerItem, dynamicStyles.logoutItem]}
          onPress={handleLogout}
        >
          <Text style={[dynamicStyles.drawerItemText, dynamicStyles.logoutText]}>🚪 Logout</Text>
        </TouchableOpacity>
        
        <Text style={dynamicStyles.appNameText}>
          {appName}
        </Text>
        <Text style={dynamicStyles.versionText}>
          v{Constants.expoConfig?.version || '1.0.0'}
        </Text>
      </View>
    </View>
  );
}

export default function DrawerLayout() {
  const { isDark } = useTheme();

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: isDark ? '#1c1c1e' : '#f8f9fa',
          width: 250,
        },
        drawerActiveTintColor: isDark ? '#007AFF' : '#007AFF',
        drawerInactiveTintColor: isDark ? '#8e8e93' : '#666',
        headerStyle: {
          backgroundColor: isDark ? '#1c1c1e' : '#ffffff',
        },
        headerTintColor: isDark ? '#ffffff' : '#000000',
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "Home",
          title: "Home",
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: "Settings",
          title: "Settings",
        }}
      />
    </Drawer>
  );
}

// Dynamic styles function
const getStyles = (isDark: boolean) => StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: isDark ? '#1c1c1e' : '#f8f9fa',
  },
  topSection: {
    flex: 1,
  },
  bottomSection: {
    paddingBottom: 30,
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: isDark ? '#ffffff' : '#333',
  },
  drawerItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 5,
    borderRadius: 8,
    backgroundColor: isDark ? '#2c2c2e' : 'transparent',
  },
  drawerItemText: {
    fontSize: 16,
    color: isDark ? '#ffffff' : '#333',
  },
  logoutItem: {
    backgroundColor: isDark ? '#3a1f1f' : '#ffe6e6',
    borderWidth: 1,
    borderColor: isDark ? '#5a2a2a' : '#ffcccb',
  },
  logoutText: {
    color: isDark ? '#ff6b6b' : '#dc3545',
    fontWeight: '600',
  },
  appNameText: {
    fontSize: 14,
    color: isDark ? '#8e8e93' : '#666',
    textAlign: 'center',
    marginTop: 15,
    fontWeight: '500',
  },
  versionText: {
    fontSize: 12,
    color: isDark ? '#6d6d70' : '#999',
    textAlign: 'center',
    marginTop: 2,
    fontStyle: 'italic',
  },
});

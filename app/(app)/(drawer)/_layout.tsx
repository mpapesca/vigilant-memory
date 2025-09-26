import { useSession } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { getDrawerStyles } from '@/styles/styles';
import Constants from 'expo-constants';
import { Drawer } from 'expo-router/drawer';
import { Text, TouchableOpacity, View } from 'react-native';

function CustomDrawerContent(props: any) {
  const { isDark } = useTheme();
  const { signOut } = useSession();

  const handleLogout = async () => {
    signOut();
  };

  const navigateToScreen = (screenName: string) => {
    props.navigation.navigate(screenName);
  };

  // Convert app name to human-readable format
  const formatAppName = (name: string) => {
    return name
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const appName = Constants.expoConfig?.name
    ? formatAppName(Constants.expoConfig.name)
    : 'Vigilant Memory';

  // Dynamic styles based on color scheme
  const styles = getDrawerStyles(isDark);

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.topSection}>
        <Text style={styles.drawerTitle}>Menu</Text>

        <TouchableOpacity style={styles.drawerItem} onPress={() => navigateToScreen('index')}>
          <Text style={styles.drawerItemText}>🏠 Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.drawerItem} onPress={() => navigateToScreen('progress')}>
          <Text style={styles.drawerItemText}>📊 Progress</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.drawerItem} onPress={() => navigateToScreen('settings')}>
          <Text style={styles.drawerItemText}>⚙️ Settings</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity style={[styles.drawerItem, styles.logoutItem]} onPress={handleLogout}>
          <Text style={[styles.drawerItemText, styles.logoutText]}>🚪 Logout</Text>
        </TouchableOpacity>

        <Text style={styles.appNameText}>{appName}</Text>
        <Text style={styles.versionText}>v{Constants.expoConfig?.version || '1.0.0'}</Text>
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
        headerShown: true,
        swipeEnabled: true,
      }}
    >
      <Drawer.Screen
        name='index'
        options={{
          drawerLabel: 'Home',
          title: 'Home',
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name='game'
        options={{
          drawerLabel: 'Game',
          title: 'Memory Game',
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name='progress'
        options={{
          drawerLabel: 'Progress',
          title: 'Progress',
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name='settings'
        options={{
          drawerLabel: 'Settings',
          title: 'Settings',
          headerShown: true,
        }}
      />
    </Drawer>
  );
}

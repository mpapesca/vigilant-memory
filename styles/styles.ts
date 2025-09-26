import { StyleSheet } from 'react-native';

// Common Colors and Design Tokens
export const Colors = {
  primary: '#007AFF',
  danger: '#ff3b30',
  success: '#34c759',
  warning: '#ff9500',
  light: {
    background: '#f5f5f5',
    backgroundAlt: '#f0f8ff',
    backgroundThird: '#f8f9fa',
    cardBackground: '#ffffff',
    text: '#333333',
    textSecondary: '#666666',
    textTertiary: '#777777',
    textMuted: '#999999',
    border: '#ddd',
    inputBackground: '#f9f9f9',
    shadow: '#000',
  },
  dark: {
    background: '#000000',
    backgroundAlt: '#1c1c1e',
    backgroundThird: '#2a2a2a',
    cardBackground: '#1a1a1a',
    text: '#ffffff',
    textSecondary: '#cccccc',
    textTertiary: '#aaaaaa',
    textMuted: '#888888',
    border: '#444444',
    inputBackground: '#2a2a2a',
    shadow: '#000',
  },
};

export const Spacing = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  xxxl: 30,
};

export const BorderRadius = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  xxl: 16,
};

export const Typography = {
  h1: { fontSize: 28, fontWeight: 'bold' as const },
  h2: { fontSize: 24, fontWeight: 'bold' as const },
  h3: { fontSize: 20, fontWeight: 'bold' as const },
  h4: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '500' as const },
  bodySmall: { fontSize: 14, fontWeight: 'normal' as const },
  caption: { fontSize: 12, fontWeight: 'normal' as const },
};

export const Shadows = {
  small: {
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  medium: {
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  large: {
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
};

// Base/Common Styles
const getBaseStyles = (isDark: boolean) => ({
  container: {
    flex: 1,
    padding: Spacing.xxl,
    backgroundColor: isDark ? Colors.dark.background : Colors.light.background,
  },
  containerAlt: {
    flex: 1,
    padding: Spacing.xxl,
    backgroundColor: isDark ? Colors.dark.backgroundAlt : Colors.light.backgroundAlt,
  },
  card: {
    backgroundColor: isDark ? Colors.dark.cardBackground : Colors.light.cardBackground,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl,
    marginBottom: Spacing.xxl,
    ...Shadows.medium,
    shadowColor: Colors.light.shadow,
    shadowOpacity: isDark ? 0.3 : 0.1,
  },
  cardSmall: {
    backgroundColor: isDark ? Colors.dark.cardBackground : Colors.light.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    ...Shadows.small,
    shadowColor: Colors.light.shadow,
    shadowOpacity: isDark ? 0.3 : 0.1,
  },
  title: {
    ...Typography.h1,
    textAlign: 'center' as const,
    marginBottom: Spacing.lg,
    color: isDark ? Colors.dark.text : Colors.light.text,
  },
  subtitle: {
    ...Typography.body,
    textAlign: 'center' as const,
    marginBottom: Spacing.xxxl,
    color: isDark ? Colors.dark.textSecondary : Colors.light.textSecondary,
  },
  text: {
    ...Typography.body,
    color: isDark ? Colors.dark.text : Colors.light.text,
  },
  textSecondary: {
    ...Typography.bodySmall,
    color: isDark ? Colors.dark.textSecondary : Colors.light.textSecondary,
  },
  textMuted: {
    ...Typography.bodySmall,
    color: isDark ? Colors.dark.textMuted : Colors.light.textMuted,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center' as const,
    marginBottom: Spacing.xxl,
  },
  buttonText: {
    color: 'white',
    ...Typography.h4,
  },
  input: {
    borderWidth: 1,
    borderColor: isDark ? Colors.dark.border : Colors.light.border,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    ...Typography.body,
    marginBottom: Spacing.xl,
    backgroundColor: isDark ? Colors.dark.inputBackground : Colors.light.inputBackground,
    color: isDark ? Colors.dark.text : Colors.light.text,
  },
});

// Login Screen Styles
export const getLoginStyles = (isDark: boolean) => {
  const base = getBaseStyles(isDark);
  return StyleSheet.create({
    container: {
      ...base.containerAlt,
      justifyContent: 'center',
    },
    loginCard: {
      ...base.card,
      ...Shadows.large,
    },
    title: base.title,
    subtitle: base.subtitle,
    input: base.input,
    loginButton: base.button,
    loginButtonText: base.buttonText,
    demoText: {
      ...base.textMuted,
      textAlign: 'center',
      fontStyle: 'italic',
      lineHeight: 20,
    },
  });
};

// Home Screen Styles
export const getHomeStyles = (isDark: boolean) => {
  const base = getBaseStyles(isDark);
  return StyleSheet.create({
    container: base.container,
    title: base.title,
    subtitle: base.subtitle,
    card: base.card,
    button: base.button,
    buttonText: base.buttonText,
    instructionText: {
      ...base.textSecondary,
      lineHeight: 20,
      textAlign: 'center',
    },
  });
};

// Settings Screen Styles
export const getSettingsStyles = (isDark: boolean) => {
  const base = getBaseStyles(isDark);
  return StyleSheet.create({
    container: base.container,
    title: base.title,
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      ...base.cardSmall,
    },
    settingText: base.text,
    settingSection: base.cardSmall,
    buttonGroup: {
      flexDirection: 'row',
      marginTop: Spacing.lg,
      backgroundColor: isDark ? Colors.dark.backgroundThird : Colors.light.backgroundThird,
      borderRadius: BorderRadius.lg,
      padding: Spacing.xs,
    },
    themeButton: {
      flex: 1,
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing.xl,
      borderRadius: BorderRadius.md,
      alignItems: 'center',
      marginHorizontal: 1,
    },
    themeButtonActive: {
      backgroundColor: Colors.primary,
    },
    themeButtonText: {
      ...Typography.bodySmall,
      fontWeight: '500',
      color: isDark ? Colors.dark.textSecondary : Colors.light.textSecondary,
    },
    themeButtonTextActive: {
      color: 'white',
      fontWeight: '600',
    },
    themeValue: {
      ...Typography.body,
      fontWeight: '600',
      color: Colors.primary,
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.lg,
      borderRadius: BorderRadius.sm,
    },
    description: {
      ...base.textMuted,
      textAlign: 'center',
      marginTop: Spacing.xxxl,
      fontStyle: 'italic',
    },
  });
};

// Drawer Styles
export const getDrawerStyles = (isDark: boolean) => {
  const base = getBaseStyles(isDark);
  return StyleSheet.create({
    drawerContainer: {
      flex: 1,
      paddingTop: 50,
      paddingHorizontal: Spacing.xxl,
      backgroundColor: isDark ? Colors.dark.backgroundAlt : Colors.light.backgroundThird,
    },
    topSection: {
      flex: 1,
    },
    bottomSection: {
      paddingBottom: Spacing.xxxl,
    },
    drawerTitle: {
      ...Typography.h2,
      marginBottom: Spacing.xxxl,
      color: isDark ? Colors.dark.text : Colors.light.text,
    },
    drawerItem: {
      paddingVertical: Spacing.xl,
      paddingHorizontal: Spacing.lg,
      marginBottom: Spacing.sm,
      borderRadius: BorderRadius.lg,
      backgroundColor: isDark ? Colors.dark.backgroundThird : 'transparent',
    },
    drawerItemText: {
      ...base.text,
    },
    logoutItem: {
      backgroundColor: isDark ? '#3a1f1f' : '#ffe6e6',
      borderWidth: 1,
      borderColor: isDark ? '#5a2a2a' : '#ffcccb',
    },
    logoutText: {
      color: isDark ? '#ff6b6b' : Colors.danger,
      fontWeight: '600',
    },
    appNameText: {
      ...Typography.bodySmall,
      color: isDark ? Colors.dark.textMuted : Colors.light.textSecondary,
      textAlign: 'center',
      marginTop: Spacing.xl,
      fontWeight: '500',
    },
    versionText: {
      ...Typography.caption,
      color: isDark ? Colors.dark.textMuted : Colors.light.textMuted,
      textAlign: 'center',
      marginTop: Spacing.xs,
      fontStyle: 'italic',
    },
  });
};

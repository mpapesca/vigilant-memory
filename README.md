# 🧠 Vigilant Memory

<div align="center">

![Vigilant Memory Logo](./assets/images/icon.png)

**A Modern React Native App with Expo Router** 🚀

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh/)

*Where memory meets vigilance in the most elegant way possible* ✨

</div>

---

## 🌟 What is Vigilant Memory?

**Vigilant Memory** is a beautifully crafted React Native application that showcases modern mobile development practices. Built with **Expo Router v6**, it demonstrates professional-grade authentication flows, dark mode theming, and intuitive navigation patterns.

This isn't just another demo app – it's a **production-ready foundation** that follows industry best practices and implements the latest React Native patterns.

## ✨ Features That'll Make You Smile

### 🔐 **Smart Authentication**
- **Secure Storage**: Uses `expo-secure-store` for production-grade credential management
- **Session Persistence**: Stay logged in across app restarts
- **Protected Routes**: Expo Router's `Stack.Protected` pattern for seamless navigation
- **No Flash Navigation**: Smooth authentication without screen flickering

### 🌙 **Adaptive Theming**
- **System Theme Detection**: Automatically follows your device's theme preference
- **Manual Override**: Choose from System, Light, or Dark modes
- **Persistent Preferences**: Your theme choice is remembered forever
- **Smooth Transitions**: Beautiful animations between theme changes

### 🧭 **Intuitive Navigation**
- **Drawer Navigation**: Slide-out menu with elegant animations
- **File-Based Routing**: Expo Router v6 with TypeScript support
- **Deep Linking**: Direct navigation to any screen via URLs
- **Splash Screen Management**: Professional loading experience

### 🎨 **Design Excellence**
- **Centralized Styling**: Single source of truth for all design tokens
- **Design System**: Consistent colors, typography, spacing, and shadows
- **Responsive Layouts**: Looks perfect on phones and tablets
- **Modern UI**: Clean, minimal interface that users love

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **Bun** (recommended) or npm/yarn
- **Expo CLI** installed globally
- **iOS Simulator** or **Android Emulator** (optional)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd vigilant-memory

# Install dependencies with Bun (lightning fast! ⚡)
bun install

# Start the development server
bun run start
```

### Running the App

```bash
# iOS Simulator
bun run ios

# Android Emulator  
bun run android

# Web Browser
bun run web

# Development Server (scan QR code)
bun run start
```

## 🏗️ Architecture Deep Dive

### 📁 Project Structure
```
vigilant-memory/
├── app/                          # 🧭 Expo Router file-based routing
│   ├── _layout.tsx              # Root layout with providers
│   ├── sign-in.tsx              # Authentication screen
│   └── (app)/                   # 🔒 Protected routes group
│       ├── _layout.tsx          # App-level layout
│       └── (drawer)/            # 🗂️ Drawer navigation
│           ├── _layout.tsx      # Drawer configuration
│           ├── index.tsx        # Home screen
│           └── settings.tsx     # Settings screen
├── components/                   # 🧩 Reusable UI components
│   └── SplashScreenController.tsx
├── contexts/                     # 🌍 Global state management
│   ├── AuthContext.tsx          # Authentication state
│   └── ThemeContext.tsx         # Theme management
├── hooks/                        # 🎣 Custom React hooks
│   └── useStorageState.ts       # Secure storage abstraction
├── styles/                       # 🎨 Centralized styling
│   └── styles.ts                # Design system & components
└── assets/                       # 📷 Images and static files
    └── images/
```

### 🔧 Tech Stack

| Technology | Purpose | Why We Chose It |
|------------|---------|----------------|
| **React Native** | Cross-platform mobile framework | Write once, run everywhere 📱 |
| **Expo Router v6** | File-based navigation | Simple, powerful routing with TypeScript support |
| **TypeScript** | Type safety | Catch bugs before they ship 🐛 |
| **Expo Secure Store** | Credential storage | Bank-level security for user data 🔒 |
| **React Navigation** | Drawer navigation | Smooth, native-feeling navigation |
| **Bun** | Package manager & runtime | Blazingly fast development experience ⚡ |

### 🎭 State Management Philosophy

We use **React Context** for global state management because:
- ✅ **Simple**: No complex boilerplate or learning curve
- ✅ **Native**: Built into React, no additional dependencies  
- ✅ **Performant**: Optimized re-renders with proper context splitting
- ✅ **TypeScript**: First-class TypeScript support out of the box

## 🎨 Design System

### 🌈 Color Palette
```typescript
Colors: {
  primary: '#007AFF',      // iOS blue - trust and reliability
  danger: '#ff3b30',       // Critical actions
  success: '#34c759',      // Positive feedback  
  warning: '#ff9500',      // Caution states
  // + Comprehensive light/dark theme variants
}
```

### 📐 Spacing Scale
```typescript
Spacing: {
  xs: 2px,    sm: 4px,    md: 8px,
  lg: 12px,   xl: 16px,   xxl: 20px,   xxxl: 30px
}
```

### ✍️ Typography System
```typescript
Typography: {
  h1: { fontSize: 28, fontWeight: 'bold' },
  h2: { fontSize: 24, fontWeight: 'bold' },
  body: { fontSize: 16, fontWeight: '500' },
  caption: { fontSize: 12, fontWeight: 'normal' },
}
```

## 🔒 Security Features

- **🔐 Secure Credential Storage**: Production-grade encryption via Expo Secure Store
- **🛡️ Protected Routes**: Authentication-aware navigation with automatic redirects
- **🔄 Session Management**: Secure token handling with automatic refresh
- **📱 Biometric Support**: Ready for fingerprint/Face ID authentication (future enhancement)

## 🌙 Theme System

Our adaptive theming system provides:

- **🤖 System Detection**: Automatically follows iOS/Android system preferences
- **👤 User Override**: Manual theme selection with instant switching
- **💾 Persistence**: Theme preferences saved securely across app sessions
- **🎨 Design Tokens**: Centralized color management for consistent theming

## 📱 Platform Support

| Platform | Status | Notes |
|----------|--------|-------|
| **iOS** | ✅ Full Support | Native iOS navigation patterns |
| **Android** | ✅ Full Support | Material Design principles |
| **Web** | ✅ Full Support | Progressive Web App ready |

## 🚦 Development Workflow

### 🧪 Testing the App
```bash
# Start development server
bun run start

# Test authentication flow
1. Open app → Should show sign-in screen
2. Tap "Sign In" → Navigates to home screen  
3. Close and reopen app → Should load directly to home
4. Navigate to Settings → Toggle theme modes
5. Tap logout → Returns to sign-in screen
```

### 🛠️ Development Commands
```bash
bun run start          # Start development server
bun run android        # Launch Android emulator
bun run ios            # Launch iOS simulator  
bun run web            # Launch web version
bun run lint           # Run ESLint checks
```

## 🔮 Future Roadmap

- [ ] **🔔 Push Notifications**: Real-time engagement features
- [ ] **📊 Analytics Integration**: User behavior insights
- [ ] **🌐 Offline Support**: Work without internet connection
- [ ] **🎭 Animation Library**: Micro-interactions and delightful UX
- [ ] **📷 Camera Integration**: Photo capture and processing
- [ ] **🗺️ Maps Integration**: Location-based features

## 🤝 Contributing

We love contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)  
5. **Open** a Pull Request

### 📋 Contribution Guidelines
- Follow TypeScript best practices
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🎉 Acknowledgments

- **Expo Team** - For the amazing development platform
- **React Native Community** - For the vibrant ecosystem
- **GitHub Copilot** - For AI-powered development assistance

---

<div align="center">

**Made with ❤️ using React Native & Expo**

*If this project helped you, please consider giving it a ⭐!*

</div>

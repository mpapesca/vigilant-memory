# 🧠 Vigilant Memory

<div align="center">

![Vigilant Memory Logo](./assets/images/icon.png)

**A Progressive Card Matching Game Built with React Native & Expo** 🎮

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh/)

*Challenge your memory with infinite levels of emoji-matching fun!* ✨

</div>

---

## 🌟 What is Vigilant Memory?

**Vigilant Memory** is an engaging card matching game that tests and improves your memory skills through progressively challenging levels. Built with modern React Native and Expo Router v6, it features infinite level generation, beautiful emoji themes, and a polished user experience.

This isn't just another memory game – it's a **production-quality mobile app** that demonstrates professional development practices while providing hours of entertaining gameplay.

## 🎮 Game Features

### 🃏 **Infinite Level Progression**
- **Dynamic Level Generation**: Unlimited levels with algorithmic difficulty scaling
- **Progressive Complexity**: Grid sizes grow from 2x2 to 8x8 as you advance
- **Smart Difficulty Scaling**: 6 difficulty tiers from Easy to Legendary
- **Even Card Counts**: All levels guarantee proper pair matching

### 🎨 **Beautiful Emoji Themes**
- **8 Rotating Categories**: People, Food, Activity, Places, Nature, Objects, Symbols, Flags
- **Level-Based Progression**: Each level features different emoji themes
- **Consistent Rendering**: Uses emoji-mart for cross-platform compatibility
- **Visual Variety**: 1000+ emojis ensuring fresh gameplay experiences

### 📊 **Comprehensive Progress Tracking**
- **Level Completion History**: Track all completed levels with detailed stats
- **Performance Metrics**: Monitor moves, completion time, and personal bests
- **Interactive Progress View**: Browse and replay completed levels
- **Achievement System**: Visual progress indicators and milestone tracking

### ⚙️ **Customization Options**
- **Theme System**: System, Light, and Dark mode support
- **Progress Management**: Reset all progress with confirmation safeguards
- **Responsive Design**: Optimized for phones, tablets, and web browsers

## ✨ Core Features

### 🔐 **Smart Authentication**
- **Secure Storage**: Uses `expo-secure-store` for production-grade credential management
- **Session Persistence**: Stay logged in across app restarts
- **Protected Routes**: Expo Router's authentication patterns for seamless navigation
- **Smooth Transitions**: No flash navigation between authenticated states

### 🌙 **Adaptive Theming**
- **System Theme Detection**: Automatically follows your device's theme preference
- **Manual Override**: Choose from System, Light, or Dark modes
- **Persistent Preferences**: Your theme choice is remembered across sessions
- **Smooth Transitions**: Beautiful animations between theme changes

### 🧭 **Intuitive Navigation**
- **Drawer Navigation**: Slide-out menu with elegant animations
- **File-Based Routing**: Expo Router v6 with TypeScript support
- **Deep Linking**: Direct navigation to any screen via URLs
- **Professional UX**: Polished loading and transition experiences

### 🎨 **Design Excellence**
- **Centralized Design System**: Single source of truth for all design tokens
- **Consistent Styling**: Unified colors, typography, spacing, and shadows
- **Responsive Layouts**: Perfect experience on phones, tablets, and web
- **Modern UI**: Clean, minimal interface optimized for gameplay

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

## 🎯 How to Play

### 🎮 **Game Basics**
1. **Start**: Tap cards to reveal emoji symbols
2. **Match**: Find matching pairs by remembering card locations
3. **Win**: Clear the entire grid to complete the level
4. **Progress**: Advance to increasingly challenging levels

### 🏆 **Difficulty Progression**
- **Easy (Levels 1-3)**: Small 2x2 to 3x3 grids - perfect for warming up
- **Medium (Levels 4-6)**: 4x4 grids - building your memory skills  
- **Hard (Levels 7-10)**: 5x5 grids - serious memory challenges
- **Expert (Levels 11-15)**: 6x6 grids - for memory masters
- **Master (Levels 16-25)**: 7x7 grids - elite level gameplay
- **Legendary (Level 26+)**: 8x8 grids - ultimate memory test

### 📈 **Tracking Your Progress**
- **Performance Stats**: Track moves, completion time, and personal records
- **Level History**: View all completed levels with detailed statistics
- **Progress Screen**: Interactive gallery of your achievements
- **Reset Option**: Start fresh anytime with progress reset functionality

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
│           ├── game.tsx         # Main game screen
│           ├── progress.tsx     # Level progress viewer
│           └── settings.tsx     # App settings
├── components/                   # 🧩 Reusable UI components
│   ├── Emoji.tsx               # Consistent emoji rendering
│   └── SplashScreenController.tsx
├── contexts/                     # 🌍 Global state management
│   ├── AuthContext.tsx          # Authentication state
│   ├── GameContext.tsx          # Game state & progress
│   └── ThemeContext.tsx         # Theme management
├── hooks/                        # 🎣 Custom React hooks
│   └── useStorageState.ts       # Secure storage abstraction
├── utils/                        # 🔧 Game logic & utilities
│   ├── gameLogic.ts            # Level generation & game mechanics
│   ├── emojiUtils.ts           # Emoji-mart integration
│   └── testLevels.ts           # Level testing utilities
├── styles/                       # 🎨 Centralized styling
│   └── styles.ts               # Design system & components
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
| **emoji-mart** | Emoji rendering | Consistent emoji display across platforms 🎭 |
| **AsyncStorage** | Game progress | Persistent game state and level completion |
| **Bun** | Package manager & runtime | Blazingly fast development experience ⚡ |

### 🎮 Game Architecture

#### **Infinite Level System**
```typescript
// Dynamic level generation algorithm
generateLevelConfig(levelNumber: number) {
  // Progressive difficulty scaling
  // Grid size calculation: 2x2 → 8x8
  // Emoji category rotation: 8 themes
  // Even card count guarantee
}
```

#### **State Management**
- **GameContext**: Level progression, completion tracking, move counting
- **AuthContext**: User authentication and session management  
- **ThemeContext**: Visual theme preferences and system detection

#### **Emoji Integration**
```typescript
// Level-based emoji progression
getEmojiSetForLevel(level: number, pairs: number) {
  const category = getCategoryForLevel(level); // 8 categories cycling
  return selectEmojisFromCategory(category, pairs);
}
```

### 🎭 State Management Philosophy

We use **React Context** for global state management because:
- ✅ **Simple**: No complex boilerplate or learning curve
- ✅ **Native**: Built into React, no additional dependencies  
- ✅ **Performant**: Optimized re-renders with proper context splitting
- ✅ **TypeScript**: First-class TypeScript support out of the box
- ✅ **Game-Optimized**: Perfect for managing game state and progress tracking

## 🎨 Design System

### 🌈 Color Palette
```typescript
Colors: {
  primary: '#007AFF',      // iOS blue - trust and reliability
  danger: '#ff3b30',       // Critical actions (game over, reset)
  success: '#34c759',      // Positive feedback (level complete)
  warning: '#ff9500',      // Caution states (hints, warnings)
  // + Comprehensive light/dark theme variants for gameplay
}
```

### 🎯 Game UI Colors
```typescript
GameColors: {
  cardBack: '#f0f0f0',     // Hidden card background
  cardMatch: '#34c759',    // Matched card highlight
  cardReveal: '#007AFF',   // Temporarily revealed cards
  gridBackground: '#fafafa' // Game board background
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
  h1: { fontSize: 28, fontWeight: 'bold' },      // Screen titles
  h2: { fontSize: 24, fontWeight: 'bold' },      // Section headers
  body: { fontSize: 16, fontWeight: '500' },     // Main content
  gameStats: { fontSize: 14, fontWeight: '600' }, // Game statistics
  caption: { fontSize: 12, fontWeight: 'normal' }, // Helper text
}
```

## 🔒 Security & Data Features

- **🔐 Secure Credential Storage**: Production-grade encryption via Expo Secure Store
- **🛡️ Protected Routes**: Authentication-aware navigation with automatic redirects
- **🔄 Session Management**: Secure token handling with automatic refresh
- **� Progress Persistence**: Game data securely stored with AsyncStorage
- **🗑️ Data Management**: Safe progress reset with confirmation dialogs
- **📱 Cross-Platform Security**: Consistent security across iOS, Android, and Web

## 🎮 Game Logic Features

### 🧠 **Memory Game Mechanics**
- **Card Matching**: Classic memory game with emoji pairs
- **Progressive Difficulty**: Grids scale from 2x2 to 8x8 based on level
- **Move Tracking**: Count and optimize your performance  
- **Time Tracking**: Monitor completion times and set personal records
- **Level Validation**: Ensures all grids have even card counts for proper pairing

### 🎨 **Emoji System**
- **8 Themed Categories**: People, Food, Activity, Places, Nature, Objects, Symbols, Flags
- **Level-Based Rotation**: Each level features different emoji themes for variety
- **Cross-Platform Consistency**: emoji-mart ensures identical rendering everywhere
- **Fallback Systems**: Graceful degradation if emoji-mart fails to load

### 📊 **Progress System**  
- **Level Completion Tracking**: Permanent record of all completed levels
- **Performance Statistics**: Best moves, fastest completion times per level
- **Interactive Progress View**: Browse and replay completed levels with game grids
- **Achievement Visualization**: Clear progress indicators and milestone tracking

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

### 🧪 Testing the Game
```bash
# Start development server
bun run start

# Test complete game flow
1. Open app → Should show sign-in screen
2. Tap "Sign In" → Navigate to home screen
3. Start Level 1 → Play through card matching game
4. Complete level → Advance to next level with new emoji theme
5. Visit Progress → View completed levels with statistics
6. Check Settings → Toggle themes, reset progress
7. Logout and re-login → Progress should persist
```

### 🎮 Game Testing Scenarios
```bash
# Level Progression Testing
- Complete levels 1-5 → Verify difficulty increase
- Test emoji rotation → Different themes per level  
- Check grid scaling → 2x2 → 3x3 → 4x4 progression
- Validate even cards → All grids should have pair counts

# Progress System Testing  
- Complete multiple levels → Verify progress tracking
- View progress screen → Interactive level browser
- Test progress reset → Confirm data deletion with warnings
- Check persistence → Progress survives app restarts
```

### 🛠️ Development Commands
```bash
bun run start          # Start development server
bun run android        # Launch Android emulator
bun run ios            # Launch iOS simulator  
bun run web            # Launch web version
bun run lint           # Run ESLint checks
bun install emoji-mart # Add emoji dependencies
```

## 🔮 Future Roadmap

### 🎮 **Game Enhancements**
- [ ] **🏆 Achievement System**: Unlock badges and rewards for milestones
- [ ] **⏱️ Time Challenges**: Speed modes and time-based competitions  
- [ ] **🎯 Daily Challenges**: Special levels with unique objectives
- [ ] **🌟 Power-ups**: Hint cards, peek abilities, shuffle options
- [ ] **📈 Analytics Dashboard**: Detailed performance graphs and trends
- [ ] **🎵 Sound Effects**: Audio feedback for matches, completions, and interactions

### 🌐 **Social Features**
- [ ] **👥 Multiplayer Mode**: Real-time competitions with friends
- [ ] **🏅 Leaderboards**: Global and friend-based high score tracking
- [ ] **📤 Progress Sharing**: Share level completions on social media
- [ ] **👫 Friend Challenges**: Send custom levels to friends

### 🔧 **Technical Improvements** 
- [ ] **� Push Notifications**: Daily game reminders and achievement alerts
- [ ] **📊 Advanced Analytics**: User behavior insights and engagement metrics
- [ ] **🌐 Offline Support**: Full gameplay without internet connection
- [ ] **🎭 Animation Library**: Enhanced micro-interactions and visual feedback
- [ ] **📷 Screenshot Sharing**: Capture and share completed level grids
- [ ] **🌍 Localization**: Multi-language support for global audience

## 🚀 Deployment

### Building for Production

This project uses **Expo Application Services (EAS)** for building and deploying to app stores:

```bash
# Install EAS CLI globally (one-time setup)
bun add -g eas-cli

# Login to your Expo account
eas login

# Initialize EAS for the project
eas init

# Build for app stores
eas build --profile production --platform all
```

For comprehensive deployment guidance, refer to the official [EAS Build Documentation](https://docs.expo.dev/build/introduction/).

## 🤝 Contributing

We love contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)  
5. **Open** a Pull Request

### 📋 Contribution Guidelines
- Follow TypeScript best practices
- Test game mechanics thoroughly  
- Add tests for new features
- Update documentation as needed
- Follow the existing code style and design patterns
- Ensure emoji-mart integration works across platforms

### 🎮 Game Development Areas
- **Level Generation**: Improve the infinite level algorithm
- **Emoji Systems**: Add new categories or themed level packs
- **UI/UX**: Enhance animations, transitions, and visual feedback
- **Performance**: Optimize rendering for larger grids
- **Accessibility**: Improve support for assistive technologies

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🎉 Acknowledgments

- **Expo Team** - For the amazing cross-platform development framework
- **React Native Community** - For the vibrant ecosystem and best practices
- **emoji-mart** - For providing consistent emoji rendering across platforms  
- **GitHub Copilot** - For AI-powered development assistance and code optimization

---

<div align="center">

**Made with ❤️ and 🧠 using React Native & Expo**

*Challenge your memory and enjoy infinite levels of fun!*

*If this game entertained you, please consider giving it a ⭐!*

</div>

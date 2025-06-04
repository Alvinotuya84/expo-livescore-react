# Riffle Validation - Offline-First Demo 🚀

Hey there! 👋 This is a fun little experiment showing how to build an offline-first mobile app with some cool conflict resolution features. Think of it as a playground for testing out some interesting ideas about data sync and offline capabilities.

## What's This All About? 🤔

This project is split into two parts:

1. **Mobile App** ([expo-livescore-react](https://github.com/Alvinotuya84/expo-livescore-react)): A React Native app built with Expo that shows how to handle offline data and sync it back when you're back online.

2. **Backend** ([riffle-offline-first-validation](https://github.com/Alvinotuya84/riffle-offline-first-validation)): A NestJS server that helps manage all the data sync and conflict resolution magic.

## Cool Features ✨

- 📱 Works offline 
- 🔄 Smart sync when you're back online
- 🤝 Handles conflicts like a boss
- 🚀 Built with Expo for easy development
- 💾 Uses LiveStore for state management

## Quick Start 🏃‍♂️

### Mobile App

```bash
# Clone the mobile app
git clone https://github.com/Alvinotuya84/expo-livescore-react.git
cd expo-livescore-react

# Install dependencies
npm install

# Start the app
npx expo start
```

### Backend

```bash
# Clone the backend
git clone https://github.com/Alvinotuya84/riffle-offline-first-validation.git
cd riffle-offline-first-validation

# Install dependencies
npm install

# Start the server
npm run start:dev
```

## How It Works 🛠️

1. The app stores data locally when you're offline
2. When you're back online, it syncs with the server
3. If there are any conflicts (like someone else changed the same data), it helps you resolve them
4. Everything stays in sync, even when your internet connection is spotty

## Tech Stack 🛠️

- **Mobile**: React Native, Expo, LiveStore
- **Backend**: NestJS, PostgreSQL
- **Sync Engine**: Custom implementation for conflict resolution

## Why This Matters 🌟

It's a proof of concept showing how to build apps that work great even when your internet connection isn't perfect. Perfect for:
- Travel apps
- Field work applications
- Places with spotty internet
- Any app where offline support is crucial

## Contributing 🤝

Feel free to play around with this code! If you find any bugs or have cool ideas, just open an issue or submit a PR.

## License 📝

MIT License - feel free to use this however you want!

---

Made with ❤️ by [Alvin Otuya](https://github.com/Alvinotuya84)

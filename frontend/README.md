# ElderEase Frontend

This is the Expo/React Native frontend application for ElderEase.

## Prerequisites

- Node.js >= 16.x (recommend latest LTS)
- npm (comes with Node) or Yarn
- Expo CLI: `npm install -g expo-cli`

## Installation

```bash
# Clone the repository (from project root)
git clone <repository-url>
cd ElderEase/frontend

# Install dependencies
npm install
# or
yarn install
```

## Available Scripts

- `npm start` / `yarn start`: start Expo dev server (Metro bundler)  
- `npm run ios` / `yarn ios`: open in iOS Simulator  
- `npm run android` / `yarn android`: open in Android emulator/device  
- `npm run web` / `yarn web`: open in web browser (Expo for Web)

## Dependencies

Listed in `package.json` under `dependencies`:

- expo ^52.0.0
- react ^18.2.0
- react-native 0.73.8
- @expo/vector-icons ^14.1.0
- @react-native-async-storage/async-storage ^2.1.2
- @react-native-community/datetimepicker ^8.3.0
- @react-navigation/native ^7.1.6
- @react-navigation/native-stack ^7.3.10
- react-native-paper ^5.13.3
- react-native-safe-area-context ^5.4.0
- react-native-screens ^4.10.0

## Testing

1. Ensure emulator or physical device is connected (Expo Go mobile app recommended).
2. Run `npm start` and scan QR code or select platform.
3. Navigate through screens and verify functionality (Medications, Appointments, etc.).

## Contributing

1. Fork & branch off `main`.
2. Apply code changes & ensure lint/format pass.
3. Commit with descriptive message.
4. Push branch and open Pull Request against `main`.

---

Your teammates can now pull, install, and run this frontend for testing.

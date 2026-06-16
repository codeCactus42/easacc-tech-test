# Easacc React Developer Task

React Native app built with Expo for the Easacc React developer task.

## Task Scope

- Social login page with Google sign-in and a Facebook option.
- Settings page to save the website URL used by the WebView.
- Settings page device discovery for available WiFi and Bluetooth devices.
- WebView page that opens the URL saved from settings.

## Requirements

- Node.js
- npm
- Expo CLI / Expo development tools
- iOS Simulator or Android Emulator

## Setup

```bash
npm install
```

Create a `.env` file from `.env.example` and add the Firebase and social auth tokens.

To test Google authentication, add the platform Google services files to the project root:

- `GoogleService-Info.plist` for iOS
- `google-services.json` for Android

Also fill these Google auth values in `.env`:

```bash
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=
```

## Run

```bash
npm run ios
npm run android
```

You can also start the Expo server manually:

```bash
npm start
```

## Notes

Google login will stay disabled until the Google services files and required `.env` tokens are provided.

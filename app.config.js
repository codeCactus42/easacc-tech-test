const { existsSync } = require('fs');
const { join } = require('path');

/** @type {import('@expo/config').ExpoConfig} */
module.exports = {
  name: 'easacc-task',
  slug: 'easacc-task',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'easacc-task',
  userInterfaceStyle: 'automatic',
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.easacc.techtest',
    ...(existsSync(join(__dirname, 'GoogleService-Info.plist')) && {
      googleServicesFile: './GoogleService-Info.plist',
    }),
    entitlements: {
      'keychain-access-groups': ['$(AppIdentifierPrefix)com.easacc.techtest'],
    },
  },
  android: {
    ...(existsSync(join(__dirname, 'google-services.json')) && {
      googleServicesFile: './google-services.json',
    }),
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
    permissions: [
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.BLUETOOTH',
      'android.permission.BLUETOOTH_ADMIN',
      'android.permission.BLUETOOTH_CONNECT',
      'android.permission.ACCESS_COARSE_LOCATION',
    ],
    package: 'com.easacc.techtest',
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
      },
    ],
    'expo-font',
    'expo-image',
    '@react-native-google-signin/google-signin',
    'expo-web-browser',
    'expo-status-bar',
    'react-native-wifi-reborn',
    [
      'react-native-ble-plx',
      {
        bluetoothAlwaysPermission:
          'Allow $(PRODUCT_NAME) to connect to nearby Bluetooth devices.',
      },
    ],
    [
      'expo-location',
      {
        locationWhenInUsePermission:
          'Allow $(PRODUCT_NAME) to use your location to discover nearby WiFi networks and Bluetooth devices.',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

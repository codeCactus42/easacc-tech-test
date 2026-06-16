import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Constants from 'expo-constants';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

const googleServicesFile = Constants.expoConfig?.ios?.googleServicesFile;

function buildGoogleSigninConfig(
  googleWebClientId: string,
  googleIosClientId: string | undefined,
) {
  if (Platform.OS !== 'ios') {
    return { webClientId: googleWebClientId };
  }
  return googleIosClientId
    ? { webClientId: googleWebClientId, iosClientId: googleIosClientId }
    : { webClientId: googleWebClientId, googleServicePlistPath: 'GoogleService-Info' };
}

export function useGoogleLogin({
  onSuccess,
  onError,
}: {
  onSuccess: (idToken: string) => Promise<void> | void;
  onError: (error: unknown) => void;
}) {
  const [isGooglePending, setIsGooglePending] = useState(false);

  const googleWebClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || undefined;
  const googleIosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || undefined;
  const googleAndroidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || undefined;

  const platformGoogleClientId = Platform.select({
    android: googleAndroidClientId,
    ios: googleIosClientId,
    default: googleWebClientId,
  });

  const hasGoogleIosConfig = Boolean(googleIosClientId || googleServicesFile);
  const hasGoogleClientId =
    Platform.OS === 'ios' ? hasGoogleIosConfig : Boolean(platformGoogleClientId);

  useEffect(() => {
    if (Platform.OS === 'web' || !googleWebClientId) return;
    if (Platform.OS === 'ios' && !hasGoogleIosConfig) return;

    GoogleSignin.configure(buildGoogleSigninConfig(googleWebClientId, googleIosClientId));
  }, [googleIosClientId, googleWebClientId, hasGoogleIosConfig]);

  const handleGoogleLogin = useCallback(async () => {
    setIsGooglePending(true);

    try {
      if (Platform.OS === 'web') {
        throw new Error('Google sign in requires a native app build.');
      }
      if (!googleWebClientId || (Platform.OS === 'ios' && !hasGoogleIosConfig)) {
        throw new Error('Missing Google sign-in config. Set the client IDs in .env.');
      }
      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      }

      const result = await GoogleSignin.signIn();
      if (result.type === 'cancelled') {
        setIsGooglePending(false);
        return;
      }
      if (!result.data.idToken) {
        throw new Error('Google did not return an ID token. Check the web client ID in .env.');
      }

      await onSuccess(result.data.idToken);
    } catch (error) {
      onError(error);
    } finally {
      setIsGooglePending(false);
    }
  }, [googleWebClientId, hasGoogleIosConfig, onSuccess, onError]);

  return {
    handleGoogleLogin,
    isGooglePending,
    hasGoogleClientId,
  };
}

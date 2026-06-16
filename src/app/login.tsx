import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { Button, Separator } from 'heroui-native';
import { useCallback, useState } from 'react';
import { ImageBackground, Platform, StyleSheet, View } from 'react-native';
import { withUniwind } from 'uniwind';
import { AppText } from '../components/app-text';
import { ProviderButton, providerIconColor } from '../components/provider-button';
import { useAuth } from '../contexts/auth-context';
import { useGoogleLogin } from '../helpers/hooks/use-google-login';


const StyledFontAwesome = withUniwind(FontAwesome);

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Sign in failed. Please try again.';
}

export default function LoginScreen() {
  const router = useRouter();
  const { configurationMessage, continueAsGuest, isAuthConfigured, loginWithGoogle } =
    useAuth();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const finishLogin = useCallback(() => {
    router.replace('/(tabs)/settings');
  }, [router]);

  const handleProviderError = useCallback((error: unknown) => {
    setErrorMessage(getErrorMessage(error));
  }, []);

  const handleGoogleSuccess = useCallback(
    async (idToken: string) => {
      setErrorMessage(null);
      await loginWithGoogle({ idToken });
      finishLogin();
    },
    [loginWithGoogle, finishLogin]
  );

  const { handleGoogleLogin, isGooglePending, hasGoogleClientId } = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleProviderError,
  });

  const handleGuestLogin = () => {
    setErrorMessage(null);
    continueAsGuest();
    router.replace('/(tabs)/settings');
  };

  // ── Derived state ────────────────────────────────────────────────────────
  const setupMessage =
    configurationMessage ?? (!hasGoogleClientId ? `Missing ${Platform.OS} Google client ID config.` : null);
  const shouldDisableGoogle = !isAuthConfigured || !hasGoogleClientId || isGooglePending;
  const isGoogleMuted = shouldDisableGoogle && !isGooglePending;

  return (
    <ImageBackground
      source={require('../../assets/images/light-login-bg.png')}
      resizeMode="cover"
      className="flex-1"
    >
      <View className="flex-1 items-center justify-end px-6 py-18">
        <View className="w-full gap-3">
          <View className="mb-1 flex-row items-center gap-3 px-2">
            <Separator className="flex-1 bg-gray-400/50" />
            <AppText className="text-sm font-medium text-gray-500">continue with</AppText>
            <Separator className="flex-1 bg-gray-400/50" />
          </View>

          <ProviderButton
            onPress={handleGoogleLogin}
            isDisabled={shouldDisableGoogle}
            isMuted={isGoogleMuted}
          >
            <StyledFontAwesome name="google" size={18} color={providerIconColor(isGoogleMuted)} />
            <Button.Label style={isGoogleMuted ? styles.labelMuted : styles.label}>
              {isGooglePending ? 'Opening Google...' : 'Continue with Google'}
            </Button.Label>
          </ProviderButton>

          {/* Facebook (coming soon) */}
          <ProviderButton isDisabled isMuted>
            <StyledFontAwesome name="facebook" size={18} color={providerIconColor(true)} />
            <Button.Label style={styles.labelMuted}>Continue with Facebook</Button.Label>
          </ProviderButton>

          {/* Guest */}
          <Button
            variant="primary"
            onPress={handleGuestLogin}
            isDisabled={isGooglePending}
            className="disabled:opacity-100"
            style={[styles.guestButton, isGooglePending && styles.guestButtonMuted]}
          >
            <Button.Label style={isGooglePending ? styles.guestLabelMuted : styles.guestLabel}>
              Continue as a guest
            </Button.Label>
          </Button>

          {(errorMessage || setupMessage) && (
            <AppText className="mt-2 text-center text-sm text-muted">
              {errorMessage ?? setupMessage}
            </AppText>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  label: {
    color: '#F1FBFF',
  },
  labelMuted: {
    color: 'rgba(241, 251, 255, 0.62)',
  },
  guestButton: {
    backgroundColor: 'rgba(232, 249, 255, 0.98)',
    borderColor: 'rgba(184, 240, 255, 0.72)',
    borderWidth: StyleSheet.hairlineWidth,
    opacity: 1,
  },
  guestButtonMuted: {
    backgroundColor: 'rgba(214, 240, 248, 0.78)',
    borderColor: 'rgba(184, 240, 255, 0.42)',
  },
  guestLabel: {
    color: '#04374A',
  },
  guestLabelMuted: {
    color: 'rgba(4, 55, 74, 0.58)',
  },
});

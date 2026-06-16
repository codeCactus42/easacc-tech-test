import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { Button, useThemeColor } from 'heroui-native';
import { useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView, { type WebViewNavigation } from 'react-native-webview';
import type {
  WebViewErrorEvent,
  WebViewProgressEvent,
} from 'react-native-webview/lib/WebViewTypes';
import { AppText } from '../../components/app-text';
import { useSettings } from '../../contexts/settings-context';

type BrowserState = {
  canGoBack: boolean;
  canGoForward: boolean;
  source: string;
  title: string;
  url: string;
};

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function getUrlHost(value: string) {
  if (!value) return 'Not set';
  const normalized = normalizeUrl(value);
  const withoutProtocol = normalized.replace(/^[a-z][a-z0-9+.-]*:\/\//i, '');
  return withoutProtocol.split('/')[0]?.replace(/^www\./i, '') || normalized;
}

function getUrlDetail(value: string) {
  const normalized = normalizeUrl(value);
  const withoutProtocol = normalized.replace(/^[a-z][a-z0-9+.-]*:\/\//i, '');
  const path = withoutProtocol.split('/').slice(1).join('/');
  return path ? `/${path}` : normalized;
}

function BrowserIconButton({
  color,
  icon,
  isDisabled,
  label,
  onPress,
}: {
  color: string;
  icon: keyof typeof Feather.glyphMap;
  isDisabled?: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Button
      accessibilityLabel={label}
      variant="secondary"
      size="sm"
      isIconOnly
      isDisabled={isDisabled}
      onPress={onPress}
      className="disabled:opacity-100"
    >
      <Feather name={icon} size={17} color={color} />
    </Button>
  );
}

export default function WebViewScreen() {
  const { webUrl } = useSettings();
  const router = useRouter();
  const webViewRef = useRef<WebView>(null);
  const [foreground, muted, accent, border] = useThemeColor([
    'foreground',
    'muted',
    'accent',
    'border',
  ]);
  const loadUrl = normalizeUrl(webUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<{
    message: string;
    source: string;
  } | null>(null);
  const [browserState, setBrowserState] = useState<BrowserState>({
    canGoBack: false,
    canGoForward: false,
    source: webUrl,
    title: '',
    url: loadUrl,
  });

  const activeBrowserState =
    browserState.source === webUrl
      ? browserState
      : { canGoBack: false, canGoForward: false, source: webUrl, title: '', url: loadUrl };
  const activeError = loadError?.source === webUrl ? loadError.message : undefined;
  const pageHost = getUrlHost(activeBrowserState.url || loadUrl);
  const pageDetail = getUrlDetail(activeBrowserState.url || loadUrl);
  const pageTitle = (() => {
    const title = activeBrowserState.title.trim();
    return !title || title === activeBrowserState.url ? pageHost : title;
  })();

  const goToSettings = () => router.push('/(tabs)/settings');

  const handleNavigationChange = (state: WebViewNavigation) => {
    setBrowserState({
      canGoBack: state.canGoBack,
      canGoForward: state.canGoForward,
      source: webUrl,
      title: state.title,
      url: state.url,
    });
  };

  const handleLoadStart = () => {
    setIsLoading(true);
    setLoadError(null);
  };

  const handleLoadEnd = () => setIsLoading(false);

  const handleLoadProgress = (event: WebViewProgressEvent) => {
    if (event.nativeEvent.progress >= 1) setIsLoading(false);
  };

  const handleError = (event: WebViewErrorEvent) => {
    setIsLoading(false);
    setLoadError({
      message: event.nativeEvent.description || 'Unable to load this website.',
      source: webUrl,
    });
  };

  const handleReload = () => webViewRef.current?.reload();

  const handleStopLoading = () => {
    setIsLoading(false);
    webViewRef.current?.stopLoading();
  };

  if (!loadUrl) {
    return (
      <View className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center gap-4 px-6">
          <Feather name="globe" size={32} color={muted} />
          <AppText className="text-center text-xl font-bold text-foreground">
            No website yet
          </AppText>
          <AppText className="text-center text-sm leading-5 text-muted">
            Add a site in Settings to open it here with your connected device context.
          </AppText>
          <Button onPress={goToSettings} className="mt-2">
            <Feather name="settings" size={17} color="#FFFFFF" />
            <Button.Label>Configure website</Button.Label>
          </Button>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']} style={{ flex: 1 }}>
      <View className="border-b border-border bg-background px-4 py-2">
        <View className="flex-row items-center gap-3">
          <View className="h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
            <Feather name="globe" size={19} color={accent} />
          </View>
          <View className="min-w-0 flex-1 gap-0.5">
            <View className="flex-row items-center gap-2">
              <AppText
                className="min-w-0 flex-1 text-base font-semibold text-foreground"
                numberOfLines={1}
              >
                {pageTitle}
              </AppText>
              {isLoading && <ActivityIndicator size="small" color={accent} />}
            </View>
            <AppText className="text-xs text-muted" numberOfLines={1}>
              {pageDetail}
            </AppText>
          </View>
          <View className="shrink-0 flex-row items-center gap-2">
            <BrowserIconButton
              label="Go back"
              icon="chevron-left"
              color={activeBrowserState.canGoBack ? foreground : muted}
              isDisabled={!activeBrowserState.canGoBack}
              onPress={() => webViewRef.current?.goBack()}
            />
            <BrowserIconButton
              label="Go forward"
              icon="chevron-right"
              color={activeBrowserState.canGoForward ? foreground : muted}
              isDisabled={!activeBrowserState.canGoForward}
              onPress={() => webViewRef.current?.goForward()}
            />
            <BrowserIconButton
              label={isLoading ? 'Stop loading' : 'Reload'}
              icon={isLoading ? 'x' : 'refresh-cw'}
              color={foreground}
              onPress={isLoading ? handleStopLoading : handleReload}
            />
          </View>
        </View>
      </View>

      {activeError && (
        <View
          className="flex-row items-start gap-3 border-b px-4 py-3"
          style={{ backgroundColor: 'rgba(255, 196, 87, 0.12)', borderColor: border }}
        >
          <Feather name="alert-triangle" size={18} color="#B7791F" />
          <View className="min-w-0 flex-1 gap-1">
            <AppText className="text-sm font-semibold text-foreground">
              Could not load page
            </AppText>
            <AppText className="text-xs text-muted">{activeError}</AppText>
          </View>
        </View>
      )}

      <WebView
        key={loadUrl}
        ref={webViewRef}
        source={{ uri: loadUrl }}
        style={styles.webView}
        originWhitelist={['*']}
        allowsBackForwardNavigationGestures
        mixedContentMode="always"
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onLoadProgress={handleLoadProgress}
        onError={handleError}
        onNavigationStateChange={handleNavigationChange}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  webView: {
    backgroundColor: 'transparent',
    flex: 1,
  },
});

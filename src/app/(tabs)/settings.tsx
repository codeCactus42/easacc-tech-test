import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NetworkDeviceSection } from '../../components/network-device-section';
import { SettingsHeroCard } from '../../components/settings-hero-card';
import { WebsiteSection } from '../../components/website-section';
import { useAuth } from '../../contexts/auth-context';
import { useSettings } from '../../contexts/settings-context';
import { useNetworkDevices } from '../../helpers/hooks/use-network-devices';

function getUrlHost(value: string) {
  if (!value) {
    return 'Not set';
  }

  const withoutProtocol = value.replace(/^[a-z][a-z0-9+.-]*:\/\//i, '');
  return withoutProtocol.split('/')[0]?.replace(/^www\./i, '') || value;
}

export default function SettingsScreen() {
  const { logout, userName } = useAuth();
  const { webUrl, setWebUrl, selectedDevice, setSelectedDevice } = useSettings();
  const { devices, isAvailable, isScanning, permissionStatus, scan, unavailableReason } =
    useNetworkDevices();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView contentContainerClassName="px-5 pt-2">
        <View className="gap-5">
          <SettingsHeroCard
            userName={userName}
            activeHost={getUrlHost(webUrl)}
            selectedDeviceName={selectedDevice?.label ?? 'No device'}
            onLogout={logout}
          />

          <WebsiteSection webUrl={webUrl} onSave={setWebUrl} />

          <NetworkDeviceSection
            devices={devices}
            isAvailable={isAvailable}
            isScanning={isScanning}
            permissionStatus={permissionStatus}
            selectedDevice={selectedDevice}
            unavailableReason={unavailableReason}
            onDeviceChange={setSelectedDevice}
            onScan={scan}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

import Feather from '@expo/vector-icons/Feather';
import { Button, Description, Label, Select, useThemeColor } from 'heroui-native';
import { useState } from 'react';
import { View } from 'react-native';
import type { SelectedDevice } from '../contexts/settings-context';
import type { NetworkDevice, NetworkPermissionStatus, NetworkUnavailableReason } from '../helpers/hooks/use-network-devices';
import { AppText } from './app-text';
import { SectionHeader } from './section-header';

export function NetworkDeviceSection({
  devices,
  isAvailable,
  isScanning,
  permissionStatus,
  selectedDevice,
  unavailableReason,
  onDeviceChange,
  onScan,
}: {
  devices: NetworkDevice[];
  isAvailable: boolean;
  isScanning: boolean;
  permissionStatus: NetworkPermissionStatus;
  selectedDevice: SelectedDevice | undefined;
  unavailableReason: NetworkUnavailableReason | undefined;
  onDeviceChange: (device: SelectedDevice | undefined) => void;
  onScan: () => void;
}) {
  const [foreground, muted, accent] = useThemeColor([
    'foreground',
    'muted',
    'accent',
  ]);
  const [hasScanned, setHasScanned] = useState(false);

  const deviceCountLabel = `${devices.length} ${devices.length === 1 ? 'device' : 'devices'}`;

  const unavailableMessage =
    unavailableReason === 'expo-go'
      ? 'Device scanning requires a development build because Expo Go cannot load the BLE/Wi-Fi native modules.'
      : unavailableReason === 'web'
        ? 'Device scanning is not available on web.'
        : undefined;

  const permissionMessage =
    permissionStatus === 'unavailable'
      ? unavailableMessage
      : permissionStatus === 'denied'
        ? 'Bluetooth and location permissions are required to scan for devices.'
        : hasScanned && permissionStatus === 'granted' && devices.length === 0
          ? 'No devices found. Move closer to the device and scan again.'
          : undefined;

  const handleScan = async () => {
    setHasScanned(true);
    await onScan();
  };

  return (
    <View className="-mx-1 gap-4 rounded-[14px] border border-border bg-background p-4 mb-4">
      <SectionHeader
        icon="radio"
        title="Network device"
        description="Nearby Bluetooth and Wi-Fi devices."
      />

      <View className="flex-row items-center justify-between gap-4 rounded-lg border border-border px-3 py-2.5">
        <View className="min-w-0 flex-1 gap-1">
          <AppText className="text-sm font-medium text-foreground">
            {isScanning ? 'Scanning nearby' : deviceCountLabel}
          </AppText>
          <AppText className="text-xs text-muted" numberOfLines={1}>
            {selectedDevice?.label ?? 'No device selected'}
          </AppText>
        </View>
        <Feather
          name={isAvailable ? 'activity' : 'slash'}
          size={18}
          color={isAvailable ? accent : muted}
        />
      </View>

      <View className="gap-2">
        <Label>
          <Label.Text>Network Device</Label.Text>
        </Label>
        <Select
          value={selectedDevice}
          onValueChange={onDeviceChange}
          isDisabled={devices.length === 0 || !isAvailable}
        >
          <Select.Trigger>
            <Select.Value placeholder="Select a device" />
            <Select.TriggerIndicator />
          </Select.Trigger>
          <Select.Portal>
            <Select.Overlay />
            <Select.Content presentation="popover" width="trigger">
              {devices.map((device) => (
                <Select.Item
                  key={device.id}
                  value={device.id}
                  label={device.name}
                >
                  <Select.ItemLabel />
                  <Select.ItemDescription>
                    {device.kind === 'bluetooth' ? 'Bluetooth' : 'Wi-Fi'}
                  </Select.ItemDescription>
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Portal>
        </Select>
      </View>

      <Button
        variant="secondary"
        onPress={handleScan}
        isDisabled={isScanning || !isAvailable}
        className="disabled:opacity-100"
      >
        <Feather
          name={isScanning ? 'loader' : 'search'}
          size={17}
          color={foreground}
        />
        <Button.Label>
          {isScanning ? 'Scanning...' : 'Scan for devices'}
        </Button.Label>
      </Button>

      {permissionMessage && <Description>{permissionMessage}</Description>}
    </View>
  );
}

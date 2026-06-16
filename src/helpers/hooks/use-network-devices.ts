import { isRunningInExpoGo } from 'expo';
import * as Location from 'expo-location';
import { useCallback, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

export interface NetworkDevice {
  id: string;
  name: string;
  kind: 'bluetooth' | 'wifi';
}

export type NetworkPermissionStatus =
  | 'unknown'
  | 'granted'
  | 'denied'
  | 'unavailable';

export type NetworkUnavailableReason = 'expo-go' | 'web';

export interface UseNetworkDevicesResult {
  devices: NetworkDevice[];
  isScanning: boolean;
  isAvailable: boolean;
  permissionStatus: NetworkPermissionStatus;
  unavailableReason: NetworkUnavailableReason | undefined;
  scan: () => Promise<void>;
}

const BLE_SCAN_DURATION_MS = 8000;
const unavailableReason: NetworkUnavailableReason | undefined =
  isRunningInExpoGo() ? 'expo-go' : Platform.OS === 'web' ? 'web' : undefined;
const isNativeScanningAvailable = !unavailableReason;

let bleManager: import('react-native-ble-plx').BleManager | undefined;

async function getBleManager(): Promise<
  import('react-native-ble-plx').BleManager
> {
  if (!bleManager) {
    const { BleManager } = await import('react-native-ble-plx');
    bleManager = new BleManager();
  }
  return bleManager;
}

async function requestPermissions(): Promise<boolean> {
  if (Platform.OS === 'android') {
    const results = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    ]);

    return Object.values(results).every(
      (result) => result === PermissionsAndroid.RESULTS.GRANTED
    );
  }

  const { granted } = await Location.requestForegroundPermissionsAsync();
  return granted;
}

async function scanBluetoothDevices(): Promise<NetworkDevice[]> {
  const manager = await getBleManager();

  return new Promise((resolve) => {
    const found = new Map<string, NetworkDevice>();

    manager.startDeviceScan(null, null, (error, device) => {
      if (error || !device) {
        return;
      }
      const name = device.name ?? device.localName;
      if (name) {
        found.set(device.id, {
          id: `ble-${device.id}`,
          name,
          kind: 'bluetooth',
        });
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      resolve(Array.from(found.values()));
    }, BLE_SCAN_DURATION_MS);
  });
}

async function scanWifiNetworks(): Promise<NetworkDevice[]> {
  const { default: WifiManager } = await import('react-native-wifi-reborn');

  if (Platform.OS === 'android') {
    try {
      const networks = await WifiManager.reScanAndLoadWifiList();
      const seen = new Set<string>();
      const devices: NetworkDevice[] = [];

      for (const network of networks) {
        if (!network.SSID || seen.has(network.SSID)) {
          continue;
        }
        seen.add(network.SSID);
        devices.push({
          id: `wifi-${network.BSSID}`,
          name: network.SSID,
          kind: 'wifi',
        });
      }

      return devices;
    } catch {
      return [];
    }
  }

  if (Platform.OS === 'ios') {
    try {
      const ssid = await WifiManager.getCurrentWifiSSID();
      return ssid ? [{ id: `wifi-${ssid}`, name: ssid, kind: 'wifi' }] : [];
    } catch {
      return [];
    }
  }

  return [];
}

export function useNetworkDevices(): UseNetworkDevicesResult {
  const [devices, setDevices] = useState<NetworkDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [permissionStatus, setPermissionStatus] =
    useState<NetworkPermissionStatus>(
      isNativeScanningAvailable ? 'unknown' : 'unavailable'
    );

  const scan = useCallback(async () => {
    if (!isNativeScanningAvailable) {
      setDevices([]);
      setPermissionStatus('unavailable');
      return;
    }

    setIsScanning(true);

    try {
      const granted = await requestPermissions();
      setPermissionStatus(granted ? 'granted' : 'denied');

      if (!granted) {
        setDevices([]);
        return;
      }

      const [bluetoothDevices, wifiDevices] = await Promise.all([
        scanBluetoothDevices(),
        scanWifiNetworks(),
      ]);

      setDevices([...bluetoothDevices, ...wifiDevices]);
    } catch (error) {
      console.warn('Network device scan failed.', error);
      setDevices([]);
      setPermissionStatus('unavailable');
    } finally {
      setIsScanning(false);
    }
  }, []);

  return {
    devices,
    isScanning,
    isAvailable: isNativeScanningAvailable,
    permissionStatus,
    unavailableReason,
    scan,
  };
}

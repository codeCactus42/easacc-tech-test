import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  safeGetItem,
  safeRemoveItem,
  safeSetItem,
} from '../helpers/storage';

const WEB_URL_STORAGE_KEY = 'settings.webUrl';
const SELECTED_DEVICE_STORAGE_KEY = 'settings.selectedDevice';

export interface SelectedDevice {
  value: string;
  label: string;
}

interface SettingsContextValue {
  webUrl: string;
  setWebUrl: (url: string) => void;
  selectedDevice: SelectedDevice | undefined;
  setSelectedDevice: (device: SelectedDevice | undefined) => void;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [webUrl, setWebUrlState] = useState('');
  const [selectedDevice, setSelectedDeviceState] = useState<
    SelectedDevice | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const [storedUrl, storedDevice] = await Promise.all([
        safeGetItem(WEB_URL_STORAGE_KEY),
        safeGetItem(SELECTED_DEVICE_STORAGE_KEY),
      ]);

      if (!isMounted) {
        return;
      }

      if (storedUrl) {
        setWebUrlState(storedUrl);
      }

      if (storedDevice) {
        try {
          setSelectedDeviceState(JSON.parse(storedDevice));
        } catch {
          setSelectedDeviceState(undefined);
        }
      }

      setIsLoading(false);
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const setWebUrl = (url: string) => {
    setWebUrlState(url);
    void safeSetItem(WEB_URL_STORAGE_KEY, url);
  };

  const setSelectedDevice = (device: SelectedDevice | undefined) => {
    setSelectedDeviceState(device);
    if (device) {
      void safeSetItem(SELECTED_DEVICE_STORAGE_KEY, JSON.stringify(device));
    } else {
      void safeRemoveItem(SELECTED_DEVICE_STORAGE_KEY);
    }
  };

  return (
    <SettingsContext.Provider
      value={{ webUrl, setWebUrl, selectedDevice, setSelectedDevice, isLoading }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

import AsyncStorage from '@react-native-async-storage/async-storage';

function warnStorageError(operation: string, key: string, error: unknown) {
  console.warn(`Storage ${operation} failed for "${key}".`, error);
}

export async function safeGetItem(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    warnStorageError('read', key, error);
    return null;
  }
}

export async function safeSetItem(key: string, value: string): Promise<void> {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    warnStorageError('write', key, error);
  }
}

export async function safeRemoveItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    warnStorageError('remove', key, error);
  }
}

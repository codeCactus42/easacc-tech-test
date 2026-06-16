import { useHeaderHeight as useHeaderHeightElements } from 'expo-router/react-navigation';
import { useState } from 'react';
import { Platform } from 'react-native';

function useHeaderHeight(): number {
  const headerHeight = useHeaderHeightElements();
  const [fixedHeight] = useState(headerHeight);

  return Platform.OS === 'android' ? fixedHeight : headerHeight;
}
export default useHeaderHeight;

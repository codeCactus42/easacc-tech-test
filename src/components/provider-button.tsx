import { Button, cn } from 'heroui-native';
import type { ComponentProps } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native';

const PROVIDER_ICON_COLOR = '#B8F0FF';
const PROVIDER_ICON_MUTED_COLOR = 'rgba(184, 240, 255, 0.58)';

export const PROVIDER_COLORS = {
  active: PROVIDER_ICON_COLOR,
  muted: PROVIDER_ICON_MUTED_COLOR,
} as const;

type ProviderButtonProps = ComponentProps<typeof Button> & {
  isMuted?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function ProviderButton({
  isMuted,
  style,
  children,
  className,
  ...rest
}: ProviderButtonProps) {
  return (
    <Button
      variant="secondary"
      className={cn('disabled:opacity-100', className)}
      style={[
        styles.base,
        isMuted && styles.muted,
        style,
      ]}
      {...rest}
    >
      {children}
    </Button>
  );
}


export function providerIconColor(isMuted: boolean) {
  return isMuted ? PROVIDER_ICON_MUTED_COLOR : PROVIDER_ICON_COLOR;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: 'rgba(3, 42, 54, 0.9)',
    borderColor: 'rgba(184, 240, 255, 0.34)',
    borderWidth: StyleSheet.hairlineWidth,
    opacity: 1,
  },
  muted: {
    backgroundColor: 'rgba(16, 52, 63, 0.64)',
    borderColor: 'rgba(184, 240, 255, 0.22)',
  },
});

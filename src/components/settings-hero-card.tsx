import Feather from '@expo/vector-icons/Feather';
import { Button } from 'heroui-native';
import { ImageBackground, View } from 'react-native';
import { AppText } from './app-text';

type FeatherIconName = keyof typeof Feather.glyphMap;

function StatusItem({
  icon,
  label,
  value,
}: {
  icon: FeatherIconName;
  label: string;
  value: string;
}) {
  return (
    <View className="min-w-0 flex-1 gap-1">
      <View className="flex-row items-center gap-2">
        <Feather name={icon} size={13} color="rgba(241, 251, 255, 0.72)" />
        <AppText className="text-xs font-medium text-white/65">{label}</AppText>
      </View>
      <AppText className="text-sm font-semibold text-white" numberOfLines={1}>
        {value}
      </AppText>
    </View>
  );
}

export function SettingsHeroCard({
  userName,
  activeHost,
  selectedDeviceName,
  onLogout,
}: {
  userName: string;
  activeHost: string;
  selectedDeviceName: string;
  onLogout: () => void;
}) {
  return (
    <ImageBackground
      source={require('../../assets/images/card-bg.png')}
      resizeMode="cover"
      className="-mx-1 overflow-hidden rounded-[14px] p-4"
      imageStyle={heroImageStyle}
    >
      <View
        pointerEvents="none"
        className="absolute inset-0 bg-[rgba(8,29,38,0.08)]"
      />
      <View className="flex-row items-start gap-3">
        <View className="min-w-0 flex-1 gap-1.5">
          <AppText className="text-sm font-medium text-white/70">
            Settings
          </AppText>
          <AppText className="text-2xl font-bold text-white">
            Hi, {userName}
          </AppText>
          <AppText className="text-sm leading-5 text-white/74">
            Keep the WebView and nearby device connection ready for this
            session.
          </AppText>
        </View>
        <Button
          variant="secondary"
          size="sm"
          isIconOnly
          onPress={onLogout}
          className="border border-white/24 bg-white/14"
        >
          <Feather name="log-out" size={17} color="#F1FBFF" />
        </Button>
      </View>

      <View className="mt-4 border-t border-white/16 pt-3">
        <View className="flex-row gap-4">
          <StatusItem icon="globe" label="Website" value={activeHost} />
          <StatusItem icon="wifi" label="Device" value={selectedDeviceName} />
        </View>
      </View>
    </ImageBackground>
  );
}

const heroImageStyle = { borderRadius: 14 };

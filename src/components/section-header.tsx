import Feather from '@expo/vector-icons/Feather';
import { useThemeColor } from 'heroui-native';
import { View } from 'react-native';
import { AppText } from './app-text';

type FeatherIconName = keyof typeof Feather.glyphMap;

export function SectionHeader({
  description,
  icon,
  title,
}: {
  description: string;
  icon: FeatherIconName;
  title: string;
}) {
  const [accent] = useThemeColor(['accent']);

  return (
    <View className="flex-row items-start gap-3">
      <View className="h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
        <Feather name={icon} size={17} color={accent} />
      </View>
      <View className="min-w-0 flex-1 gap-1 justify-center self-center">
        <AppText className="text-base font-bold text-foreground">
          {title}
        </AppText>
      </View>
    </View>
  );
}

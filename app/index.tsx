import color from '@constants/color';
import { FONTS } from '@constants/fonts';
import { useAppStartup } from '@hooks/useAppStartup';
import { useRedirect } from '@hooks/useRedirect';
import { ActivityIndicator, Text, View } from 'react-native';

export default function Index() {
  const { ready, userHydrated } = useAppStartup(); // ✅ Get both flags
  useRedirect(ready, userHydrated); // ✅ Pass both to redirect logic

  // Show loading until app is ready
  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{ fontSize: 24, fontFamily: FONTS.bold, color: color.dark_green}}>
          ĐANG TẢI...
        </Text>
        <ActivityIndicator size="large" color={color.dark_green} />
      </View>
    );
  }

  // Keep showing loading during redirect
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{ fontSize: 24, fontFamily: FONTS.bold, color: color.dark_green}}>
        ĐANG TẢI...
      </Text>
      <ActivityIndicator size="large" color={color.dark_green} />
    </View>
  );
}
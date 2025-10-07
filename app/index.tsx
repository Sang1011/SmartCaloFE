import { View, Text, ActivityIndicator } from 'react-native';
import color from '@constants/color';
import { useRedirect } from '@hooks/useRedirect';
import { FONTS } from '@constants/fonts';

export default function Index() {
  useRedirect();

  return (
     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{ fontSize: 24 , fontFamily: FONTS.bold, color: color.dark_green}}>LOADING...</Text>
      <ActivityIndicator size="large" color={color.dark_green} />
    </View>
  );
}
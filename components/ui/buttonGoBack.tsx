import color from "@constants/color";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useNavigation } from "expo-router";
import SCButton from "./SCButton";
interface Props {
  bgColor?: string;
  link?: string;
  borderRadius?: number;
  width?: number | string;
  height?: number;
  logoSize?: number;
  handleLogic?: () => void;
}
export default function ButtonGoBack({
  bgColor = color.white_50,
  link,
  handleLogic,
  borderRadius = 10,
  width = 50,
  height = 50,
  logoSize = 24,
}: Props) {
  const navigation = useNavigation();
  const onPress = () => {
    if (handleLogic) {
      handleLogic();
    } else {
      if (!link && navigation.canGoBack()) {
        navigation.goBack();
      } else if (link) {
        router.push(link as any);
      } else {
        router.push("/tabs");
      }
    }
  }
  return (
    <SCButton
      bgColor={bgColor}
      width={width}
      height={height}
      borderRadius={borderRadius}
      onPress={() => handleLogic ? handleLogic() : onPress()}
      icon={
        <Ionicons name="arrow-back-outline" size={logoSize} color={color.white} />
      }
    />
  );
}

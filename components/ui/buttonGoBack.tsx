import color from "@constants/color";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useNavigation } from "expo-router";
import SCButton from "./SCButton";
interface Props {
  bgColor?: string;
  link?: string;
}
export default function ButtonGoBack({
  bgColor = color.white_50,
  link,
}: Props) {
  const navigation = useNavigation();
  return (
    <SCButton
      bgColor={bgColor}
      width={50}
      height={50}
      borderRadius={10}
      onPress={() => {
        if (!link && navigation.canGoBack()) {
          navigation.goBack();
        } else if (link) {
          router.push(link as any);
        } else {
          router.push("/tabs");
        }
      }}
      icon={
        <Ionicons name="arrow-back-outline" size={24} color={color.white} />
      }
    />
  );
}

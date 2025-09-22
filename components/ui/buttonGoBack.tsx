import { useNavigation } from "expo-router";
import SCButton from "./SCButton";
import color from "@constants/color";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ButtonGoBack(){
    const navigation = useNavigation();
    return (
        <SCButton
          bgColor={color.white_50}
          width={50}
          height={50}
          borderRadius={10}
          onPress={() => navigation.goBack()}
          icon={
            <Ionicons name="arrow-back-outline" size={24} color={color.white} />
          }
        />
    )
}
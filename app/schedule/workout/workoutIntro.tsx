import SCButton from "@components/ui/SCButton";
import color from "@constants/color";
import { navigateCustom } from "@utils/navigation";
import { Text, View } from "react-native";

export default function WorkoutIntro({ onStart }: { onStart: () => void }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.dark_green,
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
      }}
    >
      <Text style={{ color: color.white, fontSize: 20, fontWeight: "bold" }}>
        Sẵn sàng tập luyện chứ?
      </Text>
      <SCButton
        title="Bắt đầu"
        bgColor={color.white_40}
        color={color.white}
        width={300}
        height={50}
        onPress={() => onStart()}
      />
      <SCButton
        title="Quay lại"
        variant="outline"
        color={color.white}
        borderColor={color.white}
        width={300}
        height={50}
        onPress={() => navigateCustom("/schedule/workout/workoutTest")}
      />
    </View>
  );
}

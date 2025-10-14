import ButtonGoBack from "@components/ui/buttonGoBack";
import ExerciseCard from "@components/ui/excerciseCard";
import SCButton from "@components/ui/SCButton";
import ScheduleBody from "@components/ui/scheduleBody";
import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { navigateCustom } from "@utils/navigation";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ScheduleDetailScreen() {
  const fakeSlotItems = [
    { name: "Đứng xoay tay chạm mũi chân", duration: "20 giây" },
    { name: "Đứng Tấn", duration: "x 16 lần" },
    { name: "Chạy tại chỗ nâng cao gối", duration: "30 giây" },
    { name: "Plank cơ bản", duration: "45 giây" },
    { name: "Squat bật nhảy", duration: "x 12 lần" },
    { name: "Gập bụng chéo", duration: "x 20 lần" },
    { name: "Gập bụng chéo", duration: "x 15 lần" },
  ];

  const params = useLocalSearchParams();

  const title = params.title ?? "Bài tập";
  const image = params.image ?? "";
  const day = parseInt(params.day as string, 10) ?? 1;

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <View style={styles.goback}>
        <ButtonGoBack bgColor={color.transparent} handleLogic={() => {
          navigateCustom("/schedule", {
            params: {
              scheduleId: 1,
              day: day,
              title: title,
              image: image
            }
          });
        }}/>
      </View>

      <ExerciseCard
        title={title as string}
        image={image ? image : require("../../assets/images/dumbbell.png")}
        haveButton={false}
        day={day}
        width={"100%"}
        border={0}
        marginBottom={0}
      />

      <View style={styles.scheduleList}>
        <View style={styles.scheduleHeader}>
          <View style={styles.item}>
            <Text style={styles.title}>Cấp độ</Text>
            <Text style={styles.value}>Nâng cao</Text>
          </View>
          <View style={styles.divider}></View>
          <View style={styles.item}>
            <Text style={styles.title}>Kcal</Text>
            <Text style={styles.value}>≈ 152.2</Text>
          </View>
          <View style={styles.divider}></View>
          <View style={styles.item}>
            <Text style={styles.title}>Thời lượng</Text>
            <Text style={styles.value}>13 phút</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.option} onPress={() => {
          console.log("Go to setting");
          navigateCustom("/schedule/scheduleSettings", {
            params: {
                scheduleId: 1,
                day: day,
                title: title,
                image: image
              }
          });
        }}>
          <Text style={styles.optionText}>Cài đặt tập luyện</Text>
          <MaterialIcons name="navigate-next" size={24} color="black" />
        </TouchableOpacity>
        <ScheduleBody data={fakeSlotItems} />
      </View>

      <View style={styles.buttonHolder}>
        <SCButton
          bgColor={color.dark_green}
          title="Tiếp tục"
          width={"75%"}
          onPress={() => {
            navigateCustom("/schedule/workout");
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", backgroundColor: color.white },
  goback: { position: "absolute", top: 50, left: 10, zIndex: 5 },
  scheduleList: {
    flex: 1,
    width: "100%",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    transform: [{ translateY: -25 }],
    backgroundColor: color.white,
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 60,
  },
  scheduleHeader: {
    width: "98%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  item: {
    width: "32%",
    height: 75,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 14, fontFamily: FONTS.regular },
  value: { fontSize: 16, fontFamily: FONTS.bold },
  divider: { width: 1, height: "75%", backgroundColor: color.border },
  option: {
    width: "98%",
    height: 50,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  optionText: { fontSize: 18, fontFamily: FONTS.bold },
  buttonHolder: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 84,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderTopColor: color.border,
    backgroundColor: color.white,
  },
});

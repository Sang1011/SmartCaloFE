import ExerciseCard from "@components/ui/excerciseCard";
import color from "@constants/color";
import { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

type WorkoutDataType = {
  title: string;
  info: string;
  totalProgress: number; 
  image: any;
};

// Khởi tạo dữ liệu
const workoutDataList: WorkoutDataType[] = [
  {
    title: "XÂY DỰNG CƠ THỂ MẠNH MẼ & SĂN CHẮC",
    info: "13 phút - 10 bài tập / 1 ngày",
    totalProgress: 30,
    image: require("../../assets/images/dumbbell.png"),
  },
  {
    title: "XÂY DỰNG CƠ THỂ MẠNH MẼ & SĂN CHẮC",
    info: "13 phút - 10 bài tập / 1 ngày",
    totalProgress: 30,
    image: require("../../assets/images/dumbbell.png"),
  },
  {
    title: "XÂY DỰNG CƠ THỂ MẠNH MẼ & SĂN CHẮC",
    info: "13 phút - 10 bài tập / 1 ngày",
    totalProgress: 30,
    image: require("../../assets/images/dumbbell.png"),
  },
];

export default function Workout() {
  const [workoutList, setWorkoutList] = useState<WorkoutDataType[]>(workoutDataList);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Thể dục</Text>
      </View>

      {/* DANH SÁCH */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {workoutList.map((item, index) => (
          <ExerciseCard
            key={index}
            title={item.title}
            totalProgress={item.totalProgress}
            image={item.image}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    backgroundColor: color.white,
    alignItems: "center",
    justifyContent: "center",
    borderBottomColor: color.border,
    borderBottomWidth: 1
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
});

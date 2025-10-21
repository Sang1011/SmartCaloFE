import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import { StyleSheet, Text, View } from "react-native";
import { WorkoutExcerciseDTO, WorkoutExcerciseTypeEnum } from "../../types/workoutExcercise";

export default function ScheduleBody({
  data,
}: {
  data: WorkoutExcerciseDTO[];
}) {
  const handleTextType = (item: WorkoutExcerciseDTO) => {
    if (item.type === WorkoutExcerciseTypeEnum.RepBased) {
      return `x ${item.reps} lần`;
    } else {
      if (!item.durationMin || item.durationMin === 0) {
        return "30 giây";
      }
      return `${item.durationMin} giây`;
    }
  };

  return (
    <View style={styles.body}>
      <Text style={styles.bodyText}>{data?.length} bài tập</Text>
      {data.map((item: WorkoutExcerciseDTO) => (
        <View key={item.id} style={styles.slotItem}>
          <Text style={styles.contentTitle}>{item.exerciseName}</Text>
          <Text style={styles.contentDes}>{handleTextType(item)}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    width: "95%",
    marginTop: 10,
  },
  bodyText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    paddingLeft: 10,
  },
  slotItem: {
    paddingHorizontal: 20,
    minHeight: 75,
    justifyContent: "center",
  },
  contentTitle: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: color.black,
  },
  contentDes: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: color.red_dark,
  },
});

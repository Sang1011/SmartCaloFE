import color from "@constants/color";
import { globalStyles } from "@constants/fonts";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ScheduleSlotItemProps {
  day: number;
  totalDurationMin?: number;
  dayOff: boolean;
}

export default function ScheduleSlotItem({
  day,
  totalDurationMin = 10,
  dayOff,
}: ScheduleSlotItemProps) {
  return (
    <View style={styles.slotItem}>
      <View style={styles.dayItem}>
        <Text style={[globalStyles.regular, { fontSize: 14 }]}>Ngày</Text>
        <Text style={[globalStyles.semiBold, { fontSize: 28 }]}>
          {day.toString().padStart(2, "0")}
        </Text>
      </View>

      <View style={styles.completed}>
        {/* {isCompleted ? (
          <>
            <Text style={[globalStyles.regular, { fontSize: 12 }]}>Đã hoàn thành</Text>
            <SCProgressBar
              color={color.dark_green}
              width={100}
              height={5}
              progress={100}
              duration={100}
            />
          </>
        ) : (
          <> */}
        {dayOff ? (
          <Text style={[globalStyles.regular, { fontSize: 12 }]}>
            NGÀY NGHỈ
          </Text>
        ) : (
          <Text style={[globalStyles.regular, { fontSize: 12 }]}>
            6 bài tập
          </Text>
        )}
        {/* <SCProgressBar
              color={color.dark_green}
              width={100}
              height={5}
              progress={0}
              duration={100}
            /> */}
        {/* </>
        )} */}
      </View>

      

      {/* <View style={styles.marked}>
        {isCompleted ? (
          <LinearGradient
            colors={[color.scan_button_inner_left, color.scan_button_inner_right]}
            style={[styles.buttonCheck, { borderRadius: 24 }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Feather name="check" size={24} color={color.white} />
          </LinearGradient>
        ) : (
          <></>
        )}
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  slotItem: {
    marginHorizontal: 20,
    padding: 20,
    height: 75,
    backgroundColor: color.white,
    borderRadius: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  dayItem: {
    flex: 0.3,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  completed: {
    flex: 0.4,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  marked: {
    flex: 0.3,
    height: "100%",
    display: "flex",
    justifyContent: "flex-end",
    flexDirection: "row",
    alignItems: "center",
  },
  buttonCheck: {
    width: 48,
    height: 48,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

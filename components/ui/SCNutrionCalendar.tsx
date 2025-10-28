import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import { isOldDay } from "@utils/filterDay";
import { navigateCustom } from "@utils/navigation";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

export default function SCNutritionCalendar() {
  // // Ví dụ dữ liệu: key là ngày, value là trạng thái ăn
  // const nutritionData: Record<string, "thiếu" | "đủ" | "thừa"> = {
  //   "2025-09-20": "thiếu",
  //   "2025-09-19": "đủ",
  //   "2025-09-18": "thừa",
  //   "2025-09-17": "đủ",
  //   "2025-09-16": "đủ",
  // };

  const getDotColor = (status: "thiếu" | "đủ" | "thừa") => {
    switch (status) {
      case "đủ":
        return color.eat_default; // xanh lá
      case "thừa":
        return color.overeating; // đỏ
      default:
        return color.undereating; // vàng
    }
  };

  // Lấy ngày hiện tại
  const now = new Date();
const vietnamTime = new Date(now.getTime() + 7 * 60 * 60 * 1000); // Cộng thêm 7 tiếng

const todayString = [
  vietnamTime.getUTCFullYear(),
  String(vietnamTime.getUTCMonth() + 1).padStart(2, "0"),
  String(vietnamTime.getUTCDate()).padStart(2, "0"),
].join("-");


  // Convert nutritionData sang format của react-native-calendars
  // const markedDates = Object.keys(nutritionData).reduce((acc, date) => {
  //   const status = nutritionData[date];
  //   acc[date] = {
  //     marked: true,
  //     dots: [{ color: getDotColor(status) }],
  //   };
  //   return acc;
  // }, {} as any);

  // Highlight ngày hiện tại
  // markedDates[todayString] = {
  //   ...(markedDates[todayString] || {}),
  //   selected: true,
  //   selectedColor: color.light_green,
  // };

  return (
    <View style={styles.container}>
      <Calendar
        monthFormat={"MMMM yyyy"}
        // markedDates={markedDates}
        markingType={"multi-dot"}
        theme={{
          todayTextColor: "#2a9d8f",
          textDayFontWeight: "500",
          textMonthFontWeight: "bold",
          textDayHeaderFontWeight: "600",
        }}
        dayComponent={(props) => {
          const { date, state } = props;
          if (!date) return null;

          const isToday = date.dateString === todayString;

          // Nếu ngày có dữ liệu -> dùng dot từ dữ liệu
          // Nếu không có dữ liệu nhưng state != disabled -> mặc định là "thiếu"
          // const isMarked = markedDates[date.dateString];
          const getToday = new Date().toLocaleDateString("en-CA");
          console.log("GETTODAY", getToday);
          return (
            <Pressable
            onPress={() => {
              if(isToday || isOldDay(date.dateString)){
                navigateCustom("/viewAllData", {
                  params: {
                    date: date.dateString
                  }
                })
              }
            }}
              style={[
                styles.dayContainer,
                {
                  borderColor:
                    state === "disabled" ? color.transparent : color.dark_green,
                },
                isOldDay(date.dateString) &&
                  state !== "disabled" && { backgroundColor: color.dark_green },
                isToday && {
                  backgroundColor: color.light_green,
                  borderColor: color.light_green,
                },
              ]}
            >
              <Text
                style={{
                  color:
                    state === "disabled"
                      ? "#ccc"
                      : isOldDay(date.dateString) || isToday
                      ? color.white
                      : color.dark_green,
                  fontSize: 16,
                  fontFamily:
                    state === "disabled" ? FONTS.regular : FONTS.semiBold,
                }}
              >
                {date.day}
              </Text>
            </Pressable>
          );
        }}
      />

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot]} />
          {/* <Text>Ăn thiếu calo</Text> */}
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot]} />
          {/* <Text>Ăn đủ calo</Text> */}
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot]} />
          {/* <Text>Ăn thừa calo</Text> */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  dayContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    margin: 2,
    flexDirection: "column",
    position: "relative",
  },
  legend: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 70,
    height: 6,
    borderRadius: 3,
    marginTop: 2,
  },
  dotBelow: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
    bottom: -14,
  },
});

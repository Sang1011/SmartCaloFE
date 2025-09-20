import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import { isOldDay } from "@utils/filterDay";
import React from "react";
import { StatusBar } from "react-native";
import { View, Text, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";

export default function SCNutritionCalendar() {
  // Ví dụ dữ liệu: key là ngày, value là trạng thái ăn
  const nutritionData: Record<string, "thiếu" | "đủ" | "thừa"> = {
    "2025-09-20": "thiếu",
    "2025-09-19": "đủ",
    "2025-09-18": "thừa",
    "2025-09-17": "đủ",
    "2025-09-16": "đủ",
  };

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
  const today = new Date();
  const todayString = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, "0"),
  String(today.getDate()).padStart(2, "0"),
].join("-");

  // Convert nutritionData sang format của react-native-calendars
  const markedDates = Object.keys(nutritionData).reduce((acc, date) => {
    const status = nutritionData[date];
    acc[date] = {
      marked: true,
      dots: [{ color: getDotColor(status) }],
    };
    return acc;
  }, {} as any);

  // Highlight ngày hiện tại
  markedDates[todayString] = {
    ...(markedDates[todayString] || {}),
    selected: true,
    selectedColor: color.light_green,
  };

  return (
    <View style={styles.container}>
      <Calendar
        monthFormat={"MMMM yyyy"}
        markedDates={markedDates}
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
          const isMarked = markedDates[date.dateString];
          let dotColor =
            isMarked && isMarked.dots ? isMarked.dots[0].color : null;

          if (!isMarked && state !== "disabled" && isOldDay(date.dateString)) {
            dotColor = getDotColor("thiếu");
          }

          return (
            <View
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

              {dotColor && (
                <View
                  style={[styles.dotBelow, { backgroundColor: dotColor }]}
                />
              )}
            </View>
          );
        }}
      />

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: color.undereating }]} />
          <Text>Ăn thiếu calo</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: color.eat_default }]} />
          <Text>Ăn đủ calo</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: color.overeating }]} />
          <Text>Ăn thừa calo</Text>
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
    width: 6,
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

import Color from "@constants/color";
import { FONTS } from "@constants/fonts";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { getWeeklyLogsThunk } from "@features/tracking";
import { RootState } from "@redux";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { navigateCustom } from "@utils/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { MealType } from "../../types/tracking";
import SCNutritionCalendar from "./SCNutrionCalendar";

// Helper function để lấy 7 ngày trong tuần
function getCurrentWeekDays() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ...
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    days.push({
      dateObj: date,
      day: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][date.getDay()],
      date: date.getDate(),
      dateKey: date.toLocaleDateString("en-CA"),
    });
  }
  return days;
}

export default function SCNutritionThisWeek() {
  const mealNames = [
    { name: "Bữa sáng", type: MealType.Breakfast },
    { name: "Bữa trưa", type: MealType.Lunch },
    { name: "Bữa tối", type: MealType.Dinner },
    { name: "Bữa phụ", type: MealType.Snack }
  ];

  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const today = new Date();
  const days = useMemo(() => getCurrentWeekDays(), []);

  const todayIndex = days.findIndex(
    (d) =>
      d.dateObj.getDate() === today.getDate() &&
      d.dateObj.getMonth() === today.getMonth() &&
      d.dateObj.getFullYear() === today.getFullYear()
  );

  const [selectedDayIndex, setSelectedDayIndex] = useState(
    todayIndex >= 0 ? todayIndex : 0
  );
  const selectedDay = days[selectedDayIndex];
  const month = selectedDay.dateObj.getMonth() + 1;

  const { weeklyLogs, weeklyLoading } = useAppSelector(
    (state: RootState) => state.tracking
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    const dateStrings = days.map((d) => d.dateKey);
    dispatch(getWeeklyLogsThunk(dateStrings));
  }, []);

  // Tính toán dữ liệu hiển thị từ weeklyLogs
  const daysWithData = useMemo(() => {
    return days.map((day) => {
      const log = weeklyLogs[day.dateKey];
      return {
        ...day,
        calo: log?.totalCaloriesConsumed || 0,
        max: log?.totalCaloriesTarget || 2000,
      };
    });
  }, [days, weeklyLogs]);

  const selectedDayData = daysWithData[selectedDayIndex];
  const selectedDayLog = weeklyLogs[selectedDayData.dateKey];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Dinh dưỡng tuần này</Text>
        <Pressable onPress={() => setCalendarVisible(true)}>
          <Entypo name="calendar" size={24} color={Color.black} />
        </Pressable>
      </View>

      {/* Biểu đồ cột */}
      <View style={styles.chart}>
        {daysWithData.map((item, idx) => {
          const progress = item.max > 0 ? Math.min(item.calo / item.max, 1) : 0;
          return (
            <View key={idx} style={styles.barWrapper}>
              <View
                style={[
                  styles.bar
                ]}
              >
                {item.calo === 0 ? (
                  <Text
                    style={{
                      fontSize: 10,
                      fontFamily: FONTS.semiBoldItalic,
                      color: idx === selectedDayIndex ? Color.dark_green : Color.gray_dark,
                      margin: "auto",
                    }}
                  >
                    N/A
                  </Text>
                ) : (
                  <View
                    style={{
                      flex: progress,
                      backgroundColor:
                        idx === selectedDayIndex
                          ? Color.light_green
                          : Color.light_gray,
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                    }}
                  />
                )}
              </View>

              <Pressable
                style={[
                  styles.barLabel,
                  idx === selectedDayIndex && styles.barLabelActive,
                ]}
                onPress={() => setSelectedDayIndex(idx)}
              >
                <Text
                  style={[
                    styles.day,
                    idx === selectedDayIndex && styles.dayActive,
                  ]}
                >
                  {item.day}
                </Text>
                <Text
                  style={[
                    styles.date,
                    idx === selectedDayIndex && styles.dateActive,
                  ]}
                >
                  {item.date}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>

      {/* Chi tiết ngày được chọn */}
      <View style={styles.detail}>
        <Text style={styles.detailTitle}>
          Tổng calo {selectedDayData.day}, {selectedDayData.date} tháng {month}
        </Text>
        <View style={styles.detailCaloRow}>
          <Text style={styles.detailCalo}>
            {selectedDayData.calo}/{Math.round(selectedDayData.max)} calo
          </Text>

          <Pressable
            style={styles.detailLinkContainer}
            onPress={() =>
              navigateCustom("/viewAllData", {
                params: {
                  date: selectedDayData.dateKey,
                },
              })
            }
          >
            <Text style={styles.detailLink}>Xem tổng quan</Text>
            <MaterialIcons
              name="navigate-next"
              size={20}
              color={Color.dark_green}
            />
          </Pressable>
        </View>

        {/* Danh sách các bữa ăn */}
        {mealNames.map((meal, index) => (
          <Pressable
            key={index}
            style={styles.mealRow}
            onPress={() =>
              navigateCustom("/viewData", {
                params: {
                  date: selectedDayData.dateKey,
                  mealType: meal.type.toString(),
                },
              })
            }
          >
            <Text style={styles.mealText}>{meal.name}</Text>
            <MaterialIcons name="navigate-next" size={20} color={Color.black} />
          </Pressable>
        ))}
      </View>

      {/* Modal lịch */}
      <Modal
        visible={isCalendarVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCalendarVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setCalendarVisible(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.calendarBox}>
                <Text style={{ textAlign: "center", marginTop: 20 }}>
                  <SCNutritionCalendar />
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    backgroundColor: Color.white,
    borderRadius: 16,
    padding: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    marginBottom: 8,
  },
  chart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  barWrapper: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  bar: {
    height: 100,
    width: "100%",
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barLabel: {
    marginTop: 8,
    flexDirection: "column",
    alignItems: "center",
    width: 28,
    borderRadius: 8,
  },
  barLabelActive: {
    backgroundColor: Color.dark_green,
    borderRadius: 8,
  },
  day: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    marginTop: 4,
    color: Color.black_50,
  },
  dayActive: {
    color: Color.white_50,
    paddingHorizontal: 4,
  },
  date: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: Color.black_60,
  },
  dateActive: {
    color: Color.white,
    borderRadius: 6,
    paddingHorizontal: 4,
  },
  detail: {
    borderTopWidth: 1,
    borderTopColor: Color.black_50,
    paddingTop: 8,
  },
  detailTitle: {
    fontSize: 12,
    fontFamily: FONTS.regular,
  },
  detailCalo: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    marginVertical: 4,
  },
  detailCaloRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
  },
  detailLinkContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailLink: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: Color.dark_green,
    marginRight: 4,
  },
  mealRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
    marginLeft: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: Color.border,
  },
  mealText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: Color.black,
  },
  overlay: {
    flex: 1,
    backgroundColor: Color.black_50,
    justifyContent: "flex-end",
  },
  calendarBox: {
    backgroundColor: Color.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    minHeight: "50%",
  },
});

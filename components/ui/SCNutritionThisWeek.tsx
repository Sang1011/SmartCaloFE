import Color from "@constants/color";
import { FONTS } from "@constants/fonts";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { navigateCustom } from "@utils/navigation";
import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import SCNutritionCalendar from "./SCNutrionCalendar";

const days = [
  { day: "T2", date: 11, calo: 1700, max: 2000 },
  { day: "T3", date: 12, calo: 1200, max: 2000 },
  { day: "T4", date: 13, calo: 300, max: 2000 },
  { day: "T5", date: 14, calo: 1200, max: 2000 },
  { day: "T6", date: 15, calo: 500, max: 2000 },
  { day: "T7", date: 16, calo: 800, max: 2000 },
  { day: "CN", date: 17, calo: 0, max: 2000 },
];

const mealsData = [
  {
    name: "Bữa sáng",
    icon: "coffee", // FontAwesome
    consumed: 448,
    target: 414,
  },
  {
    name: "Bữa trưa",
    icon: "bowl-food", // FontAwesome6
    consumed: 234,
    target: 552,
  },
  {
    name: "Bữa chiều",
    icon: "food-apple", // MaterialCommunityIcons
    consumed: 0,
    target: 69,
  },
  {
    name: "Bữa tối",
    icon: "food-turkey", // MaterialCommunityIcons (Đã đổi từ bữa Chiều sang Dinner/Bữa tối như hình)
    consumed: 0,
    target: 345,
  },
];

const today = new Date();
let currentDayIndex = today.getDay();
currentDayIndex = (currentDayIndex + 6) % 7;

export default function SCNutritionThisWeek() {
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(currentDayIndex);

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
        {days.map((item, idx) => {
          const progress = item.max > 0 ? item.calo / item.max : 0;
          return (
            <View key={idx} style={styles.barWrapper}>
              <View style={styles.bar}>
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

      {/* Chi tiết hôm nay */}
      <View style={styles.detail}>
        <Text style={styles.detailTitle}>
          Tổng calo {days[selectedDayIndex].day}, {days[selectedDayIndex].date}{" "}
          tháng 3
        </Text>
        <Text style={styles.detailCalo}>
          {days[selectedDayIndex].calo}/{days[selectedDayIndex].max} calo
        </Text>

        <View style={styles.detailContainer}>
          <Text style={styles.detailLink}>Xem tổng quan</Text>
          <MaterialIcons name="navigate-next" size={24} color={Color.dark_green} onPress={() => 
            navigateCustom("/viewAllData")
          }/>
        </View>

        {/* Danh sách các bữa ăn trong ngày */}
        {mealsData.map((meal, index) => (
          <Pressable
            key={index}
            style={styles.mealRow}
            onPress={() => navigateCustom("/viewData")}
          >
            <Text style={styles.mealText}>
              {meal.name} - {meal.consumed || 0} calo
            </Text>
            <MaterialIcons name="navigate-next" size={20} color={Color.black} onPress={() => 
            navigateCustom("/viewData")
          }/>
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
        {/* Overlay tối */}
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
    backgroundColor: Color.white, // Nền ngoài cùng là trắng
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
  detailContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  detailLink: {
    fontSize: 15,
    fontFamily: FONTS.medium,
    color: Color.dark_green,
  },
  meal: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    marginTop: 2,
    marginLeft: 15,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    color: Color.dark_green,
    fontSize: 18,
  },
  detailRightContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
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
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Color.dark_green, // Nút + màu xanh lá đậm
    justifyContent: "center",
    alignItems: "center",
  },
  // END: Sửa đổi style cho phần chi tiết bữa ăn (detail)

  // Style cũ (giữ lại và loại bỏ các style không dùng)
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

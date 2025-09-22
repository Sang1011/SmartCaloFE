import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import Color from "@constants/color";
import { FONTS } from "@constants/fonts";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SCNutritionCalendar from "./SCNutrionCalendar";
import { navigateWithFlag } from "@utils/navigation";

const days = [
  { day: "T2", date: 11, calo: 1700, max: 2000 },
  { day: "T3", date: 12, calo: 1200, max: 2000 },
  { day: "T4", date: 13, calo: 300, max: 2000 },
  { day: "T5", date: 14, calo: 1200, max: 2000 },
  { day: "T6", date: 15, calo: 500, max: 2000 },
  { day: "T7", date: 16, calo: 800, max: 2000 },
  { day: "CN", date: 17, calo: 0, max: 2000 },
];

const today = new Date();
let currentDayIndex = today.getDay();
currentDayIndex = (currentDayIndex + 6) % 7;

export default function SCNutritionThisWeek() {
  useEffect(() => {
    navigateWithFlag("/scan");
  }, []);
  const [isCalendarVisible, setCalendarVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Dinh dưỡng tuần này</Text>
        <Pressable onPress={() => setCalendarVisible(true)}>
          <Entypo name="calendar" size={24} color="black" />
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
                      idx === currentDayIndex
                        ? Color.light_green
                        : Color.light_gray,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                  }}
                />
              </View>
              <View
                style={[
                  styles.barLabel,
                  idx === currentDayIndex && styles.barLabelActive,
                ]}
              >
                <Text
                  style={[
                    styles.day,
                    idx === currentDayIndex && styles.dayActive,
                  ]}
                >
                  {item.day}
                </Text>
                <Text
                  style={[
                    styles.date,
                    idx === currentDayIndex && styles.dateActive,
                  ]}
                >
                  {item.date}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Chi tiết hôm nay */}
      <View style={styles.detail}>
        <Text style={styles.detailTitle}>
          Tổng calo {days[currentDayIndex].day}, {days[currentDayIndex].date}{" "}
          tháng 3
        </Text>
        <Text style={styles.detailCalo}>
          {days[currentDayIndex].calo}/{days[currentDayIndex].max} calo
        </Text>
        <View style={styles.detailContainer}>
          <Text style={styles.detailLink}>Xem chi tiết</Text>
          <MaterialIcons name="navigate-next" size={24} color="black" />
        </View>
        <Text style={styles.meal}>Bữa sáng - 300 calo</Text>
        <Text style={styles.meal}>Bữa trưa</Text>
        <Text style={styles.meal}>Bữa tối</Text>
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
    borderRadius: 6,
  },
  barLabelActive: {
    backgroundColor: Color.dark_green,
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
  },
  detailLink: {
    fontSize: 15,
    fontFamily: FONTS.medium,
  },
  meal: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    marginTop: 2,
    marginLeft: 15,
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
  calendarTitle: {
    fontSize: 18,
    fontFamily: FONTS.semiBold,
    marginBottom: 12,
    textAlign: "center",
  },
});

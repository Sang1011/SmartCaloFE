import Color from "@constants/color";
import { FONTS } from "@constants/fonts";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
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
    name: "Breakfast",
    icon: "coffee", // FontAwesome
    consumed: 448,
    target: 414,
  },
  {
    name: "Lunch",
    icon: "bowl-food", // FontAwesome6
    consumed: 234,
    target: 552,
  },
  {
    name: "Dinner",
    icon: "food-turkey", // MaterialCommunityIcons (Đã đổi từ bữa Chiều sang Dinner/Bữa tối như hình)
    consumed: 0,
    target: 345,
  },
  {
    name: "Snacks",
    icon: "food-apple", // MaterialCommunityIcons
    consumed: 0,
    target: 69,
  },
];

const today = new Date();
let currentDayIndex = today.getDay();
currentDayIndex = (currentDayIndex + 6) % 7; // Chuyển từ (CN=0, T2=1,...) sang (T2=0, T7=5, CN=6)

const MealItem = ({ meal }) => {
  const isOverCal = meal.consumed > meal.target;
  const progress = meal.target > 0 ? meal.consumed / meal.target : 0;
  const isComplete = meal.consumed > 0;

  // Chọn icon dựa trên tên bữa ăn
  let IconComponent;
  let iconName;
  switch (meal.name) {
    case "Breakfast":
      IconComponent = FontAwesome;
      iconName = "coffee";
      break;
    case "Lunch":
      IconComponent = FontAwesome6;
      iconName = "bowl-food";
      break;
    case "Dinner":
      IconComponent = MaterialCommunityIcons;
      iconName = "food-turkey";
      break;
    case "Snacks":
      IconComponent = MaterialCommunityIcons;
      iconName = "food-apple";
      break;
    default:
      IconComponent = MaterialIcons;
      iconName = "restaurant";
      break;
  }

  const iconColor = isComplete ? Color.black : Color.dark_green;

  return (
    <Pressable
      style={styles.mealContainer}
      onPress={() => {
        navigateCustom("/viewData");
      }}
    >
      <View style={styles.mealIconWrapper}>
        <View
          style={[
            styles.mealIcon,
            {
              // Thanh tiến trình
              borderColor: isOverCal ? Color.red : Color.dark_green,
            },
          ]}
        >
          <View
            style={[
              styles.progressCircle,
              {
                // Vị trí thanh progress (đã đơn giản hóa progress bar)
                // Cần một thư viện đồ họa để vẽ vòng tròn progress chuẩn
                // Dùng một màu nền để mô phỏng vòng tròn.
                borderWidth: 2,
                borderColor: isComplete
                  ? isOverCal
                    ? Color.red
                    : Color.dark_green
                  : Color.light_gray,
              },
            ]}
          >
            {/* Sử dụng một View overlay để mô phỏng progress bar/vòng tròn, nhưng phức tạp với style.
                Giữ đơn giản với icon và màu sắc như ảnh. */}
            <IconComponent name={iconName} size={20} color={iconColor} />
          </View>
        </View>
      </View>

      <View style={styles.mealTextContent}>
        <View style={styles.mealHeader}>
          <Text style={styles.mealName}>{meal.name}</Text>
          <MaterialIcons
            name="navigate-next"
            size={24}
            color={Color.white}
            style={styles.arrowIcon}
          />
        </View>
        <Text
          style={[
            styles.mealCalo,
            { color: isOverCal ? Color.red_dark : Color.black },
          ]}
        >
          {meal.consumed} / {meal.target} Cal
        </Text>
      </View>
      <Pressable style={styles.addButton}>
        <Entypo
          name="plus"
          size={28}
          color={Color.white}
          onPress={() => {
            navigateCustom("/option");
          }}
        />
      </Pressable>
    </Pressable>
  );
};

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
          <Text style={styles.sectionTitle}>Dinh dưỡng</Text>
          <View style={styles.detailRightContainer}>
          <Text style={styles.detailLink} onPress={() => {
            navigateCustom("/viewAllData");
          }}>Xem chi tiết</Text>
          <MaterialIcons
            name="navigate-next"
            size={16}
            color={Color.dark_green}
          />
          </View>
        </View>
        <View style={styles.separator}></View>
        {mealsData.map((meal, index) => (
          <MealItem key={index} meal={meal} />
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
    borderRadius: 12, // Thêm bo góc để trông đẹp hơn
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 12, // Khoảng cách với biểu đồ cột
  },
  detailTitle: {
    fontSize: 14, // Tăng nhẹ kích thước
    fontFamily: FONTS.regular,
    color: Color.black_50, // Chữ xám nhạt (trắng mờ)
    paddingTop: 8,
  },
  detailCalo: {
    fontSize: 20, // Kích thước lớn
    fontFamily: FONTS.bold,
    color: Color.black,
    marginVertical: 4,
  },
  detailContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
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
  detailLink: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: Color.dark_green, // "Xem chi tiết" màu xanh lá đậm
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: Color.white_10, // Đường kẻ phân cách
    marginVertical: 8,
  },

  mealContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10, // Khoảng cách giữa các bữa ăn
    borderBottomWidth: 1,
    borderBottomColor: Color.black_50, // Đường kẻ mờ
  },
  mealIconWrapper: {
    // Vòng tròn ngoài cùng
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    // Màu nền mờ (optional, tùy thuộc vào độ chính xác của hình ảnh)
    backgroundColor: Color.dark_green,
  },
  mealIcon: {
    // Vòng tròn progress bar (Đang mô phỏng bằng border)
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Color.white, // Nền bên trong
    // Giữ nguyên logic border/progress ở trên
  },
  progressCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  mealTextContent: {
    flex: 1,
    paddingHorizontal: 10,
  },
  mealHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  mealName: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
  },
  arrowIcon: {
    // Icon mũi tên
    opacity: 0.5, // Làm mờ bớt
  },
  mealCalo: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: Color.dark_green, // Calo tiêu chuẩn dùng dark_green
  },
  mealItems: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: Color.black_60, // Danh sách món ăn dùng trắng mờ (gray/xám)
    flexWrap: "wrap",
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

import color from "@constants/color";
import { FONTS, globalStyles } from "@constants/fonts";
import { Ionicons } from "@expo/vector-icons";
import { navigateCustom } from "@utils/navigation";
import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BodyInfo() {
  type genderType = "male" | "female";
  const [gender, setGender] = useState<genderType>("male");
  const [showDropdown, setShowDropdown] = useState(false);
  const [activity, setActivity] = useState("Vận động nhẹ");

  const activities = [
    "Ít vận động",
    "Vận động nhẹ",
    "Vận động vừa phải",
    "Vận động nhiều",
    "Vận động rất nhiều",
  ];

  const weight = 65;
  const height = 160;
  const bmi = 27.7;
  const bmr = 2088;
  const tdee = 2871;

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: color.background }}>
    {/* Nút quay về */}
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 20, // thêm padding dưới để tránh bị cắt
      }}
    >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigateCustom("/tabs")}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={color.dark_green} />
          </TouchableOpacity>
          <Text style={styles.title}>Thông tin của bạn</Text>
        </View>
        <View style={styles.card}>
          {/* Giới tính */}
          <View style={styles.genderContainer}>
            <Pressable
              style={[
                styles.genderBox,
                gender === "female" && styles.activeGender,
              ]}
              onPress={() => setGender("female")}
            >
              <Text
                style={[
                  styles.genderText,
                  gender === "female" && styles.activeGenderText,
                ]}
              >
                Female
              </Text>
              <Image
                source={require("@assets/images/female.png")}
                style={styles.avatar}
              />
            </Pressable>

            <Pressable
              style={[
                styles.genderBox,
                gender === "male" && styles.activeGender,
              ]}
              onPress={() => setGender("male")}
            >
              <Text
                style={[
                  styles.genderText,
                  gender === "male" && styles.activeGenderText,
                ]}
              >
                Male
              </Text>
              <Image
                source={require("@assets/images/male-noBG.png")}
                style={styles.avatar}
              />
            </Pressable>
          </View>

          {/* Cân nặng & chiều cao */}
          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <Text style={styles.label}>Cân nặng</Text>
              <Text style={styles.value}>{weight} kg</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.label}>Chiều cao</Text>
              <Text style={styles.value}>{height} cm</Text>
            </View>
          </View>

          {/* Mức độ vận động */}
          <View style={{ alignItems: "center", marginTop: 10 }}>
            <Text style={styles.label}>Mức độ vận động</Text>
            <Pressable
              style={styles.activityDropdown}
              onPress={() => setShowDropdown(!showDropdown)}
            >
              <Text style={styles.dropdownText}>{activity}</Text>
              <Ionicons
                name={showDropdown ? "chevron-up" : "chevron-down"}
                size={18}
                color={color.dark_green}
              />
            </Pressable>

            {showDropdown && (
              <View style={styles.dropdownList}>
                {activities.map((item) => (
                  <TouchableOpacity
                    key={item}
                    onPress={() => {
                      setActivity(item);
                      setShowDropdown(false);
                    }}
                    style={[
                      styles.dropdownItem,
                      activity === item && styles.dropdownItemActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        activity === item && styles.dropdownItemTextActive,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <Pressable style={styles.saveButton}>
            <Text style={styles.saveText}>Lưu thông tin</Text>
          </Pressable>

          <Pressable
            style={styles.historyButton}
            onPress={() => navigateCustom("/bodyHistory")}
          >
            <Ionicons
              name="bar-chart-outline"
              size={18}
              color={color.dark_green}
            />
            <Text style={styles.historyText}>Xem lịch sử thay đổi</Text>
          </Pressable>
        </View>

        {/* BMI */}
        {/* BMI */}
        <View style={styles.bmiCard}>
          <Text style={styles.bmiTitle}>BMI</Text>
          <Text style={styles.bmiDesc}>
            Chỉ số BMI của bạn là {bmi} —{" "}
            <Text style={{ fontWeight: "bold" }}>
              {bmi < 18.5
                ? "Thiếu cân"
                : bmi < 22.9
                ? "Bình thường"
                : bmi < 24.9
                ? "Thừa cân"
                : bmi < 29.9
                ? "Béo phì độ 1"
                : bmi < 35
                ? "Béo phì độ 2"
                : "Béo phì độ 3"}
            </Text>
          </Text>

          {/* Thanh BMI chia mốc */}
          <View style={styles.bmiBarContainer}>
            <View style={styles.bmiBar}>
              <View
                style={[
                  styles.bmiSegment,
                  { flex: 3, backgroundColor: "#4FC3F7" },
                ]}
              />
              {/* <18.5 */}
              <View
                style={[
                  styles.bmiSegment,
                  { flex: 4.4, backgroundColor: "#81C784" },
                ]}
              />
              {/* 18.5–22.9 */}
              <View
                style={[
                  styles.bmiSegment,
                  { flex: 2, backgroundColor: "#FFF176" },
                ]}
              />
              {/* 23–24.9 */}
              <View
                style={[
                  styles.bmiSegment,
                  { flex: 5, backgroundColor: "#FFB74D" },
                ]}
              />
              {/* 25–29.9 */}
              <View
                style={[
                  styles.bmiSegment,
                  { flex: 5.1, backgroundColor: "#E57373" },
                ]}
              />
              {/* 30–35 */}
            </View>

            {/* Dấu chỉ vị trí BMI */}
            <View
              style={[
                styles.bmiIndicator,
                { left: `${((bmi - 15) / (35 - 15)) * 100}%` },
              ]}
            />
          </View>

          {/* Mốc giá trị dưới thanh */}
          <View style={styles.bmiLabels}>
            {[15, 18.5, 22.9, 24.9, 29.9, 35].map((v) => (
              <Text key={v} style={styles.bmiLabelText}>
                {v}
              </Text>
            ))}
          </View>

          <Text style={styles.bmiIdeal}>
            Cân nặng lý tưởng ước tính: 77.1 - 88 kg
          </Text>
        </View>

        {/* BMR & TDEE */}
        <View style={styles.calcBox}>
          <View style={[styles.calcItem, { backgroundColor: "#EAF4FF" }]}>
            <Text style={[styles.calcTitle, globalStyles.medium]}>
              Tỉ lệ chuyển hóa cơ bản (BMR)
            </Text>
            <Text style={[styles.calcValue, globalStyles.bold]}>
              2,088 calo / ngày
            </Text>
            <Text style={[styles.calcDesc, globalStyles.light]}>
              Năng lượng cần thiết
            </Text>
          </View>
          <View style={[styles.calcItem, { backgroundColor: "#E8F9F1" }]}>
            <Text style={[styles.calcTitle, globalStyles.medium]}>
              Tổng năng lượng tiêu hao (TDEE)
            </Text>
            <Text style={[styles.calcValue, globalStyles.bold]}>
              2,871 calo / ngày
            </Text>
            <Text style={[styles.calcDesc, globalStyles.light]}>
              Bao gồm hoạt động hằng ngày
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  backButton: { flexDirection: "row", alignItems: "center", gap: 6,justifyContent: "center" },
  backText: {
    color: color.dark_green,
    fontFamily: FONTS.medium,
    fontSize: 16,
  },
  container: { flex: 1, backgroundColor: color.background, paddingHorizontal: 16, 
    paddingTop: 16
   },
  card: {
    backgroundColor: color.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: color.dark_green,
    marginBottom: 10,
    width: "100%",
    textAlign: "center",
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  genderBox: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: color.light_gray,
    borderRadius: 12,
    padding: 10,
    width: "40%",
  },
  activeGender: { borderColor: color.dark_green, backgroundColor: "#E8F5E9" },
  avatar: { width: 70, height: 70, resizeMode: "contain" },
  genderText: { fontSize: 14, color: color.gray },
  activeGenderText: { color: color.dark_green, fontFamily: FONTS.bold },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  infoBox: { alignItems: "center" },
  label: { fontSize: 14, color: color.dark_green },
  value: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: color.dark_green,
    marginTop: 4,
  },
  activityDropdown: {
    borderWidth: 1,
    borderColor: color.dark_green,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  dropdownText: { color: color.dark_green },
  dropdownList: {
    borderWidth: 1,
    borderColor: color.dark_green,
    borderRadius: 10,
    marginTop: 6,
    width: "80%",
    backgroundColor: color.white,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  dropdownItemActive: {
    backgroundColor: "#E8F5E9",
  },
  dropdownItemText: {
    color: color.dark_green,
  },
  dropdownItemTextActive: {
    fontFamily: FONTS.bold,
  },
  saveButton: {
    backgroundColor: color.dark_green,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 16,
  },
  saveText: { color: color.white, fontSize: 16, fontFamily: FONTS.bold },
  historyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    gap: 6,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 10,
    borderColor: color.dark_green,
  },
  historyText: { color: color.dark_green, fontFamily: FONTS.medium },
  bmiCard: {
    backgroundColor: color.white,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  bmiTitle: { fontSize: 18, fontFamily: FONTS.bold, color: color.dark_green },
  bmiDesc: { marginTop: 4, color: color.gray },
  bmiIdeal: { color: color.dark_green, marginTop: 8, fontFamily: FONTS.medium },
  bmiBarContainer: {
    marginVertical: 10,
    position: "relative",
  },
  bmiBar: {
    flexDirection: "row",
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
  },
  bmiSegment: {
    height: "100%",
  },
  bmiIndicator: {
    position: "absolute",
    top: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderColor: color.white,
    borderWidth: 2,
    backgroundColor: color.scan_button_outer_bottom,
  },
  bmiLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  bmiLabelText: {
    fontSize: 10,
    color: color.gray,
  },
  calcBox: {
    marginVertical: 8,
    backgroundColor: color.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  calcItem: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  calcTitle: {
    fontSize: 14,
    color: color.black,
  },
  calcValue: {
    fontSize: 16,
    marginVertical: 4,
    color: color.black,
  },
  calcDesc: {
    fontSize: 12,
    color: color.grey,
  },
});

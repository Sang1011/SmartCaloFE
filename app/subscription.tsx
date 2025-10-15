import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import { Ionicons } from "@expo/vector-icons";
import { navigateCustom } from "@utils/navigation";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SubscriptionScreen() {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("yearly");
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Nút back */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={32} color={color.black} 
        onPress={() => navigateCustom("/tabs/profile")}
        />
      </View>

      {/* Tiêu đề */}
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { fontFamily: FONTS.semiBold }]}>
          Chọn gói phù hợp với bạn!
        </Text>
        <Text style={[styles.subtitle, { fontFamily: FONTS.regular }]}>
          So sánh tính năng giữa gói FREE và PRO
        </Text>
      </View>

      {/* Bảng so sánh */}
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { flex: 2 }]}> </Text>
          <Text style={[styles.tableHeaderText, { flex: 1 }]}>FREE</Text>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Text style={[styles.tableHeaderText, { marginRight: 4 }]}>
              PRO
            </Text>
            <Text style={styles.crown}>👑</Text>
          </View>
        </View>

        {[
          ["Nhận diện thức ăn qua hình ảnh", "10 lần / 1 tháng", true],
          ["Tính toán BMI/BMR/TDEE", "✔️", true],
          ["Theo dõi quá trình ăn uống & tập luyện cơ bản", "✔️", true],
          ["Tra cứu thư viện các món ăn Việt Nam", "✔️", true],
          ["AI gợi ý các bữa ăn và bài tập", "❌", true],
          ["Ghi nhật ký ăn uống không giới hạn", "❌", true],
        ].map(([title, freeValue], index) => (
          <View key={index} style={styles.row}>
            <Text style={[styles.cellText, { flex: 2 }]}>{title}</Text>
            <Text
              style={[
                styles.cellText,
                {
                  flex: 1,
                  color:
                    freeValue === "10 lần / 1 tháng"
                      ? color.red_dark
                      : color.black,
                  textAlign: "center",
                },
              ]}
            >
              {freeValue}
            </Text>
            <Text style={[styles.cellText, { flex: 1, textAlign: "center" }]}>
              ✔️
            </Text>
          </View>
        ))}
      </View>

      {/* Gói chọn */}
      <View style={styles.planContainer}>
        <TouchableOpacity
          style={[
            styles.planBox,
            selectedPlan === "yearly" && styles.planSelected,
          ]}
          onPress={() => setSelectedPlan("yearly")}
          activeOpacity={0.8}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={[styles.planTitle, { fontFamily: FONTS.bold }]}>
              12 THÁNG
            </Text>
            <Text style={styles.discount}>Giảm giá gần 17%</Text>
          </View>
          <Text style={[styles.planPrice, { fontFamily: FONTS.medium }]}>
            300.000 VND / 1 năm
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.planBox,
            selectedPlan === "monthly" && styles.planSelected,
          ]}
          onPress={() => setSelectedPlan("monthly")}
          activeOpacity={0.8}
        >
          <Text style={[styles.planTitle, { fontFamily: FONTS.bold }]}>
            1 THÁNG
          </Text>
          <Text style={[styles.planPrice, { fontFamily: FONTS.medium }]}>
            30.000 VND / 1 tháng
          </Text>
        </TouchableOpacity>
      </View>

      {/* Nút nâng cấp */}
      <TouchableOpacity style={styles.button}>
        <Text style={[styles.buttonText, { fontFamily: FONTS.semiBold }]}>
          Nâng cấp tài khoản của bạn ngay bây giờ!
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    position: "absolute",
    top: 5,
    left: 5,
    zIndex: 10,
  },
  titleContainer: {
    marginTop: 50,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: color.dark_green,
    fontFamily: FONTS.bold,
  },
  subtitle: {
    fontSize: 14,
    color: color.gray_dark,
    marginTop: 4,
  },
  tableContainer: {
    backgroundColor: color.gray_light,
    borderRadius: 12,
    padding: 12,
    marginTop: 24,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 8,
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: color.black,
    textAlign: "center",
  },
  crown: {
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: color.light_gray,
  },
  cellText: {
    fontSize: 13,
    color: color.black,
  },
  planContainer: {
    marginTop: 24,
  },
  planBox: {
    borderWidth: 1,
    borderColor: color.green,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  planSelected: {
    borderWidth: 2,
    borderColor: color.dark_green,
    backgroundColor: "#F8FFF3",
  },
  planTitle: {
    fontSize: 15,
    color: color.dark_green,
  },
  planPrice: {
    fontSize: 13,
    color: color.black,
    marginTop: 6,
  },
  discount: {
    backgroundColor: "#E6F3DC",
    color: color.dark_green,
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  button: {
    backgroundColor: color.dark_green,
    borderRadius: 10,
    paddingVertical: 18,
    marginVertical: 24,
  },
  buttonText: {
    color: color.white,
    fontSize: 15,
    textAlign: "center",
  },
});

import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import { Ionicons } from "@expo/vector-icons";
import { fetchAllSubscriptions } from "@features/subscriptions";
import { RootState } from "@redux";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { navigateCustom } from "@utils/navigation";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SubscriptionScreen() {
  const [selectedPlan, setSelectedPlan] = useState<"free" | "monthly" | "yearly">(
    "free"
  );
  const dispatch = useAppDispatch();
  const { subscriptionPlans, loading } = useAppSelector(
    (state: RootState) => state.subscription
  );

  useEffect(() => {
    dispatch(fetchAllSubscriptions());
  }, [dispatch]);

  // --- Loading state ---
  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={[styles.loadingText, { fontFamily: FONTS.bold }]}>
          LOADING...
        </Text>
        <ActivityIndicator size="large" color={color.dark_green} />
      </View>
    );
  }


  // --- Main content ---
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
      {/* Nút back */}
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={32}
          color={color.black}
          onPress={() => navigateCustom("/tabs/profile")}
        />
      </View>

      {/* Tiêu đề */}
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { fontFamily: FONTS.semiBold }]}>
          Chọn gói phù hợp với bạn!
        </Text>
        <Text style={[styles.subtitle, { fontFamily: FONTS.regular }]}>
          So sánh tính năng giữa gói FREE và PREMIMUM
        </Text>
      </View>

      {/* Bảng so sánh */}
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { flex: 2 }]} />
          <Text style={[styles.tableHeaderText, { flex: 1 }]}>FREE</Text>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Text style={[styles.tableHeaderText, { marginRight: 4 }]}>PREMIMUM</Text>
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
                  color: freeValue === "10 lần / 1 tháng" ? color.red_dark : color.black,
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
        {subscriptionPlans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={[
              styles.planBox,
              selectedPlan === plan.planName.toLowerCase() && styles.planSelected,
            ]}
            onPress={() =>
              setSelectedPlan(plan.planName.toLowerCase() as "monthly" | "yearly")
            }
            activeOpacity={0.8}
          >
            <Text style={[styles.planTitle, { fontFamily: FONTS.bold }]}>
              {plan.planName.toUpperCase()}
            </Text>
            <Text style={[styles.planPrice, { fontFamily: FONTS.medium }]}>
              {plan.price.toLocaleString()} VND /{" "}
              {plan.durationInDays >= 365 ? "1 năm" : "1 tháng"}
            </Text>
          </TouchableOpacity>
        ))}
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
    backgroundColor: color.white,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 24,
    color: color.dark_green,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 18,
    color: "red",
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

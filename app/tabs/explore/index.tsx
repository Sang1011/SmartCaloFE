import SCButton from "@components/ui/SCButton";
import CurrentMenuCard from "@components/ui/currentMenuCard";
import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import { FontAwesome5 } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { fetchCurrentUserThunk } from "@features/users";
import { useRoute } from "@react-navigation/native";
import { RootState } from "@redux";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { ensureUserExists } from "@utils/firebaseRealTime";
import { navigateCustom } from "@utils/navigation";
import { useEffect } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

const recipeData = {
  id: 1,
  title:
    "Eat Clean dành cho dân văn phòng bận rộn cùng SmartCalo (1600-1800 calo)",
  calorie: "1600-1800 cal/ ngày",
  meals: "4 bữa / ngày",
  duration: "7 ngày",
  image: require("../../../assets/images/recipe_1.png"),
};

type ExerciseType = {
  title: string;
  day: string;
  info: string;
  progress: {
    current: number;
    total: number;
  };
  image?: string;
};
const exerciseData: ExerciseType = {
  title: "XÂY DỰNG CƠ THỂ MẠNH MẼ & SĂN CHẮC",
  day: "NGÀY 6",
  info: "13 phút - 10 bài tập",
  progress: {
    current: 6,
    total: 30,
  },
};

const planData = {
  title: "Giảm cân và tăng cường dinh dưỡng",
  startDate: "04/06/2025",
  endDate: "04/09/2025",
  duration: "3 tháng",
  initialWeight: "65 kg",
  targetWeight: "55 kg",
  progressPercent: 25,
  daysCompleted: 30,
  totalDays: 92,
  streakDays: 30,
};

export default function ExploreScreen() {
  const route = useRoute();
  const dispatch = useAppDispatch();

  const { user, loading } = useAppSelector((state: RootState) => state.user);

  // 🔹 Chỉ fetch user từ backend 1 lần khi vào component
  useEffect(() => {
    dispatch(fetchCurrentUserThunk());
  }, [dispatch]);

  // 🔹 Khi Redux đã có user → kiểm tra / tạo user trong Firebase
  useEffect(() => {
    if (user?.id) {
      fetchUserFromFirebase(user.id);
    }
  }, [user?.id]);

  const fetchUserFromFirebase = async (id: string) => {
    try {
      await ensureUserExists(id);
      console.log("✅ Firebase user ensured:", id);
    } catch (err) {
      console.error("❌ Error ensuring Firebase user:", err);
    }
  };

  const handleRedirect = (url: string) => {
    if (route.name === url) return;
    navigateCustom(url);
  };

  const hasCurrentMenu = false;

  return (
    <View style={styles.container}>
      {loading ? (
        // ✅ Hiển thị loading khi đang tải
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={color.dark_green} />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : (
        <ScrollView style={styles.contentContainer}>
          {/* --- Current Plan --- */}
          <View style={styles.sectionPlan}>
            <View style={styles.sectionHeader}>
              <Feather name="target" size={24} color={color.dark_green} />
              <Text style={styles.sectionSubtitle}>
                Kế hoạch đang thực hiện
              </Text>
            </View>

            <Text style={styles.planTitle}>{planData.title}</Text>

            <View style={styles.dateContainer}>
              <View style={[styles.dateItem, { paddingLeft: 3 }]}>
                <FontAwesome
                  style={{ paddingRight: 3 }}
                  name="calendar"
                  size={16}
                  color={color.dark_green}
                />
                <Text style={styles.dateText}>
                  {planData.startDate} - {planData.endDate}
                </Text>
              </View>
              <View style={styles.dateItem}>
                <Ionicons name="timer" size={20} color={color.dark_green} />
                <Text style={styles.durationText}>
                  Thời gian {planData.duration}
                </Text>
              </View>
            </View>

            {/* Weight Info */}
            <View style={styles.weightContainer}>
              <View style={styles.weightItem}>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <AntDesign name="stock" size={16} color={color.white} />
                  <Text style={styles.weightLabel}>Ban đầu</Text>
                </View>
                <Text style={styles.weightValue}>{user?.startWeight} Kg</Text>
              </View>
              <View style={styles.weightItem}>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <FontAwesome5 name="weight" size={14} color={color.white} />
                  <Text style={styles.weightLabel}>Mục tiêu</Text>
                </View>
                <Text style={styles.weightValue}>{user?.targetWeight} Kg</Text>
              </View>
            </View>

            {/* Progress Section */}
            <View style={styles.progressSection}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.progressLabel}>Tiến độ</Text>
                <Text style={styles.labelHundred}>
                  {planData.progressPercent}%
                </Text>
              </View>

              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${planData.progressPercent}%` },
                    ]}
                  />
                </View>
              </View>
              <Text style={styles.progressText}>
                Ngày {planData.daysCompleted} / {planData.totalDays}
              </Text>
            </View>

            {/* Streak Section */}
            <View style={styles.streakContainer}>
              <View style={styles.streakContent}>
                <Text style={styles.streakLabel}>Số ngày đã kiên trì</Text>
                <View style={styles.streakValueContainer}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 4,
                    }}
                  >
                    <View style={styles.streakIcon}>
                      <FontAwesome5 name="fire" size={24} color={color.white} />
                    </View>
                    <Text style={styles.streakValue}>
                      {planData.streakDays}
                    </Text>
                  </View>
                  <Text style={styles.streakUnit}>ngày liên tiếp</Text>
                </View>
              </View>
            </View>
          </View>

          {/* --- Current Menu Section --- */}
          <Text style={styles.sectionTitle}>Thực đơn hiện tại</Text>
          {hasCurrentMenu ? (
            <CurrentMenuCard
              title={recipeData.title}
              calorie={recipeData.calorie}
              meals={recipeData.meals}
              duration={recipeData.duration}
              image={recipeData.image}
              onChange={() => console.log("Thay đổi thực đơn")}
            />
          ) : (
            <View style={[styles.emptyBox, { marginBottom: 28 }]}>
              <Ionicons
                name="restaurant-outline"
                size={36}
                color={color.dark_green}
              />
              <Text style={styles.emptyText}>Bạn chưa chọn thực đơn</Text>
              <SCButton
                title="Chọn thực đơn ngay"
                bgColor={color.dark_green}
                color={color.white}
                borderRadius={20}
                width={200}
                height={45}
                fontSize={14}
                fontFamily={FONTS.semiBold}
                onPress={() => handleRedirect("/tabs/recipe")}
              />
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.background },
  contentContainer: { flex: 1, paddingTop: 16, paddingHorizontal: 16 },

  // --- EMPTY STATE ---
  emptyBox: {
    backgroundColor: color.white,
    borderRadius: 12,
    paddingVertical: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: color.border,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: color.dark_green,
    marginVertical: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: color.white,
  },
  loadingText: {
    marginTop: 12,
    color: color.dark_green,
    fontFamily: FONTS.medium,
    fontSize: 15,
  },
  sectionPlan: {
    backgroundColor: color.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderColor: color.dark_green,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 8,
    gap: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: color.dark_green,
    fontFamily: FONTS.bold,
  },
  planTitle: {
    fontSize: 18,
    color: color.dark_green,
    fontFamily: FONTS.semiBold,
    marginBottom: 12,
  },
  dateContainer: { marginBottom: 16 },
  dateItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  dateText: {
    fontSize: 12,
    color: color.dark_green,
    fontFamily: FONTS.regular,
  },
  durationText: {
    fontSize: 12,
    color: color.dark_green,
    fontFamily: FONTS.regular,
  },
  weightContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  weightItem: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: color.dark_green,
    padding: 12,
    alignItems: "center",
    marginHorizontal: 4,
  },
  weightLabel: { fontSize: 12, color: color.white, fontFamily: FONTS.regular },
  weightValue: {
    paddingTop: 4,
    fontSize: 20,
    color: color.white,
    fontFamily: FONTS.semiBold,
  },
  progressSection: { marginBottom: 16 },
  progressLabel: {
    fontSize: 14,
    color: color.dark_green,
    fontFamily: FONTS.semiBold,
    marginBottom: 4,
  },
  labelHundred: {
    fontSize: 14,
    color: color.dark_green,
    fontFamily: FONTS.semiBold,
  },
  progressText: {
    fontSize: 12,
    color: color.dark_green,
    fontFamily: FONTS.regular,
    marginVertical: 8,
  },
  progressBarContainer: { width: "100%" },
  progressBar: {
    height: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: color.dark_green,
    borderRadius: 3,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: color.dark_green,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  streakIcon: { marginRight: 12 },
  streakContent: { flex: 1, alignItems: "center", justifyContent: "center" },
  streakLabel: {
    fontSize: 12,
    color: color.white,
    fontFamily: FONTS.black,
    marginBottom: 4,
  },
  streakValueContainer: { flexDirection: "column" },
  streakValue: { fontSize: 24, color: color.white, fontFamily: FONTS.bold },
  streakUnit: { fontSize: 12, color: color.white, fontFamily: FONTS.medium },
  sectionTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: color.black,
    marginBottom: 12,
  },
  excerciseTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: color.black,
    marginBottom: 12,
  },
});

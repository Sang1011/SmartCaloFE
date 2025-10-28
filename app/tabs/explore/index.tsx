import CurrentMenuCard from "@components/ui/currentMenuCard";
import PlanModal from "@components/ui/PlanModal";
import SCButton from "@components/ui/SCButton";
import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import { FontAwesome5 } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { fetchMenuByUserId } from "@features/menus";
import { fetchCurrentUserThunk, updateProfileThunk } from "@features/users";
import { useRoute } from "@react-navigation/native";
import { RootState } from "@redux";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { getUserStreakData, UserStreakData } from "@utils/firebaseRealTime";
import { navigateCustom } from "@utils/navigation";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  ActivityLevel,
  activityLevelMap,
  Gender,
  genderLabelMap,
  HealthGoal,
  UpdateProfileDto,
} from "../../../types/me";

export const healthGoalOptions = [
  {
    label: "Duy trì cân nặng và tăng cường dinh dưỡng",
    labelEN: "MaintainWeight",
    value: HealthGoal.MaintainWeight,
  },
  { label: "Giảm cân", labelEN: "LoseWeight", value: HealthGoal.LoseWeight },
  { label: "Tăng cân", labelEN: "GainWeight", value: HealthGoal.GainWeight },
  { label: "Tăng cơ", labelEN: "GainMuscle", value: HealthGoal.GainMuscle },
];


export default function ExploreScreen() {
  const route = useRoute();
  const dispatch = useAppDispatch();

  const { user, loading } = useAppSelector((state: RootState) => state.user);
  const { menuByUserId } = useAppSelector((state: RootState) => state.menu);
  const [hasCurrentMenu, setHasCurrentMenu] = useState<boolean>(false);
  const [userFromFB, setUserFromFB] = useState<UserStreakData | null>(null);

  // ✅ Modal state
  const [showPlanModal, setShowPlanModal] = useState<boolean>(false);
  const [isNewPlan, setIsNewPlan] = useState<boolean>(false);

  // ✅ Calculated values
  const [startDateFormatted, setStartDateFormatted] = useState<string>("");
  const [endDateFormatted, setEndDateFormatted] = useState<string>("");
  const [daysCompleted, setDaysCompleted] = useState<number>(1);
  const [totalDays, setTotalDays] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [isPlanCompleted, setIsPlanCompleted] = useState<boolean>(false);

  // 🔹 CONST ĐỂ CHECK UI CHÚC MỪNG
  const SHOW_CONGRATS_UI = isPlanCompleted;

  // 🔹 Chỉ fetch user từ backend 1 lần khi vào component
  useEffect(() => {
    dispatch(fetchCurrentUserThunk());
  }, [dispatch]);

  // 🔹 Khi Redux đã có user → kiểm tra / tạo user trong Firebase
  useEffect(() => {
    console.warn("User", user);
    console.warn("UserStats", user?.userStats);
    if (user?.id) {
      fetchUserFromFirebase(user.id);
      fetchCurrentMenu(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (menuByUserId) {
      setHasCurrentMenu(true);
    }
  }, [menuByUserId]);

  // ✅ Tính toán các giá trị khi có user và userFromFB
  useEffect(() => {
    if (user && userFromFB && userFromFB.firstLoginDate) {
      calculatePlanDetails();
    }
  }, [user, userFromFB]);

  const calculatePlanDetails = () => {
    if (!user || !userFromFB || !userFromFB.firstLoginDate) return;
  
    const firstLoginTimestamp = userFromFB.firstLoginDate;
    const targetMonths = user.targetMonths || 1;
  
    // 🔹 Normalize về 00:00:00 của ngày
    const startDate = normalizeDate(new Date(firstLoginTimestamp));
    const formattedStart = formatDate(startDate);
    setStartDateFormatted(formattedStart);
  
    // 🔹 Tính ngày kết thúc
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + targetMonths);
    const formattedEnd = formatDate(endDate);
    setEndDateFormatted(formattedEnd);
  
    // 🔹 Tổng số ngày trong kế hoạch
    const totalDaysInPlan = Math.floor(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    setTotalDays(totalDaysInPlan);
  
    // 🔹 Normalize today về 00:00:00
    const today = normalizeDate(new Date());
    
    // 🔹 Số ngày đã qua (từ startDate đến today)
    const daysElapsed = Math.floor(
      (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    // ✅ FIX: 
    // - Nếu cùng ngày (daysElapsed = 0) → completed = 1 (ngày đầu tiên)
    // - Nếu qua 1 ngày (daysElapsed = 1) → completed = 2 (ngày thứ 2)
    // - Không được vượt quá totalDaysInPlan
    const completed = Math.min(daysElapsed, totalDaysInPlan);
    setDaysCompleted(completed);
  
    // 🔹 Tính phần trăm tiến độ
    const percent =
      totalDaysInPlan > 0 ? Math.round((completed / totalDaysInPlan) * 100) : 0;
    setProgressPercent(Math.min(percent, 100));
  
    // 🔹 Kiểm tra kế hoạch đã hoàn thành chưa
    const isCompleted = today >= endDate;
    setIsPlanCompleted(isCompleted);
    
    console.log('📊 Plan calculation:', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      today: today.toISOString(),
      daysElapsed,
      completed,
      totalDaysInPlan,
      percent,
      'startDate normalized': startDate.getTime(),
      'today normalized': today.getTime(),
      'time diff (ms)': today.getTime() - startDate.getTime(),
    });
  };

  const normalizeDate = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  useEffect(() => {
    if (!user || !userFromFB) return;
  
    // Check mỗi phút xem đã qua ngày mới chưa
    const checkNewDay = setInterval(() => {
      const now = new Date();
      const lastCheck = new Date(userFromFB.lastActiveDate || 0);
      
      // Nếu ngày khác nhau → recalculate
      if (now.getDate() !== lastCheck.getDate() || 
          now.getMonth() !== lastCheck.getMonth() ||
          now.getFullYear() !== lastCheck.getFullYear()) {
        console.log('🌅 New day detected, recalculating...');
        calculatePlanDetails();
      }
    }, 60000); // Check mỗi 1 phút
  
    return () => clearInterval(checkNewDay);
  }, [user, userFromFB]);

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const fetchCurrentMenu = async (id: string) => {
    try {
      await dispatch(fetchMenuByUserId({ userId: id }));
    } catch (err) {
      console.error("❌ Error fetching current menu:", err);
    }
  };

  const fetchUserFromFirebase = async (id: string) => {
    try {
      const fbUser = await getUserStreakData(id);
      if (fbUser) {
        setUserFromFB(fbUser);
        console.log("✅ Firebase user loaded:", fbUser);
      }
    } catch (err) {
      console.error("❌ Error fetching Firebase user:", err);
    }
  };

  const handleUpdateUser = async (
    newWeight: number,
    newTargetWeight: number,
    newTargetMonths: number,
    newGoal: number
  ) => {
    if (!user) return;
    console.log("newGoal", newGoal);
    const objectSend: UpdateProfileDto = {
      name: user.name,
      age: user.age,
      height: user.userStats.height,
      startWeight: newWeight,
      weight: newWeight,
      targetWeight: newTargetWeight,
      targetMonths: newTargetMonths,
      goal: newGoal,
      gender: user.gender === genderLabelMap[0] ? Gender.Male : Gender.Female,
      activityLevel: user.activityLevel
        ? activityLevelMap[user.activityLevel]
        : ActivityLevel.Sedentary,
    };

    const result = await dispatch(updateProfileThunk(objectSend));
    if (updateProfileThunk.rejected.match(result)) {
      Alert.alert("Đã có lỗi xảy ra");
      navigateCustom("/login");
    } else {
      dispatch(fetchCurrentUserThunk());
      Alert.alert("Cập nhật kế hoạch thành công!");
    }
  };

  const handleRedirect = (url: string) => {
    if (route.name === url) return;
    navigateCustom(url);
  };

  const getNamePlan = () => {
    if (!user) return healthGoalOptions[0].label;

    const found = healthGoalOptions.find(
      (option) => option.labelEN === user?.userStats?.healthGoal?.toString()
    );

    return found ? found.label : healthGoalOptions[0].label;
  };

  // ✅ Open modal for editing plan
  const handleEditPlan = () => {
    setIsNewPlan(false);
    setShowPlanModal(true);
  };

  // ✅ Open modal for creating new plan
  const handleCreateNewPlan = () => {
    setIsNewPlan(true);
    setShowPlanModal(true);
  };

  // ✅ Render Congratulations UI
  const renderCongratsUI = () => (
    <View style={styles.congratsContainer}>
      <View style={styles.congratsContent}>
        <FontAwesome5 name="trophy" size={64} color={color.gold} />
        <Text style={styles.congratsTitle}>Chúc mừng!</Text>
        <Text style={styles.congratsMessage}>
          Bạn đã hoàn thành kế hoạch "{getNamePlan()}"
        </Text>
        <Text style={styles.congratsSubMessage}>
          Thời gian: {totalDays} ngày
        </Text>
        <Text style={styles.congratsSubMessage}>
          Số ngày kiên trì: {userFromFB?.currentStreak || 0} ngày liên tiếp 🔥
        </Text>

        <SCButton
          title="Tạo kế hoạch mới"
          bgColor={color.dark_green}
          color={color.white}
          borderRadius={20}
          width={200}
          height={45}
          fontSize={14}
          fontFamily={FONTS.semiBold}
          onPress={handleCreateNewPlan}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={color.dark_green} />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      ) : (
        <ScrollView style={styles.contentContainer}>
          {/* ✅ SHOW CONGRATS UI IF PLAN COMPLETED */}
          {SHOW_CONGRATS_UI ? (
            renderCongratsUI()
          ) : (
            <>
              {/* --- Current Plan --- */}
              <View style={styles.sectionPlan}>
                <View style={styles.sectionHeader}>
                  <Feather name="target" size={24} color={color.dark_green} />
                  <Text style={styles.sectionSubtitle}>
                    Kế hoạch đang thực hiện
                  </Text>
                </View>

                <Text style={styles.planTitle}>{getNamePlan()}</Text>

                <View style={styles.dateContainer}>
                  <View style={[styles.dateItem, { paddingLeft: 3 }]}>
                    <FontAwesome
                      style={{ paddingRight: 3 }}
                      name="calendar"
                      size={16}
                      color={color.dark_green}
                    />
                    <Text style={styles.dateText}>
                      {startDateFormatted} - {endDateFormatted}
                    </Text>
                  </View>
                  <View style={styles.dateItem}>
                    <Ionicons name="timer" size={20} color={color.dark_green} />
                    <Text style={styles.durationText}>
                      Thời gian {user?.targetMonths} tháng
                    </Text>
                  </View>
                </View>

                {/* Weight Info */}
                <View style={styles.weightContainer}>
                  <View style={styles.weightItem}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <AntDesign name="stock" size={16} color={color.white} />
                      <Text style={styles.weightLabel}>Ban đầu</Text>
                    </View>
                    <Text style={styles.weightValue}>
                      {user?.startWeight} Kg
                    </Text>
                  </View>
                  <View style={styles.weightItem}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <FontAwesome5
                        name="weight"
                        size={14}
                        color={color.white}
                      />
                      <Text style={styles.weightLabel}>Mục tiêu</Text>
                    </View>
                    <Text style={styles.weightValue}>
                      {user?.targetWeight} Kg
                    </Text>
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
                    <Text style={styles.labelHundred}>{progressPercent}%</Text>
                  </View>

                  <View style={styles.progressBarContainer}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${progressPercent}%` },
                        ]}
                      />
                    </View>
                  </View>
                  <Text style={styles.progressText}>
                    Ngày {daysCompleted} / {totalDays}
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
                          <FontAwesome5
                            name="fire"
                            size={24}
                            color={color.white}
                          />
                        </View>
                        <Text style={styles.streakValue}>
                          {userFromFB?.currentStreak || 0}
                        </Text>
                      </View>
                      <Text style={styles.streakUnit}>ngày liên tiếp</Text>
                    </View>
                  </View>
                </View>

                {/* ✅ Longest Streak */}
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Streak dài nhất</Text>
                    <Text style={styles.statValue}>
                      {userFromFB?.longestStreak || 0} ngày 🏆
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Tổng ngày hoạt động</Text>
                    <Text style={styles.statValue}>
                      {userFromFB?.totalActiveDays || 0} ngày
                    </Text>
                  </View>
                </View>

                {/* ✅ Edit Plan Button */}
                <SCButton
                  onPress={handleEditPlan}
                  variant="primary"
                  borderRadius={8}
                  height={60}
                  title="Chỉnh sửa kế hoạch"
                  style={{ marginTop: 8 }}
                />
              </View>

              {/* --- Current Menu Section --- */}
              {hasCurrentMenu && menuByUserId ? (
                <CurrentMenuCard
                  menuId={menuByUserId?.id}
                  title={menuByUserId?.menuName}
                  minCalorie={menuByUserId.dailyCaloriesMin}
                  maxCalorie={menuByUserId.dailyCaloriesMax}
                  image={menuByUserId.imageUrl}
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
            </>
          )}
        </ScrollView>
      )}

      {/* ✅ Plan Modal */}
      {user && (
        <PlanModal
          visible={showPlanModal}
          onClose={() => setShowPlanModal(false)}
          onSubmit={handleUpdateUser}
          isNewPlan={isNewPlan}
          currentWeight={user?.userStats?.weight || 0}
          currentTargetWeight={user?.targetWeight || 0}
          currentTargetMonths={user?.targetMonths || 1}
          currentGoal={user?.userStats?.healthGoal || HealthGoal.MaintainWeight}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.background },
  contentContainer: { flex: 1, paddingTop: 16, paddingHorizontal: 16 },

  // --- CONGRATS UI ---
  congratsContainer: {
    flex: 1,
    backgroundColor: color.white,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: color.gold,
    shadowColor: color.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  congratsContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
  },
  congratsTitle: {
    fontSize: 32,
    fontFamily: FONTS.bold,
    color: color.dark_green,
    marginTop: 16,
    marginBottom: 8,
  },
  congratsMessage: {
    fontSize: 18,
    fontFamily: FONTS.semiBold,
    color: color.dark_green,
    textAlign: "center",
    marginBottom: 8,
  },
  congratsSubMessage: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: color.dark_green,
    textAlign: "center",
    marginBottom: 4,
  },

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

  // ✅ Stats Row (Longest Streak + Total Active Days)
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 8,
  },
  statItem: {
    flex: 1,
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.dark_green,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 11,
    color: color.dark_green,
    fontFamily: FONTS.medium,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    color: color.dark_green,
    fontFamily: FONTS.bold,
  },
});

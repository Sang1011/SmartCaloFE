import SCDonutChart from "@components/ui/SCDonutChart";
import SCNutritionThisWeek from "@components/ui/SCNutritionThisWeek";
import SCProgressBar from "@components/ui/SCProgressBar";
import Color from "@constants/color";
import { FONTS } from "@constants/fonts";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getDailyLogThunk } from "@features/tracking";
import { fetchCurrentUserThunk } from "@features/users";
import { RootState } from "@redux";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { navigateCustom } from "@utils/navigation";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DefaultScreen() {
  const { user } = useAppSelector((state: RootState) => state.user);
  const { dailyLog, loading } = useAppSelector(
    (state: RootState) => state.tracking
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUserThunk());
    const today = new Date().toLocaleDateString("en-CA");
    console.log("TODAY:", today);
  
    dispatch(getDailyLogThunk({ date: today }));
  }, [dispatch]);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={[]}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Color.dark_green} />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          <View style={styles.layoutView}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={styles.headerTextName}>Hello, {user?.name}</Text>
                <Text style={styles.headerTextHour}>Thứ 3, 12 tháng 4</Text>
              </View>
              <Pressable
                style={styles.headerRight}
                onPress={() => navigateCustom("/chat")}
              >
                <Ionicons
                  name="chatbox-ellipses-sharp"
                  size={24}
                  color="black"
                />
              </Pressable>
            </View>

            {/* Body */}
            <View style={styles.bodyView}>
              <View style={styles.caloContainer}>
                {/* Tổng calo */}
                <View style={styles.caloView}>
                  <View style={styles.caloContent}>
                    <Text style={styles.caloTextView}>
                      {Math.round(dailyLog?.totalCaloriesTarget ?? 0) -
                        (dailyLog?.totalCaloriesConsumed ?? 0) || 1700}{" "}
                      calo
                    </Text>
                    <Text style={styles.caloDescription}>còn lại hôm nay</Text>
                  </View>

                  {dailyLog?.totalCaloriesConsumed !== undefined && (
                    <View style={styles.caloChart}>
                      <SCDonutChart
                        segments={[dailyLog?.totalCaloriesConsumed ?? 0]}
                        size={110}
                        strokeWidth={14}
                        maxValue={dailyLog?.totalCaloriesTarget ?? 2000}
                        centerText={`${Math.min(
                          Math.round(
                            ((dailyLog?.totalCaloriesConsumed ?? 0) /
                              (dailyLog?.totalCaloriesTarget || 1)) *
                              100
                          ),
                          100
                        )}%`}
                      />
                    </View>
                  )}
                </View>

                {/* Nutrition */}
                {dailyLog && (
                  <View style={styles.nutrions}>
                    <View style={styles.nutrionfield}>
                      <Text style={styles.nutritionValue}>
                        {dailyLog?.totalCarbsConsumed ?? 0}g
                      </Text>
                      <Text style={styles.nutritionText}>Carb</Text>
                      <View style={styles.progressBarContainer}>
                        <SCProgressBar
                          progress={dailyLog?.totalCarbsConsumed ?? 0}
                          maxProgress={dailyLog?.totalCarbsTarget ?? 0}
                          color={Color.progress_carb}
                        />
                      </View>
                    </View>

                    <View style={styles.nutrionfield}>
                      <Text style={styles.nutritionValue}>
                        {dailyLog?.totalProteinConsumed ?? 0}g
                      </Text>
                      <Text style={styles.nutritionText}>Protein</Text>
                      <View style={styles.progressBarContainer}>
                        <SCProgressBar
                          progress={dailyLog?.totalProteinConsumed ?? 0}
                          maxProgress={dailyLog?.totalProteinTarget ?? 0}
                          color={Color.progress_protein}
                        />
                      </View>
                    </View>

                    <View style={styles.nutrionfield}>
                      <Text style={styles.nutritionValue}>
                        {dailyLog?.totalFatConsumed ?? 0}g
                      </Text>
                      <Text style={styles.nutritionText}>Fat</Text>
                      <View style={styles.progressBarContainer}>
                        <SCProgressBar
                          progress={dailyLog?.totalFatConsumed ?? 0}
                          maxProgress={dailyLog?.totalFatTarget ?? 0}
                          color={Color.progress_fat}
                        />
                      </View>
                    </View>
                  </View>
                )}

                {/* This Week Section */}
                <View>
                  <SCNutritionThisWeek />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    backgroundColor: Color.background,
  },
  layoutView: {
    flex: 1,
    marginHorizontal: "auto",
    width: "92%",
    justifyContent: "center",
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Color.white,
  },
  loadingText: {
    marginTop: 12,
    color: Color.dark_green,
    fontFamily: FONTS.medium,
    fontSize: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTextName: {
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  headerTextHour: {
    fontSize: 12,
    fontFamily: FONTS.bold,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    backgroundColor: Color.white,
    borderRadius: 9999,
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  bodyView: {
    marginVertical: 16,
    flex: 1,
  },
  caloContainer: {
    flex: 1,
    gap: 8,
  },
  caloView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Color.white,
    borderRadius: 32,
    paddingVertical: 14,
    paddingHorizontal: 24,
    height: 135,
  },
  caloContent: {
    width: "60%",
  },
  caloTextView: {
    fontSize: 30,
    fontFamily: FONTS.bold,
  },
  caloDescription: {
    fontSize: 18,
    fontFamily: FONTS.medium,
  },
  caloChart: {
    width: "40%",
  },
  nutrions: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  nutrionfield: {
    flex: 1,
    backgroundColor: Color.white,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 10,
  },
  nutritionValue: {
    textAlign: "left",
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  nutritionText: {
    textAlign: "left",
    fontSize: 14,
    fontFamily: FONTS.medium,
  },
  progressBarContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

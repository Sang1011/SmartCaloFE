import SCDonutChart from "@components/ui/SCDonutChart";
import SCNutritionThisWeek from "@components/ui/SCNutritionThisWeek";
import SCProgressBar from "@components/ui/SCProgressBar";
import Color from "@constants/color";
import { FONTS } from "@constants/fonts";
import Ionicons from "@expo/vector-icons/Ionicons";
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
  const { user, loading } = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUserThunk());
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={[]}>
      {loading ? (
        // ✅ Hiển thị loading khi đang tải
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Color.dark_green} />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          <View style={styles.layoutView}>
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
            <View style={styles.bodyView}>
              <View style={styles.caloContainer}>
                <View style={styles.caloView}>
                  <View style={styles.caloContent}>
                    <Text style={styles.caloTextView}>1700 calo</Text>
                    <Text style={styles.caloDescription}>còn lại hôm nay</Text>
                  </View>
                  <View style={styles.caloChart}>
                    <SCDonutChart
                      segments={[300]}
                      size={110}
                      strokeWidth={14}
                      maxValue={2000}
                      centerText="15%"
                    />
                  </View>
                </View>
                <View style={styles.nutrions}>
                  <View style={styles.nutrionfield}>
                    <Text style={styles.nutritionValue}>300g</Text>
                    <Text style={styles.nutritionText}>Carb</Text>
                    <View style={styles.progressBarContainer}>
                      <SCProgressBar
                        progress={45}
                        color={Color.progress_carb}
                      />
                    </View>
                  </View>
                  <View style={styles.nutrionfield}>
                    <Text style={styles.nutritionValue}>50g</Text>
                    <Text style={styles.nutritionText}>Protein</Text>
                    <View style={styles.progressBarContainer}>
                      <SCProgressBar
                        progress={20}
                        color={Color.progress_protein}
                      />
                    </View>
                  </View>
                  <View style={styles.nutrionfield}>
                    <Text style={styles.nutritionValue}>400g</Text>
                    <Text style={styles.nutritionText}>Fat</Text>
                    <View style={styles.progressBarContainer}>
                      <SCProgressBar progress={60} />
                    </View>
                  </View>
                </View>
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
  badge: {
    position: "absolute",
    right: 13,
    top: 11,
    backgroundColor: "red",
    borderRadius: 4,
    width: 8,
    height: 8,
    justifyContent: "center",
    alignItems: "center",
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
  dailySection: {
    width: "100%",
    backgroundColor: Color.white,
    borderRadius: 16,
    padding: 12,
  },
  checklist: {},
  checklistTitle: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
  },
  checklistItems: {
    paddingVertical: 8,
  },
  warningText: {
    textAlign: "center",
    fontSize: 12,
    color: "red",
  },
  successText: {
    textAlign: "center",
    fontSize: 12,
    color: "green",
  },
});

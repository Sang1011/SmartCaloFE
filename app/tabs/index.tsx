import SCDonutChart from "@components/ui/SCDonutChart";
import SCNutritionThisWeek from "@components/ui/SCNutritionThisWeek";
import SCProgressBar from "@components/ui/SCProgressBar";
import { SCTask } from "@components/ui/SCTask";
import Color from "@constants/color";
import { FONTS, globalStyles } from "@constants/fonts";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
export default function DefaultScreen() {
  return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.layoutView}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTextName}>Hello, User</Text>
              <Text style={styles.headerTextHour}>Thứ 3, 12 tháng 4</Text>
            </View>
            <View style={styles.headerRight}>
              <Ionicons name="notifications-outline" size={24} color="black" />
              <View style={styles.badge}></View>
            </View>
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
                    <SCProgressBar progress={45} color={Color.progress_carb} />
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
              <View style={styles.dailySection}>
                <View style={styles.checklist}>
                  <Text style={styles.checklistTitle}>Nhiệm vụ hàng ngày</Text>
                  <View style={styles.checklistItems}>
                    <SCTask
                      title="Kiểm tra cân nặng trước khi ăn sáng"
                      completed={false}
                    />
                    <SCTask title="Uống 1 ly nước" completed={false} />
                    <SCTask title="Ăn theo thực đơn & Ghi lại nhật ký ăn uống" completed={true} />
                    <SCTask title="Không ăn sau 20h" completed={true} />
                    <SCTask title="Không ăn đồ ngoài thực đơn" completed={true} />
                    <SCTask title="Thực hiện các bài tập hôm nay" completed={true} />
                  </View>
                </View>
              </View>
              <Text style={[globalStyles.medium, styles.warningText]}>Bạn chưa hoàn thành tất cả nhiệm vụ hôm nay!</Text>
              <View> 
                  <SCNutritionThisWeek/>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
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
    marginTop: 20
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
  }
});

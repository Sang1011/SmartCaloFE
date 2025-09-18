import BottomTabs from "@components/ui/bottomTabs";
import { TabType } from "../../types/tabs";
import {
  Button,
  ProgressBarAndroidComponent,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Color from "@constants/color";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FONTS, globalStyles } from "@constants/fonts";
import SCDonutChart from "@components/ui/SCDonutChart";
export default function DefaultScreen() {
  return (
    <SafeAreaView style={styles.container}>
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
                  {/* progress bar */}
                </View>
                <View style={styles.nutrionfield}>
                  <Text style={styles.nutritionValue}>50g</Text>
                  <Text style={styles.nutritionText}>Protein</Text>
                  {/* progress bar */}
                </View>
                <View style={styles.nutrionfield}>
                  <Text style={styles.nutritionValue}>400g</Text>
                  <Text style={styles.nutritionText}>Fat</Text>
                  {/* progress bar */}
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  layoutView: {
    flex: 1,
    marginHorizontal: "auto",
    width: "92%",
    justifyContent: "center",
    marginTop: 60,
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
    paddingHorizontal: 10
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
  progressBar: {
    width: "100%",
    height: 8,
    borderRadius: 4,
    backgroundColor: Color.dark_green,
  },
});

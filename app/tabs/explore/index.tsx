import SCButton from "@components/ui/SCButton";
import CurrentExerciseCard from "@components/ui/currentExcerciseCard";
import CurrentMenuCard from "@components/ui/currentMenuCard";
import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import { FontAwesome5 } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRoute } from "@react-navigation/native";
import { navigateCustom } from "@utils/navigation";
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

const recipeData = {
  id: 1,
  title:
    "Eat Clean dành cho dân văn phòng bận rộn cùng SmartCalo (1600-1800 calo)",
  calorie: "1600-1800 cal/ ngày",
  meals: "4 bữa / ngày",
  duration: "7 ngày",
  image: require("../../../assets/images/recipe_1.png"),
};


type excerciseType = {
  title: string,
  day: string,
  info: string,
  progress: {
    current: number,
    total: number,
  }
  image?: string
}
const excerciseData: excerciseType = {
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
}

export default function ExploreScreen() {
  const route = useRoute();

  const handleRedirect = (url: string) => {
    if (route.name === url) return;
    navigateCustom(url);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        {/* Current Plan Section */}
        <View style={styles.sectionPlan}>
          <View style={styles.sectionHeader}>
            <Feather name="target" size={24} color={color.dark_green} />
            <Text style={styles.sectionSubtitle}>Kế hoạch đang thực hiện</Text>
          </View>
          <Text style={styles.planTitle}>
            {planData.title}
          </Text>

          <View style={styles.dateContainer}>
            <View style={[styles.dateItem, { paddingLeft: 3 }]}>
              <FontAwesome
                style={{ paddingRight: 3 }}
                name="calendar"
                size={16}
                color={color.dark_green}
              />
              <Text style={styles.dateText}>{planData.startDate} - {planData.endDate}</Text>
            </View>
            <View style={styles.dateItem}>
              <Ionicons name="timer" size={20} color={color.dark_green} />
              <Text style={styles.durationText}>Thời gian {planData.duration}</Text>
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
              <Text style={styles.weightValue}>{planData.initialWeight}</Text>
            </View>
            <View style={styles.weightItem}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <FontAwesome5 name="weight" size={14} color={color.white} />
                <Text style={styles.weightLabel}>Mục tiêu</Text>
              </View>
              <Text style={styles.weightValue}>{planData.targetWeight}</Text>
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
              <Text style={styles.labelHundred}>{planData.progressPercent}%</Text>
            </View>

            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${planData.progressPercent}%` }]} />
              </View>
            </View>
            <Text style={styles.progressText}>Ngày {planData.daysCompleted} / {planData.totalDays}</Text>
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
                  <Text style={styles.streakValue}>{planData.streakDays}</Text>
                </View>
                <Text style={styles.streakUnit}>ngày liên tiếp</Text>
              </View>
            </View>
          </View>

          <SCButton
            title="Thay đổi kế hoạch"
            variant="outline"
            iconPos="left"
            icon={
              <MaterialIcons
                name="change-circle"
                size={24}
                color={color.dark_green}
              />
            }
            onPress={() => {}}
          />
        </View>

        <CurrentMenuCard
          title={recipeData.title}
          calorie={recipeData.calorie}
          meals={recipeData.meals}
          duration={recipeData.duration}
          image={recipeData.image}
          onChange={() => console.log("Thay đổi thực đơn")}
        />

        <Text style={styles.excerciseTitle}>Thể dục</Text>
        <CurrentExerciseCard
          title={excerciseData.title}
          day={excerciseData.day}
          info={excerciseData.info}
          progress={excerciseData.progress}
          image={excerciseData.image}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
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
    justifyContent: "flex-start",
  },
  section: {
    backgroundColor: color.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: color.dark_green,
    fontFamily: FONTS.bold,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: color.dark_green,
    fontFamily: FONTS.semiBold,
    marginBottom: 12,
  },
  dateContainer: {
    marginBottom: 16,
  },
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
  weightLabel: {
    fontSize: 12,
    color: color.white,
    fontFamily: FONTS.regular,
  },
  weightValue: {
    paddingTop: 4,
    fontSize: 20,
    color: color.white,
    fontFamily: FONTS.semiBold,
  },
  progressSection: {
    marginBottom: 16,
  },
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
  progressBarContainer: {
    width: "100%",
  },
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
  streakIcon: {
    marginRight: 12,
  },
  streakContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  streakLabel: {
    fontSize: 12,
    color: color.white,
    fontFamily: FONTS.black,
    marginBottom: 4,
  },
  streakValueContainer: {
    flexDirection: "column",
  },
  streakValue: {
    fontSize: 24,
    color: color.white,
    fontFamily: FONTS.bold,
  },
  streakUnit: {
    fontSize: 12,
    color: color.white,
    fontFamily: FONTS.medium,
  },
  changePlanButton: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  changePlanText: {
    fontSize: 14,
    color: color.black,
    fontFamily: FONTS.semiBold,
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: color.black,
    fontFamily: FONTS.semiBold,
  },
  changeMenuText: {
    fontSize: 14,
    color: color.dark_green,
    fontFamily: FONTS.regular,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: color.black,
    fontFamily: FONTS.semiBold,
    marginBottom: 12,
  },
  excerciseTitle: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    color: color.black,
    marginBottom: 12,
  },
  continueButton: {
    backgroundColor: color.dark_green,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: color.white,
    fontFamily: FONTS.semiBold,
  },
});

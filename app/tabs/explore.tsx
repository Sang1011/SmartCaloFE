import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ProgressBarAndroid } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.mainTitle}>Khám phá</Text>
      </View>

      <ScrollView style={styles.contentContainer}>
        {/* Tab Section */}
        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Text style={[styles.tabText, styles.activeTabText]}>Kế hoạch</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Gợi ý sản phẩm</Text>
          </TouchableOpacity>
        </View>

        {/* Current Plan Section */}
        <View style={styles.section}>
          <Text style={styles.sectionSubtitle}>Kế hoạch đang thực hiện</Text>
          <Text style={styles.planTitle}>Giảm cân và tăng cường dinh dưỡng</Text>
          
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>04/06/2025 - 04/09/2025</Text>
            <Text style={styles.durationText}>Thời gian 3 tháng</Text>
          </View>

          {/* Weight Info */}
          <View style={styles.weightContainer}>
            <View style={styles.weightItem}>
              <Text style={styles.weightLabel}>Ban đầu</Text>
              <Text style={styles.weightValue}>65 kg</Text>
            </View>
            <View style={styles.weightItem}>
              <Text style={styles.weightLabel}>Mục tiêu</Text>
              <Text style={styles.weightValue}>55 kg</Text>
            </View>
          </View>

          {/* Progress Section */}
          <View style={styles.progressSection}>
            <Text style={styles.progressLabel}>Tiến độ</Text>
            <Text style={styles.progressText}>Ngày 30 / 92</Text>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '32.6%' }]} />
              </View>
            </View>
          </View>

          {/* Streak Section */}
          <View style={styles.streakContainer}>
            <View style={styles.streakIcon}>
              <FontAwesome5 name="fire" size={24} color="#FF6B35" />
            </View>
            <View style={styles.streakContent}>
              <Text style={styles.streakLabel}>Số ngày đã kiên trì</Text>
              <View style={styles.streakValueContainer}>
                <Text style={styles.streakValue}>30</Text>
                <Text style={styles.streakUnit}>ngày liên tiếp</Text>
              </View>
            </View>
          </View>

          {/* Change Plan Button */}
          <TouchableOpacity style={styles.changePlanButton}>
            <Text style={styles.changePlanText}>Thay đổi kế hoạch</Text>
          </TouchableOpacity>
        </View>

        {/* Current Menu Section */}
        <View style={styles.section}>
          <View style={styles.menuHeader}>
            <Text style={styles.menuTitle}>Thực đơn đang áp dụng</Text>
            <TouchableOpacity>
              <Text style={styles.changeMenuText}>Thay đổi</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.menuCard}>
            <Text style={styles.menuCardTitle}>Eat Clean dành cho dân văn phòng bận rộn cùng Wao</Text>
            <Text style={styles.menuCardCalories}>1600 - 1800 calo</Text>
            <View style={styles.menuDetails}>
              <Text style={styles.menuDetail}>4 bữa/ngày</Text>
              <Text style={styles.menuDetail}>7 ngày</Text>
            </View>
          </View>
        </View>

        {/* Exercise Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thể dục</Text>
          <Text style={styles.exerciseTitle}>XÂY DỰNG CƠ THỂ MẠNH MẼ & SĂN CHẮC</Text>
          
          <View style={styles.exerciseProgress}>
            <Text style={styles.exerciseDay}>NGÀY 6</Text>
            <Text style={styles.exerciseInfo}>13 phút - 10 bài tập</Text>
            <Text style={styles.exerciseProgressText}>6 / 30 ngày</Text>
            
            <View style={styles.exerciseProgressBarContainer}>
              <View style={styles.exerciseProgressBar}>
                <View style={[styles.exerciseProgressFill, { width: '20%' }]} />
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.continueButton}>
            <Text style={styles.continueButtonText}>Tiếp tục</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
  },
  headerContainer: {
    width: "100%",
    marginBottom: 20,
    height: 70,
    backgroundColor: color.white,
    borderBottomColor: color.border,
    borderBottomWidth: 1,
    justifyContent: 'center',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    fontFamily: FONTS.semiBold,
    textAlign: "center",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: color.white,
    borderRadius: 12,
    marginBottom: 16,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: color.dark_green,
  },
  tabText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#666',
  },
  activeTabText: {
    color: color.white,
    fontFamily: FONTS.semiBold,
  },
  section: {
    backgroundColor: color.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    fontFamily: FONTS.regular,
    marginBottom: 8,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: FONTS.semiBold,
    marginBottom: 12,
  },
  dateContainer: {
    marginBottom: 16,
  },
  dateText: {
    fontSize: 14,
    color: '#000',
    fontFamily: FONTS.regular,
    marginBottom: 4,
  },
  durationText: {
    fontSize: 12,
    color: '#666',
    fontFamily: FONTS.regular,
  },
  weightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  weightItem: {
    flex: 1,
  },
  weightLabel: {
    fontSize: 12,
    color: '#666',
    fontFamily: FONTS.regular,
    marginBottom: 4,
  },
  weightValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    fontFamily: FONTS.semiBold,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 12,
    color: '#666',
    fontFamily: FONTS.regular,
    marginBottom: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#000',
    fontFamily: FONTS.regular,
    marginBottom: 8,
  },
  progressBarContainer: {
    width: '100%',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: color.dark_green,
    borderRadius: 3,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9F2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  streakIcon: {
    marginRight: 12,
  },
  streakContent: {
    flex: 1,
  },
  streakLabel: {
    fontSize: 12,
    color: '#666',
    fontFamily: FONTS.regular,
    marginBottom: 4,
  },
  streakValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  streakValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B35',
    fontFamily: FONTS.semiBold,
    marginRight: 4,
  },
  streakUnit: {
    fontSize: 12,
    color: '#666',
    fontFamily: FONTS.regular,
  },
  changePlanButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  changePlanText: {
    fontSize: 14,
    color: '#000',
    fontFamily: FONTS.semiBold,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    fontFamily: FONTS.semiBold,
  },
  changeMenuText: {
    fontSize: 14,
    color: color.dark_green,
    fontFamily: FONTS.regular,
  },
  menuCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  menuCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    fontFamily: FONTS.semiBold,
    marginBottom: 4,
  },
  menuCardCalories: {
    fontSize: 12,
    color: '#666',
    fontFamily: FONTS.regular,
    marginBottom: 8,
  },
  menuDetails: {
    flexDirection: 'row',
  },
  menuDetail: {
    fontSize: 12,
    color: '#666',
    fontFamily: FONTS.regular,
    marginRight: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    fontFamily: FONTS.semiBold,
    marginBottom: 12,
  },
  exerciseTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    fontFamily: FONTS.semiBold,
    marginBottom: 12,
    textAlign: 'center',
  },
  exerciseProgress: {
    alignItems: 'center',
    marginBottom: 16,
  },
  exerciseDay: {
    fontSize: 16,
    fontWeight: 'bold',
    color: color.dark_green,
    fontFamily: FONTS.semiBold,
    marginBottom: 4,
  },
  exerciseInfo: {
    fontSize: 12,
    color: '#666',
    fontFamily: FONTS.regular,
    marginBottom: 4,
  },
  exerciseProgressText: {
    fontSize: 12,
    color: '#000',
    fontFamily: FONTS.regular,
    marginBottom: 8,
  },
  exerciseProgressBarContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  exerciseProgressBar: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  exerciseProgressFill: {
    height: '100%',
    backgroundColor: color.dark_green,
    borderRadius: 2,
  },
  continueButton: {
    backgroundColor: color.dark_green,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: color.white,
    fontFamily: FONTS.semiBold,
  },
});
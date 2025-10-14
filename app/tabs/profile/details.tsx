import SCButton from "@components/ui/SCButton";
import color from "@constants/color";
import { FONTS, globalStyles } from "@constants/fonts";
import { RootState } from "@redux";
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useSelector } from 'react-redux';

export default function ProfileDetailsScreen() {
  const { user } = useSelector(
    (state: RootState) => state.auth
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Thông tin cá nhân */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={[styles.label, globalStyles.regular]}>
              Tên của bạn
            </Text>
            <Text style={[styles.value, globalStyles.medium]}>
              {user?.name || "Chưa có thông tin"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, globalStyles.regular]}>Email</Text>
            <Text style={[styles.value, globalStyles.medium]}>
              {user?.email || "Chưa có thông tin"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, globalStyles.regular]}>Giới tính</Text>
            <Text style={[styles.value, globalStyles.medium]}>
              {user?.gender || "Chưa có thông tin"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, globalStyles.regular]}>Chiều cao</Text>
            <Text style={[styles.value, globalStyles.medium]}>
              {user?.height || "Chưa có thông tin"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, globalStyles.regular]}>Ngày sinh</Text>
            <Text style={[styles.value, globalStyles.medium]}>
              {user?.birthdate || "Chưa có thông tin"}
            </Text>
          </View>
        </View>

        <SCButton
          title="Lưu thay đổi"
          onPress={() => {}}
          fontFamily={FONTS.semiBold}
        />

        {/* Lượng Calo mục tiêu */}
        <Text style={[styles.sectionTitle, globalStyles.semiBold]}>
          Lượng Calo mục tiêu
        </Text>
        <View style={styles.targetBox}>
          <View style={styles.targetItem}>
            <Text style={[styles.targetLabel, globalStyles.regular]}>
              Mục tiêu
            </Text>
            <Text style={[styles.targetValue, globalStyles.bold]}>2,321</Text>
            <Text style={[styles.unit, globalStyles.light]}>calo / ngày</Text>
          </View>
          <View style={styles.targetItem}>
            <Text style={[styles.targetLabel, globalStyles.regular]}>
              Mục tiêu tuần này
            </Text>
            <Text style={[styles.targetValue, globalStyles.bold]}>16,247</Text>
            <Text style={[styles.unit, globalStyles.light]}>calo / tuần</Text>
          </View>
        </View>
      </View>
      {/* Chi tiết tính toán */}
      <View style={styles.calcContainer}>
        <Text style={[styles.sectionTitleCal, globalStyles.semiBold]}>
          Chi tiết tính toán
        </Text>
        <View style={styles.calcBox}>
          <View style={[styles.calcItem, { backgroundColor: "#EAF4FF" }]}>
            <Text style={[styles.calcTitle, globalStyles.medium]}>
              Tỉ lệ chuyển hóa cơ bản (BMR)
            </Text>
            <Text style={[styles.calcValue, globalStyles.bold]}>
              2,088 calo / ngày
            </Text>
            <Text style={[styles.calcDesc, globalStyles.light]}>
              Năng lượng cần thiết
            </Text>
          </View>
          <View style={[styles.calcItem, { backgroundColor: "#E8F9F1" }]}>
            <Text style={[styles.calcTitle, globalStyles.medium]}>
              Tổng năng lượng tiêu hao (TDEE)
            </Text>
            <Text style={[styles.calcValue, globalStyles.bold]}>
              2,871 calo / ngày
            </Text>
            <Text style={[styles.calcDesc, globalStyles.light]}>
              Bao gồm hoạt động hằng ngày
            </Text>
          </View>
        </View>

        <View style={styles.groupButton}>
          <SCButton
            variant="outline"
            title="Điều chỉnh mục tiêu"
            onPress={() => {}}
            fontFamily={FONTS.semiBold}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
  },
  innerContainer: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: color.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: color.black,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  calcContainer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: color.white,
    padding: 16,
  },
  sectionTitleCal: {
    marginVertical: 8,
    fontSize: 16,
  },
  sectionTitle: {
    marginTop: 20,
    fontSize: 16,
    marginBottom: 8,
    color: color.black,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  label: {
    fontSize: 14,
    color: color.grey,
  },
  value: {
    fontSize: 14,
    color: color.black,
  },
  saveBtn: {
    backgroundColor: color.dark_green,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  saveBtnText: {
    color: color.white,
    fontSize: 15,
  },
  targetBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: color.white,
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  targetItem: {
    alignItems: "center",
    flex: 1,
  },
  targetLabel: {
    fontSize: 13,
    color: color.grey,
    marginBottom: 4,
  },
  targetValue: {
    fontSize: 18,
    color: color.black,
  },
  unit: {
    fontSize: 12,
    color: color.grey,
  },
  calcBox: {
    marginVertical: 8,
  },
  calcItem: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  calcTitle: {
    fontSize: 14,
    color: color.black,
  },
  calcValue: {
    fontSize: 16,
    marginVertical: 4,
    color: color.black,
  },
  calcDesc: {
    fontSize: 12,
    color: color.grey,
  },
  groupButton: {
    display: "flex",
    gap: 6
  }
});

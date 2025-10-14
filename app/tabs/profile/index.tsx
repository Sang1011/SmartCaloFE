import { HAS_LOGGED_IN } from "@constants/app";
import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import { useAuth } from "@contexts/AuthContext";
import { Feather, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { navigateCustom } from "@utils/navigation";
import { Link } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const { logout } = useAuth();
  const handleLogout = async () => {
    try {
      await logout();
      console.log('Đăng xuất thành công');
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    }
  };

  return (
    <View style={styles.container}>

      <ScrollView style={styles.contentContainer}>
        {/* User Info Section */}
        <View style={styles.userSection}>
          <Link href="/tabs/profile/details" style={styles.detailText}>Xem chi tiết {">"}</Link>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>H</Text>
          </View>
          <Text style={styles.userName}>hello</Text>
        </View>

        {/* Mục tiêu Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MỤC TIÊU</Text>
          
          <View style={styles.goalItem}>
            <View style={styles.goalIcon}>
              <FontAwesome5 name="weight" size={20} color={color.icon} />
            </View>
            <View style={styles.goalContent}>
              <Text style={styles.goalLabel}>Cân nặng ban đầu</Text>
              <Text style={styles.goalValue}>100 kg</Text>
            </View>
          </View>

          <View style={styles.goalItem}>
            <View style={styles.goalIcon}>
              <FontAwesome5 name="flag" size={20} color={color.icon} />
            </View>
            <View style={styles.goalContent}>
              <Text style={styles.goalLabel}>Cân nặng mục tiêu</Text>
              <Text style={styles.goalValue}>85 kg</Text>
            </View>
          </View>
        </View>

        {/* Pháp lý Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PHÁP LÝ</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="document-text-outline" size={20} color={color.icon} />
            </View>
            <Text style={styles.menuText}>Chính sách quyền riêng tư</Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color={color.icon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="shield-checkmark-outline" size={20} color={color.icon} />
            </View>
            <Text style={styles.menuText}>Điều khoản sử dụng</Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color={color.icon} />
          </TouchableOpacity>
        </View>

        {/* Tài khoản Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TÀI KHOẢN</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Feather name="trash-2" size={20} color={color.icon} />
            </View>
            <Text style={styles.menuText}>Xóa dữ liệu và tài khoản</Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color={color.icon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => {
            console.log('Đăng xuất');
            handleLogout();
            navigateCustom("/login", { flagKey: HAS_LOGGED_IN, value: false });
          }}>
            <View style={styles.menuIcon}>
              <MaterialIcons name="logout" size={20} color={color.icon} />
            </View>
            <Text style={styles.menuText}>Đăng xuất</Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color={color.icon} />
          </TouchableOpacity>
        </View>

        {/* Nâng cấp tài khoản Button */}
        <TouchableOpacity style={styles.upgradeButton} onPress={() => navigateCustom("/subscription")}>
          <MaterialIcons name="star" size={24} color="#fff" />
          <Text style={styles.upgradeText}>Nâng cấp tài khoản</Text>
        </TouchableOpacity>
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
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  userSection: {
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    fontFamily: FONTS.medium,
    position: 'absolute',
    right: 16,
    top: 5,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: color.dark_green,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: color.white,
    fontFamily: FONTS.semiBold,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: color.dark_green,
    marginBottom: 16,
    fontFamily: FONTS.semiBold,
    textTransform: 'uppercase',
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  goalContent: {
    flex: 1,
  },
  goalLabel: {
    fontSize: 14,
    color: '#666',
    fontFamily: FONTS.regular,
    marginBottom: 4,
  },
  goalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    fontFamily: FONTS.semiBold,
  },
  trackingButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuIcon: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    fontFamily: FONTS.regular,
  },
  upgradeButton: {
    flexDirection: 'row',
    backgroundColor: color.dark_green,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  upgradeText: {
    fontSize: 16,
    fontWeight: '600',
    color: color.white,
    fontFamily: FONTS.semiBold,
    marginLeft: 8,
  },
});
import { HAS_LOGGED_IN } from "@constants/app";
import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import { useAuth } from "@contexts/AuthContext";
import {
  FontAwesome5,
  Ionicons,
  MaterialIcons
} from "@expo/vector-icons";
import { fetchCurrentUserThunk } from "@features/users";
import { RootState } from "@redux";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { navigateCustom } from "@utils/navigation";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function ProfileScreen() {
  const { logout } = useAuth();

  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const { user } = useAppSelector((state: RootState) => state.user);

  const handleLogout = async () => {
    try {
      await logout();
      console.log("Đăng xuất thành công");
    } catch (error) {
      console.warn("Lỗi khi đăng xuất:", error);
    }
  };

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUserThunk());
    console.log(user);
  }, [user?.id]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        {/* User Info Section */}
        <View style={styles.userSection}>
          <Link href="/tabs/profile/details" style={styles.detailText}>
            Xem chi tiết {">"}
          </Link>

          {/* Avatar */}
          <View style={styles.avatarContainer}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{user?.name.charAt(0).toLocaleUpperCase()}</Text>
            )}
          </View>
          <Text style={styles.userName}>{user?.name || "hello"}</Text>
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
              <Text style={styles.goalValue}>{user?.startWeight} kg</Text>
            </View>
          </View>

          <View style={styles.goalItem}>
            <View style={styles.goalIcon}>
              <FontAwesome5 name="flag" size={20} color={color.icon} />
            </View>
            <View style={styles.goalContent}>
              <Text style={styles.goalLabel}>Cân nặng mục tiêu</Text>
              <Text style={styles.goalValue}>{user?.targetWeight} kg</Text>
            </View>
          </View>
        </View>

        {/* Pháp lý Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PHÁP LÝ</Text>

          <TouchableOpacity style={styles.menuItem} onPress={() => {
            navigateCustom("/privacy")
          }}>
            <View style={styles.menuIcon}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color={color.icon}
              />
            </View>
            <Text style={styles.menuText}>Chính sách quyền riêng tư</Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color={color.icon}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => {
            navigateCustom("/terms")
          }}>
            <View style={styles.menuIcon}>
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={color.icon}
              />
            </View>
            <Text style={styles.menuText}>Điều khoản sử dụng</Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color={color.icon}
            />
          </TouchableOpacity>
        </View>

        {/* Tài khoản Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TÀI KHOẢN</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateCustom("/tabs/profile/reviewApp")}
          >
            <View style={styles.menuIcon}>
              {/* Chọn icon phù hợp, ví dụ Star hoặc Edit */}
              <MaterialIcons name="star-outline" size={20} color={color.icon} />
            </View>
            <Text style={styles.menuText}>Đánh giá ứng dụng</Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color={color.icon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              console.log("Đăng xuất");
              handleLogout();
              navigateCustom("/login", {
                flagKey: HAS_LOGGED_IN,
                value: false,
              });
            }}
          >
            <View style={styles.menuIcon}>
              <MaterialIcons name="logout" size={20} color={color.icon} />
            </View>
            <Text style={styles.menuText}>Đăng xuất</Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color={color.icon}
            />
          </TouchableOpacity>
        </View>

        {/* Nâng cấp tài khoản */}
        <TouchableOpacity
          style={styles.upgradeButton}
          onPress={() => navigateCustom("/subscription")}
        >
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
    alignItems: "center",
    marginBottom: 24,
    position: "relative",
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    fontFamily: FONTS.medium,
    position: "absolute",
    right: 16,
    top: 5,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: color.dark_green,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    overflow: "hidden",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: color.white,
    fontFamily: FONTS.semiBold,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  changePhotoBtn: {
    marginVertical: 10,
  },
  changePhotoText: {
    fontSize: 14,
    color: color.dark_green,
    fontFamily: FONTS.medium,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    fontFamily: FONTS.semiBold,
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: color.dark_green,
    marginBottom: 16,
    fontFamily: FONTS.semiBold,
    textTransform: "uppercase",
  },
  goalItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  goalIcon: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  goalContent: {
    flex: 1,
  },
  goalLabel: {
    fontSize: 14,
    color: "#666",
    fontFamily: FONTS.regular,
    marginBottom: 4,
  },
  goalValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    fontFamily: FONTS.semiBold,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  menuIcon: {
    width: 24,
    alignItems: "center",
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    fontFamily: FONTS.regular,
  },
  upgradeButton: {
    flexDirection: "row",
    backgroundColor: color.dark_green,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  upgradeText: {
    fontSize: 16,
    fontWeight: "600",
    color: color.white,
    fontFamily: FONTS.semiBold,
    marginLeft: 8,
  },
});

import GenderPicker from "@components/ui/genderPicker";
import SCButton from "@components/ui/SCButton";
import color from "@constants/color";
import { FONTS, globalStyles } from "@constants/fonts";
import { useAuth } from "@contexts/AuthContext";
import { fetchCurrentUserThunk, updateProfileThunk } from "@features/users";
import { RootState } from "@redux";
import { useAppDispatch } from "@redux/hooks";
import { navigateCustom } from "@utils/navigation";
import React, { useEffect, useState } from "react";
import {
  Alert,
  LayoutAnimation,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import {
  ActivityLevel,
  activityLevelMap,
  Gender,
  HealthGoal,
  healthGoalMap,
  UpdateProfileDto,
  UserDTO,
} from "../../../types/me";

export default function ProfileDetailsScreen() {
  const { logout } = useAuth();
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();

  const [editableData, setEditableData] = useState({
    name: "",
    gender: 0,
    height: "",
    weight: "",
    age: "",
  });

  const [isChanged, setIsChanged] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleLoadUser = async () => {
    const result = await dispatch(fetchCurrentUserThunk());
    if (fetchCurrentUserThunk.rejected.match(result)) {
      await logout();
      navigateCustom("/login");
    }
  };

  useEffect(() => {
    handleLoadUser();
  }, [!user]);

  useEffect(() => {
    if (user) {
      setEditableData({
        name: user.name || "",
        gender: user.gender === "Female" ? Gender.Female : Gender.Male,
        height: user.userStats?.height?.toString() || "",
        weight: user.userStats?.weight?.toString() || "",
        age: user.age?.toString() || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const changed =
      editableData.name !== (user.name || "") ||
      editableData.gender !==
        (user.gender === "Female" ? Gender.Female : Gender.Male) ||
      editableData.height !== (user.userStats?.height?.toString() || "") ||
      editableData.weight !== (user.userStats?.weight?.toString() || "") ||
      editableData.age !== (user.age?.toString() || "");

    setIsChanged(changed);
  }, [editableData, user]);

  const handleChange = (field: string, value: any) => {
    setEditableData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEdit = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsEditing((prev) => !prev);
  };

  const handleUpdateProfile = async () => {
    if (user) {
      const objectSend: UpdateProfileDto = {
        name: editableData.name,
        age: Number(editableData.age),
        height: Number(editableData.height),
        weight: Number(editableData.weight),
        targetWeight: user.targetWeight,
        goal:
          healthGoalMap[user.userStats.healthGoal] ?? HealthGoal.MaintainWeight,
        gender: editableData.gender,
        activityLevel:
          activityLevelMap[user.activityLevel] ?? ActivityLevel.Sedentary,
      };
      console.log("objectSend", objectSend);
      const result = await dispatch(updateProfileThunk(objectSend));
      if (updateProfileThunk.fulfilled.match(result)) {
        const data = result.payload.userDto as UserDTO;
        setEditableData({
          name: data.name,
          age: data.age.toString(),
          gender: Number(data.gender) || Gender.Male,
          height: data.userStats.height.toString(),
          weight: data.userStats.weight.toString(),
        });
        Alert.alert("Cập nhật thông tin cá nhân thành công!");
      } else {
        Alert.alert("Lỗi khi cập nhật thông tin cá nhân");
      }
    }
    setIsChanged(false);
    setIsEditing(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Thông tin cá nhân */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={[styles.label, globalStyles.regular]}>
              Tên của bạn
            </Text>
            <TextInput
              editable={isEditing}
              style={[
                styles.valueInput,
                globalStyles.medium,
                isEditing && {
                  borderColor: color.dark_green,
                  backgroundColor: "#F4F9FF",
                },
                !isEditing && { color: color.grey, borderBottomWidth: 0 },
              ]}
              value={editableData.name}
              onChangeText={(text) => handleChange("name", text)}
              placeholder="Chưa có thông tin"
              placeholderTextColor={color.grey}
            />
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, globalStyles.regular]}>Email</Text>
            <Text style={[styles.value, globalStyles.medium]}>
              {user?.email || "Chưa có thông tin"}
            </Text>
          </View>

          {/* 🔹 Giới tính */}
          <View style={styles.row}>
            <Text style={[styles.label, globalStyles.regular]}>Giới tính</Text>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <GenderPicker
                value={editableData.gender}
                onSelect={(gender) => handleChange("gender", gender)}
                disabled={!isEditing}
                isEditing={isEditing}
              />
            </View>
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, globalStyles.regular]}>Chiều cao</Text>
            <TextInput
              editable={isEditing}
              style={[
                styles.valueInput,
                globalStyles.medium,
                isEditing && {
                  borderColor: color.dark_green,
                  backgroundColor: "#F4F9FF",
                },
                !isEditing && { color: color.grey, borderBottomWidth: 0 },
              ]}
              value={editableData.height}
              onChangeText={(text) => handleChange("height", text)}
              keyboardType="numeric"
              placeholder="Chưa có thông tin"
              placeholderTextColor={color.grey}
            />
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, globalStyles.regular]}>Cân nặng</Text>
            <TextInput
              editable={isEditing}
              style={[
                styles.valueInput,
                globalStyles.medium,
                isEditing && {
                  borderColor: color.dark_green,
                  backgroundColor: "#F4F9FF",
                },
                !isEditing && { color: color.grey, borderBottomWidth: 0 },
              ]}
              value={editableData.weight}
              onChangeText={(text) => handleChange("weight", text)}
              keyboardType="numeric"
              placeholder="Chưa có thông tin"
              placeholderTextColor={color.grey}
            />
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, globalStyles.regular]}>Tuổi</Text>
            <TextInput
              editable={isEditing}
              style={[
                styles.valueInput,
                globalStyles.medium,
                isEditing && {
                  borderColor: color.dark_green,
                  backgroundColor: "#F4F9FF",
                },
                !isEditing && { color: color.grey, borderBottomWidth: 0 },
              ]}
              value={editableData.age}
              onChangeText={(text) => handleChange("age", text)}
              keyboardType="numeric"
              placeholder="Chưa có thông tin"
              placeholderTextColor={color.grey}
            />
          </View>
        </View>

        {isEditing && isChanged && (
          <SCButton
            title="Hủy thay đổi"
            variant="outline"
            bgColor={color.white}
            onPress={() => {
              // Reset editableData về dữ liệu user hiện tại
              if (user) {
                setEditableData({
                  name: user.name || "",
                  gender:
                    user.gender === "Female" ? Gender.Female : Gender.Male,
                  height: user.userStats?.height?.toString() || "",
                  weight: user.userStats?.weight?.toString() || "",
                  age: user.age?.toString() || "",
                });
              }
              setIsChanged(false);
              setIsEditing(false);
            }}
            fontFamily={FONTS.semiBold}
            style={{ marginBottom: 8 }}
          />
        )}

        <SCButton
          title={isEditing ? "Lưu thay đổi" : "Chỉnh sửa"}
          onPress={() => {
            if (isEditing) {
              if (isChanged) handleUpdateProfile();
              else setIsEditing(false);
            } else {
              toggleEdit();
            }
          }}
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
            <Text style={[styles.targetValue, globalStyles.bold]}>
              {user?.dailyCaloGoal !== undefined
                ? Math.ceil(user.dailyCaloGoal).toLocaleString()
                : "—"}
            </Text>
            <Text style={[styles.unit, globalStyles.light]}>calo / ngày</Text>
          </View>
          <View style={styles.targetItem}>
            <Text style={[styles.targetLabel, globalStyles.regular]}>
              Mục tiêu tuần này
            </Text>
            <Text style={[styles.targetValue, globalStyles.bold]}>
              {user?.dailyCaloGoal !== undefined
                ? Math.ceil(user.dailyCaloGoal * 7).toLocaleString()
                : "—"}
            </Text>
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
              {user?.userStats.bmr.toLocaleString()} / ngày
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
              {user?.userStats.tdee.toLocaleString()} calo / ngày
            </Text>
            <Text style={[styles.calcDesc, globalStyles.light]}>
              Bao gồm hoạt động hằng ngày
            </Text>
          </View>
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
  },
  label: {
    fontSize: 14,
    color: color.grey,
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: color.black,
    flex: 1,
    textAlign: "right",
  },
  valueInput: {
    fontSize: 14,
    color: color.black,
    textAlign: "right",
    flex: 1,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
    paddingVertical: 2,
  },
  sectionTitle: {
    marginTop: 20,
    fontSize: 16,
    marginBottom: 8,
    color: color.black,
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
});

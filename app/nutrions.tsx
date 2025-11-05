import ButtonGoBack from "@components/ui/buttonGoBack";
import NutritionSummary from "@components/ui/NutrionSummary";
import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import { clearSelectedDish, fetchDishById } from "@features/dishes";
import { RootState } from "@redux";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { navigateCustom } from "@utils/navigation";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NutrionScreen() {
  const { id } = useLocalSearchParams();
  const { selectedDish, loading } = useAppSelector(
    (state: RootState) => state.dish
  );
  const dispatch = useAppDispatch();
  const [dishId, setDishId] = useState<string>("");

  // 🧭 Lấy ID từ params và fetch món ăn
  useEffect(() => {
    const extractedId = Array.isArray(id) ? id[0] : id;
    if (extractedId && typeof extractedId === "string") {
      setDishId(extractedId);
      dispatch(fetchDishById(extractedId));
    }

    return () => {
      dispatch(clearSelectedDish());
    };
  }, [id, dispatch]);

  // ⏳ Loading
  if (loading && !selectedDish) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text
          style={{
            fontSize: 24,
            fontFamily: FONTS.bold,
            color: color.dark_green,
          }}
        >
          LOADING...
        </Text>
        <ActivityIndicator size="large" color={color.dark_green} />
      </View>
    );
  }

  // ❌ Không có món
  if (!selectedDish) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 50 }}>
          Không tìm thấy món ăn.
        </Text>
      </SafeAreaView>
    );
  }

  // 🧑‍⚕️ Dữ liệu user (tạm hardcode hoặc lấy từ Redux user slice)
  const userProfile = {
    tdee: 2200,
    gender: "female" as const,
    age: 22,
    goal: "loseWeight" as const,
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.gobackButton}>
            <ButtonGoBack
              handleLogic={() =>
                navigateCustom("/dishes", {
                  params: { id: dishId },
                })
              }
            />
          </View>

          <View style={styles.imageContainer}>
            {selectedDish ? (
              <Image src={selectedDish.imageUrl} style={styles.image} />
            ) : (
              <Image
                source={require("@assets/images/com-tam.png")}
                style={styles.image}
              />
            )}
          </View>
        </View>

        {/* Nội dung */}
        <View style={styles.bodyContainer}>
          <Text style={styles.title}>{selectedDish.name}</Text>

          {/* Gọi component tổng quan dinh dưỡng */}
          <NutritionSummary
            selectedDish={selectedDish}
            userProfile={userProfile}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.white },
  header: {
    backgroundColor: color.background_dish,
    height: 270,
    justifyContent: "center",
    alignItems: "center",
  },
  gobackButton: { position: "absolute", top: 30, left: 15 },
  imageContainer: {
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  image: { width: 200, height: 200, borderRadius: 100, resizeMode: "cover", marginBottom: 15 },
  bodyContainer: {
    backgroundColor: color.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -40,
    padding: 20,
  },
  title: {
    fontFamily: FONTS.semiBold,
    fontSize: 22,
    marginBottom: 15,
    textAlign: "center",
  },
});

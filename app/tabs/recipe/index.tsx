import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import { fetchMenuByDailyCalo } from "@features/menus";
import { RootState } from "@redux";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { router } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecipeScreen() {
  const dispatch = useAppDispatch();
  const { listData, loading } = useAppSelector((state: RootState) => state.menu);
  const { user } = useAppSelector((state: RootState) => state.user);

  useEffect(() => {
    console.log("user", user);
    dispatch(fetchMenuByDailyCalo({ dailyCalo: 1600 }));
  }, []);

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      {loading ? (
        // ✅ Hiển thị loading khi đang tải
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={color.dark_green} />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          {listData && listData.length > 0 ? (
            listData.map((item) => (
              <Pressable
                key={item.id}
                style={({ pressed }) => [
                  styles.menuCard,
                  pressed && { opacity: 0.85 },
                ]}
                onPress={() =>
                  router.push({
                    pathname: "/tabs/recipe/RecipeDetail",
                    params: { recipeId: item.id, recipeName: item.menuName, imageUrl: item.imageUrl },
                  })
                }
              >
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    style={styles.menuImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={require("../../../assets/images/recipe_1.png")}
                    style={styles.menuImage}
                    resizeMode="cover"
                  />
                )}

                <View style={styles.textContainer}>
                  <Text style={styles.menuTitle}>{item.menuName}</Text>
                  <Text style={styles.calorieInfo}>
                    {item.dailyCaloriesMin} - {item.dailyCaloriesMax} calo
                  </Text>

                  <View style={styles.detailsContainer}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>4 bữa / ngày</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text
                        style={[styles.detailLabel, { fontFamily: FONTS.bold }]}
                      >
                        30 ngày
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))
          ) : (
            <Text style={styles.noDataText}>Không có thực đơn phù hợp</Text>
          )}

          <View style={{ height: 2 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: color.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: color.white,
  },
  loadingText: {
    marginTop: 12,
    color: color.dark_green,
    fontFamily: FONTS.medium,
    fontSize: 15,
  },
  container: {
    flex: 1,
    marginTop: -45,
    backgroundColor: color.white,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  menuCard: {
    width: "100%",
    backgroundColor: color.white,
    borderRadius: 15,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: color.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 8,
  },
  menuImage: {
    width: "100%",
    height: 160,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  textContainer: {
    width: "100%",
    padding: 12,
    backgroundColor: color.white,
  },
  menuTitle: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    color: color.black,
    marginBottom: 4,
    lineHeight: 22,
    textAlign: "left",
  },
  calorieInfo: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: color.black,
    marginBottom: 8,
    textAlign: "left",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  detailItem: {
    backgroundColor: color.dark_green,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 12,
    color: color.white,
    fontFamily: FONTS.medium,
  },
  noDataText: {
    textAlign: "center",
    marginTop: 40,
    color: color.grey,
    fontSize: 15,
    fontFamily: FONTS.regular,
  },
});

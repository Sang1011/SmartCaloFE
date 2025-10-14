import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import { router } from "expo-router";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const recipes = [
  {
    id: 1,
    title: "Eat Clean dành cho dân văn phòng bận rộn cùng Wao",
    calorie: "1600-1800 cal/ ngày",
    meals: "4 bữa / ngày",
    duration: "7 ngày",
    image: require("../../../assets/images/recipe_1.png"),
    screen: "RecipeDetail",
  },
  {
    id: 2,
    title: "Bữa ăn dinh dưỡng dành cho các gymer cường độ cao",
    calorie: "3000-5000 cal/ ngày",
    meals: "4 bữa / ngày",
    duration: "Hàng ngày",
    image: require("../../../assets/images/recipe_2.png"),
    screen: "RecipeDetail",
  },
  {
    id: 3,
    title: "Thực đơn giảm cân nhanh 1500 calo",
    calorie: "1500 cal/ ngày",
    meals: "3 bữa / ngày",
    duration: "7 ngày",
    image: require("../../../assets/images/recipe_1.png"),
    screen: "RecipeDetail",
  },
];

export default function RecipeScreen() {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {recipes.map((item) => (
          <Pressable
            key={item.id}
            style={({ pressed }) => [
              styles.menuCard,
              pressed && { opacity: 0.85 },
            ]}
            onPress={() =>
              router.push({
                pathname: "/tabs/recipe/RecipeDetail",
                params: { recipeId: item.id },
              })
            }
          >
            <Image
              source={item.image}
              style={styles.menuImage}
              resizeMode="cover"
            />
            <View style={styles.textContainer}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.calorieInfo}>{item.calorie}</Text>

              <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>{item.meals}</Text>
                </View>
                {/* Tag Thời gian - Sử dụng FONTS.bold */}
                <View style={styles.detailItem}>
                  <Text
                    style={[styles.detailLabel, { fontFamily: FONTS.bold }]}
                  >
                    {item.duration}
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
        ))}
        <View style={{ height: 2 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: color.white,

  },
  menuIconContainer: {
    position: "absolute",
    right: 16,
    padding: 8,
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
});

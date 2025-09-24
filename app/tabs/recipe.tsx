import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import { navigateCustom } from "@utils/navigation";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from "react-native";

const recipes = [
  {
    id: 1,
    title: "Eat Clean dành cho dân văn phòng bận rộn cùng Wao (1600-1800 calo)",
    calorie: "1600-1800 cal/ ngày",
    meals: "4 bữa / ngày",
    duration: "7 ngày",
    image: require("../../assets/images/recipe_1.png"),
    screen: "RecipeDetail",
  },
  {
    id: 2,
    title: "Thực đơn giảm cân nhanh 1500 calo",
    calorie: "1500 cal/ ngày",
    meals: "3 bữa / ngày",
    duration: "7 ngày",
    image: require("../../assets/images/recipe_2.png"),
    screen: "RecipeDetail",
  },
];

export default function RecipeScreen() {
  return (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.mainTitle}>Thực đơn gợi ý</Text>
      </View>
      <ScrollView style={styles.container}>
        {recipes.map((item) => (
          <Pressable
            key={item.id}
            style={({ pressed }) => [
              styles.menuCard,
              pressed && { transform: [{ scale: 0.97 }] },
            ]}
            onPress={() => navigateCustom(item.screen)}
          >
            <View style={styles.imageContainer}>
              <Image
                source={item.image}
                style={styles.menuImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.calorieInfo}>{item.calorie}</Text>

              <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>{item.meals}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>{item.duration}</Text>
                </View>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: color.background,
  },
  headerContainer: {
    width: "100%",
    marginBottom: 20,
    height: 70,
    shadowColor: color.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 12,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    fontFamily: FONTS.semiBold,
    lineHeight: 115,
    textAlign: "center",
  },
  menuCard: {
    marginHorizontal: "auto",
    width: 343,
    height: 240,
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 16,
    shadowColor: color.black,
    shadowOffset: { width: 0, height: 4 },
    overflow: "hidden",
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 12,
  },
  imageContainer: { flex: 1 },
  menuImage: { width: "100%", height: "100%" },
  textContainer: {
    width: "100%",
    backgroundColor: color.white,
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: [{ translateX: "-50%" }],
    display: "flex",
    alignItems: "center",
  },
  menuTitle: {
    width: "100%",
    textAlign: "left",
    fontSize: 16,
    fontWeight: "600",
    color: color.black,
    marginBottom: 8,
    paddingHorizontal: 12,
    lineHeight: 22,
    margin: 12,
    fontFamily: FONTS.semiBold,
  },
  calorieInfo: {
    width: "100%",
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: color.black,
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 12,
    marginBottom: 12,
    width: "100%",
    gap: 8,
  },
  detailItem: {
    flex: 1,
    backgroundColor: color.dark_green,
    borderRadius: 12,
    minWidth: 60,
    maxWidth: 110,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 14,
    color: color.white,
    fontFamily: FONTS.medium,
  },
});

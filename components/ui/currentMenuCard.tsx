import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { navigateCustom } from "@utils/navigation";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import SCButton from "./SCButton";

type Props = {
  menuId: string;
  title: string;
  minCalorie: number;
  maxCalorie: number;
  meals?: string;
  image: string;
  onChange?: () => void;
};

export default function CurrentMenuCard({
  title,
  minCalorie,
  maxCalorie,
  menuId,
  meals,
  image,
  onChange,
}: Props) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Thực đơn đang áp dụng</Text>
        <View style={{ width: "25%" }}>
          <SCButton
            title="Thay đổi"
            variant="outline"
            gap={2}
            height={32}
            fontSize={12}
            iconPos="left"
            icon={
              <MaterialIcons
                name="change-circle"
                size={18}
                color={color.dark_green}
              />
            }
            onPress={() => onChange}
          />
        </View>
      </View>

      {/* Card */}
      <Pressable style={styles.card} onPress={() => {
        navigateCustom("/tabs/recipe/RecipeDetail", {
          params: {
            recipeId: menuId,
            recipeName: title,
            imageUrl: image,
            backExplore: "true"
          }
        })
      }}>
        <Image src={image} style={styles.image} resizeMode="cover" />

        <View style={styles.info}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.calorie}>
            {minCalorie} - {maxCalorie} calo
          </Text>

          <View style={styles.detailRow}>
            {/* <View style={styles.detailTag}>
              <Text style={styles.detailText}>{meals}</Text>
            </View> */}
            {/* <View style={styles.detailTag}>
              <Text style={styles.detailText}>{duration}</Text>
            </View> */}
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: color.black
  },
  changeText: {
    fontSize: 14,
    color: color.dark_green,
    fontFamily: FONTS.bold,
  },
  card: {
    flexDirection: "row",
    backgroundColor: color.white,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: "35%",
    height: "auto",
  },
  info: {
    padding: 12,
  },
  cardTitle: {
    flexWrap: "wrap",
    maxWidth: "80%",
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: "#000",
    marginBottom: 4,
  },
  calorie: {
    fontSize: 12,
    color: "#666",
    fontFamily: FONTS.regular,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    gap: 8,
  },
  detailTag: {
    backgroundColor: color.dark_green,
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  detailText: {
    fontSize: 12,
    color: color.white,
    fontFamily: FONTS.medium,
  },
});

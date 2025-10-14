import ButtonGoBack from "@components/ui/buttonGoBack";
import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import { Ionicons } from "@expo/vector-icons";
import { navigateCustom } from "@utils/navigation";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NutrionScreen() {
    const { mealId } = useLocalSearchParams();
  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.gobackButton}>
            <ButtonGoBack handleLogic={() =>
                navigateCustom("/dishes", {
                    params: {
                        mealId: "1"
                    }
                })
            } />
          </View>
          <View style={styles.imageContainer}>
            <Image
              source={require("@assets/images/com-tam.png")}
              style={styles.image}
            />
          </View>
        </View>

        {/* Body */}
        <View style={styles.bodyContainer}>
          <Text style={styles.title}>Giá trị dinh dưỡng</Text>

          {/* Hàng 1 */}
          <View
            style={[styles.card, { backgroundColor: color.progress_protein }]}
          >
            <View style={styles.cardHeader}>
              <Ionicons name="barbell-outline" size={20} color={color.white} />
              <Text style={[styles.cardTitle, { color: color.white }]}>
                Protein
              </Text>
            </View>
            <View style={styles.progressRow}>
              <Text style={styles.value}>44</Text>
              <Text style={styles.total}>/50g</Text>
            </View>
            <View style={styles.progressBackground}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: color.progress_protein_fill,
                    width: "88%",
                  },
                ]}
              />
            </View>
            <Text style={styles.percent}>88%</Text>
          </View>

          {/* Hàng 2 */}
          <View style={[styles.card, { backgroundColor: color.progress_fat }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="flame-outline" size={20} color={color.white} />
              <Text style={[styles.cardTitle, { color: color.white }]}>
                Chất béo
              </Text>
            </View>
            <Text style={styles.subText}>Cần thiết cho cơ thể</Text>
            <View style={styles.progressRow}>
              <Text style={styles.value}>40</Text>
              <Text style={styles.total}>/78g</Text>
            </View>
            <View style={styles.progressBackground}>
              <View
                style={[
                  styles.progressFill,
                  { backgroundColor: color.progress_fat_fill, width: "6%" },
                ]}
              />
            </View>
            <Text style={styles.percent}>6%</Text>
          </View>

          {/* Hàng 3 */}
          <View style={styles.row}>
            <View
              style={[
                styles.cardSmall,
                { backgroundColor: color.progress_fiber },
              ]}
            >
              <View style={styles.cardHeader}>
                <Ionicons name="leaf-outline" size={18} color={color.white} />
                <Text style={[styles.cardTitleSmall, { color: color.white }]}>
                  Chất xơ
                </Text>
              </View>
              <View style={styles.progressRowSmall}>
                <Text style={styles.valueSmall}>1.5</Text>
                <Text style={styles.totalSmall}>/25g</Text>
              </View>
              <View style={styles.progressBackgroundSmall}>
                <View
                  style={[
                    styles.progressFillSmall,
                    { backgroundColor: color.progress_fiber_fill, width: "6%" },
                  ]}
                />
              </View>
              <Text style={styles.percentSmall}>6%</Text>
            </View>

            <View
              style={[
                styles.cardSmall,
                { backgroundColor: color.progress_sugar },
              ]}
            >
              <View style={styles.cardHeader}>
                <Ionicons
                  name="ice-cream-outline"
                  size={18}
                  color={color.white}
                />
                <Text style={[styles.cardTitleSmall, { color: color.white }]}>
                  Đường
                </Text>
              </View>
              <View style={styles.progressRowSmall}>
                <Text style={styles.valueSmall}>7</Text>
                <Text style={styles.totalSmall}>/50g</Text>
              </View>
              <View style={styles.progressBackgroundSmall}>
                <View
                  style={[
                    styles.progressFillSmall,
                    {
                      backgroundColor: color.progress_sugar_fill,
                      width: "14%",
                    },
                  ]}
                />
              </View>
              <Text style={styles.percentSmall}>14%</Text>
            </View>
          </View>

          {/* Tóm tắt */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Tóm tắt dinh dưỡng</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tổng Calories</Text>
              <View style={styles.tag}>
                <Text style={styles.tagText}>800 kcal</Text>
              </View>
            </View>

            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Protein</Text>
                <View
                  style={[
                    styles.tag,
                    { backgroundColor: color.summary_protein_bg },
                  ]}
                >
                  <Text
                    style={[
                      styles.tagText,
                      { color: color.summary_protein_color },
                    ]}
                  >
                    88%
                  </Text>
                </View>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Chất béo</Text>
                <View
                  style={[
                    styles.tag,
                    { backgroundColor: color.summary_carb_bg },
                  ]}
                >
                  <Text
                    style={[
                      styles.tagText,
                      { color: color.summary_carb_color },
                    ]}
                  >
                    70%
                  </Text>
                </View>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Chất xơ</Text>
                <View
                  style={[
                    styles.tag,
                    { backgroundColor: color.summary_fiber_bg },
                  ]}
                >
                  <Text
                    style={[
                      styles.tagText,
                      { color: color.summary_fiber_color },
                    ]}
                  >
                    22%
                  </Text>
                </View>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Đường</Text>
                <View
                  style={[
                    styles.tag,
                    { backgroundColor: color.summary_sugar_bg },
                  ]}
                >
                  <Text
                    style={[
                      styles.tagText,
                      { color: color.summary_sugar_color },
                    ]}
                  >
                    12%
                  </Text>
                </View>
              </View>
            </View>
          </View>
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
  image: { width: 200, height: 200, borderRadius: 100, resizeMode: "cover" },
  bodyContainer: {
    backgroundColor: color.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -40,
    padding: 20,
  },
  title: { fontFamily: FONTS.semiBold, fontSize: 20, marginBottom: 15 },
  card: {
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  cardTitle: { fontFamily: FONTS.semiBold, fontSize: 16 },
  subText: {
    fontFamily: FONTS.regular,
    color: color.white,
    fontSize: 12,
    marginVertical: 2,
  },
  progressRow: { flexDirection: "row", alignItems: "flex-end", marginTop: 5 },
  value: { fontFamily: FONTS.bold, color: color.white, fontSize: 22 },
  total: {
    fontFamily: FONTS.medium,
    color: color.white,
    fontSize: 14,
    marginLeft: 3,
  },
  progressBackground: {
    width: "100%",
    height: 6,
    borderRadius: 3,
    backgroundColor: color.white_50,
    marginVertical: 5,
  },
  progressFill: { height: 6, borderRadius: 3 },
  percent: {
    fontFamily: FONTS.medium,
    color: color.white,
    fontSize: 12,
    textAlign: "right",
  },

  // hàng nhỏ
  row: { flexDirection: "row", justifyContent: "space-between" },
  cardSmall: {
    borderRadius: 15,
    padding: 12,
    width: "48%",
    marginBottom: 15,
  },
  cardTitleSmall: { fontFamily: FONTS.semiBold, fontSize: 15 },
  progressRowSmall: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 3,
  },
  valueSmall: { fontFamily: FONTS.bold, color: color.white, fontSize: 18 },
  totalSmall: {
    fontFamily: FONTS.medium,
    color: color.white,
    fontSize: 12,
    marginLeft: 3,
  },
  progressBackgroundSmall: {
    width: "100%",
    height: 4,
    borderRadius: 3,
    backgroundColor: color.white_50,
    marginVertical: 4,
  },
  progressFillSmall: { height: 4, borderRadius: 3 },
  percentSmall: {
    fontFamily: FONTS.medium,
    color: color.white,
    fontSize: 11,
    textAlign: "right",
  },

  // summary
  summaryCard: {
    backgroundColor: color.white,
    borderRadius: 15,
    padding: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  summaryTitle: { fontFamily: FONTS.semiBold, fontSize: 16, marginBottom: 10 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  summaryLabel: { fontFamily: FONTS.regular, color: color.black, fontSize: 14 },
  tag: {
    backgroundColor: color.macro_span_protein_bg,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  tagText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: color.macro_span_protein_color,
  },
  summaryPercent: { fontFamily: FONTS.medium, fontSize: 13 },
  summaryContainer: {
    gap: 2,
  },
});

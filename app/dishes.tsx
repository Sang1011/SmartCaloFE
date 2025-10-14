import ButtonGoBack from "@components/ui/buttonGoBack";
import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { navigateCustom } from "@utils/navigation";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { PieChart } from "react-native-gifted-charts/dist";
import { SafeAreaView } from "react-native-safe-area-context";

// Dữ liệu mẫu đã được xử lý
const rawIngredients =
  "Thịt heo 300 Gr, Thơm 1/2 Trái, Nước dừa 100 muỗngl, Ớt 2 Trái, Hạt nêm 1 muỗnguỗng cà phê, Nước mắm 1 muỗnguỗng canh, Tiêu 1/2 muỗnguỗng cà phê, Đường trắng 1 muỗnguỗng canh, Muối 1/2 muỗnguỗng cà phê, Dầu ăn 2 muỗnguỗng canh";

const rawMethods =
  "Gà rửa sạch, chặt miếng vừa ăn rồi ướp với 1 muỗnguỗng cà phê hạt nêm, 1 muỗnguỗng cà phê nước mắm ngon, 1/2 muỗnguỗng cà phê tiêu, ướp gà khoảng 2 giờ. Cho thịt gà vào lò vi sóng nấu khoảng 6-7 phút, đến khi chín sơ, rắc đều một lớp bột chiên giòn lên các miếng thịt gà., Gừng cắt sợi.Sả, riềng, tỏi băm nhuyễn. Lá lốt rửa sạch, cắt sợi mỏng. Hành tím cắt lát., Bắc chảo lên bếp, đun nóng dầu lên, cho gà vào chiên vàng rồi vớt ra, để ráo dầu., Vẫn chảo dầu ấy, cho tỏi vào phi thơm vàng. Tiếp tục cho sả, hành tím, lá lốt và gừng vào đảo đều, nêm với 2 muỗnguỗng cà phê hạt nêm., Cuối cùng cho gà đã chiên vàng vào xào nhanh tay rồi tắt bếp., Lấy ra đĩa, ăn với cơm. Chút cay nồng của gừng, chút ấm thơm của sả khiến người thưởng thức thêm ấm lòng ngày mưa lạnh.";

const ingredients = rawIngredients
  .split(",")
  .map((item) => item.trim())
  .filter((item) => item.length > 0);

  const methods = rawMethods
  .replace(/[,]+/g, "") // xoá hết dấu phẩy thừa
  .split(".")            // tách theo dấu chấm
  .map((item) => item.trim())
  .filter((item) => item.length > 0);

export default function Dishes() {
  const [tab, setTab] = useState<"ingre" | "method">("ingre");
  const { mealId } = useLocalSearchParams();

  const handleAddPress = () => {
    navigateCustom("/addMealEntry");
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header - ảnh và nút quay lại (Giữ nguyên) */}
        <View style={styles.header}>
          <View style={styles.gobackButton}>
            <ButtonGoBack link="/tabs" />
          </View>
          <View style={styles.imageContainer}>
            <Image
              source={require("@assets/images/com-tam.png")}
              style={styles.image}
            />
          </View>
        </View>

        {/* Phần thân bo tròn nổi lên (Giữ nguyên) */}
        <View style={styles.bodyContainer}>
          <View style={styles.flyContainer}>
            <Text style={styles.titleText}>Cơm sườn bì chả</Text>

            <View style={styles.iconContainer}>
              <View style={styles.icon}>
                <Ionicons name="time-outline" size={24} color="black" />
                <Text style={{ fontFamily: FONTS.semiBold, fontSize: 14 }}>
                  30 phút
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.icon}>
                <AntDesign name="fire" size={24} color="black" />
                <Text style={{ fontFamily: FONTS.semiBold, fontSize: 14 }}>
                  800Kcal
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.icon}>
                <Ionicons name="fast-food-outline" size={24} color="black" />
                <Text style={{ fontFamily: FONTS.semiBold, fontSize: 14 }}>
                  Đồ mặn
                </Text>
              </View>
            </View>

            <View style={styles.desContainer}>
              <Text style={{ fontFamily: FONTS.semiBold, fontSize: 17 }}>
                Giới thiệu
              </Text>
              <Text
                style={{
                  fontFamily: FONTS.regular,
                  fontSize: 14,
                  paddingHorizontal: 10,
                }}
              >
                Món ngon đặc trưng, rất được ưa chuộng. Để học cách làm sườn
                nướng cơm tấm ngon chuẩn thì cần biết cách ướp sườn cốt lết sao
                cho ngấm vị đậm đà.
              </Text>
            </View>
          </View>

          {/* Dinh dưỡng (Giữ nguyên) */}
          <View style={styles.nutrions}>
            <View style={styles.headerNutrions}>
              <Text style={{ fontFamily: FONTS.semiBold, fontSize: 15 }}>
                Giá trị dinh dưỡng
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{ fontFamily: FONTS.semiBold, fontSize: 12 }}
                  onPress={() => navigateCustom("/nutrions")}
                >
                  Xem tất cả
                </Text>
                <MaterialIcons name="navigate-next" size={16} color="black" />
              </View>
            </View>

            <View style={styles.chartContainer}>
              <PieChart
                donut
                radius={60}
                innerRadius={40}
                data={[
                  { value: 25, color: "#60A5FA" },
                  { value: 35, color: "#FCA5A5" },
                  { value: 40, color: "#C4B5FD" },
                ]}
              />
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View
                    style={[styles.colorBox, { backgroundColor: "#60A5FA" }]}
                  />
                  <Text style={styles.legendText}>25% Protein</Text>
                </View>
                <View style={styles.legendItem}>
                  <View
                    style={[styles.colorBox, { backgroundColor: "#FCA5A5" }]}
                  />
                  <Text style={styles.legendText}>35% Chất béo</Text>
                </View>
                <View style={styles.legendItem}>
                  <View
                    style={[styles.colorBox, { backgroundColor: "#C4B5FD" }]}
                  />
                  <Text style={styles.legendText}>40% Tinh bột</Text>
                </View>
              </View>
            </View>

            <Text
              style={{
                fontFamily: FONTS.semiBold,
                fontSize: 12,
                textAlign: "center",
              }}
            >
              Theo % giá trị khuyến nghị DV – Daily Value, khuyến nghị hàng ngày
            </Text>

            {/* Tabs (Giữ nguyên) */}
            <View style={styles.buttonContainer}>
              <Pressable
                style={[tab === "ingre" ? styles.buttonActive : styles.button]}
                onPress={() => setTab("ingre")}
              >
                <Text
                  style={[
                    tab === "ingre"
                      ? styles.buttonTextActive
                      : styles.buttonText,
                  ]}
                >
                  Thành phần
                </Text>
              </Pressable>
              <Pressable
                style={[tab === "method" ? styles.buttonActive : styles.button]}
                onPress={() => setTab("method")}
              >
                <Text
                  style={[
                    tab === "method"
                      ? styles.buttonTextActive
                      : styles.buttonText,
                  ]}
                >
                  Cách làm
                </Text>
              </Pressable>
            </View>

            {/* Nội dung tab - ĐÃ CẬP NHẬT */}
            <View style={styles.contentContainer}>
              {tab === "ingre" ? (
                <View style={styles.ingreContainer}>
                  {ingredients.map((item, index) => (
                    <View key={index} style={styles.ingreRow}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.ingreText}>{item}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.methodContainer}>
                  {methods.map((stepContent, index) => (
                    <View key={index} style={styles.methodRow}>
                      <View style={styles.numberDots}>
                        <Text
                          style={{
                            color: color.white,
                            fontFamily: FONTS.semiBold,
                            fontSize: 14,
                          }}
                        >
                          {index + 1}
                        </Text>
                      </View>
                      <View style={styles.methodSteps}>
                        <Text style={styles.step}>Bước {index + 1}</Text>
                        <Text style={styles.stepContent}>{stepContent}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      <Pressable style={styles.addButton} onPress={handleAddPress}>
        <AntDesign name="plus" size={20} color={color.white} />
        <Text style={styles.addButtonText}>Thêm vào lịch sử</Text>
      </Pressable>
    </SafeAreaView>
  );
}

// --- Cập nhật Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
  header: {
    backgroundColor: color.background_dish,
    height: 270,
    justifyContent: "center",
    alignItems: "center",
  },
  gobackButton: {
    position: "absolute",
    top: 30,
    left: 15,
  },
  imageContainer: {
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    marginHorizontal: "auto",
  },
  bodyContainer: {
    backgroundColor: color.white,
    borderRadius: 25,
    marginTop: -40, // bo góc chồng lên ảnh
    paddingBottom: 20,
  },
  flyContainer: {
    padding: 16,
    borderRadius: 25,
    backgroundColor: color.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  titleText: {
    fontFamily: FONTS.semiBold,
    fontSize: 25,
    marginBottom: 15,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 40,
  },
  icon: {
    alignItems: "center",
  },
  divider: {
    height: "85%",
    width: 1,
    backgroundColor: color.grey,
  },
  desContainer: {
    paddingHorizontal: 15,
    marginTop: 20,
  },
  nutrions: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  headerNutrions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    gap: 20,
  },
  legendContainer: {
    gap: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  colorBox: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: "#333",
  },
  buttonContainer: {
    alignSelf: "center",
    marginVertical: 15,
    width: 220,
    height: 35,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: color.grey,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  button: {
    height: 25,
    width: 102,
  },
  buttonActive: {
    height: 25,
    width: 102,
    backgroundColor: color.dark_green,
    borderRadius: 8,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    lineHeight: 25,
  },
  buttonTextActive: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    lineHeight: 25,
    color: color.white,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 10, // Thêm padding chung cho nội dung
  },
  // START: STYLES MỚI CHO THÀNH PHẦN
  ingreContainer: {
    flexDirection: "column",
    gap: 8,
  },
  ingreRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 5,
  },
  bulletPoint: {
    marginRight: 8,
    fontSize: 16,
    lineHeight: 20,
    color: color.dark_green, // Màu chấm
  },
  ingreText: {
    fontFamily: FONTS.regular,
    fontSize: 15,
    flexShrink: 1, // Đảm bảo text wrapping
    lineHeight: 20,
  },
  // END: STYLES MỚI CHO THÀNH PHẦN
  methodContainer: {
    flexDirection: "column",
    justifyContent: "center",
    gap: 12, // Tăng khoảng cách giữa các bước
  },
  methodRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  numberDots: {
    backgroundColor: color.dark_green,
    width: 25, // Tăng kích thước
    height: 25,
    borderRadius: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  methodSteps: {
    flex: 1, // Đảm bảo chiếm phần còn lại
  },
  step: {
    fontSize: 15,
    fontFamily: FONTS.semiBold,
    marginBottom: 2, // Khoảng cách giữa Bước 1 và nội dung
  },
  stepContent: {
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
  addButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: color.dark_green,
    paddingVertical: 15,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: color.white,
    fontFamily: FONTS.bold,
    fontSize: 16,
    marginLeft: 8,
  },
});

import ButtonGoBack from "@components/ui/buttonGoBack";
import SCDonutChart from "@components/ui/SCDonutChart";
import SCShadowCard from "@components/ui/SCShadowCard";
import color from "@constants/color";
import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function Dishes() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.gobackButton}>
                    <ButtonGoBack />
                </View>
                <View style={styles.imageContainer}>
                <Image source={require("@assets/images/com-tam.png")} style={styles.image} />
                </View>
            </View>
            <SCShadowCard>
                <Text>Com suon bi cha</Text>
                <View style={styles.iconContainer}>
                    <View style={styles.icon}>
                        {/* icon */}
                        <Text></Text>
                    </View>
                    <View style={styles.divider}/>
                    <View style={styles.icon}>
                        {/* icon */}
                        <Text></Text>
                    </View>
                </View>
                <View>
                    <Text>Gioi thieu</Text>
                    <Text>Com suon bi cha la mot mon an truyen thong cua nguoi Viet....</Text>
                </View>
            </SCShadowCard>
            <View style={styles.nutrions}>
                <View style={styles.headerNutrions}>
                    <Text>Giá trị dinh dưỡng</Text>
                    <Text>Xem tất cả</Text>
                </View>
                <Text>Theo % giá trị khuyến nghị DV – Daily Value, khuyến nghị hàng ngày</Text>
                <View style={styles.chartContainer}>
                    <SCDonutChart
                        maxValue={100}
                        segments={[25,35,40]}
                    />
                    <View style={styles.nutrientContainer}>
                        <View style={styles.nutrient}>
                            <View style={styles.colorRectangle}></View>
                            <Text>Protein</Text>
                        </View>
                        <View style={styles.nutrient}>
                            <View style={styles.colorRectangle}></View>
                            <Text>Protein</Text>
                        </View>
                        <View style={styles.nutrient}>
                            <View style={styles.colorRectangle}></View>
                            <Text>Protein</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    {/* button doi */}
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: color.background_dish,
    height: 230,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  gobackButton: {
    position: "absolute",
    top: 12,
    left: 15
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    marginHorizontal: "auto"
  },
  iconContainer: {

  },
  icon: {

  },
  divider: {
    // style cho thanh phân cách giữa các icon/info
  },
  nutrions: {
    // style cho phần dinh dưỡng
  },
  headerNutrions: {
    // style cho tiêu đề và "xem tất cả"
  },
  chartContainer: {
    // style cho container chart + legend
  },
  nutrientContainer: {
    // style cho container các nutrient item
  },
  nutrient: {
    // style cho mỗi nutrient: icon + text
  },
  colorRectangle: {
    // style cho hình chữ nhật màu biểu thị nutrient
  },
  buttonContainer: {

  }
});

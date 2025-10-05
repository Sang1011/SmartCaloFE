import { Image } from "expo-image";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { globalStyles } from "../../constants/fonts";

const { width, height } = Dimensions.get("window");

export default function Step7_Info() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/survey_3.png")}
        style={styles.image}
        contentFit="cover"
      />
      <Text style={[styles.title, globalStyles.bold]}>
        Lựa chọn tuyệt vời! {"\n"}
        <Text style={[globalStyles.extraBold, { color: "#000000" }]}>
          Thói quen nhỏ = Thay đổi lớn.
        </Text>
      </Text>
      <Text style={[styles.description, globalStyles.semiBold]}>
        Chúng tôi sẽ giúp bạn chia nhỏ mục tiêu (và ăn mừng từng chiến thắng
        nhỏ!) trên hành trình đạt được mục tiêu của bạn.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  image: {
    width: "100%",
    height: height * 0.35,
    borderRadius: 16,
    marginBottom: 25,
  },
  title: {
    fontSize: width * 0.06,
    textAlign: "center",
    color: "#000000",
    marginBottom: 15,
  },
  description: {
    fontSize: width * 0.04,
    textAlign: "center",
    color: "#000000",
    lineHeight: width * 0.06,
  },
});

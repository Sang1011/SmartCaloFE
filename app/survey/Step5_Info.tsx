import { Image } from "expo-image";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { globalStyles } from "../../constants/fonts";
import { SurveyData } from "./index";

const { width, height } = Dimensions.get("window");

interface Props {
  surveyData: SurveyData;
}

export default function Step5_Info({ surveyData }: Props) {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/intro_1.png")}
        style={styles.image}
        contentFit="cover"
      />
      <Text style={[styles.title, globalStyles.extraBold]}>
        Chúng tôi hiểu mà,{" "}
        <Text style={{ color: "#000000" }}>{surveyData.name}</Text>. Một lối
        sống bận rộn có thể dễ dàng cản trở bạn đạt được mục tiêu.
      </Text>
      <Text style={[styles.description, globalStyles.semiBold]}>
        May mắn thay, chúng tôi biết rõ cách quản lý những trở ngại tiềm ẩn trên
        hành trình này vì chúng tôi đã giúp hàng triệu người đạt được mục tiêu
        của họ.
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

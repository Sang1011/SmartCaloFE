import { Image } from "expo-image";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { globalStyles } from "../../constants/fonts";

const { width, height } = Dimensions.get("window");

export default function Step3_Info() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/intro_1.png")} // Chưa chèn ảnh
        style={styles.image}
        contentFit="cover"
      />
      <Text style={[styles.title, globalStyles.extraBold]}>
        Tuyệt vời! Bạn vừa thực hiện một bước tiến lớn trên hành trình của mình.
      </Text>
      <Text style={[styles.description, globalStyles.semiBold]}>
        Bạn có biết rằng việc theo dõi thực phẩm của bạn là một phương pháp đã
        được khoa học chứng minh để đạt được thành công? Nó được gọi là “tự giám
        sát” và bạn càng duy trì đều đặn, bạn càng có nhiều khả năng đạt được
        mục tiêu của mình.
      </Text>
      <Text style={[styles.description, globalStyles.semiBold]}>
        Bây giờ, hãy nói về mục tiêu duy trì cân nặng của bạn.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
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

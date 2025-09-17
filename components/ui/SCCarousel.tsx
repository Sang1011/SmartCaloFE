import { Image, StyleSheet, Text, View } from "react-native";

export default function SCCarousel() {
  return (
    <View style={styles.container}>
      <View style={styles.groupContainer}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={require("../../assets/images/intro_1.png")}
          />
          <Text>Dinh dưỡng hợp lý. Cuộc sống lý tưởng!</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
    width: "100%",
  },
  groupContainer: {},
  imageContainer: {
    height: 367,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    gap: 15,
  },
  image: {
    width: "65%",
    aspectRatio: 1,
    resizeMode: "cover",
    borderRadius: 23,
  },
});

import { FlatList, Image, StyleSheet, Text, View, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import React, { useState } from "react";
import color from "@constants/color";
import { globalStyles } from "@constants/fonts";

const { width } = Dimensions.get("window");

const data = [
  {
    id: 1,
    image: require("../../assets/images/intro_1.png"),
    text: "Dinh dưỡng hợp lý. Cuộc sống lý tưởng!",
  },
  {
    id: 2,
    image: require("../../assets/images/intro_2.png"),
    text: "Tính calo thông minh. Sống khỏe mỗi ngày!",
  },
  {
    id: 3,
    image: require("../../assets/images/intro_3.png"),
    text: "Xây dựng thói quen lành mạnh",
  },
];

export default function SCCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / width);
    setActiveIndex(newIndex);
  };

  return (
    <View style={styles.container}>
      {/* Carousel */}
      <FlatList
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.groupContainer, { width }]}>
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={item.image} />
              <Text style={[globalStyles.black, styles.text]}>{item.text}</Text>
            </View>
          </View>
        )}
        onMomentumScrollEnd={handleScrollEnd}
      />

      {/* Dot indicator */}
      <View style={styles.dotContainer}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeIndex && styles.dotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 450,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },
  groupContainer: {
    height: 386,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  imageContainer: {
    height: 367,
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  },
  image: {
    height: 304,
    aspectRatio: "5/6",
    borderRadius: 23,
  },
  text: {
    maxWidth: 200,
    fontSize: 16,
    lineHeight: 24,
    color: color.dark_green,
    textAlign: "center",
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    position: "absolute",
    bottom: 50,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: color.light_green,
  },
  dotActive: {
    backgroundColor: color.dark_green,
  },
});

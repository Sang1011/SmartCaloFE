import { StyleSheet, Text, View } from "react-native";
import SCProgressBar from "./SCProgressBar";

export default function ViewNutritionDetail() {
  return (
    <View style={styles.container}>
      <Text>Giá trị dinh dưỡng</Text>
      <View style={styles.content}>
        <View style={[styles.nutrientContainer, styles.protein]}>
          <Text>Protein</Text>
          <View>
            <Text>44</Text>
            <Text>/50g</Text>
          </View>
          <View>
            <SCProgressBar progress={44} width="90%" />
          </View>
          <Text>88%</Text>
        </View>
        <View style={[styles.nutrientContainer, styles.fat]}>
          <Text>Fat</Text>
          <View>
            <Text>44</Text>
            <Text>/50g</Text>
          </View>
          <View>
            <SCProgressBar progress={44} width="90%" />
          </View>
          <Text>88%</Text>
        </View>
        <View>
          <View style={[styles.nutrientContainer, styles.fiber]}>
            <Text>Fiber</Text>
            <View>
              <Text>44</Text>
              <Text>/50g</Text>
            </View>
            <View>
              <SCProgressBar progress={44} width="90%" />
            </View>
            <Text>88%</Text>
          </View>
          <View style={[styles.nutrientContainer, styles.sugar]}>
            <Text>Sugar</Text>
            <View>
              <Text>44</Text>
              <Text>/50g</Text>
            </View>
            <View>
              <SCProgressBar progress={44} width="90%" />
            </View>
            <Text>88%</Text>
          </View>
        </View>
        <View>
            <Text>Tóm tắt dinh dưỡng</Text>
            <View style={styles.summaryContainer}>
                <Text>Tong calories</Text>
                <Text style={[styles.spanText, styles.totalCalories]}>800 kcalo</Text>
            </View>
            <View style={styles.summaryContainer}>
                <Text>Protein</Text>
                <Text style={[styles.spanText, styles.protein]}>22g - 88%</Text>
            </View>
            <View style={styles.summaryContainer}>
                <Text>Chat Beo</Text>
                <Text style={[styles.spanText, styles.fat]}>44g - 88%</Text>
            </View>
            <View style={styles.summaryContainer}>
                <Text>Chat xo</Text>
                <Text style={[styles.spanText, styles.fiber]}>44g - 88%</Text>
            </View>
            <View style={styles.summaryContainer}>
                <Text>Duong</Text>
                <Text style={[styles.spanText, styles.sugar]}>44g - 88%</Text>
            </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
     container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  content: {
    marginTop: 16,
  },
  nutrientContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
  },
  protein: {
    borderLeftWidth: 4,
    borderLeftColor: "#4caf50", // xanh lá
  },
  fat: {
    borderLeftWidth: 4,
    borderLeftColor: "#ff9800", // cam
  },
  fiber: {
    borderLeftWidth: 4,
    borderLeftColor: "#2196f3", // xanh dương
  },
  sugar: {
    borderLeftWidth: 4,
    borderLeftColor: "#e91e63", // hồng
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  spanText: {
    fontWeight: "600",
  },
  totalCalories: {
    color: "#ff5722",
  },
})
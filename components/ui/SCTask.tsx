import { Text, View, StyleSheet } from "react-native";
import SCCheckBox from "./SCCheckBox";
import color from "@constants/color";
import { useEffect, useState } from "react";
import { FONTS } from "@constants/fonts";

interface ISCTaskProps {
  title: string;
  completed: boolean;
}

export function SCTask({ title, completed: initialCompleted }: ISCTaskProps) {
  const [completed, setCompleted] = useState(initialCompleted);

  useEffect(() => {
    setCompleted(initialCompleted);
  }, [initialCompleted]);

  return (
    <View style={styles.container}>
      {/* Text */}
      <View style={styles.textWrapper}>
        <Text style={[styles.text, completed && styles.textCompleted]}>
          {title}
        </Text>
      </View>

      {/* Checkbox */}
      <View style={styles.checkboxWrapper}>
        <SCCheckBox
          checked={completed} // 👈 dùng controlled prop
          onChange={setCompleted} // 👈 callback để thay đổi state
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 2,
  },
  textWrapper: {
    flex: 0.85,
    paddingRight: 8,
  },
  text: {
    fontSize: 14,
    flexWrap: "wrap",
    fontFamily: FONTS.regular,
  },
  checkboxWrapper: {
    flex: 0.06,
    alignItems: "center",
    justifyContent: "center",
  },
  textCompleted: {
    color: color.lime,
    fontFamily: FONTS.semiBold,
    textDecorationLine: "line-through",
  },
});

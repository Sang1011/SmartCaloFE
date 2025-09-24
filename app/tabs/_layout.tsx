import { Slot } from "expo-router";
import BottomTabs from "@components/ui/bottomTabs";
import { SafeAreaView, StyleSheet, View } from "react-native";

export default function TabsLayout() {
  return (
    <>
      <View style={styles.content}>
        <Slot />
      </View>
      <View style={styles.bottom}>
        <BottomTabs />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  bottom: {
    width: "100%"
  }
});

import { Slot } from "expo-router";
import BottomTabs from "@components/ui/bottomTabs";
import { SafeAreaView, StyleSheet, View } from "react-native";

export default function TabsLayout() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Slot />
      </View>
      <BottomTabs />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

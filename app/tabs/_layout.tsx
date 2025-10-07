import { Slot } from "expo-router";
import BottomTabs from "@components/ui/bottomTabs";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabsLayout() {
  return (
    <>
      <SafeAreaView style={styles.content} edges={['top']}>
        <Slot />
      </SafeAreaView>
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

import BottomTabs from "@components/ui/bottomTabs";
import { Button, StyleSheet, View } from "react-native";

export default function TabLayout() {
  return (
    <View style={styles.container}>
      <BottomTabs />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

import BottomTabs from "@components/ui/bottomTabs";
import { TabType } from "../../types/tabs";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";

// interface ITabLayoutProps {
//   children: React.ReactNode;
//   name: TabType;
// }

export default function LogScreen() {
  return (
    <View style={styles.container}>
      {/* <ScrollView>
        {children}
      </ScrollView> */}
      <Text>Log</Text>
      <Button title="Click me" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

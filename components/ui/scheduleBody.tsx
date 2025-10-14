import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function ScheduleBody({ data }: { data: any[] }) {
  return (
    <View style={styles.body}>
      <Text style={styles.bodyText}>{data.length} bài tập</Text>

      <ScrollView
        style={styles.scrollArea}
        showsVerticalScrollIndicator={false}
      >
        {data.map((item, index) => (
          <View key={index} style={styles.slotItem}>
            <Text style={styles.contentTitle}>{item.name}</Text>
            <Text style={styles.contentDes}>{item.duration}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    width: "95%",
    marginTop: 10,
  },
  bodyText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    paddingLeft: 10,
  },
  scrollArea: {
    marginTop: 10,
  },
  slotItem: {
    paddingHorizontal: 20,
    minHeight: 75,
    justifyContent: "center",
  },
  contentTitle: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: color.black,
  },
  contentDes: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: color.red_dark,
  },
});

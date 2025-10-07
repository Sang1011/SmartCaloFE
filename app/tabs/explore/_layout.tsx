import { FONTS } from "@constants/fonts";
import { Stack, useRouter, usePathname } from "expo-router";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import color from "@constants/color";
import { navigateCustom } from "@utils/navigation";

function HeaderTabs() {
  const pathname = usePathname();

  const handleRedirect = (url: string) => {
    if (pathname === url) return;
    navigateCustom(url);
  };

  return (
    <View style={styles.body}>
      <Text style={styles.headerText}>Khám phá</Text>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, pathname === "/tabs/explore" && styles.activeTab]}
          onPress={() => handleRedirect("/tabs/explore")}
        >
          <Text
            style={[
              styles.tabText,
              pathname === "/tabs/explore" && styles.activeTabText,
            ]}
          >
            Kế hoạch
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            pathname === "/tabs/explore/suggestions" && styles.activeTab,
          ]}
          onPress={() => handleRedirect("/tabs/explore/suggestions")}
        >
          <Text
            style={[
              styles.tabText,
              pathname === "/tabs/explore/suggestions" && styles.activeTabText,
            ]}
          >
            Gợi ý sản phẩm
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function ExploreLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: () => <HeaderTabs />,
          headerTitleAlign: "center",
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="suggestions"
        options={{
          headerTitle: () => <HeaderTabs />,
          headerTitleAlign: "center",
          headerBackVisible: false
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  body: {
    width: "100%",
  },
  headerText: {
    fontFamily: FONTS.semiBold,
    fontSize: 22,
    marginBottom: 8,
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: color.white,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: color.dark_green,
  },
  tabText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: "#666",
  },
  activeTabText: {
    color: color.white,
    fontFamily: FONTS.semiBold,
  },
});

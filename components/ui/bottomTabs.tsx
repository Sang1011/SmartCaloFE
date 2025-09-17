import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Color from "@constants/color";
import { UserTab, LogTab, MenuTab, BetweenTab, ExploreTab } from "./tabIcons";

export default function BottomTabs() {
  const [activeTab, setActiveTab] = useState("log");

  const tabs = [
    { key: "log", label: "Nhật ký", component: LogTab },
    { key: "explore", label: "Khám phá", component: ExploreTab },
    { key: "center", label: "", component: BetweenTab },
    { key: "menu", label: "Thực đơn", component: MenuTab },
    { key: "profile", label: "Hồ sơ", component: UserTab },
  ];

  return (
    <View style={styles.container}>
        <View style={styles.centerTabBehind}></View>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const IconComponent = tab.component;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabItem,
                tab.key === "center" && styles.centerTab,
              ]}
              onPress={() => setActiveTab(tab.key)}
            >
              <IconComponent isActive={activeTab === tab.key} />
              {tab.label !== "" && (
                <Text
                  style={[
                    styles.label,
                    activeTab === tab.key && { color: Color.dark_green } && styles.labelActive,
                  ]}
                >
                  {tab.label}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    position: "relative"
  },
  tabBar: {
    height: 88,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
    justifyContent: "space-around",
  },
  tabItem: {
    alignItems: "center",
    marginTop: 15,
  },
  centerTab: {
    backgroundColor: Color.dark_green,
    justifyContent: "center",
    borderRadius: "50%",
    height: 48,
    width: 48,
    marginTop: -8,
  },
  centerTabBehind: {
    position: "absolute",
    bottom: -100,
    left: "50%",
    backgroundColor: "red",
    borderRadius: "50%",
    // zIndex: -1,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    color: "#555",
  },
  labelActive: {
    color: Color.dark_green,
  },
});

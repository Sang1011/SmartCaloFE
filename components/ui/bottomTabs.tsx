import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import Color from "@constants/color";
import { UserTab, LogTab, MenuTab, BetweenTab, ExploreTab } from "./tabIcons";
import { FONTS } from "@constants/fonts";
import { TabType } from "../../types/tabs";

interface IBottomTabsProps {
  name?: TabType;
}
export default function BottomTabs({ name = "log" }: IBottomTabsProps) {
  const [activeTab, setActiveTab] = useState(name);
  const [isCenterOpen, setIsCenterOpen] = useState(false);

  const tabs: {
    key: TabType;
    label: string;
    component: React.FC<{ isActive: boolean }>;
  }[] = [
    { key: "log", label: "Nhật ký", component: LogTab },
    { key: "explore", label: "Khám phá", component: ExploreTab },
    { key: "center", label: "", component: BetweenTab },
    { key: "menu", label: "Thực đơn", component: MenuTab },
    { key: "profile", label: "Hồ sơ", component: UserTab },
  ];

  return (
    <View style={styles.container}>
      {/* Outer của centerTab đặt ở đây, chung cấp tabBar */}
      <View style={styles.centerTabOuter} />

      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const IconComponent = tab.component;
          if (tab.key === "center") {
            return (
              <TouchableOpacity
                key={tab.key}
                style={styles.centerTabWrapper}
                onPress={() => setIsCenterOpen(!isCenterOpen)}
              >
                <View style={styles.centerTabInnerContainer}>
                <View style={styles.centerTabInner}>
                  <BetweenTab isActive={isCenterOpen} />
                </View>
                </View>
              </TouchableOpacity>
            );
          }
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabItem}
              onPress={() => setActiveTab(tab.key)}
            >
              <IconComponent isActive={activeTab === tab.key} />
              {tab.label !== "" && (
                <Text
                  style={[
                    styles.label,
                    activeTab === tab.key && styles.labelActive,
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
    height: 88,
    justifyContent: "flex-end",
    alignItems: "center",
    position: "fixed",
  },
  tabBar: {
    width: "100%",
    marginHorizontal: "auto",
    height: 88,
    position: "relative",
    zIndex: 1,
    flexDirection: "row",
    backgroundColor: Color.white,
    borderTopWidth: 1,
    borderColor: Color.border,
    justifyContent: "space-around",
  },
  tabItem: {
    alignItems: "center",
    marginTop: 15,
    width: "20%",
  },
  centerTabOuter: {
    backgroundColor: Color.white,
    borderRadius: 9999,
    height: 56,
    width: 56,
    borderWidth: 1,
    transform: [{ rotate: "-180deg" }],
    borderColor: Color.border,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    top: 43,
    zIndex: 0, // nằm dưới tabBar
  },
  centerTabWrapper: {
    marginTop: -8,
    alignItems: "center",
  },
  centerTabInnerContainer: {
    backgroundColor: Color.white,
    borderRadius: 9999,
    height: 56,
    width: 56,
    marginTop: -5,
    alignItems: "center",
    justifyContent: "center",
  },
  centerTabInner: {
    backgroundColor: Color.dark_green,
    borderRadius: 24,
    height: 48,
    width: 48,
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    fontSize: 12,
    marginTop: 4,
    color: Color.grey,
    fontFamily: FONTS.medium,
  },
  labelActive: {
    color: Color.dark_green,
    fontFamily: FONTS.bold,
  },
});

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from "react-native";
import Color from "@constants/color";
import { UserTab, LogTab, MenuTab, BetweenTab, ExploreTab } from "./tabIcons";
import { FONTS } from "@constants/fonts";
import { TabType } from "../../types/tabs";
import SCButton from "./SCButton";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';

interface IBottomTabsProps {
  name?: TabType;
}

export default function BottomTabs({ name = "log" }: IBottomTabsProps) {
  const [activeTab, setActiveTab] = useState(name);
  const [isCenterOpen, setIsCenterOpen] = useState(false);

  const animation = useRef(new Animated.Value(88)).current; // start height

  const groupOpacity = useRef(new Animated.Value(0)).current;
const groupTranslate = useRef(new Animated.Value(20)).current;

const toggleCenter = () => {
  const toHeight = isCenterOpen ? 88 : 207;
  setIsCenterOpen(!isCenterOpen);

  Animated.parallel([
    Animated.timing(animation, {
      toValue: toHeight,
      duration: 250,
      useNativeDriver: false,
    }),
    Animated.timing(groupOpacity, {
      toValue: isCenterOpen ? 0 : 1,
      duration: 250,
      useNativeDriver: true,
    }),
    Animated.timing(groupTranslate, {
      toValue: isCenterOpen ? 20 : 0,
      duration: 250,
      useNativeDriver: true,
    }),
  ]).start();
};


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
    <Animated.View style={[styles.container, { height: animation }]}>
     <Animated.View
  style={[
    styles.groupButtons,
    {
      opacity: groupOpacity,
      transform: [{ translateY: groupTranslate }],
    },
  ]}
  pointerEvents={isCenterOpen ? "auto" : "none"}
>

        <SCButton
          title="Thư viện món ăn"
          bgColor={Color.fast_button}
          color={Color.black}
          iconPos="top"
          icon={<MaterialIcons name="collections-bookmark" size={18} color="black" />}
          fontSize={8}
          width={77}
          height={77}
          textAlign="center"
          onPress={() => {}}
        />
        <SCButton
          title="Chụp ảnh"
          bgColor={Color.fast_button}
          color={Color.black}
          iconPos="top"
          icon={<Octicons name="screen-full" size={18} color="black" />}
          fontSize={8}
          width={77}
          height={77}
          textAlign="center"
          onPress={() => {}}
        />
        <SCButton
          title="Thể dục"
          bgColor={Color.fast_button}
          color={Color.black}
          iconPos="top"
          icon={<FontAwesome5 name="dumbbell" size={18} color="black" />}
          fontSize={8}
          width={77}
          height={77}
          textAlign="center"
          onPress={() => {}}
        />
        <SCButton
          title="Chỉ số cơ thể"
          bgColor={Color.fast_button}
          color={Color.black}
          iconPos="top"
          icon={<Ionicons name="sparkles" size={18} color="black" />}
          fontSize={8}
          width={77}
          height={77}
          textAlign="center"
          onPress={() => {}}
        />
      </Animated.View>

      <View style={styles.centerTabOuter} />

      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const IconComponent = tab.component;
          if (tab.key === "center") {
            return (
              <TouchableOpacity
                key={tab.key}
                style={styles.centerTabWrapper}
                onPress={toggleCenter}
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-end",
    alignItems: "center",
    position: "relative",
    width: "100%",
    backgroundColor: "white",
    borderRadius: 18,
  },
  groupButtons: {
    position: "absolute",
    bottom: 80,
    height: 119, // max height của group buttons
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    gap: 15,
    paddingVertical: 12,
  },
  tabBar: {
    width: "100%",
    height: 88,
    flexDirection: "row",
    backgroundColor: Color.white,
    borderTopWidth: 1,
    borderColor: Color.border,
    justifyContent: "space-around",
    zIndex: 1,
    position: "relative",
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
    zIndex: 0,
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

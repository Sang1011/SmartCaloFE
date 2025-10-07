import color from "@constants/color";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";
import { Platform, StatusBar } from "react-native";

type BarStyle = "light-content" | "dark-content";
type ButtonStyle = "light" | "dark";

interface SystemFieldProps {
  statusBarColor?: string;
  statusBarStyle?: BarStyle;
  navigationBarColor?: string;
  navigationButtonStyle?: ButtonStyle;
  edgeToEdge?: boolean; 
}

export async function setSystemBars({
  statusBarColor = color.white,
  statusBarStyle = "dark-content",
  navigationBarColor = color.white,
  navigationButtonStyle = "dark",
  edgeToEdge = true,
}: SystemFieldProps = {}) {
  // StatusBar
  StatusBar.setBarStyle(statusBarStyle, true);

  if (Platform.OS === "android") {
    StatusBar.setBackgroundColor(statusBarColor, true);
    StatusBar.setTranslucent(true); 

    if (edgeToEdge) {
      await NavigationBar.setBackgroundColorAsync("transparent");
      await NavigationBar.setBehaviorAsync("overlay-swipe");
    } else {
      await NavigationBar.setBackgroundColorAsync(navigationBarColor);
      await NavigationBar.setBehaviorAsync("inset-swipe");
    }

    await NavigationBar.setButtonStyleAsync(navigationButtonStyle);
  }
}

export function useSystemBars(options: SystemFieldProps = {}) {
  useEffect(() => {
    setSystemBars(options);
  }, [
    options.statusBarColor,
    options.statusBarStyle,
    options.navigationBarColor,
    options.navigationButtonStyle,
    options.edgeToEdge,
  ]);
}
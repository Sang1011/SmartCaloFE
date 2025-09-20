import { StyleSheet } from "react-native";

export const FONTS = {
  thin: "Montserrat-Thin",
  thinItalic: "Montserrat-ThinItalic",
  extraLight: "Montserrat-ExtraLight",
  extraLightItalic: "Montserrat-ExtraLightItalic",
  light: "Montserrat-Light",
  lightItalic: "Montserrat-LightItalic",
  regular: "Montserrat-Regular",
  italic: "Montserrat-Italic",
  medium: "Montserrat-Medium",
  mediumItalic: "Montserrat-MediumItalic",
  semiBold: "Montserrat-SemiBold",
  semiBoldItalic: "Montserrat-SemiBoldItalic",
  bold: "Montserrat-Bold",
  boldItalic: "Montserrat-BoldItalic",
  extraBold: "Montserrat-ExtraBold",
  extraBoldItalic: "Montserrat-ExtraBoldItalic",
  black: "Montserrat-Black",
  blackItalic: "Montserrat-BlackItalic",
};

export const globalStyles = StyleSheet.create({
  thin: { fontFamily: FONTS.thin },                     // 100
  thinItalic: { fontFamily: FONTS.thinItalic },         // 100 italic
  extraLight: { fontFamily: FONTS.extraLight },         // 200
  extraLightItalic: { fontFamily: FONTS.extraLightItalic }, // 200 italic
  light: { fontFamily: FONTS.light },                   // 300
  lightItalic: { fontFamily: FONTS.lightItalic },       // 300 italic
  regular: { fontFamily: FONTS.regular },               // 400
  italic: { fontFamily: FONTS.italic },                 // 400 italic
  medium: { fontFamily: FONTS.medium },                 // 500
  mediumItalic: { fontFamily: FONTS.mediumItalic },     // 500 italic
  semiBold: { fontFamily: FONTS.semiBold },             // 600
  semiBoldItalic: { fontFamily: FONTS.semiBoldItalic }, // 600 italic
  bold: { fontFamily: FONTS.bold },                     // 700
  boldItalic: { fontFamily: FONTS.boldItalic },         // 700 italic
  extraBold: { fontFamily: FONTS.extraBold },           // 800
  extraBoldItalic: { fontFamily: FONTS.extraBoldItalic }, // 800 italic
  black: { fontFamily: FONTS.black },                   // 900
  blackItalic: { fontFamily: FONTS.blackItalic },       // 900 italic
});


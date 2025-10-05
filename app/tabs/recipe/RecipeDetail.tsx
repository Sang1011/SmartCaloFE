// import color from "@constants/color";
// import { FONTS } from "@constants/fonts";
// import { Ionicons } from "@expo/vector-icons";
// import { router, useLocalSearchParams } from "expo-router";
// import React, { useState } from "react";
// import {
//   Image,
//   ImageBackground,
//   ImageSourcePropType,
//   Pressable,
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// // --- Giả lập dữ liệu ---
// type FoodItemType = {
//   name: string;
//   calories: number;
//   carb: number;
//   protein: number;
//   fat: number;
//   image: ImageSourcePropType; // Sử dụng type này cho require()
// };

// type MealType = {
//   name: string;
//   totalCalories: number;
//   items: FoodItemType[];
// };
// const mockRecipeData = {
//   id: 1,
//   title: "Meal plan chuẩn gym: Tăng cơ, Giảm mỡ, Sống khỏe",
//   image: require("../../../assets/images/recipeDetail/recipe_header.png"), // Thay bằng ảnh nền của bạn
//   dailyData: {
//     totalCalories: 1290,
//     protein: 90.3,
//     fat: 43.4,
//     carbs: 135.8,
//   },
//   meals: [
//     {
//       name: "Buổi sáng",
//       totalCalories: 240,
//       items: [
//         {
//           name: "Trứng ốp la",
//           calories: 84,
//           carb: 0.9,
//           protein: 6.4,
//           fat: 6.1,
//           image: require("../../../assets/images/recipeDetail/dish_egg.png"), // Thay bằng ảnh món ăn
//         },
//         {
//           name: "Bánh mì Sandwich",
//           calories: 145,
//           carb: 25.9,
//           protein: 5,
//           fat: 2.5,
//           image: require("../../../assets/images/recipeDetail/dish_sandwich.png"), // Thay bằng ảnh món ăn
//         },
//       ],
//     },
//     {
//       name: "Buổi trưa",
//       totalCalories: 432,
//       items: [
//         {
//           name: "Súp lơ xanh luộc",
//           calories: 40,
//           carb: 6.1,
//           protein: 3.1,
//           fat: 0.3,
//           image: require("../../../assets/images/recipeDetail/dish_brocoli.png"), // Thay bằng ảnh món ăn
//         },
//         {
//           name: "Cơm gạo lứt đỏ",
//           calories: 169,
//           carb: 35.8,
//           protein: 3.5,
//           fat: 1.3,
//           image: require("../../../assets/images/recipeDetail/dish_rice.png"), // Thay bằng ảnh món ăn
//         },
//         {
//           name: "Gà kho sả",
//           calories: 223,
//           carb: 7.8,
//           protein: 26.7,
//           fat: 9.9,
//           image: require("../../../assets/images/recipeDetail/dish_chicken.png"), // Thay bằng ảnh món ăn
//         },
//       ],
//     },
//     {
//       name: "Buổi tối",
//       totalCalories: 449,
//       items: [
//         {
//           name: "Su su luộc",
//           calories: 25,
//           carb: 5.1,
//           protein: 0.9,
//           fat: 0.1,
//           image: require("../../../assets/images/recipeDetail/dish_su.png"), // Thay bằng ảnh món ăn
//         },
//         {
//           name: "Ức gà áp chảo",
//           calories: 302,
//           carb: 1.2,
//           protein: 57.4,
//           fat: 8,
//           image: require("../../../assets/images/recipeDetail/dish_chicken_breast.png"), // Thay bằng ảnh món ăn
//         },
//         {
//           name: "Khoai lang luộc",
//           calories: 122,
//           carb: 23.2,
//           protein: 0.8,
//           fat: 0.2,
//           image: require("../../../assets/images/recipeDetail/dish_sweet_potato.png"), // Thay bằng ảnh món ăn
//         },
//       ],
//     },
//   ],
// };

// // --- Component chính ---
// export default function RecipeDetailScreen() {
//   const { recipeId } = useLocalSearchParams(); // Nhận ID từ màn hình trước
//   const [activeDay, setActiveDay] = useState(1);
//   const data = mockRecipeData; // Trong thực tế, bạn sẽ dùng recipeId để fetch data

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="light-content" />
//       <ScrollView style={styles.container}>
//         {/* Phần Header với ảnh nền */}
//         <ImageBackground source={data.image} style={styles.headerBackground}>
//           <Pressable onPress={() => router.back()} style={styles.backButton}>
//             <Ionicons name="arrow-back" size={24} color={color.white} />
//           </Pressable>
//           <Text style={styles.headerTitle}>{data.title}</Text>
//         </ImageBackground>

//         <View style={styles.content}>
//           {/* Chọn ngày */}
//           <Text style={styles.sectionTitle}>Thực đơn theo ngày</Text>
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             style={styles.daySelector}
//           >
//             {[1, 2, 3, 4, 5, 6, 7].map((day) => (
//               <TouchableOpacity
//                 key={day}
//                 style={[
//                   styles.dayButton,
//                   activeDay === day && styles.dayButtonActive,
//                 ]}
//                 onPress={() => setActiveDay(day)}
//               >
//                 <Text
//                   style={[
//                     styles.dayText,
//                     activeDay === day && styles.dayTextActive,
//                   ]}
//                 >
//                   {day}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>

//           {/* Giá trị dinh dưỡng */}
//           <View style={styles.nutritionSection}>
//             <View style={styles.nutritionHeader}>
//               <Text style={styles.sectionTitle}>Giá trị dinh dưỡng</Text>
//               <Pressable>
//                 <Text style={styles.viewAllText}>Xem tất cả</Text>
//               </Pressable>
//             </View>
//             <Text style={styles.totalCalories}>
//               Tổng calo trong ngày:{" "}
//               <Text style={{ fontFamily: FONTS.bold }}>
//                 {data.dailyData.totalCalories} calo
//               </Text>
//             </Text>
//             <View style={styles.macrosContainer}>
//               <MacroCard
//                 label="Protein"
//                 value={`${data.dailyData.protein}g`}
//                 color={"#2F54D9"}
//               />
//               <MacroCard
//                 label="Chất béo"
//                 value={`${data.dailyData.fat}g`}
//                 color={"#C2728E"}
//               />
//               <MacroCard
//                 label="Tinh bột"
//                 value={`${data.dailyData.carbs}g`}
//                 color={"#26843D"}
//               />
//             </View>
//           </View>

//           {/* Các bữa ăn */}
//           {data.meals.map((meal, index) => (
//             <MealSection key={index} meal={meal} />
//           ))}

//           {/* Các nút bấm ở cuối */}
//           <View style={styles.footerButtons}>
//             <TouchableOpacity style={styles.customizeButton}>
//               <Text style={styles.customizeButtonText}>Tùy chỉnh thực đơn</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.followButton}>
//               <Text style={styles.followButtonText}>Ăn theo thực đơn này</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// // --- Các Component phụ ---
// // --- Định nghĩa kiểu cho Props ---
// type MacroCardProps = {
//   label: string;
//   value: string;
//   color: string;
// };

// type MealSectionProps = {
//   meal: MealType;
// };

// type FoodItemProps = {
//   item: FoodItemType;
// };

// // --- Các Component phụ (Đã được sửa lỗi TypeScript) ---
// const MacroCard: React.FC<MacroCardProps> = ({
//   label,
//   value,
//   color: bgColor,
// }) => (
//   <View style={[styles.macroCard, { backgroundColor: bgColor }]}>
//     <View style={[styles.macroDot, { backgroundColor: color.white }]} />
//     <Text style={styles.macroLabel}>{label}</Text>
//     <Text style={styles.macroValue}>{value}</Text>
//   </View>
// );

// const MealSection: React.FC<MealSectionProps> = ({ meal }) => (
//   <View style={styles.mealSection}>
//     <View style={styles.mealHeader}>
//       <Text style={styles.mealTitle}>{meal.name}</Text>
//       <Text style={styles.mealCalories}>{meal.totalCalories} calo</Text>
//     </View>
//     {/* TypeScript sẽ tự động suy ra kiểu của 'item' và 'index' ở đây */}
//     {meal.items.map((item, index) => (
//       <FoodItem key={index} item={item} />
//     ))}
//   </View>
// );

// const FoodItem: React.FC<FoodItemProps> = ({ item }) => (
//   <TouchableOpacity style={styles.foodItem}>
//     <Image source={item.image} style={styles.foodImage} />
//     <View style={styles.foodDetails}>
//       <Text style={styles.foodName}>{item.name}</Text>
//       <Text style={styles.foodCalorieInfo}>Calo: {item.calories}</Text>
//       <View style={styles.foodMacros}>
//         <Text style={styles.macroText}>{item.carb}g Carb</Text>
//         <Text style={styles.macroText}>{item.protein}g Protein</Text>
//         <Text style={styles.macroText}>{item.fat}g Fat</Text>
//       </View>
//     </View>
//     <View style={styles.viewDetailsContainer}>
//       <Text style={styles.viewDetailsText}>Xem chi tiết</Text>
//       <Ionicons name="chevron-forward" size={16} color={color.grey} />
//     </View>
//   </TouchableOpacity>
// );

// // --- StyleSheet ---
// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: color.white },
//   container: { flex: 1, backgroundColor: color.light_gray },
//   headerBackground: {
//     height: 200,
//     justifyContent: "flex-end",
//     padding: 16,
//   },
//   backButton: {
//     position: "absolute",
//     top: 50,
//     left: 16,
//     backgroundColor: "rgba(0,0,0,0.3)",
//     borderRadius: 15,
//     padding: 5,
//   },
//   headerTitle: {
//     fontSize: 22,
//     fontFamily: FONTS.bold,
//     color: color.white,
//     textShadowColor: "rgba(0, 0, 0, 0.75)",
//     textShadowOffset: { width: -1, height: 1 },
//     textShadowRadius: 10,
//   },
//   content: { padding: 16 },
//   sectionTitle: {
//     fontSize: 18,
//     fontFamily: FONTS.semiBold,
//     color: color.black,
//     marginBottom: 12,
//   },
//   daySelector: {
//     flexDirection: "row",
//     marginBottom: 20,
//   },
//   dayButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: color.white,
//     marginRight: 10,
//     borderWidth: 1,
//     borderColor: color.border,
//   },
//   dayButtonActive: {
//     backgroundColor: color.dark_green,
//     borderColor: color.dark_green,
//   },
//   dayText: {
//     fontSize: 16,
//     fontFamily: FONTS.medium,
//     color: color.black,
//   },
//   dayTextActive: {
//     color: color.white,
//     fontFamily: FONTS.bold,
//   },
//   nutritionSection: {
//     marginBottom: 20,
//     backgroundColor: color.white,
//     padding: 12,
//     borderRadius: 15,
//   },
//   nutritionHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   viewAllText: {
//     fontSize: 14,
//     color: color.dark_green,
//     fontFamily: FONTS.medium,
//   },
//   totalCalories: {
//     fontSize: 14,
//     fontFamily: FONTS.regular,
//     color: color.grey,
//     marginTop: -5,
//     marginBottom: 12,
//   },
//   macrosContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     gap: 10,
//   },
//   macroCard: {
//     flex: 1,
//     padding: 10,
//     borderRadius: 10,
//     alignItems: "flex-start",
//   },
//   macroDot: { width: 8, height: 8, borderRadius: 4, marginBottom: 6 },
//   macroLabel: {
//     fontSize: 12,
//     color: color.white,
//     fontFamily: FONTS.medium,
//   },
//   macroValue: {
//     fontSize: 14,
//     color: color.white,
//     fontFamily: FONTS.bold,
//   },
//   mealSection: {
//     marginBottom: 16,
//   },
//   mealHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   mealTitle: {
//     fontSize: 18,
//     fontFamily: FONTS.semiBold,
//     color: color.black,
//   },
//   mealCalories: {
//     fontSize: 14,
//     fontFamily: FONTS.medium,
//     color: color.grey,
//   },
//   foodItem: {
//     flexDirection: "row",
//     backgroundColor: color.white,
//     borderRadius: 15,
//     padding: 10,
//     marginBottom: 10,
//     alignItems: "center",
//   },
//   foodImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 10,
//   },
//   foodDetails: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   foodName: {
//     fontSize: 16,
//     fontFamily: FONTS.semiBold,
//     color: color.black,
//   },
//   foodCalorieInfo: {
//     fontSize: 12,
//     fontFamily: FONTS.regular,
//     color: color.grey,
//     marginVertical: 2,
//   },
//   foodMacros: {
//     flexDirection: "row",
//     gap: 12,
//   },
//   macroText: {
//     fontSize: 12,
//     fontFamily: FONTS.medium,
//     color: color.grey,
//   },
//   viewDetailsContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     position: "absolute",
//     right: 10,
//     top: 10,
//   },
//   viewDetailsText: {
//     fontSize: 12,
//     color: color.grey,
//     fontFamily: FONTS.regular,
//   },
//   footerButtons: {
//     marginTop: 20,
//     marginBottom: 30,
//     gap: 12,
//   },
//   customizeButton: {
//     paddingVertical: 15,
//     borderRadius: 30,
//     borderWidth: 1.5,
//     borderColor: color.dark_green,
//     alignItems: "center",
//   },
//   customizeButtonText: {
//     fontSize: 16,
//     color: color.dark_green,
//     fontFamily: FONTS.bold,
//   },
//   followButton: {
//     paddingVertical: 15,
//     borderRadius: 30,
//     backgroundColor: color.dark_green,
//     alignItems: "center",
//   },
//   followButtonText: {
//     fontSize: 16,
//     color: color.white,
//     fontFamily: FONTS.bold,
//   },
// });

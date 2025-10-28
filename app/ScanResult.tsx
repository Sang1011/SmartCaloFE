import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { fetchDishById } from "@features/dishes";
import { createLogEntryThunk } from "@features/tracking";
import { RootState } from "@redux";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { navigateCustom } from "@utils/navigation";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CreateEntryLogRequestBody, MealType } from "../types/tracking";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ScanResult() {
  const { dishId, confidence, uri } = useLocalSearchParams();
  const dispatch = useAppDispatch();

  const { selectedDish, loading } = useAppSelector(
    (state: RootState) => state.dish
  );

  const { loading: createLoading } = useAppSelector(
    (state: RootState) => state.tracking
  );

  const [scanning, setScanning] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const [getUri, setUri] = useState<string>("");

  useEffect(() => {
    if (dishId) {
      dispatch(fetchDishById(dishId as string));
    }
  }, [dishId, dispatch]);

  useEffect(() => {
    if(uri){
      setUri(uri as string);
    }
    if (!loading && selectedDish) {
      startScanAnimation();
    }
  }, [loading, uri, selectedDish]);

  const startScanAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setScanning(false);
            showResultAnimation();
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);
  };

  const showResultAnimation = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start(() => setShowResult(true));
  };

  const handleClose = () => {
    navigateCustom("/tabs");
  };

  const [mealType, setMealType] = useState<MealType>(MealType.Breakfast);
  const [mealTypeModalVisible, setMealTypeModalVisible] = useState(false);

  const handleAddPress = () => {
    setMealTypeModalVisible(true);
  };

  const mealTypeOptions = [
    { label: "Bữa sáng", value: MealType.Breakfast },
    { label: "Bữa trưa", value: MealType.Lunch },
    { label: "Bữa tối", value: MealType.Dinner },
    { label: "Ăn nhẹ", value: MealType.Snack },
  ];

  const handleSelectMealType = async (selectedType: MealType) => {
    if (!selectedDish) return;
    setMealType(selectedType);
    setMealTypeModalVisible(false);

    const body: CreateEntryLogRequestBody = {
      dishId: selectedDish.id,
      quantity: 1,
      mealType: selectedType,
      sourceType: 1,
      date: new Date().toLocaleDateString("en-CA"),
      foodName: selectedDish.name,
      calories: selectedDish.calories,
      protein: selectedDish.protein,
      carbs: selectedDish.carbs,
      fat: selectedDish.fat,
      fiber: selectedDish.fiber,
      sugar: selectedDish.sugar,
    };

    try {
      await dispatch(createLogEntryThunk({ body })).unwrap();
      alert("✅ Đã thêm vào lịch sử thành công!");
      navigateCustom("/tabs");
    } catch (error: any) {
      console.error("❌ Lỗi khi thêm log món ăn:", error);

      if (error?.status === 403 || error?.response?.status === 403) {
        Alert.alert(
          "Nâng cấp tài khoản",
          "Vui lòng nâng cấp tài khoản của bạn lên bản trả phí để sử dụng tính năng này!",
          [
            {
              text: "Nâng cấp ngay",
              style: "default",
              onPress: () => navigateCustom("/subscription"),
            },
            {
              text: "Rời khỏi",
              style: "cancel",
              onPress: () => navigateCustom("/tabs"),
            },
          ]
        );
      } else {
        alert("❌ Lỗi khi thêm log món ăn: " + (error?.message || "Không xác định"));
      }
    }
  };

  const handleScanAgain = () => {
    navigateCustom("/scan");
  };

  if (loading || !selectedDish) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={color.dark_green} />
      </View>
    );
  }

  const scanLineTranslateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 350],
  });

  if (scanning) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.scanOverlay}>
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />

            <Image
              source={{ uri: getUri }}
              style={styles.scanImage}
            />

            <Animated.View
              style={[
                styles.scanLine,
                {
                  transform: [{ translateY: scanLineTranslateY }],
                },
              ]}
            />
          </View>

          <View style={styles.scanInfo}>
            <Text style={styles.scanDots}>● ● ●</Text>
            <Text style={styles.scanText}>Đang phân tích món ăn</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{progress}%</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <AntDesign name="close" size={24} color={color.white} />
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.resultContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: selectedDish.imageUrl }}
              style={styles.dishImage}
            />
            <View style={styles.imageOverlay} />
          </View>
          <View style={styles.successBadge}>
            <View style={styles.checkIcon}>
              <Ionicons name="checkmark" size={16} color={color.white} />
            </View>
            <Text style={styles.successText}>Nhận diện thành công!</Text>
            {confidence && (
              <Text style={styles.confidenceText}>
                {(parseFloat(confidence as string) * 100).toFixed(1)}% độ chính
                xác
              </Text>
            )}
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.dishName}>{selectedDish.name}</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Ionicons
                name="restaurant"
                size={18}
                color={color.gray}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.category}>{selectedDish.category}</Text>
            </View>

            {/* Quick Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons
                  name="flame"
                  size={28}
                  color={color.dark_green}
                  style={{ marginBottom: 5 }}
                />
                <Text style={styles.statValue}>
                  {selectedDish.calories || 0}
                </Text>
                <Text style={styles.statLabel}>Calo</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons
                  name="time-outline"
                  size={28}
                  color={color.dark_green}
                  style={{ marginBottom: 5 }}
                />
                <Text style={styles.statValue}>
                  {selectedDish.cookingTime || 0}
                </Text>
                <Text style={styles.statLabel}>Phút</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons
                  name="people-outline"
                  size={28}
                  color={color.dark_green}
                  style={{ marginBottom: 5 }}
                />
                <Text style={styles.statValue}>
                  {selectedDish.servings || 1}
                </Text>
                <Text style={styles.statLabel}>Phần</Text>
              </View>
            </View>

            {/* Nutrition Cards */}
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionCard}>
                <MaterialCommunityIcons
                  name="arm-flex"
                  size={32}
                  color={color.dark_green}
                  style={{ marginBottom: 8 }}
                />
                <Text style={styles.nutritionLabel}>Protein</Text>
                <Text style={styles.nutritionValue}>
                  {selectedDish.protein || 0}g
                </Text>
              </View>
              <View style={styles.nutritionCard}>
                <MaterialCommunityIcons
                  name="barley"
                  size={32}
                  color={color.dark_green}
                  style={{ marginBottom: 8 }}
                />
                <Text style={styles.nutritionLabel}>Carbs</Text>
                <Text style={styles.nutritionValue}>
                  {selectedDish.carbs || 0}g
                </Text>
              </View>
              <View style={styles.nutritionCard}>
                <MaterialCommunityIcons
                  name="food-steak"
                  size={32}
                  color={color.dark_green}
                  style={{ marginBottom: 8 }}
                />
                <Text style={styles.nutritionLabel}>Chất béo</Text>
                <Text style={styles.nutritionValue}>
                  {selectedDish.fat || 0}g
                </Text>
              </View>
            </View>

            {/* Description */}
            {selectedDish.description && (
              <View style={styles.descriptionBox}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <Ionicons
                    name="document-text-outline"
                    size={18}
                    color={color.black}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.sectionTitle}>Mô tả</Text>
                </View>
                <Text style={styles.description}>
                  {selectedDish.description}
                </Text>
              </View>
            )}

            {/* Ingredients */}
            {selectedDish.ingredients && (
              <View style={styles.ingredientsBox}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <Ionicons
                    name="cart-outline"
                    size={18}
                    color={color.black}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.sectionTitle}>Nguyên liệu</Text>
                </View>
                <View style={styles.ingredientTags}>
                  {(typeof selectedDish.ingredients === "string"
                    ? selectedDish.ingredients.split(",")
                    : selectedDish.ingredients
                  ).map((ing, index) => (
                    <View key={index} style={styles.ingredientTag}>
                      <Text style={styles.ingredientText}>{ing.trim()}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleAddPress}
                disabled={createLoading}
              >
                <Text style={styles.primaryButtonText}>Thêm vào lịch sử</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleScanAgain}
                disabled={createLoading}
              >
                <Text style={styles.secondaryButtonText}>Quét món khác</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Animated.View>
      <Modal
        visible={mealTypeModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMealTypeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setMealTypeModalVisible(false)}
            >
              <AntDesign name="close" size={22} color={color.gray} />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Chọn loại bữa ăn</Text>
            <View style={styles.modalOptions}>
              {mealTypeOptions.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={styles.modalOption}
                  onPress={() => handleSelectMealType(item.value)}
                >
                  <Text style={styles.modalOptionText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: color.black,
  },

  // Scanning Styles
  scanOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  scanFrame: {
    width: SCREEN_WIDTH - 60,
    height: 400,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    backgroundColor: color.dark_green + "20",
    borderWidth: 3,
    borderColor: color.dark_green,
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: color.dark_green,
    zIndex: 10,
  },
  topLeft: {
    top: -3,
    left: -3,
    borderTopWidth: 5,
    borderLeftWidth: 5,
    borderTopLeftRadius: 20,
  },
  topRight: {
    top: -3,
    right: -3,
    borderTopWidth: 5,
    borderRightWidth: 5,
    borderTopRightRadius: 20,
  },
  bottomLeft: {
    bottom: -3,
    left: -3,
    borderBottomWidth: 5,
    borderLeftWidth: 5,
    borderBottomLeftRadius: 20,
  },
  bottomRight: {
    bottom: -3,
    right: -3,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    borderBottomRightRadius: 20,
  },
  scanImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  scanLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: color.dark_green,
    shadowColor: color.dark_green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 10,
  },
  scanInfo: {
    marginTop: 40,
    alignItems: "center",
  },
  scanDots: {
    fontSize: 24,
    color: color.dark_green,
    fontFamily: FONTS.bold,
    marginBottom: 12,
  },
  scanText: {
    fontSize: 18,
    color: color.white,
    fontFamily: FONTS.medium,
    marginBottom: 20,
  },
  progressBar: {
    width: SCREEN_WIDTH - 100,
    height: 8,
    backgroundColor: color.white + "30",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressFill: {
    height: "100%",
    backgroundColor: color.dark_green,
    borderRadius: 10,
  },
  progressText: {
    fontSize: 20,
    color: color.dark_green,
    fontFamily: FONTS.bold,
  },

  // Result Styles
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 100,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: color.black + "30",
    justifyContent: "center",
    alignItems: "center",
  },
  resultContainer: {
    flex: 1,
  },
  successBadge: {
    backgroundColor: color.dark_green,
    paddingHorizontal: 20,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    paddingVertical: 12,
    marginBottom: 20,
    gap: 8,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: color.white + "30",
    justifyContent: "center",
    alignItems: "center",
  },
  successText: {
    fontSize: 16,
    color: color.white,
    fontFamily: FONTS.bold,
  },
  confidenceText: {
    fontSize: 14,
    color: color.white + "90",
    fontFamily: FONTS.medium,
  },
  imageContainer: {
    width: SCREEN_WIDTH - 40,
    marginTop: 40,
    height: 280,
    alignSelf: "center",
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    marginBottom: 20,
  },
  dishImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "linear-gradient(transparent, rgba(0,0,0,0.7))",
  },
  infoContainer: {
    backgroundColor: color.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 40,
  },
  dishName: {
    fontSize: 28,
    color: color.black,
    fontFamily: FONTS.bold,
    marginBottom: 8,
    textAlign: "center",
  },
  category: {
    fontSize: 16,
    color: color.gray,
    fontFamily: FONTS.medium,
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    paddingVertical: 15,
    backgroundColor: color.light_gray + "30",
    borderRadius: 15,
  },
  statItem: {
    alignItems: "center",
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 5,
  },
  statValue: {
    fontSize: 20,
    color: color.dark_green,
    fontFamily: FONTS.bold,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: color.gray,
    fontFamily: FONTS.regular,
  },
  nutritionGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 10,
  },
  nutritionCard: {
    flex: 1,
    backgroundColor: color.white,
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    borderWidth: 2,
    borderColor: color.light_gray,
  },
  nutritionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  nutritionLabel: {
    fontSize: 12,
    color: color.gray,
    fontFamily: FONTS.medium,
    marginBottom: 5,
  },
  nutritionValue: {
    fontSize: 18,
    color: color.dark_green,
    fontFamily: FONTS.bold,
  },
  descriptionBox: {
    backgroundColor: color.light_gray + "30",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    color: color.black,
    fontFamily: FONTS.bold,
  },
  description: {
    fontSize: 14,
    color: color.gray,
    fontFamily: FONTS.regular,
    lineHeight: 22,
  },
  ingredientsBox: {
    backgroundColor: color.light_gray + "30",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  ingredientTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  ingredientTag: {
    backgroundColor: color.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: color.dark_green + "30",
  },
  ingredientText: {
    fontSize: 13,
    color: color.dark_green,
    fontFamily: FONTS.medium,
  },
  actionButtons: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: color.dark_green,
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 16,
    color: color.white,
    fontFamily: FONTS.bold,
  },
  secondaryButton: {
    backgroundColor: color.white,
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: "center",
    borderWidth: 2,
    borderColor: color.dark_green,
  },
  secondaryButtonText: {
    fontSize: 16,
    color: color.dark_green,
    fontFamily: FONTS.bold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: SCREEN_WIDTH - 60,
    backgroundColor: color.white,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    position: "relative",
  },
  modalCloseButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: color.black,
    marginBottom: 20,
  },
  modalOptions: {
    width: "100%",
    gap: 12,
  },
  modalOption: {
    width: "100%",
    backgroundColor: color.light_gray + "40",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  modalOptionText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: color.dark_green,
  },
});

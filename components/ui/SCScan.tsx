import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import {
    ensureCameraPermission,
    ensureLibraryPermission,
} from "@utils/permissions";
import { CameraView } from "expo-camera";
import type { CameraType, FlashMode } from "expo-camera/build/Camera.types";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Animated,
    Image,
    StyleSheet,
    Text,
    View
} from "react-native";

import ButtonGoBack from "./buttonGoBack";
import ButtonScan from "./buttonScan";
import SCButton from "./SCButton";

import { predictionApi } from "@features/predictionAI/predictionAIApi";
import { fetchCurrentUserThunk } from "@features/users";
import { RootState } from "@redux";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { ACTIVE_SCAN, getUserStreakData, updateFreeScan } from "@utils/firebaseRealTime";
import { navigateCustom } from "@utils/navigation";
import { PredictResponse } from "../../types/prediction";

export default function SCScan() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(
    null
  );
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [type, setType] = useState<CameraType>("back");
  const [isFlashOn, setIsFlashOn] = useState<FlashMode>("off");
  const cameraRef = useRef<CameraView>(null);
  const [alreadyTaken, setAlreadyTaken] = useState<boolean>(false);

  // Animation for scanning effect
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const { user } = useAppSelector((state: RootState) => state.user);

  useEffect(() => {
    (async () => {
      const granted = await ensureCameraPermission();
      setHasCameraPermission(granted);
    })();
  }, []);

  // Start scanning animation when image is taken and loading
  useEffect(() => {
    if (alreadyTaken && loading) {
      startScanAnimation();
    } else {
      stopScanAnimation();
    }
  }, [alreadyTaken, loading]);

  const startScanAnimation = () => {
    // Scanning line animation
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

    // Pulse animation for the frame
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopScanAnimation = () => {
    scanLineAnim.stopAnimation();
    pulseAnim.stopAnimation();
    scanLineAnim.setValue(0);
    pulseAnim.setValue(1);
  };

  const uriToFile = (uri: string, filename: string, mimeType: string): File => {
    return {
        uri,
        name: filename,
        type: mimeType,
    } as unknown as File;
  };
    
  const handleConfirm = async () => {
    try {
      const updatedUser = await dispatch(fetchCurrentUserThunk()).unwrap();
  
      if (!updatedUser) {
        Alert.alert("Lỗi", "Vui lòng đăng nhập để sử dụng tính năng này!");
        return;
      }
  
      if (!imageUri || loading) return;
  
      if (updatedUser.currentPlanId === 1) {
        const userFromFB = await getUserStreakData(updatedUser.id);
  
        if (!userFromFB) {
          Alert.alert("Lỗi", "Không thể lấy thông tin người dùng!");
          return;
        }
  
        if (userFromFB.currentFreeScan >= ACTIVE_SCAN) {
          Alert.alert(
            "Đã hết lượt sử dụng miễn phí",
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
          return;
        }
  
        console.log(`🔍 Updating free scan: ${userFromFB.currentFreeScan} -> ${userFromFB.currentFreeScan + 1}`);
        await updateFreeScan(updatedUser.id);
      }
  
      const mimeType = imageUri.endsWith(".jpg") ? "image/jpeg" : "image/png";
      const filename = imageUri.substring(imageUri.lastIndexOf("/") + 1) || "photo.jpg";
      const imageFile = uriToFile(imageUri, filename, mimeType);
  
      setLoading(true);
  
      const response = await predictionApi.predictByAI(1, imageFile);
      console.log("RESPONSE DATA", response.data);
      console.log("RESPONSE STATUS", response.status);
  
      const data: PredictResponse = response?.data;
  
      if (data && data.dishes && data.dishes.length > 0) {
        setLoading(false);
  
        if (!alreadyTaken && !imageUri) return;
  
        setTimeout(() => {
          navigateCustom("/ScanResult", {
            params: {
              dishId: data.dishes[0].id,
              confidence: data.dishes[0].confidence,
              uri: imageUri,
            },
          });
        }, 800);
      } else {
        throw new Error("Không nhận diện được món ăn");
      }
    } catch (error) {
      console.warn("❌ Predict error:", error);
      Alert.alert("❌ Không thể nhận diện ảnh", "Vui lòng thử lại!");
      setLoading(false);
    }
  };
  
  
  const handleGoBack = () => {
    if (loading) {
      Alert.alert(
        "Đang quét món ăn",
        "Đang tiến hành quét món ăn, bạn có muốn hủy quét không?",
        [
          {
            text: "Tiếp tục quét",
            style: "cancel"
          },
          {
            text: "Hủy quét",
            style: "destructive",
            onPress: () => {
              setLoading(false);
              setAlreadyTaken(false);
              setImageUri(null);
            }
          }
        ]
      );
    } else if (alreadyTaken) {
      setAlreadyTaken(false);
      setImageUri(null);
    } else {
      navigateCustom("/tabs");
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          base64: true,
        });
        setImageUri(photo.uri);
        setIsFlashOn("off");
        setAlreadyTaken(true);
      } catch (error) {
        console.log("Error taking/uploading picture:", error);
      }
    }
  };

  const pickImage = async () => {
    try {
      const hasPermission = await ensureLibraryPermission();
      if (!hasPermission) {
        Alert.alert("Lỗi", "Vui lòng cấp quyền truy cập thư viện để chọn ảnh!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        setAlreadyTaken(true);
      }
    } catch (error) {
      console.warn("Lỗi khi chọn ảnh:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi chọn ảnh. Vui lòng thử lại!");
    }
  };
  
  const renderTakePictureContent = () => {
      if (!alreadyTaken) {
          return (
              <>
                <SCButton
                  bgColor={color.dark_green}
                  width={50}
                  height={50}
                  borderRadius={9999}
                  onPress={() =>
                    setType((prev) => (prev === "back" ? "front" : "back"))
                  }
                  icon={
                    <MaterialIcons
                      name="flip-camera-ios"
                      size={24}
                      color={color.white}
                    />
                  }
                />
    
                <ButtonScan onPress={takePicture} />
    
                <SCButton
                  bgColor={color.dark_green}
                  width={50}
                  height={50}
                  borderRadius={9999}
                  onPress={pickImage}
                  icon={<Ionicons name="image-outline" size={24} color={color.white} />}
                />
              </>
          );
      }
      
      if (loading) {
          return (
              <View style={styles.loadingContent}>
                <ActivityIndicator size="large" color={color.dark_green} />
                <Text style={styles.loadingText}>Đang nhận diện món ăn...</Text>
              </View>
          );
      }
      
      return (
          <SCButton
            bgColor={color.dark_green}
            width={138}
            height={41}
            fontFamily={FONTS.bold}
            fontSize={16}
            title="Xác nhận"
            onPress={handleConfirm}
            iconPos="left"
            disabled={loading}
            icon={<Octicons name="verified" size={24} color={color.white} />}
          />
      );
  };

  const scanLineTranslateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 400],
  });

  return (
    <View style={styles.container}>
      {imageUri && alreadyTaken && (
          <View style={[styles.camera, { backgroundColor: 'black' }]}>
            <Animated.View 
              style={[
                styles.imageContainer,
                loading && {
                  transform: [{ scale: pulseAnim }]
                }
              ]}
            >
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              
              {loading && (
                <>
                  {/* Scanning Frame */}
                  <View style={styles.scanFrame}>
                    <View style={[styles.corner, styles.topLeft]} />
                    <View style={[styles.corner, styles.topRight]} />
                    <View style={[styles.corner, styles.bottomLeft]} />
                    <View style={[styles.corner, styles.bottomRight]} />
                  </View>

                  {/* Scanning Line */}
                  <Animated.View
                    style={[
                      styles.scanLine,
                      {
                        transform: [{ translateY: scanLineTranslateY }],
                      },
                    ]}
                  />

                  {/* Scanning Dots */}
                  <View style={styles.scanDotsContainer}>
                    <Text style={styles.scanDots}>● ● ●</Text>
                  </View>
                </>
              )}
            </Animated.View>
          </View>
      )}

      {!alreadyTaken && (
        <CameraView
          style={styles.camera}
          ref={cameraRef}
          facing={type}
          flash={isFlashOn}
        />
      )}
      
      <View style={styles.backButton}>
        {alreadyTaken ? (
          <SCButton
            bgColor={color.white_50}
            width={50}
            height={50}
            borderRadius={10}
            onPress={handleGoBack}
            icon={<AntDesign name="close" size={24} color={color.white} />}
          />
        ) : (
          <ButtonGoBack link="/tabs"/>
        )}
      </View>

      <View style={styles.takePictureContainer}>
        {renderTakePictureContent()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "flex-start",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1,
  },
  camera: {
    width: "100%",
    height: "82%",
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  imagePreview: {
    flex: 1,
    resizeMode: 'contain',
  },
  takePictureContainer: {
    backgroundColor: color.white,
    height: 105,
    justifyContent: "space-around",
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    width: "100%",
    bottom: 0,
    left: 0,
    zIndex: 2,
  },
  loadingContent: {
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: color.dark_green,
  },
  // Scanning effects
  scanFrame: {
    position: 'absolute',
    top: '10%',
    left: '5%',
    right: '5%',
    bottom: '10%',
    borderWidth: 2,
    borderColor: color.dark_green,
    borderRadius: 12,
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: color.dark_green,
  },
  topLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 12,
  },
  scanLine: {
    position: 'absolute',
    left: '5%',
    right: '5%',
    height: 2,
    backgroundColor: color.dark_green,
    shadowColor: color.dark_green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
    top: '10%',
  },
  scanDotsContainer: {
    position: 'absolute',
    top: '5%',
    alignSelf: 'center',
  },
  scanDots: {
    fontSize: 20,
    color: color.dark_green,
    fontFamily: FONTS.bold,
  },
});
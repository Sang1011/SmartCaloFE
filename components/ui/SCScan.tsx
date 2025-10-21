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
import { ActivityIndicator, Alert, Image, StyleSheet, View } from "react-native";

import ButtonGoBack from "./buttonGoBack";
import ButtonScan from "./buttonScan";
import SCButton from "./SCButton";

import { predictionApi } from "@features/predictionAI/predictionAIApi";
import { useAppDispatch } from "@redux/hooks";
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

  useEffect(() => {
    (async () => {
      const granted = await ensureCameraPermission();
      setHasCameraPermission(granted);
    })();
  }, []);

  const uriToFile = (uri: string, filename: string, mimeType: string): File => {
    return {
        uri,
        name: filename,
        type: mimeType,
    } as unknown as File;
  };
    
  const handleConfirm = async () => {
    if (!imageUri) return;
  
    const mimeType = imageUri.endsWith(".jpg") ? "image/jpeg" : "image/png";
    const filename = imageUri.substring(imageUri.lastIndexOf("/") + 1) || "photo.jpg";
  
    const imageFile = uriToFile(imageUri, filename, mimeType);
    setLoading(true);
  
    try {
      // Gọi API
      setLoading(true);
      const response = await predictionApi.predictByAI(1, imageFile);
      console.log("RESPONSE DATA", response.data)
      console.log("RESPONSE STATUS", response.status)
      const data : PredictResponse = response?.data;
      if (data && data.dishes && data.dishes.length > 0) {
        setLoading(false);
        setTimeout(() => {
          navigateCustom("/dishes", {
            params: {
              id: data.dishes[0].id,
              predict: "true",
            }
          });
        }, 800);
      }
      
    } catch (error) {
      Alert.alert("❌ Không thể nhận diện ảnh");
    } finally {
      setLoading(false);
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
      console.error("Lỗi khi chọn ảnh:", error);
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
              <ActivityIndicator size="large" color={color.dark_green} />
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
            icon={<Octicons name="verified" size={24} color={color.white} />}
          />
      );
  };

  return (
    <View style={styles.container}>
      {imageUri && alreadyTaken && (
          <View style={[styles.camera, { backgroundColor: 'black' }]}>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} /> 
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
            onPress={() => setAlreadyTaken(false)}
            icon={<AntDesign name="close" size={24} color={color.white} />}
          />
        ) : (
          <ButtonGoBack />
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
});
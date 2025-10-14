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
import { StyleSheet, View } from "react-native";
import ButtonGoBack from "./buttonGoBack";
import ButtonScan from "./buttonScan";
import SCButton from "./SCButton";

export default function SCScan() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(
    null
  );
  const [image, setImage] = useState<string | null>(null);
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

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          base64: true,
        });
        setImage(photo.uri);
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
        alert("Vui lòng cấp quyền truy cập thư viện để chọn ảnh!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setImage(uri);
        setAlreadyTaken(true);
      }
    } catch (error) {
      console.error("Lỗi khi chọn ảnh:", error);
      alert("Đã xảy ra lỗi khi chọn ảnh. Vui lòng thử lại!");
    }
  };

  return (
    <View style={styles.container}>
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

      <CameraView style={styles.camera} ref={cameraRef} facing={type} />

      <View style={styles.takePictureContainer}>
        {!alreadyTaken ? (
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
        ) : (
          <SCButton
            bgColor={color.dark_green}
            width={138}
            height={41}
            fontFamily={FONTS.bold}
            fontSize={16}
            title="Xác nhận"
            onPress={() => setAlreadyTaken(false)}
            iconPos="left"
            icon={<Octicons name="verified" size={24} color={color.white} />}
          />
        )}
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
    backgroundColor: "blue",
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
  },
});

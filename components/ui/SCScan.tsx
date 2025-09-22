import { Camera, CameraView } from "expo-camera";
import type { CameraType, FlashMode } from "expo-camera/build/Camera.types";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import SCButton from "./SCButton";
import color from "@constants/color";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import ButtonScan from "./buttonScan";
import { useNavigation } from '@react-navigation/native';
import Octicons from '@expo/vector-icons/Octicons';
import { FONTS } from "@constants/fonts";
import AntDesign from '@expo/vector-icons/AntDesign';
import ButtonGoBack from "./buttonGoBack";
import Ionicons from "@expo/vector-icons/Ionicons";
// import * as ImagePicker from "expo-image-picker";
export default function SCScan() {
  const navigation = useNavigation();
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);
  const [image, setImage] = useState<string | null>(null);
  const [type, setType] = useState<CameraType>("back");
  const [isFlashOn, setIsFlashOn] = useState<FlashMode>("off");
  const cameraRef = useRef<CameraView>(null);
  const [alreadyTaken, setAlreadyTaken] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  const takePicture = async () => {
  if (cameraRef.current) {
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: true, // dùng để gửi xuống backend
      });

      setImage(photo.uri); // lưu URI hoặc bạn có thể lưu photo.base64

      // Gửi xuống backend
      // const formData = new FormData();
      // formData.append("file", {
      //   uri: photo.uri,
      //   type: "image/jpeg",
      //   name: "photo.jpg",
      // });

      // await fetch("https://your-backend.com/upload", {
      //   method: "POST",
      //   body: formData,
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // });
      setAlreadyTaken(true);
    } catch (error) {
      console.log("Error taking/uploading picture:", error);
    }
  }
};


  const pickImage = async () => {
//   const result = await ImagePicker.launchImageLibraryAsync({
//     mediaTypes: ImagePicker.MediaTypeOptions.Images,
//     allowsEditing: true,
//     quality: 1,
//   });

//   if (!result.canceled) {
//     setImage(result.assets[0].uri); // lưu URI của ảnh chọn
//   }
// }
}

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
            icon={
              <AntDesign name="close" size={24} color={color.white} />
            }
          />
        ) : (
          <ButtonGoBack />
        )}
        
      </View>
      <CameraView style={styles.camera} ref={cameraRef} facing={type} />
      <View style={styles.takePictureContainer}>
        {!alreadyTaken ? (
          <>
        <View style={styles.flipButton}>
          <SCButton
            bgColor={color.dark_green}
            width={50}
            height={50}
            borderRadius={9999}
            onPress={() => {
              setType((prev) => (prev === "back" ? "front" : "back"));
            }}
            icon={
              <MaterialIcons
                name="flip-camera-ios"
                size={24}
                color={color.white}
              />
            }
          />
        </View>
        <View style={styles.takePictureButton}>
          <ButtonScan onPress={takePicture} />
        </View>
        <View style={styles.imageLibraryButton}>
          <SCButton
            bgColor={color.dark_green}
            width={50}
            height={50}
            borderRadius={9999}
            onPress={() => pickImage()}
            icon={
              <Ionicons name="image-outline" size={24} color={color.white} />
            }
          />
        </View>
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
            icon={
              <Octicons name="verified" size={24} color={color.white} />
            }
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
  },
  flipButton: {},
  takePictureButton: {},
  imageLibraryButton: {},
});

import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { saveBooleanData, getBooleanData } from "@stores";
import { HAS_CAMERA_PERMISSION, HAS_LIBRARY_PERMISSION } from "@constants/app";

export async function ensureCameraPermission() {
  const hasPermission = await getBooleanData(HAS_CAMERA_PERMISSION);
  if (!hasPermission) {
    const { status } = await Camera.requestCameraPermissionsAsync();
    const granted = status === "granted";
    await saveBooleanData(HAS_CAMERA_PERMISSION, granted);
    return granted;
  }
  return true;
}

export async function ensureLibraryPermission() {
  const hasPermission = await getBooleanData(HAS_LIBRARY_PERMISSION);
  if (!hasPermission) {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const granted = status === "granted";
    await saveBooleanData(HAS_LIBRARY_PERMISSION, granted);
    return granted;
  }
  return true;
}
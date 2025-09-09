import AsyncStorage from '@react-native-async-storage/async-storage';

// Lưu Boolean
export const saveBooleanData = async (key: string, value: boolean) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving boolean data', error);
  }
};

// Lấy Boolean (nếu chưa tồn tại → false)
export const getBooleanData = async (key: string): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null ? JSON.parse(value) : false;
  } catch (error) {
    console.error('Error getting boolean data', error);
    return false;
  }
};

// Lưu String
export const saveStringData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error('Error saving string data', error);
  }
};

// Lấy String (nếu chưa tồn tại → "")
export const getStringData = async (key: string): Promise<string> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null ? value : '';
  } catch (error) {
    console.error('Error getting string data', error);
    return '';
  }
};

// Xóa dữ liệu
export const deleteLongTermData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error deleting data', error);
  }
};

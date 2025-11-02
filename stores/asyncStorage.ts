import AsyncStorage from '@react-native-async-storage/async-storage';

// Lưu Boolean
export const saveBooleanData = async (key: string, value: boolean) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Error saving boolean data', error);
  }
};

// Lấy Boolean (nếu chưa tồn tại → false)
export const getBooleanData = async (key: string): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null ? JSON.parse(value) : false;
  } catch (error) {
    console.warn('Error getting boolean data', error);
    return false;
  }
};

// Lưu String
export const saveStringData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.warn('Error saving string data', error);
  }
};

// Lấy String (nếu chưa tồn tại → "")
export const getStringData = async (key: string): Promise<string> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null ? value : '';
  } catch (error) {
    console.warn('Error getting string data', error);
    return '';
  }
};

// Xóa dữ liệu
export const deleteLongTermData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.warn('Error deleting data', error);
  }
};

// Lưu Number
export const saveNumberData = async (key: string, value: number) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Error saving number data', error);
  }
};

// Lấy Number (nếu chưa tồn tại → defaultValue)
export const getNumberData = async (
  key: string,  
  defaultValue: number
): Promise<number> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.warn('Error getting number data', error);
    return defaultValue;
  }
};

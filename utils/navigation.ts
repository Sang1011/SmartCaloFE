import { Route, router } from "expo-router";
import { saveBooleanData } from "../stores";

/**
 * Lưu flag và điều hướng sang màn hình tiếp theo
 */
export async function navigateWithFlag(
  nextRoute: string,
  flagKey?: string,
  value?: boolean
) {
  if (flagKey) {
    await saveBooleanData(flagKey, value ?? true);
  }
  router.replace(nextRoute as Route);
}

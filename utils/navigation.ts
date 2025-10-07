import { Route, router } from "expo-router";
import { saveBooleanData } from "../stores";

/**
 * Lưu flag và điều hướng sang màn hình tiếp theo
 * Hỗ trợ cả true và false giá trị
 */
type NavigateCustomOptions = {
  flagKey?: string;
  value?: boolean;
  params?: Record<string, any>;
};

export async function navigateCustom(
  nextRoute: string,
  options?: NavigateCustomOptions,
) {
  const { flagKey, value, params } = options ?? {};

  if (flagKey !== undefined) {
    const finalValue = value !== undefined ? value : true;
    await saveBooleanData(flagKey, finalValue);
    console.log(`Saved ${flagKey} = ${finalValue}`);
  }

  if (params) {
    return router.replace({
      pathname: nextRoute,
      params,
    } as unknown as Route);
  }

  return router.replace(nextRoute as Route);
}
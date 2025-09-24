import { Route, router } from "expo-router";
import { saveBooleanData } from "../stores";

/**
 * Lưu flag và điều hướng sang màn hình tiếp theo
 */
type navigateCustomOptions = {
  flagKey?: string;
  value?: boolean;
  params?: Record<string, any>;
};

export async function navigateCustom(
  nextRoute: string,
  options?: navigateCustomOptions,
) {
  const { flagKey, value, params } = options ?? {};

  if (flagKey) {
    await saveBooleanData(flagKey, value ?? true);
  }

  if (params) {
    return router.replace({
      pathname: nextRoute,
      params,
    } as unknown as Route);
  }

  return router.replace(nextRoute as Route);
}



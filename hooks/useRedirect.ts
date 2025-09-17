import { useEffect } from "react";
import { router } from "expo-router";
import { getBooleanData, saveBooleanData } from "../stores";
import {
  HAS_DONE_SURVEY,
  HAS_OPENED_APP,
  IS_LOGGED_IN,
} from "../constants/app";

export function useRedirect() {
  useEffect(() => {
    async function checkFlags() {
      const hasOpenedApp = await getBooleanData(HAS_OPENED_APP);
      const isLoggedIn = await getBooleanData(IS_LOGGED_IN);
      const hasDoneSurvey = await getBooleanData(HAS_DONE_SURVEY);

      if (!hasOpenedApp) {
        router.replace("/introScreen");
      } else if (!isLoggedIn) {
        router.replace("/login");
      } else if (!hasDoneSurvey) {
        router.replace("/(survey)/step1");
      } else {
        router.replace("/(tabs)");
      }
    }

    checkFlags();
  }, []);
}

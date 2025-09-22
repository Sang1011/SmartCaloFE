import { router } from "expo-router";
import { useEffect } from "react";
import {
  HAS_DONE_SURVEY,
  HAS_OPENED_APP,
  IS_LOGGED_IN,
} from "../constants/app";
import { getBooleanData } from "../stores";

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
        router.replace("/survey");
      } else {
        router.replace("/tabs");
      }
    }

    checkFlags();
  }, []);
}

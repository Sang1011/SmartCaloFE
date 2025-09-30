import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  HAS_DONE_SURVEY,
  HAS_OPENED_APP,
} from "../constants/app";
import { getBooleanData, getToken } from "../stores";
import { RootState } from "@redux";
import { useAppSelector } from "@redux/hooks";

export function useRedirect() {
  const reduxAccessToken = useAppSelector((state: RootState) => state.auth.accessToken);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [hasOpenedApp, setHasOpenedApp] = useState<boolean>(false);

  useEffect(() => {
    async function checkFlags() {
      const opened = await getBooleanData(HAS_OPENED_APP);
      const hasDoneSurvey = await getBooleanData(HAS_DONE_SURVEY);
      setHasOpenedApp(opened);

      const refreshToken = await getToken();
      const loggedIn = !!reduxAccessToken || !!refreshToken;
      setIsLoggedIn(loggedIn);
      
      if (!opened) {
        router.replace("/introScreen");
      } else if (!loggedIn) {
        router.replace("/login");
      } else if (!hasDoneSurvey) {
        router.replace("/survey");
      } else {
        router.replace("/tabs");
      }
    }

    checkFlags();
  }, [reduxAccessToken]);
}

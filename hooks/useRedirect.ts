// hooks/useRedirect.ts - VERSION 2 (AN TOÀN HƠN)
import { router } from "expo-router";
import { useEffect } from "react";
import {
  HAS_DONE_SURVEY,
  HAS_LOGGED_IN,
  HAS_OPENED_APP,
} from "../constants/app";
import { getBooleanData, saveBooleanData } from "../stores";

export function useRedirect() {
  useEffect(() => {
    let isMounted = true;

    async function checkFlags() {
      if (!isMounted) return;
      
      try {
        const opened = await getBooleanData(HAS_OPENED_APP);
        const hasDoneSurvey = await getBooleanData(HAS_DONE_SURVEY);
        const hasloggedIn = await getBooleanData(HAS_LOGGED_IN);
        
        console.log(' useRedirect values:', { 
          opened, 
          hasDoneSurvey, 
          hasloggedIn 
        });

        setTimeout(() => {
          if (!isMounted) return;
          
          if (!opened) {
            console.log('Redirecting to introScreen');
            router.replace("/introScreen");
          } else if (!hasloggedIn) {
            console.log('Redirecting to login');
            router.replace("/login");
          } else if (!hasDoneSurvey) {
            console.log('Redirecting to survey');
            router.replace("/survey/surveyScreen");
          } else {
            console.log('Redirecting to tabs');
            router.replace("/tabs");
          }
        }, 500);
      } catch (error) {
        console.error('Error in useRedirect:', error);
        if (isMounted) {
          router.replace("/tabs");
        }
      }
    }

    checkFlags();

    return () => {
      isMounted = false; 
    };
  }, []);
}
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { logout, googleLoginThunk } from "@/features/auth/authSlice";
import { Config } from "@config/config";

export const useSocialAuth = () => {
  const dispatch = useAppDispatch();

  // Google
  const [googleRequest, googleResponse, promptGoogleLogin] =
    Google.useAuthRequest({
      androidClientId: Config.GOOGLE_ANDROID_CLIENT_ID,
      iosClientId: Config.GOOGLE_IOS_CLIENT_ID,
    });

  // Facebook (tạm comment)
  // const [fbRequest, fbResponse, promptFbLogin] = Facebook.useAuthRequest({
  //   clientId: Config.FACEBOOK_APP_ID,
  // });

  // Handle Google login response
  useEffect(() => {
    if (googleResponse?.type === "success") {
      const { authentication } = googleResponse;
      if (authentication?.idToken) {
        // Gửi idToken xuống BE qua thunk
        dispatch(googleLoginThunk(authentication.idToken));
      }
    }
  }, [googleResponse]);

  // Handle Facebook login response (nếu cần)
  // useEffect(() => {
  //   if (fbResponse?.type === "success") {
  //     const { authentication } = fbResponse;
  //     if (authentication?.accessToken) {
  //       dispatch(socialLoginThunk(authentication.accessToken));
  //     }
  //   }
  // }, [fbResponse]);

  const signOut = () => {
    dispatch(logout());
  };

  return {
    googleLogin: promptGoogleLogin,
    // fbLogin: promptFbLogin,
    signOut,
    googleRequest,
    // fbRequest,
  };
};

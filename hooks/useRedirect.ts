import { RootState } from "@redux";
import { useAppSelector } from "@redux/hooks";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { HAS_LOGGED_IN, HAS_OPENED_APP } from "../constants/app";
import { getBooleanData } from "../stores";
import { UserStatusLabel } from "../types/me";

export function useRedirect(ready?: boolean, userHydrated?: boolean) {
  const { user } = useAppSelector((state: RootState) => state.user);
  const hasRedirected = useRef(false);

  useEffect(() => {
    // ✅ Chỉ chạy khi app đã ready VÀ đã hoàn tất việc hydrate user
    if (!ready || userHydrated === undefined || hasRedirected.current) {
      return;
    }

    const performRedirect = async () => {
      try {
        console.log("🔄 Starting redirect logic...", { user: user?.id, userHydrated });

        // ✅ TRƯỜNG HỢP 1: Đã có user trong Redux → Redirect theo status
        if (user) {
          console.log(`✅ User found: ${user.email}, status: ${user.status}`);
          hasRedirected.current = true;

          if (user.status === UserStatusLabel.PendingOnboarding) {
            console.log("→ Redirecting to /survey");
            router.replace("/survey");
          } else if (user.status === UserStatusLabel.Active) {
            console.log("→ Redirecting to /tabs");
            router.replace("/tabs");
          } else {
            console.warn(`⚠️ Unknown status: ${user.status}, redirecting to /login`);
            router.replace("/login");
          }
          return;
        }

        // ✅ TRƯỜNG HỢP 2: Không có user trong Redux
        // Kiểm tra các cờ trong storage
        const hasOpenedApp = await getBooleanData(HAS_OPENED_APP);
        const hasLoggedIn = await getBooleanData(HAS_LOGGED_IN);

        console.log("📋 Storage flags:", { hasOpenedApp, hasLoggedIn, userHydrated });

        hasRedirected.current = true;

        // ✅ Chưa mở app lần nào → Intro screen
        if (!hasOpenedApp) {
          console.log("→ First time opening app, redirecting to /introScreen");
          router.replace("/introScreen");
          return;
        }

        // ✅ Đã mở app nhưng chưa đăng nhập → Login
        if (!hasLoggedIn) {
          console.log("→ Not logged in, redirecting to /login");
          router.replace("/login");
          return;
        }

        // ✅ HAS_LOGGED_IN = true NHƯNG user = null SAU KHI đã hydrate
        // → Session không hợp lệ (token hết hạn hoặc bị xóa)
        if (hasLoggedIn && userHydrated && !user) {
          console.warn("⚠️ HAS_LOGGED_IN=true but no user after hydration → Session invalid");
          router.replace("/login");
          return;
        }

        // ✅ Fallback: Nếu không rơi vào case nào → Login
        console.log("→ Fallback: redirecting to /login");
        router.replace("/login");

      } catch (error) {
        console.error("❌ Error in redirect logic:", error);
        hasRedirected.current = true;
        router.replace("/login");
      }
    };

    // Delay nhỏ để tránh flash screen
    const timer = setTimeout(performRedirect, 300);
    return () => clearTimeout(timer);

  }, [ready, user, userHydrated]);
}
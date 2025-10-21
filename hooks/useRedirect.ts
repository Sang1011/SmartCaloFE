import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  HAS_LOGGED_IN,
  HAS_OPENED_APP,
} from "../constants/app";
// Giả định: getBooleanData và saveBooleanData là các hàm từ AsyncStorage/SecureStore
import { RootState } from "@redux";
import { useAppSelector } from "@redux/hooks";
import { getBooleanData } from "../stores";

// Giả định: UserStatus được định nghĩa
// Ví dụ: PendingOnboarding = 0, Active = 1
import { UserStatusLabel } from "../types/me"; // hoặc UserStatusLabel nếu bạn dùng string


export function useRedirect(ready?: boolean) {
  const { user } = useAppSelector((state: RootState) => state.auth);
  // Trạng thái chờ xử lý cờ (flags) và chuyển hướng (để tránh redirect nhiều lần)
  const [isRedirecting, setIsRedirecting] = useState(false);

  // --- Logic chính: Kiểm tra cờ và Trạng thái người dùng ---
  const checkAndRedirect = useCallback(async () => {
    if (isRedirecting) return;
    setIsRedirecting(true);
    
    // Bỏ qua tất cả cờ lưu trữ nếu đã có thông tin user từ Redux (tức là đã đăng nhập)
    if (user) {
      // 1. CHUYỂN HƯỚNG DỰA TRÊN TRẠNG THÁI USER (TỪ API)
      if (user.status === UserStatusLabel.PendingOnboarding) {
          router.replace("/survey");
      } else if (user.status === UserStatusLabel.Active) {
          router.replace("/tabs");
      } else {
          // Xử lý các trạng thái khác như Suspended, v.v.
          console.log(`User status is not active/pending: ${user.status}`);
          router.replace("/tabs"); // Mặc định về tabs nếu không rõ ràng
      }
      setIsRedirecting(false);
      return;
    }

    // 2. CHUYỂN HƯỚNG DỰA TRÊN CỜ ASYNCSTORAGE (Chỉ chạy khi user là NULL/Chưa đăng nhập)
    try {
      const opened = await getBooleanData(HAS_OPENED_APP);
      const hasloggedIn = await getBooleanData(HAS_LOGGED_IN);
      
      console.log('useRedirect flags:', { opened, hasloggedIn });

      // Ưu tiên kiểm tra: Lần đầu mở app -> Đã đăng nhập -> Mặc định
      if (!opened) {
        router.replace("/introScreen");
      } else if (!hasloggedIn) {
        router.replace("/login");
      } else {
        // Nếu đã đăng nhập theo cờ HAS_LOGGED_IN nhưng user vẫn là null 
        // (chưa fetch xong hoặc lỗi), tạm thời chuyển về Tabs, hoặc Login. 
        // Tuy nhiên, dựa trên logic cũ, ta chuyển về Tabs.
        // Tốt nhất là thêm logic tải lại user ở đây hoặc trong /tabs
        router.replace("/tabs");
      }
    } catch (error) {
      console.error('Error checking flags in useRedirect:', error);
      // Fallback an toàn
      router.replace("/tabs");
    } finally {
      setIsRedirecting(false);
    }
  }, [user, isRedirecting]);

  useEffect(() => {
    // Chỉ chạy khi Redux/Global State đã sẵn sàng (ready = true)
    if (ready) {
      // Đợi 500ms để đảm bảo các component đã render và tránh flash màn hình
      const timer = setTimeout(() => {
        checkAndRedirect();
      }, 500);

      // Cleanup
      return () => clearTimeout(timer);
    }
    // Dependency: Chỉ chạy lại khi `ready` thay đổi thành true
  }, [ready, checkAndRedirect]); 
}

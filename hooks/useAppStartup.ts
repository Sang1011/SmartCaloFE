import { HAS_LOGGED_IN } from "@constants/app";
import { hydrateUserThunk, logout, refreshTokenThunk } from "@features/auth/authSlice"; // Import hydrateUserThunk
import { useAppDispatch } from "@redux/hooks";
import { getAccessToken, getRefreshToken, saveBooleanData } from "@stores";
import { useEffect, useState } from "react";

const decodeToken = (token: string) => {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload;
    } catch {
        return null;
    }
};

const isTokenExpired = (token: string): boolean => {
    const payload = decodeToken(token);
    
    // Nếu token không decode được hoặc không có exp, coi như hết hạn
    if (!payload?.exp) return true; 
    
    const now = Date.now() / 1000;
    console.log("payload?.exp", payload?.exp);
    console.log("now", now);
    return payload.exp < now;
};

export const useAppStartup = () => {
    const [ready, setReady] = useState(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        async function verifyTokens() {
            try {
                const accessToken = await getAccessToken();
                const refreshToken = await getRefreshToken();

                if (accessToken && refreshToken) {
                    let shouldHydrate = true;
                    
                    if (isTokenExpired(accessToken)) {
                        console.log("Access token expired → refresh...");
                        try {
                            // Cố gắng refresh token, refreshTokenThunk đã được sửa để hydrate user
                            await dispatch(refreshTokenThunk()).unwrap(); 
                            console.log("Token refresh OK ✅");
                            await saveBooleanData(HAS_LOGGED_IN, true);
                            shouldHydrate = false; // Đã hydrate trong refreshThunk
                        } catch (err) {
                            console.log("Token refresh failed → logout ❌");
                            await dispatch(logout());
                            await saveBooleanData(HAS_LOGGED_IN, false);
                            shouldHydrate = false;
                        }
                    } else {
                        console.log("Access token still valid ✅");
                        await saveBooleanData(HAS_LOGGED_IN, true);
                    }
                    
                    // Nếu token còn hiệu lực VÀ chưa được hydrate qua refreshThunk
                    if (shouldHydrate && accessToken && !isTokenExpired(accessToken)) {
                        console.log("Hydrating user from current valid token...");
                        // BƯỚC QUAN TRỌNG: Tải thông tin user từ token vào Redux state
                        await dispatch(hydrateUserThunk()); 
                    }

                } else {
                    console.log("No tokens found → logged out");
                    await saveBooleanData(HAS_LOGGED_IN, false);
                }
            } catch (error) {
                console.error("Error verifying tokens:", error);
                await saveBooleanData(HAS_LOGGED_IN, false);
            } finally {
                // Đảm bảo setReady(true) chỉ khi đã hoàn tất xác thực VÀ hydrate user
                setReady(true);
            }
        }

        verifyTokens();
    }, [dispatch]);

    return { ready };
};
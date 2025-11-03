import { HAS_LOGGED_IN } from "@constants/app";
import { logout, refreshTokenThunk } from "@features/auth/authSlice";
import { fetchCurrentUserThunk } from "@features/users";
import { useAppDispatch } from "@redux/hooks";
import { getAccessToken, getRefreshToken, saveBooleanData } from "@stores";
import { useEffect, useState } from "react";

const decodeToken = (token: string) => {
    try {
        let payloadBase64 = token.split(".")[1]; 

        if (!payloadBase64) {
            return null; 
        }
        
        payloadBase64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
        
        while (payloadBase64.length % 4) {
            payloadBase64 += '=';
        }

        const payloadString = atob(payloadBase64);
        const payload = JSON.parse(payloadString);
        
        return payload;
        
    } catch {
        return null; 
    }
};

const isTokenExpired = (token: string): boolean => {
    const payload = decodeToken(token);
    
    if (!payload?.exp) return true; 
    
    const now = Date.now() / 1000;
    return payload.exp < now;
};

export const useAppStartup = () => {
    const [ready, setReady] = useState(false);
    const [userHydrated, setUserHydrated] = useState(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;

        async function verifyTokens() {
            // ✅ Timeout sau 10 giây
            timeoutId = setTimeout(() => {
                console.warn("⚠️ Startup timeout, forcing ready state");
                setReady(true);
            }, 10000);

            try {
                const accessToken = await getAccessToken();
                const refreshToken = await getRefreshToken();

                if (accessToken && refreshToken) {
                    if (isTokenExpired(accessToken)) {
                        console.log("Access token expired → refresh...");
                        try {
                            await dispatch(refreshTokenThunk()).unwrap();
                            console.log("Token refresh OK ✅");
                            await saveBooleanData(HAS_LOGGED_IN, true);
                            
                            // ✅ Fetch user sau khi refresh token
                            await dispatch(fetchCurrentUserThunk()).unwrap();
                            setUserHydrated(true);
                            console.log("✅ User fetched after refresh");
                        } catch (err) {
                            console.log("Token refresh or user fetch failed → logout ❌");
                            await dispatch(logout());
                            await saveBooleanData(HAS_LOGGED_IN, false);
                            setUserHydrated(false);
                        }
                    } else {
                        console.log("Access token still valid ✅");
                        await saveBooleanData(HAS_LOGGED_IN, true);
                        
                        // ✅ Fetch user từ API /users/me
                        console.log("Fetching current user from API...");
                        try {
                            await dispatch(fetchCurrentUserThunk()).unwrap();
                            setUserHydrated(true);
                            console.log("✅ User fetched successfully");
                        } catch (error) {
                            console.warn("❌ Failed to fetch user:", error);
                            setUserHydrated(false);
                            await dispatch(logout());
                            await saveBooleanData(HAS_LOGGED_IN, false);
                        }
                    }
                } else {
                    console.log("No tokens found → logged out");
                    await saveBooleanData(HAS_LOGGED_IN, false);
                    setUserHydrated(false);
                }
            } catch (error) {
                console.warn("Error verifying tokens:", error);
                await saveBooleanData(HAS_LOGGED_IN, false);
                setUserHydrated(false);
            } finally {
                clearTimeout(timeoutId);
                setReady(true);
                console.log("🎉 App startup complete");
            }
        }

        verifyTokens();

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [dispatch]);

    return { ready, userHydrated };
};
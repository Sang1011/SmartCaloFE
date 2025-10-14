import { HAS_LOGGED_IN } from "@constants/app";
import { logout, refreshTokenThunk } from "@features/auth";
import { AppDispatch } from "@redux";
import { getAccessToken, getRefreshToken, saveBooleanData } from "@stores";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

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
    if (!payload?.exp) return true;
    const now = Date.now() / 1000;
    return payload.exp < now;
};

export const useAppStartup = () => {
    const [ready, setReady] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        async function verifyTokens() {
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
                        } catch (err) {
                            console.log("Token refresh failed → logout ❌");
                            await dispatch(logout());
                            await saveBooleanData(HAS_LOGGED_IN, false);
                        }
                    } else {
                        console.log("Access token still valid ✅");
                        await saveBooleanData(HAS_LOGGED_IN, true);
                    }
                } else {
                    console.log("No tokens found → logged out");
                    await saveBooleanData(HAS_LOGGED_IN, false);
                }
            } catch (error) {
                console.error("Error verifying tokens:", error);
                await saveBooleanData(HAS_LOGGED_IN, false);
            } finally {
                setReady(true);
            }
        }

        verifyTokens();
    }, [dispatch]);

    return { ready };
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
  userDto: {
    id: string;
    email: string;
    name: string;
    avatarUrl: string;
    birthday: string;
    weight: number;
    height: number;
    gender: string;
    activityLevel: string;
    dailyCaloGoal: number;
    currentPlanId: number;
    currentSubscriptionExpiresAt: string; 
    roles: string[];
  };
};

export type RefreshTokenResponse = {
    accessToken: string;
    refreshToken: string;
}

export type RefreshTokenRequest = {
    accessToken: string;
    refreshToken: string;
}

export type logoutRequest = {
  refreshToken: string;
}

export type loginGoogleRequest = {
  idToken: string;
}

export type loginFacebookRequest = {
  accessToken: string;
}
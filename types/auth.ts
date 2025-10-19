export type LoginGoogleResponse = {
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
  userDto: {
    id: string;
    email: string;
    name: string;
    avatarUrl: string;
    age: number;
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

export type LogoutRequest = {
  refreshToken: string;
}

export type LoginGoogleRequest = {
  idToken: string;
}

export type LoginFacebookRequest = {
  accessToken: string;
}

export type VerifyOTPRequest = {
  email: string;
  otp: string;
}

export type VerifyOTPResponse = {
  resetToken: string
}

export type ForgotPasswordRequest = {
  email: string;
}

export type RegisterRequest = {
  email: string;
  password: string;
  name: string;
}

export type LoginRequest = {
  email: string;
  password: string;
}

export type ResetPasswordRequest = {
  resetToken: string;
  newPassword: string;
}

export type ResetPasswordResponse = {
  success: boolean
}

export type RegisterANDLoginResponse = {
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
  userDto: {
    id: string;
    email: string;
    name: string;
    avatarUrl: string;
    age: number;
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

export type UpdateUserDTO = {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  age: number;
  weight: number;
  height: number;
  gender: string;
  activityLevel: string;
  dailyCaloGoal: number;
  currentPlanId: number;
  currentSubscriptionExpiresAt: string;
  roles: string[];
}
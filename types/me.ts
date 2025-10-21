export interface UserStatsDto {
    weight: number;
    height: number;
    bmi: number;
    bmr: number;
    tdee: number;
    healthGoal: HealthGoal;
    recordDate: string; // ISO 8601 Date String
}

export interface MeBodyRequest {
    updateProfileDto: UpdateProfileDto;
}

export interface UserDTO {
    id: string; // UUID/GUID format
    email: string;
    name: string;
    avatarUrl: string;
    gender: string;
    age: number;
    currentSubscriptionExpiresAt: string;
    currentPlanId: number;
    startWeight: number;
    targetWeight: number;
    dailyCaloGoal: number;
    activityLevel: ActivityLevel;
    status: string;
    roles: string[]; // Array of strings (e.g., ["Admin", "User"])
    userStats: UserStatsDto;
}

export interface UserDTOLogin {
  id: string; // UUID/GUID format
  email: string;
  name: string;
  avatarUrl: string;
  gender: string;
  age: number;
  currentSubscriptionExpiresAt: string;
  currentPlanId: number;
  startWeight: number;
  targetWeight: number;
  dailyCaloGoal: number;
  activityLevel: ActivityLevel;
  status: string;
  roles: string[]; // Array of strings (e.g., ["Admin", "User"])
}

export enum UserStatusLabel {
    PendingOnboarding = "PendingOnboarding", // Đang chờ hoàn thành các bước ban đầu (survey)
    Active = "Active",            // Đã hoạt động bình thường
    Suspended = "Suspended",         // Bị khóa (để mở rộng sau này)
  }

export enum UserStatus {
    PendingOnboarding = 0, // Đang chờ hoàn thành các bước ban đầu (survey)
    Active = 1,            // Đã hoạt động bình thường
    Suspended = 2,         // Bị khóa (để mở rộng sau này)
  }

export interface UpdateProfileDto {
    name: string;
    age: number;
    weight: number;
    height: number;
    targetWeight: number;
    goal: HealthGoal;         // Ví dụ: 0 = Maintain, 1 = Lose Weight, 2 = Gain Muscle
    gender: Gender | "";       // Ví dụ: 0 = Male, 1 = Female, 2 = Other
    activityLevel: ActivityLevel; // Ví dụ: 0 = Sedentary, 1 = Lightly Active, 2 = Very Active
}

export enum Gender {
    Male = 0,
    Female = 1
}

export enum ActivityLevel {
    Sedentary = 0,      // Ít vận động
    LightlyActive = 1,  // Vận động nhẹ
    ModeratelyActive = 2, // Vận động vừa phải
    VeryActive = 3,     // Rất năng động
    ExtraActive = 4     // Cực kỳ năng động
  }

  export enum HealthGoal {
    MaintainWeight = 0, // Duy trì cân nặng
    LoseWeight = 1,     // Giảm cân
    GainWeight = 2,     // Tăng cân
    GainMuscle = 3      // Tăng cơ
  }

  // HealthGoal
export const healthGoalMap: Record<string, HealthGoal> = {
    MaintainWeight: HealthGoal.MaintainWeight,
    LoseWeight: HealthGoal.LoseWeight,
    GainWeight: HealthGoal.GainWeight,
    GainMuscle: HealthGoal.GainMuscle,
  };
  
  // ActivityLevel
export const activityLevelMap: Record<string, ActivityLevel> = {
    Sedentary: ActivityLevel.Sedentary,
    LightlyActive: ActivityLevel.LightlyActive,
    ModeratelyActive: ActivityLevel.ModeratelyActive,
    VeryActive: ActivityLevel.VeryActive,
    ExtraActive: ActivityLevel.ExtraActive,
  };

export const genderLabelMap: Record<Gender, string> = {
    [Gender.Male]: "Male",
    [Gender.Female]: "Female",
  };
export interface UserFromFirebase {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;

  menuProgress: {
    totalDays: number;
    createdAt: string;
    lastCompletedDate: string;
    currentDayNumber: number;
  };

  programProgress: {
    totalDays: number;
    createdAt: string;
    lastCompletedDate: string;
    completedDays: number[];  // mảng số nguyên
    currentDayNumber: number;
  };
}

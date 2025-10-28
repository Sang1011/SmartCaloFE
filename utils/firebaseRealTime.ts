import { get, ref, set, update } from "firebase/database";
import { rtdb } from "../config/firebase";

// ==================== INTERFACE ====================

export const ACTIVE_SCAN = 3;

export interface UserStreakData {
  userId: string;
  firstLoginDate: number | null; // ✅ Unix timestamp (ms) - ngày đăng nhập lần đầu
  currentFreeScan: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: number | null; // Unix timestamp (ms)
  streakStatus: 'uninitiated' | 'active' | 'broken';
  totalActiveDays: number;
  timezone: string;
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Chuyển string date (dd-mm-yyyy) sang Unix timestamp (start of day UTC)
 */
function parseDate(dateStr: string): number {
  try {
    const [day, month, year] = dateStr.split('-').map(Number);
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      throw new Error(`Invalid date format: ${dateStr}`);
    }

    // ✅ Tạo Date ở múi giờ Việt Nam (UTC+7)
    const date = new Date(year, month - 1, day, 0, 0, 0, 0);
    const vietnamOffset = 7 * 60 * 60 * 1000;
    const timestamp = date.getTime() - vietnamOffset;

    return timestamp;
  } catch (error) {
    console.error('❌ Error parsing date:', dateStr, error);
    throw error;
  }
}


/**
 * Tính số ngày chênh lệch giữa 2 timestamps
 */
function getDaysDifference(timestamp1: number, timestamp2: number): number {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  return Math.floor((timestamp2 - timestamp1) / MS_PER_DAY);
}

/**
 * Tạo default user data
 */
function createDefaultUserData(userId: string, firstLoginDate: number): UserStreakData {
  return {
    userId,
    firstLoginDate, // ✅ Lưu ngày đăng nhập lần đầu
    currentFreeScan: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    streakStatus: 'uninitiated',
    totalActiveDays: 0,
    timezone: 'Asia/Ho_Chi_Minh'
  };
}

// ==================== MAIN FUNCTIONS ====================

/**
 * Tự động tạo user mặc định nếu chưa tồn tại
 * @param userId - ID của user
 * @param today - Ngày hiện tại (format: dd-mm-yyyy)
 * @returns UserStreakData - Thông tin user (mới hoặc đã có)
 */
export async function autoCreateDefaultUser(
  userId: string,
  today: string
): Promise<UserStreakData> {
  try {
    const userRef = ref(rtdb, `users/${userId}`);
    const snapshot = await get(userRef);

    // Nếu user đã tồn tại -> trả về data hiện tại
    if (snapshot.exists()) {
      console.log(`✅ User ${userId} đã tồn tại`);
      return snapshot.val() as UserStreakData;
    }

    // Nếu chưa có -> tạo mới với firstLoginDate = hôm nay
    const firstLoginTimestamp = parseDate(today);
    const defaultUser = createDefaultUserData(userId, firstLoginTimestamp);
    await set(userRef, defaultUser);
    
    console.log(`🆕 Đã tạo user mới: ${userId}, firstLoginDate: ${today}`);
    return defaultUser;
    
  } catch (error) {
    console.error('❌ Lỗi autoCreateDefaultUser:', error);
    throw new Error(`Không thể tạo user: ${error}`);
  }
}

/**
 * Tự động update streak khi user đăng nhập
 * @param userId - ID của user
 * @param today - Ngày hiện tại (format: dd-mm-yyyy, vd: "15-10-2025")
 * @returns UserStreakData - Thông tin user sau khi update
 */
export async function autoUpdateStreaks(
  userId: string,
  today: string
): Promise<UserStreakData> {
  try {
    const userRef = ref(rtdb, `users/${userId}`);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
      console.log(`⚠️ User ${userId} chưa tồn tại, đang tạo mới...`);
      await autoCreateDefaultUser(userId, today); // ✅ Pass today để set firstLoginDate
      return await autoUpdateStreaks(userId, today);
    }

    const userData = snapshot.val() as UserStreakData;
    
    // ✅ Validate và parse date trước khi sử dụng
    let todayTimestamp: number;
    try {
      todayTimestamp = parseDate(today);
      console.log(`📅 Parsed today: ${today} -> ${todayTimestamp}`);
    } catch (error) {
      console.error(`❌ Invalid date format: ${today}`, error);
      throw new Error(`Invalid date format: ${today}. Expected format: dd-mm-yyyy`);
    }

    // ✅ Migration: Nếu user cũ không có firstLoginDate, set = lastActiveDate hoặc hôm nay
    if (!userData.firstLoginDate) {
      const firstLogin = userData.lastActiveDate || todayTimestamp;
      await update(userRef, { firstLoginDate: firstLogin });
      console.log(`🔄 Migration: Set firstLoginDate = ${firstLogin} for user ${userId}`);
      userData.firstLoginDate = firstLogin;
    }

    if (userData.lastActiveDate === todayTimestamp) {
      console.log(`User ${userId} đã đăng nhập hôm nay rồi`);
      return userData;
    }

    let updatedData: Partial<UserStreakData>;

    if (userData.streakStatus === 'uninitiated' || userData.lastActiveDate === null) {
      updatedData = {
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: todayTimestamp,
        streakStatus: 'active',
        totalActiveDays: 1
      };
      console.log(`User ${userId} lần đầu đăng nhập`);
    } 
    else {
      const daysDiff = getDaysDifference(userData.lastActiveDate, todayTimestamp);
      
      if (daysDiff === 1) {
        const newStreak = userData.currentStreak + 1;
        updatedData = {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, userData.longestStreak),
          lastActiveDate: todayTimestamp,
          streakStatus: 'active',
          totalActiveDays: userData.totalActiveDays + 1
        };
        console.log(`🔥 User ${userId} streak: ${userData.currentStreak} -> ${newStreak}`);
      } 
      else if (daysDiff > 1) {
        updatedData = {
          currentStreak: 1,
          longestStreak: userData.longestStreak,
          lastActiveDate: todayTimestamp,
          streakStatus: 'broken',
          totalActiveDays: userData.totalActiveDays + 1
        };
        console.log(`💔 User ${userId} streak bị break (${daysDiff} ngày bỏ lỡ)`);
      }
      else {
        console.warn(`⚠️ User ${userId}: Ngày hôm nay (${today}) < lastActiveDate`);
        return userData; 
      }
    }

    // ✅ Validate updatedData trước khi update Firebase
    Object.entries(updatedData).forEach(([key, value]) => {
      if (typeof value === 'number' && isNaN(value)) {
        throw new Error(`NaN detected in ${key}`);
      }
    });

    await update(userRef, updatedData);
    const finalData: UserStreakData = {
      ...userData,
      ...updatedData
    };

    console.log(`✅ Updated user ${userId}:`, finalData);
    return finalData;

  } catch (error) {
    console.error('❌ Lỗi autoUpdateStreaks:', error);
    throw error;
  }
}

/**
 * Lấy thông tin user (không update gì)
 */
export async function getUserStreakData(userId: string): Promise<UserStreakData | null> {
  try {
    const userRef = ref(rtdb, `users/${userId}`);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
      console.log(`⚠️ User ${userId} không tồn tại`);
      return null;
    }

    return snapshot.val() as UserStreakData;
  } catch (error) {
    console.error('❌ Lỗi getUserStreakData:', error);
    throw error;
  }
}

/**
 * Cập nhật currentFreeScan của user (+1 nếu chưa đạt giới hạn)
 * @param userId - ID của user
 */
export async function updateFreeScan(userId: string): Promise<UserStreakData> {
  try {
    const userRef = ref(rtdb, `users/${userId}`);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
      console.warn(`⚠️ User ${userId} chưa tồn tại, đang tạo mới...`);
      const today = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
      await autoCreateDefaultUser(userId, today);
      return await updateFreeScan(userId);
    }

    const userData = snapshot.val() as UserStreakData;

    // Nếu đã đạt giới hạn thì không update nữa
    if (userData.currentFreeScan >= ACTIVE_SCAN) {
      console.log(`✅ User ${userId} đã đạt giới hạn free scan (${ACTIVE_SCAN})`);
      return userData;
    }

    const updatedValue = userData.currentFreeScan + 1;
    await update(userRef, { currentFreeScan: updatedValue });

    const updatedUser: UserStreakData = {
      ...userData,
      currentFreeScan: updatedValue,
    };

    console.log(`🔍 Đã +1 free scan cho user ${userId} (${userData.currentFreeScan} → ${updatedValue})`);
    return updatedUser;

  } catch (error) {
    console.error('❌ Lỗi updateFreeScan:', error);
    throw new Error(`Không thể update free scan: ${error}`);
  }
}

// ==================== HELPER: Check Plan Status ====================

/**
 * Kiểm tra số ngày kể từ lần đầu đăng nhập
 * @param userId - ID của user
 * @returns Số ngày đã trải qua kể từ firstLoginDate
 */
export async function getDaysSinceFirstLogin(userId: string): Promise<number | null> {
  try {
    const userData = await getUserStreakData(userId);
    if (!userData || !userData.firstLoginDate) {
      return null;
    }

    const now = Date.now();
    const daysPassed = getDaysDifference(userData.firstLoginDate, now);
    return daysPassed;
  } catch (error) {
    console.error('❌ Lỗi getDaysSinceFirstLogin:', error);
    return null;
  }
}

// /**
//  * Kiểm tra xem user còn trong trial period không (7 ngày đầu)
//  * @param userId - ID của user
//  * @returns true nếu còn trong trial, false nếu hết
//  */
// export async function isInTrialPeriod(userId: string): Promise<boolean> {
//   const daysSinceFirstLogin = await getDaysSinceFirstLogin(userId);
//   if (daysSinceFirstLogin === null) return false;
  
//   const TRIAL_DAYS = 7;
//   return daysSinceFirstLogin < TRIAL_DAYS;
// }
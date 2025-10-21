import { child, get, ref, set, update } from "firebase/database";
import { rtdb } from "../config/firebase";
import { UserFromFirebase } from "../types/firebase";

/**
 * 🧩 Tạo user mặc định khi chưa có trên DB
 */
export const createDefaultUser = (userId: string): UserFromFirebase => {
  const now = new Date().toISOString();

  return {
    userId,
    currentStreak: 1,
    longestStreak: 1,
    lastActiveDate: now,
    menuProgress: {
      totalDays: 30,
      createdAt: now,
      lastCompletedDate: now,
      currentDayNumber: 1,
    },
    programProgress: {
      totalDays: 30,
      createdAt: now,
      lastCompletedDate: now,
      completedDays: [],
      currentDayNumber: 1,
    },
  };
};

/**
 * 🟢 Lưu user vào Realtime Database
 */
export const saveUserToDB = async (user: UserFromFirebase) => {
  try {
    await set(ref(rtdb, `users/${user.userId}`), user);
    console.log("✅ User saved successfully");
  } catch (error) {
    console.error("❌ Error saving user:", error);
  }
};

/**
 * 🔍 Lấy user từ DB
 */
export const getUserFromDB = async (userId: string): Promise<UserFromFirebase | null> => {
  try {
    const snapshot = await get(child(ref(rtdb), `users/${userId}`));
    if (snapshot.exists()) {
      return snapshot.val() as UserFromFirebase;
    } else {
      return null;
    }
  } catch (error) {
    console.error("❌ Error getting user:", error);
    return null;
  }
};

/**
 * 🧠 Kiểm tra user đã tồn tại trong DB hay chưa
 */
export const checkUserExists = async (userId: string): Promise<boolean> => {
  try {
    const snapshot = await get(child(ref(rtdb), `users/${userId}`));
    return snapshot.exists();
  } catch (error) {
    console.log("🔥 LỖI GET FIRESTORE ĐÃ BỊ BẮT!");
    console.error("❌ Error checking user existence:", error);
    return false;
  }
};

export const ensureUserExists = async (userId: string): Promise<UserFromFirebase> => { 
  const exists = await checkUserExists(userId);
  if (!exists) {
    const newUser = createDefaultUser(userId);
    await saveUserToDB(newUser);
    console.log("🆕 Created new default user");
    return newUser;
  } else {
    console.log("✅ User already exists");
    const existingUser = await getUserFromDB(userId);
    return existingUser!;
  }
};


export const partialUpdateUserStreak = async (userId: string) => {
  try {
    // 1️⃣ Đảm bảo user tồn tại
    const user = await ensureUserExists(userId);

    // 2️⃣ Lấy ngày hôm nay và ngày lastActive
    const today = new Date().toISOString().split("T")[0];
    const lastActive = new Date(user.lastActiveDate).toISOString().split("T")[0];

    let newStreak = user.currentStreak;
    let newLongest = user.longestStreak;

    // 3️⃣ Tính streak
    const diffDays = Math.floor(
      (new Date(today).getTime() - new Date(lastActive).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      // liên tục -> +1 streak
      newStreak += 1;
      if (newStreak > newLongest) newLongest = newStreak;
    } else if (diffDays > 1) {
      // gián đoạn -> reset streak
      newStreak = 1;
    }

    if (diffDays === 0) {
      console.log("✅ User already checked in today");
      return { currentStreak: newStreak, longestStreak: newLongest };
    }

    // 4️⃣ Cập nhật partial
    await update(ref(rtdb, `users/${userId}`), {
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastActiveDate: new Date().toISOString(),
    });

    console.log("✅ Partial streak update success");

    return { currentStreak: newStreak, longestStreak: newLongest };
  } catch (error) {
    console.error("❌ Error updating streak:", error);
    return null;
  }
};


/**
 * 🔁 Cập nhật một vài trường trong menuProgress
 */
export const autoUpdateUserMenu = async (userId: string) => {
  try {
    const user = await ensureUserExists(userId);
    const menu = user.menuProgress;

    const today = new Date().toISOString().split("T")[0];
    const lastCompleted = new Date(menu.lastCompletedDate).toISOString().split("T")[0];

    // Nếu cùng ngày -> không update
    if (today === lastCompleted) {
      console.log("✅ Menu already updated today");
      return menu;
    }

    // Tính next day
    const nextDay = Math.min(menu.currentDayNumber + 1, menu.totalDays);

    await update(ref(rtdb, `users/${userId}`), {
      "menuProgress.currentDayNumber": nextDay,
      "menuProgress.lastCompletedDate": new Date().toISOString(),
    });

    console.log("✅ Menu auto-updated");
    return { ...menu, currentDayNumber: nextDay, lastCompletedDate: new Date().toISOString() };
  } catch (error) {
    console.error("❌ Error auto-updating menu:", error);
    return null;
  }
};

export const autoUpdateUserProgram = async (userId: string) => {
  try {
    const user = await ensureUserExists(userId);
    const program = user.programProgress;

    const today = new Date().toISOString().split("T")[0];
    const lastCompleted = new Date(program.lastCompletedDate).toISOString().split("T")[0];

    if (today === lastCompleted) {
      console.log("✅ Program already updated today");
      return program;
    }

    const nextDay = Math.min(program.currentDayNumber + 1, program.totalDays);
    const completedDays = [...(program.completedDays || []), program.currentDayNumber];

    await update(ref(rtdb, `users/${userId}`), {
      "programProgress.currentDayNumber": nextDay,
      "programProgress.lastCompletedDate": new Date().toISOString(),
      "programProgress.completedDays": completedDays,
    });

    console.log("✅ Program auto-updated");
    return { ...program, currentDayNumber: nextDay, lastCompletedDate: new Date().toISOString(), completedDays };
  } catch (error) {
    console.error("❌ Error auto-updating program:", error);
    return null;
  }
};

/**
 * 🔄 Reset toàn bộ dữ liệu user về mặc định
 */
const resetUserData = async (userId: string) => {
  try {
    // 1️⃣ Tạo user mặc định
    const defaultUser = createDefaultUser(userId);

    // 2️⃣ Ghi đè dữ liệu hiện tại trong DB
    await set(ref(rtdb, `users/${userId}`), defaultUser);

    console.log("✅ User data has been reset to default");
    return defaultUser;
  } catch (error) {
    console.error("❌ Error resetting user data:", error);
    return null;
  }
};

export const resetUserDataSafe = async (userId: string) => {
  try {
    await ensureUserExists(userId); // chắc chắn user có tồn tại
    const defaultUser = await resetUserData(userId);
    return defaultUser;
  } catch (error) {
    console.error(error);
    return null;
  }
};
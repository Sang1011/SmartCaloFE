import { get, ref } from "firebase/database";
import { rtdb } from "../config/firebase";

// ==================== INTERFACE ====================

export interface EnvironmentConfig {
  appStatus: 'open' | 'closed' | 'maintenance';
  maintenanceMessage?: string;
  allowedVersions?: string[]; // Danh sách version được phép truy cập
  forceUpdate?: boolean;
  minVersion?: string; // Version tối thiểu được phép
}

// ==================== MAIN FUNCTIONS ====================

/**
 * Lấy config environment từ Firebase
 * @returns EnvironmentConfig hoặc null nếu không tồn tại
 */
export async function getEnvironmentConfig(): Promise<EnvironmentConfig | null> {
  try {
    const envRef = ref(rtdb, 'environment');
    const snapshot = await get(envRef);

    if (!snapshot.exists()) {
      console.warn('⚠️ Environment config không tồn tại trong Firebase');
      return null;
    }

    const config = snapshot.val() as EnvironmentConfig;
    console.log('✅ Environment config:', config);
    return config;
    
  } catch (error) {
    console.error('❌ Lỗi getEnvironmentConfig:', error);
    throw new Error(`Không thể lấy environment config: ${error}`);
  }
}

/**
 * Kiểm tra xem app có đang mở không
 * @returns true nếu app đang mở, false nếu đang đóng/maintenance
 */
export async function isAppAccessible(): Promise<{
  accessible: boolean;
  status: 'open' | 'closed' | 'maintenance';
  message?: string;
}> {
  try {
    const config = await getEnvironmentConfig();
    
    // Nếu không có config -> mặc định cho phép truy cập
    if (!config) {
      return {
        accessible: true,
        status: 'open'
      };
    }

    const isAccessible = config.appStatus === 'open';
    
    return {
      accessible: isAccessible,
      status: config.appStatus,
      message: config.maintenanceMessage || getDefaultMessage(config.appStatus)
    };
    
  } catch (error) {
    console.error('❌ Lỗi isAppAccessible:', error);
    // Nếu có lỗi -> cho phép truy cập (fail-safe)
    return {
      accessible: true,
      status: 'open'
    };
  }
}

/**
 * Lấy message mặc định theo trạng thái
 */
function getDefaultMessage(status: 'open' | 'closed' | 'maintenance'): string {
  switch (status) {
    case 'closed':
      return 'Ứng dụng hiện đang đóng. Vui lòng quay lại sau.';
    case 'maintenance':
      return 'Hệ thống đang bảo trì. Vui lòng thử lại sau ít phút.';
    default:
      return '';
  }
}

/**
 * Kiểm tra version của app (optional - nếu bạn cần)
 * @param currentVersion - Version hiện tại của app (từ package.json hoặc app.json)
 */
export async function checkAppVersion(currentVersion: string): Promise<{
  allowed: boolean;
  needsUpdate: boolean;
  message?: string;
}> {
  try {
    const config = await getEnvironmentConfig();
    
    if (!config) {
      return { allowed: true, needsUpdate: false };
    }

    // Kiểm tra nếu version hiện tại nằm trong danh sách cho phép
    if (config.allowedVersions && config.allowedVersions.length > 0) {
      const isAllowed = config.allowedVersions.includes(currentVersion);
      
      if (!isAllowed) {
        return {
          allowed: false,
          needsUpdate: true,
          message: 'Vui lòng cập nhật ứng dụng lên phiên bản mới nhất.'
        };
      }
    }

    // Kiểm tra version tối thiểu
    if (config.minVersion) {
      const needsUpdate = compareVersions(currentVersion, config.minVersion) < 0;
      
      if (needsUpdate) {
        return {
          allowed: !config.forceUpdate,
          needsUpdate: true,
          message: config.forceUpdate 
            ? 'Bạn cần cập nhật ứng dụng để tiếp tục sử dụng.'
            : 'Có phiên bản mới. Vui lòng cập nhật để có trải nghiệm tốt nhất.'
        };
      }
    }

    return { allowed: true, needsUpdate: false };
    
  } catch (error) {
    console.error('❌ Lỗi checkAppVersion:', error);
    return { allowed: true, needsUpdate: false };
  }
}

/**
 * So sánh 2 version strings (semantic versioning)
 * @returns -1 nếu v1 < v2, 0 nếu bằng, 1 nếu v1 > v2
 */
function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const num1 = parts1[i] || 0;
    const num2 = parts2[i] || 0;
    
    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }
  
  return 0;
}
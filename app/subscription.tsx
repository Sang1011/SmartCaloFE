import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { fetchPaymentQRUrl, fetchPaymentStatus } from "@features/payment";
import { fetchAllSubscriptions } from "@features/subscriptions";
import { fetchCurrentUserThunk } from "@features/users";
import { RootState } from "@redux";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { navigateCustom } from "@utils/navigation";
import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator, Alert,
  AppState,
  AppStateStatus,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SubscriptionScreen() {
  const [selectedPlanId, setSelectedPlanId] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const dispatch = useAppDispatch();
  const { subscriptionPlans, loading } = useAppSelector(
    (state: RootState) => state.subscription
  );

  // Lấy thêm transactionId và paymentStatus từ Redux
  const { qrImageUrl, qrLoading, transactionId, paymentStatus } = useAppSelector(
    (state: RootState) => state.payment
  );
  const { user } = useAppSelector((state: RootState) => state.user);

  // Cập nhật: Chỉ tạo QR và mở Modal. Logic Polling sẽ chạy trong useEffect.
  const handlePaymentURlCreate = async () => {
    const res = await dispatch(fetchPaymentQRUrl({ planId: selectedPlanId })).unwrap();
    if (res?.transactionId) {
      setIsModalVisible(true);
    } else {
      Alert.alert("Lỗi", "Không thể tạo QR. Vui lòng thử lại!");
    }
  };

  useEffect(() => {
    dispatch(fetchCurrentUserThunk());
    dispatch(fetchAllSubscriptions());
  }, []);

  useEffect(() => {
    if (!loading && subscriptionPlans && subscriptionPlans.length > 0) {
      const defaultPlan = subscriptionPlans.find(
        (plan) => plan.durationInDays === 30
      );
      if (defaultPlan && selectedPlanId === 0) {
        setSelectedPlanId(defaultPlan.id);
      }
    }
  }, [loading, subscriptionPlans, selectedPlanId]); 
  
  useEffect(() => {
    // Hàm xử lý khi trạng thái App thay đổi
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      // Nếu trạng thái chuyển từ background/inactive sang active (người dùng quay lại app)
      if (nextAppState === 'active' && isModalVisible && transactionId && paymentStatus?.toString().toLowerCase() !== 'completed') {
        console.log("App returned to foreground. Force checking payment status.");
        
        // Buộc dispatch ngay lập tức để cập nhật trạng thái sau khi quay lại
        dispatch(fetchPaymentStatus(transactionId));
      }
    };

    // Đăng ký sự kiện lắng nghe AppState
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Dọn dẹp listener khi component bị unmount
    return () => {
      subscription.remove();
    };
  }, [isModalVisible, transactionId, paymentStatus, dispatch]); 
// ------------------------------------------------------------------
// END LOGIC KIỂM TRA KHI QUAY LẠI APP
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// LOGIC POLLING CHÍNH (Chạy liên tục khi ở foreground)
// ------------------------------------------------------------------
  useEffect(() => {
    let intervalId: number | null = null;
    const POLLING_INTERVAL = 1000; // 1 giây
    
    // 1. Dừng Polling nếu đã thành công
    if (paymentStatus?.toString().toLowerCase() === 'completed') {
        if (intervalId) clearInterval(intervalId);
        Alert.alert("Thành công! 🎉", "Tài khoản của bạn đã được nâng cấp!");
        return; 
    }

    // 2. Bắt đầu Polling: Chỉ Polling khi Modal mở, có ID giao dịch và chưa thành công
    if (isModalVisible && transactionId) {
      setTimeout(() => {
        intervalId = setInterval(() => {
          dispatch(fetchPaymentStatus(transactionId));
          console.log("⏳ Checking payment status for:", transactionId);
        }, POLLING_INTERVAL);
      }, 2000);
    }

    // 3. Cleanup Function: Dọn dẹp Interval
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        console.log("🛑Payment status check stopped.");
      }
    };
  }, [isModalVisible, transactionId, paymentStatus, dispatch]);
// ------------------------------------------------------------------
// END LOGIC POLLING CHÍNH
// ------------------------------------------------------------------


  const handleSaveQRImage = async () => {
    if (!qrImageUrl) return;

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Thông báo", "Cần cấp quyền để lưu ảnh vào thư viện!");
        return;
      }

      const fileUri = FileSystem.cacheDirectory + "qr_payment.png";
      await FileSystem.downloadAsync(qrImageUrl, fileUri);

      await MediaLibrary.saveToLibraryAsync(fileUri);
      Alert.alert("Thành công", "Đã lưu ảnh QR vào thư viện của bạn!");
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Không thể lưu ảnh, vui lòng thử lại.");
    }
  };

  // --- Loading state ---
  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={[styles.loadingText, { fontFamily: FONTS.bold }]}>
          LOADING...
        </Text>
        <ActivityIndicator size="large" color={color.dark_green} />
      </View>
    );
  }
  
  const currentPlan = subscriptionPlans.find((p) => p.id === selectedPlanId);
  return (
    <View style={styles.fullContainer}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Nút back */}
        <View style={styles.header}>
          <Ionicons
            name="arrow-back"
            size={32}
            color={color.black}
            onPress={() => navigateCustom("/tabs/profile")}
          />
        </View>
        {/* Tiêu đề */}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { fontFamily: FONTS.semiBold }]}>
            Chọn gói phù hợp với bạn!
          </Text>
          <Text style={[styles.subtitle, { fontFamily: FONTS.regular }]}>
            So sánh tính năng giữa gói FREE và PREMIMUM
          </Text>
        </View>
        {/* Bảng so sánh */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 2 }]} />
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>FREE</Text>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Text style={[styles.tableHeaderText, { marginRight: 4 }]}>
                PREMIMUM
              </Text>
              <Text style={styles.crown}>👑</Text>
            </View>
          </View>

          {[
            ["Nhận diện thức ăn qua hình ảnh", "10 lần / 1 tháng", true],
            ["Tính toán BMI/BMR/TDEE", "✔️", true],
            ["Theo dõi quá trình ăn uống & tập luyện cơ bản", "✔️", true],
            ["Tra cứu thư viện các món ăn Việt Nam", "✔️", true],
            ["AI gợi ý các bữa ăn và bài tập", "❌", true],
            ["Ghi nhật ký ăn uống không giới hạn", "❌", true],
          ].map(([title, freeValue], index) => (
            <View key={index} style={styles.row}>
              <Text style={[styles.cellText, { flex: 2 }]}>{title}</Text>
              <Text
                style={[
                  styles.cellText,
                  {
                    flex: 1,
                    color:
                      freeValue === "10 lần / 1 tháng"
                        ? color.red_dark
                        : color.black,
                    textAlign: "center",
                  },
                ]}
              >
                {freeValue}
              </Text>
              <Text style={[styles.cellText, { flex: 1, textAlign: "center" }]}>
                ✔️
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.planContainer}>
          {subscriptionPlans.map((plan) => {
            if (plan.price === 0 || plan.durationInDays === 9999) {
              return null;
            }
            return (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planBox,
                  selectedPlanId === plan.id && styles.planSelected,
                ]}
                onPress={() => setSelectedPlanId(plan.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.planTitle, { fontFamily: FONTS.bold }]}>
                  {plan.planName.toUpperCase()}
                </Text>
                <Text style={[styles.planPrice, { fontFamily: FONTS.medium }]}>
                  {plan.price.toLocaleString()} VND /{" "}
                  {plan.durationInDays >= 365 ? "1 năm" : "1 tháng"}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {/* Nút nâng cấp */}
        <TouchableOpacity
          style={styles.button}
          onPress={handlePaymentURlCreate} // Gọi hàm mở Modal
        >
          <Text style={[styles.buttonText, { fontFamily: FONTS.semiBold }]}>
            Nâng cấp tài khoản của bạn ngay bây giờ!
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header và nút đóng */}
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { fontFamily: FONTS.semiBold }]}>
                Thanh toán cho gói {currentPlan?.planName || "Đang chọn..."}
              </Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <MaterialIcons name="close" size={28} color={color.gray_dark} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Vui lòng quét mã QR dưới đây để thanh toán.
            </Text>

            {/* Hiển thị QR Code hoặc Loading / Lỗi */}
            {qrLoading ? (
              <ActivityIndicator
                size="large"
                color={color.dark_green}
                style={{ marginVertical: 40 }}
              />
            ) : qrImageUrl ? (
              <Image source={{ uri: qrImageUrl }} style={styles.qrImage} />
            ) : (
              <Text
                style={{
                  color: color.red_dark,
                  marginVertical: 20,
                  textAlign: "center",
                }}
              >
                Không thể tạo mã QR. Vui lòng thử lại.
              </Text>
            )}

            {/* Hiển thị số tiền thanh toán */}
            <Text
              style={[
                styles.planPrice, 
                {
                  color: color.dark_green,
                  alignSelf: "center",
                  fontSize: 18,
                  marginTop: 10,
                  marginBottom: 20,
                  fontFamily: FONTS.semiBold,
                },
              ]}
            >
              Số tiền: {currentPlan?.price.toLocaleString() || 0} VND
            </Text>
            
            {/* ✨ HIỂN THỊ TRẠNG THÁI THANH TOÁN (tùy chọn) */}
            <View style={styles.statusBox}>
                {paymentStatus === 'Pending' && (
                    <View style={styles.statusRow}>
                        <ActivityIndicator size="small" color={color.dark_green} />
                        <Text style={styles.statusTextPending}>Đang chờ xác nhận từ ngân hàng...</Text>
                    </View>
                )}
                {paymentStatus === 'Completed' && (
                    <View style={styles.statusRow}>
                        <Ionicons name="checkmark-circle" size={20} color={color.green} />
                        <Text style={styles.statusTextSuccess}>Thanh toán thành công!</Text>
                    </View>
                )}
                {paymentStatus === 'Failed' && (
                    <View style={styles.statusRow}>
                        <Ionicons name="close-circle" size={20} color={color.red_dark} />
                        <Text style={styles.statusTextFailed}>Thanh toán thất bại. Vui lòng thử lại.</Text>
                    </View>
                )}
                {!transactionId && !qrLoading && <Text style={styles.statusTextFailed}>Không tìm thấy ID giao dịch.</Text>}
            </View>
            {/* END: HIỂN THỊ TRẠNG THÁI */}

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveQRImage}
              disabled={!qrImageUrl}
            >
              <Ionicons name="download-outline" size={20} color={color.white} />
              <Text style={styles.saveButtonText}>Lưu ảnh QR</Text>
            </TouchableOpacity>

            {/* Thông tin về phương thức thanh toán */}
            <Text style={styles.paymentInfo}>
              *Hệ thống sẽ tự động xác nhận thanh toán sau khi bạn chuyển khoản
              thành công.
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: color.white,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 24,
    color: color.dark_green,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  header: {
    position: "absolute",
    top: 5,
    left: 5,
    zIndex: 10,
  },
  titleContainer: {
    marginTop: 50,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: color.dark_green,
  },
  subtitle: {
    fontSize: 14,
    color: color.gray_dark,
    marginTop: 4,
  },
  tableContainer: {
    backgroundColor: color.gray_light,
    borderRadius: 12,
    padding: 12,
    marginTop: 24,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 8,
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: color.black,
    textAlign: "center",
  },
  crown: {
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: color.light_gray,
  },
  cellText: {
    fontSize: 13,
    color: color.black,
  },
  planContainer: {
    marginTop: 24,
  },
  planBox: {
    borderWidth: 1,
    borderColor: color.green,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  planSelected: {
    borderWidth: 2,
    borderColor: color.dark_green,
    backgroundColor: "#F8FFF3",
  },
  planTitle: {
    fontSize: 15,
    color: color.dark_green,
  },
  planPrice: {
    fontSize: 13,
    color: color.black,
    marginTop: 6,
  },
  button: {
    backgroundColor: color.dark_green,
    borderRadius: 10,
    paddingVertical: 18,
    marginVertical: 24,
  },
  buttonText: {
    color: color.white,
    fontSize: 15,
    textAlign: "center",
  },
  // ✨ STYLES CHO MODAL
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end", // Đẩy modal lên từ dưới
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: color.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 30,
    minHeight: 350,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    width: "90%",
    color: color.dark_green,
  },
  modalSubtitle: {
    fontSize: 14,
    color: color.gray_dark,
    marginBottom: 20,
  },
  qrImage: {
    width: 300,
    height: 300,
    alignSelf: "center",
    resizeMode: "contain",
  },
  paymentInfo: {
    fontSize: 12,
    color: color.gray_dark,
    textAlign: "center",
    marginVertical: 10,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.dark_green,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 10,
    alignSelf: "center",
  },
  saveButtonText: {
    color: color.white,
    marginLeft: 6,
    fontSize: 14,
    fontFamily: FONTS.medium,
  }, 	
  // ✨ STYLES MỚI CHO TRẠNG THÁI THANH TOÁN
  statusBox: {
    marginVertical: 15,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 5,
  },
  statusTextPending: {
      marginLeft: 8,
      fontSize: 16,
      color: color.dark_green,
      fontFamily: FONTS.medium,
  },
  statusTextSuccess: {
      marginLeft: 8,
      fontSize: 16,
      color: color.green,
      fontFamily: FONTS.semiBold,
  },
  statusTextFailed: {
      marginLeft: 8,
      fontSize: 16,
      color: color.red_dark,
      fontFamily: FONTS.medium,
  },
});
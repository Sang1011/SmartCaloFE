import color from "@constants/color";
import { FONTS } from "@constants/fonts";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { refreshTokenThunk } from "@features/auth";
import { fetchPaymentQRUrl, fetchPaymentStatus } from "@features/payment";
import { fetchAllSubscriptions } from "@features/subscriptions";
import { fetchCurrentUserThunk } from "@features/users";
import { RootState } from "@redux";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { getAccessToken, getRefreshToken } from "@stores";
import { navigateCustom } from "@utils/navigation";
import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function SubscriptionScreen() {
  const [selectedPlanId, setSelectedPlanId] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pollingStartTime, setPollingStartTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(600); // 600 giây = 10 phút
  const [hasShownSuccessAlert, setHasShownSuccessAlert] = useState(false);

  const dispatch = useAppDispatch();
  const { subscriptionPlans, loading } = useAppSelector(
    (state: RootState) => state.subscription
  );

  const { qrImageUrl, qrLoading, transactionId, paymentStatus } =
    useAppSelector((state: RootState) => state.payment);
  const { user } = useAppSelector((state: RootState) => state.user);
  const [isPro, setIsPro] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      if (user.currentPlanId !== 1) {
        setIsPro(true);
      }
    }
  }, [user]);

  const handlePaymentURlCreate = async () => {
    const res = await dispatch(
      fetchPaymentQRUrl({ planId: selectedPlanId })
    ).unwrap();
    if (res?.transactionId) {
      setPollingStartTime(Date.now()); // Lưu thời gian bắt đầu
      setTimeRemaining(600); // Reset thời gian còn lại
      setHasShownSuccessAlert(false); // Reset flag
      setIsModalVisible(true);
    } else {
      Alert.alert("Lỗi", "Không thể tạo QR. Vui lòng thử lại!");
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setPollingStartTime(null);
    setTimeRemaining(600);
    setHasShownSuccessAlert(false); // Reset flag
  };

  const features = [
    {
      name: "Nhận diện thức ăn qua hình ảnh",
      free: "3 lần",
      premium: "Không giới hạn",
    },
    { name: "Kiểm tra điểm danh hàng ngày", free: "✔️", premium: "✔️" },
    { name: "Tính toán BMI/BMR/TDEE", free: "✔️", premium: "✔️" },
    { name: "Xem thực đơn ăn uống", free: "✔️", premium: "✔️" },
    { name: "Tập luyện thể thao", free: "✔️", premium: "✔️" },
    {
      name: "Ghi lại lịch sử thay đổi cân nặng và chiều cao",
      free: "✔️",
      premium: "✔️",
    },
    {
      name: "Áp dụng thực đơn và tạo thực đơn tùy chỉnh theo cá nhân",
      free: "❌",
      premium: "✔️",
    },
    { name: "Tra cứu thư viện món ăn", free: "✔️", premium: "✔️" },
    { name: "AI Chatbox tư vấn", free: "❌", premium: "✔️" },
    { name: "Theo dõi & ghi nhật ký ăn uống", free: "✔️", premium: "✔️" },
    {
      name: "Xem thông tin dinh dưỡng chi tiết của các bữa ăn đã ghi",
      free: "❌",
      premium: "✔️",
    },
  ];

  const checkToken = async () => {
    console.warn("accessToken", await getAccessToken());
    console.warn("refreshToken", await getRefreshToken());
  };

  useEffect(() => {
    checkToken();
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

  // Timer đếm ngược hiển thị thời gian còn lại
  useEffect(() => {
    if (isModalVisible && pollingStartTime) {
      const timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - pollingStartTime) / 1000);
        const remaining = 600 - elapsed;
        setTimeRemaining(remaining > 0 ? remaining : 0);

        if (remaining <= 0) {
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isModalVisible, pollingStartTime]);

  // Logic Polling chính (Chạy liên tục khi ở foreground)
  useEffect(() => {
    // 1. Dừng Polling nếu đã thành công
    if (
      paymentStatus?.toString().toLowerCase() === "completed" &&
      !hasShownSuccessAlert
    ) {
      setHasShownSuccessAlert(true);

      Alert.alert(
        "Thành công! 🎉",
        "Tài khoản của bạn đã được nâng cấp!",
        [
          {
            text: "OK",
            onPress: async () => {
              await forceRefreshUser();
            },
          },
        ]
      );
      return;
    }

    // 2. Không bắt đầu polling nếu:
    // - Modal đã đóng
    // - Không có transaction ID
    // - Không có thời gian bắt đầu
    // - Đã thành công rồi
    // - Đã show alert rồi
    if (
      !isModalVisible ||
      !transactionId ||
      !pollingStartTime ||
      paymentStatus?.toString().toLowerCase() === "completed" ||
      hasShownSuccessAlert
    ) {
      return;
    }

    const POLLING_INTERVAL = 2000; // 2 giây
    const MAX_POLLING_DURATION = 10 * 60 * 1000; // 10 phút

    // 3. Bắt đầu polling sau 2 giây
    const timeoutId = setTimeout(() => {
      const intervalId = setInterval(() => {
        const elapsedTime = Date.now() - pollingStartTime;

        // Kiểm tra nếu đã quá 10 phút
        if (elapsedTime >= MAX_POLLING_DURATION) {
          clearInterval(intervalId);
          console.log("🛑 Polling stopped after 10 minutes");
          Alert.alert(
            "Hết thời gian",
            "Đã hết thời gian thanh toán (10 phút). Vui lòng thử lại."
          );
          handleCloseModal();
          return;
        }

        console.log(
          `⏳ Checking payment status (${Math.floor(elapsedTime / 1000)}s)`
        );
        dispatch(fetchPaymentStatus(transactionId));
      }, POLLING_INTERVAL);

      // Cleanup interval khi component unmount hoặc dependencies thay đổi
      return () => {
        clearInterval(intervalId);
        console.log("🛑 Payment status check stopped.");
      };
    }, 2000);

    // 4. Cleanup timeout
    return () => {
      clearTimeout(timeoutId);
    };
  }, [
    isModalVisible,
    transactionId,
    paymentStatus,
    pollingStartTime,
    dispatch,
    hasShownSuccessAlert,
  ]);

  const forceRefreshUser = async () => {
    await dispatch(refreshTokenThunk())
      .unwrap()
      .catch((err) => {
        console.log("Refresh attempt failed gracefully:", err);
      });

    // Đóng modal
    handleCloseModal();
  };

  // Logic Polling chính (Chạy liên tục khi ở foreground)
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    const POLLING_INTERVAL = 1000; // 1 giây
    const MAX_POLLING_DURATION = 10 * 60 * 1000; // 10 phút

    // 1. Dừng Polling nếu đã thành công
    if (
      paymentStatus?.toString().toLowerCase() === "completed" &&
      !hasShownSuccessAlert
    ) {
      setHasShownSuccessAlert(true);
      if (intervalId) clearInterval(intervalId);

      Alert.alert(
        "Thành công! 🎉",
        "Tài khoản của bạn đã được nâng cấp!",
        [
          {
            text: "OK",
            onPress: async () => {
              await forceRefreshUser();
            },
          },
        ]
      );

      return;
    }

    // 2. Bắt đầu Polling: Chỉ Polling khi Modal mở, có ID giao dịch và chưa thành công
    if (
      isModalVisible &&
      transactionId &&
      pollingStartTime &&
      paymentStatus?.toString().toLowerCase() !== "completed"
    ) {
      setTimeout(() => {
        let intervalId: number | null = null;
        intervalId = setInterval(() => {
          const elapsedTime = Date.now() - pollingStartTime;

          // Kiểm tra nếu đã quá 10 phút
          if (elapsedTime >= MAX_POLLING_DURATION) {
            if (intervalId) clearInterval(intervalId);
            console.log("🛑 Polling stopped after 10 minutes");
            Alert.alert(
              "Hết thời gian",
              "Đã hết thời gian thanh toán (10 phút). Vui lòng thử lại."
            );
            handleCloseModal();
            return;
          }

          dispatch(fetchPaymentStatus(transactionId));
          console.log(
            `⏳ Checking payment status (${Math.floor(elapsedTime / 1000)}s)`
          );
        }, POLLING_INTERVAL);
      }, 2000);
    }

    // 3. Cleanup Function: Dọn dẹp Interval
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        console.log("🛑 Payment status check stopped.");
      }
    };
  }, [
    isModalVisible,
    transactionId,
    paymentStatus,
    pollingStartTime,
    dispatch,
    hasShownSuccessAlert,
  ]);

  const formatExpiryDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Tính số ngày còn lại
  const getDaysRemaining = (dateString: string) => {
    const expiryDate = new Date(dateString);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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
      console.warn(error);
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

          {features.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text style={[styles.cellText, { flex: 2 }]}>{item.name}</Text>
              <Text style={[styles.cellText, { flex: 1, textAlign: "center" }]}>
                {item.free}
              </Text>
              <Text style={[styles.cellText, { flex: 1, textAlign: "center" }]}>
                {item.premium}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.planContainer}>
          {subscriptionPlans
            .filter((plan) => plan.price !== 0 && plan.durationInDays !== 9999)
            .map((plan) => (
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
            ))}
        </View>
        {isPro ? (
          <View
            style={{
              backgroundColor: "#E7F8ED",
              borderRadius: 10,
              paddingVertical: 14,
              paddingHorizontal: 12,
              marginVertical: 24,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: color.dark_green,
                fontFamily: FONTS.semiBold,
                fontSize: 15,
                textAlign: "center",
              }}
            >
              Bạn đang sử dụng gói
              <Text style={{ color: color.green }}> PREMIUM</Text>
            </Text>
            {user?.currentSubscriptionExpiresAt && (
              <>
                <Text
                  style={{
                    marginTop: 6,
                    color: color.black,
                    fontFamily: FONTS.regular,
                    fontSize: 13,
                    textAlign: "center",
                  }}
                >
                  Còn lại {getDaysRemaining(user.currentSubscriptionExpiresAt)}{" "}
                  ngày
                </Text>
                <Text
                  style={{
                    color: color.gray_dark,
                    fontFamily: FONTS.regular,
                    fontSize: 13,
                    textAlign: "center",
                  }}
                >
                  Hết hạn vào ngày{" "}
                  {formatExpiryDate(user.currentSubscriptionExpiresAt)}
                </Text>
              </>
            )}
          </View>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={handlePaymentURlCreate}
          >
            <Text style={[styles.buttonText, { fontFamily: FONTS.semiBold }]}>
              Nâng cấp tài khoản của bạn ngay bây giờ!
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header và nút đóng */}
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { fontFamily: FONTS.semiBold }]}>
                Thanh toán cho gói {currentPlan?.planName || "Đang chọn..."}
              </Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <MaterialIcons name="close" size={28} color={color.gray_dark} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Vui lòng quét mã QR dưới đây để thanh toán.{"\n"}
              Vui lòng thực hiện việc chuyển tiền trong{" "}
              <Text style={{ fontWeight: "bold", color: "red" }}>10 phút</Text>.
              {"\n\n"}
              Nếu việc thanh toán gặp trục trặc, vui lòng liên hệ với chúng tôi
              qua{"\n"}
              Email:{" "}
              <Text style={{ fontWeight: "bold" }}>
                pentasmartcalo@gmail.com
              </Text>
            </Text>

            {/* Hiển thị thời gian còn lại */}
            <View style={styles.timerContainer}>
              <Ionicons
                name="time-outline"
                size={18}
                color={color.dark_green}
              />
              <Text style={styles.timerText}>
                Thời gian còn lại: {Math.floor(timeRemaining / 60)}:
                {(timeRemaining % 60).toString().padStart(2, "0")}
              </Text>
            </View>

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

            {/* Hiển thị trạng thái thanh toán */}
            <View style={styles.statusBox}>
              {paymentStatus === "Pending" && (
                <View style={styles.statusRow}>
                  <ActivityIndicator size="small" color={color.dark_green} />
                  <Text style={styles.statusTextPending}>
                    Đang chờ xác nhận từ ngân hàng...
                  </Text>
                </View>
              )}
              {paymentStatus === "Completed" && (
                <View style={styles.statusRow}>
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={color.green}
                  />
                  <Text style={styles.statusTextSuccess}>
                    Thanh toán thành công!
                  </Text>
                </View>
              )}
              {paymentStatus === "Failed" && (
                <View style={styles.statusRow}>
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={color.red_dark}
                  />
                  <Text style={styles.statusTextFailed}>
                    Thanh toán thất bại. Vui lòng thử lại.
                  </Text>
                </View>
              )}
              {!transactionId && !qrLoading && (
                <Text style={styles.statusTextFailed}>
                  Không tìm thấy ID giao dịch.
                </Text>
              )}
            </View>

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
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
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
    marginBottom: 12,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF9E6",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 15,
    alignSelf: "center",
  },
  timerText: {
    fontSize: 14,
    color: color.dark_green,
    fontFamily: FONTS.semiBold,
    marginLeft: 6,
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
  statusBox: {
    marginVertical: 15,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
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

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// --- PLACEHOLDER CONSTANTS (Dựa trên style của bạn) ---
// Vui lòng thay thế bằng import từ file constants thực tế của bạn
const color = {
  background: "#f4f4f9", // Nền nhạt
  white: "#ffffff",
  dark_green: "#007bff", // Màu xanh dương (đã thay đổi để nổi bật)
  icon: "#4a4a4a", // Icon xám đậm
  primary_button: "#28a745", // Xanh lá cho nút Gửi
  star_active: "#ffc107", // Màu vàng sao
  star_inactive: "#e0e0e0", // Màu sao chưa chọn
};

// Giả lập FONTS
const FONTS = {
  regular: "System", // Thay thế bằng font thực tế của bạn
  medium: "System",
  semiBold: "System",
};
// --------------------------------------------------------

export default function ReviewAppScreen() {
  const router = useRouter();
  const [rating, setRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleRating = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      // Dùng Alert trong môi trường React Native
      Alert.alert("Lỗi", "Vui lòng chọn số sao để đánh giá trước khi gửi.");
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus("idle");

    // --- LOGIC GỌI API GỬI ĐÁNH GIÁ Ở ĐÂY ---
    console.log("Đánh giá đã gửi:", { rating, feedbackText });
    
    // Giả lập cuộc gọi API
    await new Promise((resolve) => setTimeout(resolve, 1500)); 

    setIsSubmitting(false);
    
    // Giả lập thành công
    setSubmissionStatus("success");
    
    // Quay lại màn hình trước sau 2 giây
    setTimeout(() => {
        router.back();
    }, 2000);
  };

  const maxRating = 5;
  const starArray = Array.from({ length: maxRating }, (_, index) => index + 1);

  const renderStatusMessage = () => {
    if (submissionStatus === "success") {
      return (
        <View style={styles.statusContainer}>
          <Ionicons name="checkmark-circle" size={24} color={color.primary_button} />
          <Text style={styles.statusTextSuccess}>
            Cảm ơn bạn đã đánh giá! Phản hồi của bạn đã được ghi nhận.
          </Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={color.icon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đánh giá ứng dụng</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hướng dẫn */}
        <Text style={styles.instructionText}>
          Giúp chúng tôi cải thiện trải nghiệm của bạn. Vui lòng cho biết mức độ hài lòng của bạn!
        </Text>

        {/* Khu vực chọn sao */}
        <View style={styles.ratingSection}>
          <Text style={styles.ratingTitle}>Bạn đánh giá ứng dụng này mấy sao?</Text>
          <View style={styles.starContainer}>
            {starArray.map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleRating(star)}
                style={styles.starButton}
                disabled={isSubmitting || submissionStatus === "success"}
              >
                <Ionicons
                  name={star <= rating ? "star" : "star-outline"}
                  size={40}
                  color={star <= rating ? color.star_active : color.star_inactive}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Khu vực nhập phản hồi chi tiết */}
        <View style={styles.feedbackSection}>
          <Text style={styles.feedbackTitle}>Ý kiến đóng góp (Không bắt buộc)</Text>
          <TextInput
            style={styles.textInput}
            multiline
            placeholder="Hãy chia sẻ những điều bạn thích hoặc những điểm cần cải thiện..."
            placeholderTextColor="#888"
            value={feedbackText}
            onChangeText={setFeedbackText}
            maxLength={500}
            textAlignVertical="top"
            editable={!isSubmitting && submissionStatus !== "success"}
          />
          <Text style={styles.charCount}>{feedbackText.length}/500 ký tự</Text>
        </View>

        {renderStatusMessage()}

        {/* Nút gửi đánh giá */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            (isSubmitting || submissionStatus === "success") && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting || submissionStatus === "success"}
        >
          <Text style={styles.submitText}>
            {isSubmitting ? "Đang gửi..." : submissionStatus === "success" ? "Hoàn tất" : "Gửi đánh giá"}
          </Text>
        </TouchableOpacity>
        
        {/* Liên kết đến App Store/Google Play */}
        <TouchableOpacity 
            style={styles.linkButton} 
            onPress={() => console.log("Chuyển hướng ra Store")}
            disabled={isSubmitting || submissionStatus === "success"}
        >
             <Text style={styles.linkText}>
                Hoặc đánh giá chúng tôi trên App Store/Google Play
             </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50, // Điều chỉnh cho iPhone notch
    paddingBottom: 15,
    backgroundColor: color.white,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FONTS.semiBold,
    color: "#000",
  },
  scrollContent: {
    padding: 20,
    alignItems: "center",
  },
  instructionText: {
    fontSize: 16,
    color: color.icon,
    textAlign: "center",
    marginBottom: 30,
    fontFamily: FONTS.regular,
    paddingHorizontal: 10,
  },
  // Khu vực Rating
  ratingSection: {
    width: "100%",
    backgroundColor: color.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  ratingTitle: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: "#333",
    marginBottom: 15,
  },
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  starButton: {
    paddingHorizontal: 8,
  },
  // Khu vực Feedback
  feedbackSection: {
    width: "100%",
    backgroundColor: color.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  feedbackTitle: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: "#333",
    marginBottom: 10,
  },
  textInput: {
    height: 150,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: "#000",
  },
  charCount: {
    fontSize: 12,
    color: "#888",
    textAlign: "right",
    marginTop: 5,
    fontFamily: FONTS.regular,
  },
  // Nút Submit
  submitButton: {
    width: "100%",
    backgroundColor: color.primary_button,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: "#a0d7b0", // Màu nhạt hơn khi disabled
  },
  submitText: {
    fontSize: 18,
    fontFamily: FONTS.semiBold,
    color: color.white,
  },
  // Trạng thái
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#e6ffe6',
    borderRadius: 8,
    width: '100%',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#b2dfdb',
  },
  statusTextSuccess: {
    marginLeft: 10,
    color: color.primary_button,
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  linkButton: {
      marginTop: 20,
      padding: 5,
  },
  linkText: {
    color: color.dark_green,
    fontFamily: FONTS.regular,
    fontSize: 14,
    textDecorationLine: 'underline',
  }
});
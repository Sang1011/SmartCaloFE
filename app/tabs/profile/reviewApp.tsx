import { default as Color } from "@constants/color";
import { FONTS } from "@constants/fonts";
import { Ionicons } from "@expo/vector-icons";
import { createFeedbackThunk, deleteFeedbackThunk, getCurrentUserFeedbackThunk, resetReviewState } from "@features/review/reviewSlice";
import { fetchCurrentUserThunk } from "@features/users";
import { RootState } from "@redux";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const color = {
  background: "#f4f4f9",
  white: "#ffffff",
  dark_green: "#007bff",
  icon: "#4a4a4a",
  primary_button: "#28a745",
};

export default function ReviewAppScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.user);
  const { feedback, loading } = useAppSelector((state: RootState) => state.review);

  const [rating, setRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "success" | "error">("idle");
  const [hasFeedback, setHasFeedback] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchCurrentUserThunk());
  }, []);

  // Khi user đã có, fetch feedback
  useEffect(() => {
    if (user) {
      dispatch(getCurrentUserFeedbackThunk())
        .unwrap()
        .then((res) => {
          setHasFeedback(true);
          setRating(res.rating || 0);
          setFeedbackText(res.comment || "");
        })
        .catch(() => {
          setHasFeedback(false);
        });
    }
  }, [user]);

  const handleRating = (newRating: number) => {
    if (hasFeedback) return; // Đã có feedback thì khóa không cho chọn
    setRating(newRating);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert("Lỗi", "Vui lòng chọn số sao để đánh giá trước khi gửi.");
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(
        createFeedbackThunk({
          rating,
          comment: feedbackText,
        })
      ).unwrap();

      setSubmissionStatus("success");
      setHasFeedback(true);
    } catch (err) {
      console.log("Submit failed:", err);
      setSubmissionStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };



  const handleDeleteFeedback = async () => {
  Alert.alert("Xóa đánh giá", "Bạn có chắc muốn xóa đánh giá của mình không?", [
    { text: "Hủy", style: "cancel" },
    {
      text: "Xóa",
      style: "destructive",
      onPress: async () => {
        try {
          await dispatch(deleteFeedbackThunk()).unwrap(); 
          dispatch(resetReviewState()); 
          setHasFeedback(false);
          setRating(0);
          setFeedbackText("");
          Alert.alert("Đã xóa", "Đánh giá của bạn đã được xóa thành công!");
        } catch (err) {
          console.log("Delete failed:", err);
          Alert.alert("Lỗi", "Không thể xóa đánh giá. Vui lòng thử lại sau.");
        }
      },
    },
  ]);
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
        {loading ? (
                // ✅ Hiển thị loading khi đang tải
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={Color.dark_green} />
                  <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
                </View>
              ) : (
          <>
            <Text style={styles.instructionText}>
              Giúp chúng tôi cải thiện trải nghiệm của bạn. Vui lòng cho biết mức độ hài lòng của bạn!
            </Text>

            {/* Khu vực chọn sao */}
            <View style={styles.ratingSection}>
              <Text style={styles.ratingTitle}>
                {hasFeedback
                  ? "Đánh giá của bạn:"
                  : "Bạn đánh giá ứng dụng này mấy sao?"}
              </Text>
              <View style={styles.starContainer}>
                {starArray.map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => handleRating(star)}
                    style={styles.starButton}
                    disabled={hasFeedback || isSubmitting}
                  >
                    <Ionicons
                      name={star <= rating ? "star" : "star-outline"}
                      size={40}
                      color={star <= rating ? "#ffc107" : "#e0e0e0"}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Phản hồi chi tiết */}
            <View style={styles.feedbackSection}>
              <Text style={styles.feedbackTitle}>
                {hasFeedback ? "Nội dung đánh giá của bạn" : "Ý kiến đóng góp (Không bắt buộc)"}
              </Text>
              <TextInput
                style={styles.textInput}
                multiline
                placeholder="Hãy chia sẻ những điều bạn thích hoặc cần cải thiện..."
                placeholderTextColor="#888"
                value={feedbackText}
                onChangeText={setFeedbackText}
                editable={!hasFeedback && !isSubmitting}
                textAlignVertical="top"
                maxLength={500}
              />
              <Text style={styles.charCount}>{feedbackText.length}/500 ký tự</Text>
            </View>

            {renderStatusMessage()}

            {/* Nút hành động */}
            {!hasFeedback ? (
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (isSubmitting || submissionStatus === "success") &&
                    styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={isSubmitting || submissionStatus === "success"}
              >
                <Text style={styles.submitText}>
                  {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: "#ff3b30" }]}
                onPress={handleDeleteFeedback}
              >
                <Text style={styles.submitText}>Xóa đánh giá</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: color.white,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: { padding: 4 },
  headerTitle: {
    fontSize: 18,
    fontFamily: FONTS.semiBold,
    color: "#000",
  },
  loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      // backgroundColor: Color.white,
    },
    loadingText: {
      marginTop: 12,
      color: Color.dark_green,
      fontFamily: FONTS.medium,
      fontSize: 15,
    },
  scrollContent: { padding: 20, alignItems: "center" },
  instructionText: {
    fontSize: 16,
    color: color.icon,
    textAlign: "center",
    marginBottom: 30,
    fontFamily: FONTS.regular,
    paddingHorizontal: 10,
  },
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
  starContainer: { flexDirection: "row", justifyContent: "center" },
  starButton: { paddingHorizontal: 8 },
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
  submitButtonDisabled: { backgroundColor: "#a0d7b0" },
  submitText: { fontSize: 18, fontFamily: FONTS.semiBold, color: color.white },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#e6ffe6",
    borderRadius: 8,
    width: "100%",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#b2dfdb",
  },
  statusTextSuccess: {
    marginLeft: 10,
    color: color.primary_button,
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
});

import { apiClientFoodPrediction } from "@services/apiClient";
import { PREDICTION_AI_URLS } from "./predictionAIUrls";

export const predictionApi = {
  /**
   * Gửi file ảnh và tham số topk đến API dự đoán
   * @param topk Số lượng kết quả hàng đầu muốn trả về
   * @param image Đối tượng File (từ input[type="file"] hoặc React Native)
   */
  predictByAI: (topk: number, image: File) => {
    const formData = new FormData();
    formData.append("file", image, image.name);
    console.log("📦 Body gửi đi (FormData):", formData);
    console.log("🧾 Headers gửi đi:", {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    });

    return apiClientFoodPrediction.post(
      `${PREDICTION_AI_URLS.PREDICT_BY_AI}?topk=${topk}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      }
    );
  },
};

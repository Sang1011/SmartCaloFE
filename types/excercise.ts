
/**
 * Định nghĩa chi tiết cho một Bài tập (Exercise).
 */
export type Exercise = {
    id: string;
    name: string; // Tên bài tập, ví dụ: "push up"
    description: string; // Mô tả ngắn gọn về bài tập
    instructions: string; // Các bước hướng dẫn chi tiết
    gifUrl: string; // URL của ảnh GIF minh họa bài tập
    difficulty: number; // Cấp độ khó (giá trị 0, cần làm rõ thang điểm)
  };
  
  // ---
  
  /**
   * Định nghĩa cấu trúc phân trang (Paging metadata) cho dữ liệu Bài tập.
   */
  export type ExercisePaging = {
    pageIndex: number; // Chỉ mục trang hiện tại
    pageSize: number; // Kích thước trang
    count: number; // Tổng số bản ghi (tổng số bài tập)
    data: Exercise[]; // Mảng dữ liệu bài tập trên trang hiện tại
  };
  
  // ---
  
  /**
   * Định nghĩa kiểu dữ liệu hoàn chỉnh cho phản hồi API GetAllExercises.
   * Đây là kiểu dữ liệu mà API trả về chứa phần tử "exercises".
   */
  export type GetAllExercisesResponse = {
    exercises: ExercisePaging;
  };

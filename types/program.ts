export type WorkoutExercise = {
    id: string; // ID của đối tượng WorkoutExercise
    workoutId: string; // ID của Buổi tập chứa bài tập này
    exerciseId: string; // ID của Bài tập (tức là "Jumping Jacks")
    type: number; // Loại bài tập (cần làm rõ giá trị 0 này là gì trong hệ thống của bạn)
    metValue: number; // Giá trị MET (Metabolic Equivalent of Task)
    sets: number; // Số hiệp (sets)
    reps: number; // Số lần lặp lại (reps)
    durationMin: number; // Thời lượng (tính bằng phút) cho bài tập này (có thể là thời gian giữ hoặc tổng thời gian thực hiện)
    exerciseName: string; // Tên của bài tập, ví dụ: "Jumping Jacks"
    exerciseGifUrl: string; // URL của ảnh GIF mô tả bài tập
  };
  export type Workout = {
    id: string;
    programId: string; 
    name: string; 
    description: string; 
    totalDurationMin: number; 
    workoutExercises: WorkoutExercise[];
  };
  
  export type ProgramResponse = {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    weightLossLevel: number; 
    workouts: Workout[];
  };
  
  export type ProgramResponseList = ProgramResponse[];
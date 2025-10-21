import { useWorkoutFlow } from "@hooks/useWorkoutFlow";
import { useEffect, useMemo, useState } from "react";
import {
  WorkoutExcerciseDTO,
  WorkoutExcerciseTypeEnum
} from "../../../types/workoutExcercise";
import RestScreen from "./restScreen";
import SuccessScreen from "./successScreen";
import WorkoutIntro from "./workoutIntro";
import WorkoutTest from "./workoutTest";

interface WorkoutFlowControllerProps {
  excerciseList: WorkoutExcerciseDTO[]
}

export default function WorkoutFlowController({excerciseList}: WorkoutFlowControllerProps) {
  // 🔹 2. Chuẩn hóa dữ liệu từ API sang định dạng mà useWorkoutFlow cần
  const normalizedExercises = useMemo(() => {
    if (!excerciseList || excerciseList.length === 0) return [];

    return excerciseList.map((item) => {
      console.log(item);
      const baseItem = {
        id: item.id,
        name: item.exerciseName || "Bài tập không tên",
        image: item.exerciseGifUrl || "default-image-url"
      };

      if (item.type === WorkoutExcerciseTypeEnum.TimeBased) {
        return {
          ...baseItem,
          type: WorkoutExcerciseTypeEnum.TimeBased,
          duration: item.durationMin === 0 ? 30 : item.durationMin  // phút -> giây
        };
      }

      // Mặc định RepBased
      return {
        ...baseItem,
        type: WorkoutExcerciseTypeEnum.RepBased,
        reps: item.reps || item.sets * 12 || 10
      };
    });
  }, [excerciseList]);

  // 🔹 3. Dùng useWorkoutFlow
  const { currentItem, isRest, next, currentIndex, prev, canPrev } =
    useWorkoutFlow(normalizedExercises);

  // 🔹 4. Phase quản lý flow
  const [phase, setPhase] = useState<"intro" | "workout" | "rest" | "success">(
    "intro"
  );

  useEffect(() => {
    if (normalizedExercises.length > 0 && phase === "intro") {
      // giữ nguyên intro cho người dùng bấm start
    }

    if (normalizedExercises.length === 0 && phase !== "intro") {
      // có thể xử lý lỗi hoặc navigate ra
    }
  }, [normalizedExercises, phase]);

  const handleStart = () => {
    if (normalizedExercises.length > 0) {
      setPhase("workout");
    }
  };

  const handleNext = () => {
    next();

    const totalSteps = normalizedExercises.length * 2 - 1;

    if (currentIndex + 1 < totalSteps) {
      // Nếu đang ở nghỉ -> chuyển sang bài tập
      if (isRest) setPhase("workout");
      // Nếu đang ở bài tập -> chuyển sang nghỉ
      else setPhase("rest");
    } else {
      setPhase("success");
    }
  };

  const handlePrev = () => {
    if (!canPrev) return;
    prev();

    if (currentIndex - 1 >= 0) {
      if (isRest) setPhase("workout");
      else setPhase("rest");
    } else {
      setPhase("intro");
    }
  };

  const nextItem =
  currentIndex + 1 < normalizedExercises.length
    ? normalizedExercises[currentIndex + 1]
    : null;

  // 🔹 5. Render theo phase
  if (phase === "intro") return <WorkoutIntro onStart={handleStart} />;

  if (phase === "workout" && currentItem)
    return (
      <WorkoutTest
        item={currentItem}
        onNext={handleNext}
        onPrev={handlePrev}
        canPrev={canPrev} 
      />
    );

  if (phase === "rest")
    return <RestScreen duration={currentItem?.duration ?? 30} onNext={handleNext} nextItem={nextItem} />;

  if (phase === "success") return <SuccessScreen />;

  return null;
}

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
  const normalizedExercises = useMemo(() => {
    if (!excerciseList || excerciseList.length === 0) return [];

    return excerciseList.map((item) => {
      const baseItem = {
        id: item.id,
        name: item.exerciseName || "Bài tập không tên",
        image: item.exerciseGifUrl || "default-image-url"
      };

      if (item.type === WorkoutExcerciseTypeEnum.TimeBased) {
        return {
          ...baseItem,
          type: WorkoutExcerciseTypeEnum.TimeBased,
          duration: item.durationMin === 0 ? 30 : item.durationMin
        };
      }

      return {
        ...baseItem,
        type: WorkoutExcerciseTypeEnum.RepBased,
        reps: item.reps || item.sets * 12 || 10
      };
    });
  }, [excerciseList]);

  const { currentItem, isRest, next, currentIndex, prev, canPrev } =
    useWorkoutFlow(normalizedExercises);

  const [phase, setPhase] = useState<"intro" | "workout" | "rest" | "success">("intro");

  // ✅ Đồng bộ phase với isRest và currentIndex
  useEffect(() => {
    if (phase === "intro") return; // Giữ nguyên intro
    if (phase === "success") return; // Giữ nguyên success

    // Tự động sync phase với isRest
    if (currentIndex === -1) {
      setPhase("intro");
    } else if (isRest) {
      setPhase("rest");
    } else {
      setPhase("workout");
    }
  }, [currentIndex, isRest]);

  const handleStart = () => {
    if (normalizedExercises.length > 0) {
      setPhase("workout");
    }
  };

  const handleNext = () => {
    const totalSteps = normalizedExercises.length * 2 - 1;

    if (currentIndex + 1 >= totalSteps) {
      setPhase("success");
    } else {
      next(); // Phase sẽ tự động update qua useEffect
    }
  };

  const handlePrev = () => {
    if (!canPrev) return;
    
    if (currentIndex === 0) {
      setPhase("intro");
    } else {
      prev(); // Phase sẽ tự động update qua useEffect
    }
  };

  const nextItem = useMemo(() => {
    const currentExerciseIndex = Math.floor(currentIndex / 2);
    const nextExerciseIndex = currentExerciseIndex + 1;
    
    if (nextExerciseIndex < normalizedExercises.length) {
      return normalizedExercises[nextExerciseIndex];
    }
    
    return null;
  }, [currentIndex, normalizedExercises]);

  // Render
  if (phase === "intro") return <WorkoutIntro onStart={handleStart} />;

  if (phase === "workout" && currentItem) {
    return (
      <WorkoutTest
        item={currentItem}
        onNext={handleNext}
        onPrev={handlePrev}
        canPrev={canPrev} 
      />
    );
  }

  if (phase === "rest") {
    return (
      <RestScreen 
        duration={currentItem?.duration ?? 30} 
        onNext={handleNext}
        nextItem={nextItem} 
      />
    );
  }

  if (phase === "success") return <SuccessScreen />;

  return null;
}
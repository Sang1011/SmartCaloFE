import { useWorkoutFlow } from "@hooks/useWorkoutFlow";
import { useState } from "react";
import RestScreen from "./restScreen";
import SuccessScreen from "./successScreen";
import WorkoutIntro from "./workoutIntro";
import WorkoutTest from "./workoutTest";

export default function WorkoutFlowController() {
  // 🔹 Danh sách bài tập mẫu
  const exercises = [
    { id: 1, name: "Bước ngang", duration: 30, type: "timed" as const, image:"https://static.exercisedb.dev/media/jeHtrlO.gif" },
    { id: 2, name: "Chống đẩy", reps: 12, type: "reps" as const, image: "https://static.exercisedb.dev/media/ztAa1RK.gif"},
    { id: 3, name: "Squat", duration: 40, type: "timed" as const, image: "https://static.exercisedb.dev/media/ztAa1RK.gif" },
  ];

  const { currentItem, isRest, next, currentIndex, prev, canPrev } = useWorkoutFlow(exercises);
  const [phase, setPhase] = useState<"intro" | "workout" | "rest" | "success">(
    "intro"
  );

  const handleStart = () => setPhase("workout");

  const handleNext = () => {
    next();
    // nếu còn bài → phân loại để hiển thị rest hay workout
    if (currentIndex + 1 < exercises.length * 2 - 1) {
      if (isRest) setPhase("workout");
      else setPhase("rest");
    } else {
      // xong tất cả
      setPhase("success");
    }
  };

  const handlePrev = () => {
    if (!canPrev) return;
    prev();
    // nếu còn bài → phân loại để hiển thị rest hay workout
    if (currentIndex - 1 >= 0) {
      if (isRest) setPhase("workout");
      else setPhase("rest");
    } else {
      setPhase("intro");
    }
  }

  // 🔹 render theo phase hiện tại
  if (phase === "intro")
    return <WorkoutIntro onStart={handleStart} />;

  if (phase === "workout" && "type" in currentItem)
    return <WorkoutTest item={currentItem} onNext={handleNext} onPrev={handlePrev} />;

  if (phase === "rest" && "isRest" in currentItem)
    return <RestScreen duration={currentItem.duration} onNext={handleNext}/>;

  if (phase === "success") return <SuccessScreen />;

  return null;
}

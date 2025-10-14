import { useState } from "react";

type TimedExercise = {
  id: number;
  name: string;
  duration: number;
  type: "timed";
};

type RepsExercise = {
  id: number;
  name: string;
  reps: number;
  type: "reps";
};

type Exercise = TimedExercise | RepsExercise;
type Rest = { isRest: true; duration: number };
type FlowItem = Exercise | Rest;

export function useWorkoutFlow(exercises: Exercise[]) {
  const [index, setIndex] = useState(0);

  // 🧩 tạo danh sách có chèn nghỉ vào giữa
  const flow: FlowItem[] = exercises.flatMap((ex, i) =>
    i < exercises.length - 1 ? [ex, { isRest: true, duration: 15 }] : [ex]
  );

  const currentItem = flow[index];
  const isRest = "isRest" in currentItem;

  const next = () => {
    if (index < flow.length - 1) setIndex(index + 1);
    else console.log("✅ Hoàn thành toàn bộ bài tập!");
  };

  const prev = () => {
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  const canPrev = index > 0;

  return {
    currentItem,
    currentIndex: index,
    isRest,
    canPrev,
    prev,
    next,
  };
}

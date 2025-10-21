import { useEffect, useMemo, useState } from "react";

/**
 * Flexible exercise type expected by the hook.
 * You can pass in your normalized exercises (from backend) that
 * contain either a time-based or rep-based exercise.
 */
export type FlowExercise = {
  id: string;
  name: string;
  image?: string;
  // allow enum strings or simple 'timed'|'reps'
  type: string;
  // duration in seconds (for time-based)
  duration?: number;
  // reps/sets (for rep-based)
  reps?: number;
  sets?: number;
};

export type Rest = {
  isRest: true;
  duration: number; // seconds
  title?: string;
};

export type FlowItem = FlowExercise | Rest;

export type NextResult = {
  didMove: boolean;
  finished: boolean; // true if we were already at end (or moved to final step)
  nextIndex: number;
  nextItem?: FlowItem;
};

export type PrevResult = {
  didMove: boolean;
  prevIndex: number;
  prevItem?: FlowItem;
};

/**
 * useWorkoutFlow
 * @param exercises - array of FlowExercise (normalized from API)
 * @param restDuration - seconds (default 15)
 */
export function useWorkoutFlow(
  exercises: FlowExercise[] | undefined | null,
  restDuration: number = 15
) {
  const [index, setIndex] = useState<number>(0);

  // Build flow: [ex0, rest, ex1, rest, ex2, ...] (no rest after last item)
  const flow: FlowItem[] = useMemo(() => {
    if (!exercises || exercises.length === 0) return [];

    const out: FlowItem[] = [];
    for (let i = 0; i < exercises.length; i++) {
      out.push(exercises[i]);
      if (i < exercises.length - 1) {
        const nextName = exercises[i + 1]?.name;
        out.push({
          isRest: true,
          duration: restDuration,
          title: nextName ? `Nghỉ — chuẩn bị cho: ${nextName}` : "Nghỉ giữa bài",
        });
      }
    }
    return out;
  }, [exercises, restDuration]);

  // When exercises change, reset index to 0 (safe behavior)
  useEffect(() => {
    setIndex(0);
  }, [exercises]);

  // If new flow is shorter than current index, clamp index
  useEffect(() => {
    if (index > 0 && index >= flow.length) {
      setIndex(Math.max(0, flow.length - 1));
    }
  }, [flow.length, index]);

  const currentItem = flow[index];
  const currentIndex = index;
  const isRest = !!currentItem && "isRest" in currentItem;
  const canPrev = index > 0;
  const canNext = index < Math.max(0, flow.length - 1);

  // next: advance and return info about the new position (or indicate finished)
  const next = (): NextResult => {
    if (flow.length === 0) {
      return { didMove: false, finished: true, nextIndex: -1, nextItem: undefined };
    }

    if (index >= flow.length - 1) {
      // already at the end
      return {
        didMove: false,
        finished: true,
        nextIndex: index,
        nextItem: flow[index],
      };
    }

    const nextIndex = index + 1;
    setIndex(nextIndex);
    const nextItem = flow[nextIndex];

    return {
      didMove: true,
      finished: nextIndex >= flow.length - 1,
      nextIndex,
      nextItem,
    };
  };

  // prev: go back one step and return info
  const prev = (): PrevResult => {
    if (flow.length === 0) {
      return { didMove: false, prevIndex: -1, prevItem: undefined };
    }
    if (index <= 0) {
      setIndex(0);
      return { didMove: false, prevIndex: 0, prevItem: flow[0] };
    }
    const prevIndex = index - 1;
    setIndex(prevIndex);
    return { didMove: true, prevIndex, prevItem: flow[prevIndex] };
  };

  const goTo = (i: number) => {
    const clamped = Math.max(0, Math.min(flow.length - 1, i));
    setIndex(clamped);
    return { index: clamped, item: flow[clamped] };
  };

  const reset = () => {
    setIndex(0);
  };

  return {
    // read-only values
    currentItem,
    currentIndex,
    isRest,
    canPrev,
    canNext,
    flowLength: flow.length,

    // actions
    next,
    prev,
    goTo,
    reset,

    // full flow for debug / render if needed
    flow,
  };
}

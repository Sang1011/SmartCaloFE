import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { WorkoutExcerciseDTO } from "../../../types/workoutExcercise";
import WorkoutFlowController from "./workoutFlowController";

export default function Workout() {
  const [listExcericseReal, setListExcerciseReal] = useState<
    WorkoutExcerciseDTO[]
  >([]);

  const { workoutExcerciseList } = useLocalSearchParams<{
    workoutExcerciseList: string;
  }>();
  useEffect(() => {
    if (workoutExcerciseList) {
      const parsed = JSON.parse(workoutExcerciseList);
      console.warn(parsed);
      setListExcerciseReal(parsed);
      console.log("listExcericseReal", listExcericseReal);
    }
  }, []);


  return (
    <WorkoutFlowController
      excerciseList={listExcericseReal}
    />
  );
}

export interface WorkoutExcerciseListReponse {
  pageIndex: number,
  pageSize: number,
  count: number,
  data: WorkoutExcerciseDTO[]
}

export interface WorkoutExcerciseDTO {
  id: string,
  workoutId: string,
  exerciseId: string,
  type: WorkoutExcerciseTypeEnum,
  metValue: number,
  sets: number,
  reps: number
  durationMin: number,
  exerciseName: string,
  exerciseGifUrl: string
}

export interface WorkoutExcerciseReponse {
  excercise: WorkoutExcerciseDTO
}

export enum WorkoutExcerciseTypeEnum {
  RepBased = "RepBased",
  TimeBased = "TimeBased"
}
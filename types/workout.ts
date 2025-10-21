export interface WorkoutListResponse {
    pageIndex: number,
    pageSize: number,
    count: number,
    data: WorkoutDTO[]
}
export interface WorkoutDTO {
    id: string,
    name: string,
    description: string,
    totalDurationMin: number,
    workoutExercises: []
}

export interface WorkoutReponse {
    workout : WorkoutDTO
}
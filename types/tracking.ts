export interface CreateEntryLogRequestBody {
    dishId: string;
    quantity: number;
    mealType: number;
    sourceType: number;
    date: string;
    foodName: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
}

export interface LogEntry {
    id: string;
    loggedAt: string;
    mealType: number;
    quantity: number;
    sourceType: number;
    dishId: string;
    foodName: string;
    caloriesConsumed: number;
    proteinConsumed: number;
    carbsConsumed: number;
    fatConsumed: number;
    fiberConsumed: number;
    sugarConsumed: number;
}

export interface GetDailyLogResponse {
    id: string;
    userId: string;
    date: string;
    totalCaloriesTarget: number;
    totalProteinTarget: number;
    totalFatTarget: number;
    totalCarbsTarget: number;
    totalFiberTarget: number;
    totalSugarTarget: number;
    totalCaloriesConsumed: number;
    totalProteinConsumed: number;
    totalFatConsumed: number;
    totalCarbsConsumed: number;
    totalFiberConsumed: number;
    totalSugarConsumed: number;
    logEntries: LogEntry[];
}

export interface CreateLogEntryReponse {
    foodLogEntryId: string
}

export enum MealType {
    Breakfast = 0,
    Lunch = 1,
    Dinner = 2,
    Snack = 4
}
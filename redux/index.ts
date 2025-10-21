import { dishesReducer } from "@features/dishes";
import { excerciseReducer } from "@features/excercises";
import { menuReducer } from "@features/menus";
import { paymentReducer } from "@features/payment";
import { programReducer } from "@features/programs";
import { subcriptionReducer } from "@features/subscriptions";
import { userReducer } from "@features/users";
import { workoutExcerciseReducer } from "@features/workouExcercise";
import { workoutReducer } from "@features/workouts";
import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../features/auth";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    subscription: subcriptionReducer,
    user: userReducer,
    program: programReducer,
    excercise: excerciseReducer,
    menu: menuReducer,
    dish: dishesReducer,
    workout: workoutReducer,
    payment: paymentReducer,
    workoutExcercise: workoutExcerciseReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
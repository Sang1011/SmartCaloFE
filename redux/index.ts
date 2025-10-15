import { excerciseReducer } from "@features/excercises";
import { programReducer } from "@features/programs";
import { subcriptionReducer } from "@features/subscriptions";
import { userReducer } from "@features/users";
import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../features/auth";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    subscription: subcriptionReducer,
    user: userReducer,
    program: programReducer,
    excercise: excerciseReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
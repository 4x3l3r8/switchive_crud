"use client";
import { configureStore } from "@reduxjs/toolkit";
import hotelSlice from "./features/hotels";
import { CountriesApi } from "./services/api";

export const makeStore = () => {
  return configureStore({
    reducer: {
      hotel: hotelSlice,
      [CountriesApi.reducerPath]: CountriesApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(CountriesApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

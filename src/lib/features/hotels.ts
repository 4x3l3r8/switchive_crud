import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialHotelsState = {
  hotels: [],
};

export const hotelSlice = createSlice({
  name: "hotel",
  initialState: initialHotelsState,
  reducers: {
    setHotels: (state, action) => {
      state.hotels = action.payload;
    },
  },
});

export const { setHotels } = hotelSlice.actions;

export const selectHotel = (state: RootState) => state.hotel.hotels;

export default hotelSlice.reducer;

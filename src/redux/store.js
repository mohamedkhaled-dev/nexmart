import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "./slices/filterSlice";

const store = configureStore({
  reducer: {
    filters: filterReducer,
  },
});

export default store;

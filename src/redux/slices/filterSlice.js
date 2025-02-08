import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedCategories: [],
  selectedBrands: [],
  avgRating: 0,
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setCategoryFilter(state, action) {
      state.selectedCategories = action.payload;
    },
    setBrandFilter(state, action) {
      state.selectedBrands = action.payload;
    },
    setAvgRatingFilter(state, action) {
      state.avgRating = action.payload;
    },
    clearAllFilters(state) {
      state.selectedCategories = [];
      state.selectedBrands = [];
      state.avgRating = 0;
    },
  },
});

export const {
  setCategoryFilter,
  setBrandFilter,
  setAvgRatingFilter,
  clearAllFilters,
} = filterSlice.actions;

export default filterSlice.reducer;

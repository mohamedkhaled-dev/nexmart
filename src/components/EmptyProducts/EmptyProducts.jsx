import React, { useEffect } from "react";
import { clearAllFilters } from "../../redux/slices/filterSlice";
import { useDispatch } from "react-redux";

export default function EmptyProducts() {
  const dispatch = useDispatch();

  // Clear all filters
  const clearFilters = () => {
    dispatch(clearAllFilters());
  };

  useEffect(() => {
    return () => {
      clearFilters();
    };
  }, []);
  return (
    <>
      <div className="w-full flex flex-col items-center justify-center p-12 space-y-4 border-2 border-dashed border-gray-200 rounded-lg">
        <i className="fas fa-box-open text-4xl text-gray-400"></i>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            No Products Found
          </h3>
          <p className="text-gray-500 w-full max-w-[90%] mx-auto">
            We couldn't find any products matching your current filters. Try
            adjusting your selection or clear all filters.
          </p>
        </div>
        <button
          onClick={() => clearFilters()}
          className="mt-4 px-6 py-3 bg-black text-white rounded-full hover:-translate-y-[0.1rem] transition-transform duration-300"
        >
          Clear Filters
        </button>
      </div>
    </>
  );
}

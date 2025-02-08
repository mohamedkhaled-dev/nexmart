import React from "react";
import { Link } from "react-router-dom";

export default function EmptyCart() {
  return (
    <>
      <div className="min-h-screen pb-12">
        <div className="w-full flex flex-col items-center justify-center p-12 space-y-4 border-2 border-dashed border-gray-200 rounded-lg">
          <svg
            className="size-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Your Cart is Empty
            </h3>
            <p className="text-gray-500 w-full  max-w-[90%]  mx-auto">
              Looks like you haven't added anything to your cart yet. Browse our
              products and find something you like.
            </p>
          </div>

          <Link
            to="/products"
            className="mt-4 px-6 py-3 bg-black text-white rounded-full hover:-translate-y-[0.1rem] transition-transform duration-300"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    </>
  );
}

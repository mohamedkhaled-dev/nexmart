import React from "react";
import { Link } from "react-router-dom";

export default function EmptyWishList() {
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
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>

          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Your Wishlist is Empty
            </h3>
            <p className="text-gray-500 w-full  max-w-[90%]  mx-auto">
              Found something you like? Save items to your wishlist for later
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

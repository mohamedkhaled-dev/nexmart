import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { Link } from "react-router-dom";

export default function EmptyOrders() {
  const { userToken } = useContext(UserContext);
  return (
    <>
      <div className="min-h-screen pt-40 pb-12">
        <div className="w-full flex flex-col items-center justify-center p-12 space-y-4 border-2 border-dashed border-gray-200 rounded-lg">
          <svg
            className="w-16 h-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z M15 6h2M15 9h2M15 12h2"
            />
          </svg>

          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              No Orders Found
            </h3>
            <p className="text-gray-500 w-full max-w-[90%] mx-auto">
              {!userToken
                ? "Please log in to view your orders"
                : "Start shopping and make your first order!"}
            </p>
          </div>

          <Link
            to={!userToken ? "/login" : "/products"}
            className="mt-4 px-6 py-3 bg-black text-white rounded-full hover:-translate-y-[0.1rem] transition-transform duration-300"
          >
            {!userToken ? "Login Now" : "Start Shopping"}
          </Link>
        </div>
      </div>
    </>
  );
}

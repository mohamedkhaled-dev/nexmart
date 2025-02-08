import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  useEffect(() => {
      document.title = "NexMart"
    }, [])
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-9xl font-bold text-black pb-4">404</h1>

        {/* Error Message */}
        <h2 className="text-3xl font-semibold text-gray-900 pb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 pb-8">
          Sorry, we couldn't find the page you're looking for. Perhaps you've
          mistyped the URL or the page has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:-translate-y-[0.1rem] transition-transform duration-300"
          >
            Go Home
          </Link>
          <Link
            to="/products"
            className="bg-white text-black border border-black px-8 py-3 rounded-full font-semibold hover:-translate-y-[0.1rem] transition-transform duration-300"
          >
            Browse Products
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-12 bg-primary rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 pb-2">Need Help?</h3>
          <p className="text-gray-600 mpb-4">
            If you're having trouble finding what you need, we're here to help
          </p>
          <Link to="/" className="text-black font-semibold hover:underline">
            Contact Support →
          </Link>
        </div>
      </div>
    </div>
  );
}

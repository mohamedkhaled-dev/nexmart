import React, { useEffect } from "react";

export default function Shipping() {
  useEffect(() => {
    document.title = "NexMart | Shipping";
  }, []);
  return (
    <>
      <div className="min-h-screen bg-white flex flex-col justify-center items-center pt-32">
        <div className="w-full lg:w-5/6 2xl:w-4/6">
          <h1 className="text-4xl font-bold text-center pb-4">
            Shipping Information
          </h1>
          <p className="text-gray-600 text-center pb-8">
            Fast and reliable delivery for all your orders
          </p>

          {/* Main Shipping Info */}
          <div className="bg-primary rounded-3xl p-8 mb-12">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600">
                We offer complimentary shipping on all orders
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-8 text-center">
              <div>
                <div className="bg-white rounded-2xl p-4 mb-3 w-fit mx-auto">
                  <svg
                    className="size-7 mx-auto text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="font-medium">3-5 Business Days</p>
                <p className="text-sm text-gray-600">Delivery Time</p>
              </div>

              <div>
                <div className="bg-white rounded-2xl p-4 mb-3 w-fit mx-auto">
                  <svg
                    className="size-7 mx-auto text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <p className="font-medium">Free</p>
                <p className="text-sm text-gray-600">Shipping Cost</p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-primary rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-3">Order Tracking</h2>
              <p className="text-gray-600">
                Track your package every step of the way. You'll receive a
                tracking number via email once your order ships.
              </p>
            </div>

            <div className="bg-primary rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-3">Delivery Areas</h2>
              <p className="text-gray-600">
                We currently deliver to all areas within Egypt. Orders are
                processed Monday through Friday.
              </p>
            </div>

            <div className="bg-primary rounded-2xl p-6 md:col-span-2">
              <h2 className="text-xl font-semibold mb-3">Need Help?</h2>
              <p className="text-gray-600">
                Our customer service team is available to assist you with any
                shipping-related questions. Contact us for support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

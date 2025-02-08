import React, { useEffect } from "react";

export default function Returns() {
  useEffect(() => {
    document.title = "NexMart | Returns";
  }, []);
  return (
    <>
      <div className="min-h-screen bg-white flex flex-col justify-center items-center pt-32 lg:pt-0">
        <div className="w-full lg:w-5/6 2xl:w-4/6">
          <h1 className="text-4xl font-bold text-center pb-4">
            Returns Policy
          </h1>
          <p className="text-gray-600 text-center pb-6">
            Easy returns within 30 days of purchase
          </p>

          <div className="flex flex-col gap-8">
            <div className="bg-primary rounded-2xl p-8">
              <h2 className="text-2xl font-semibold pb-4">How to Return</h2>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <span className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    1
                  </span>
                  <p className="text-gray-600">
                    Sign in to your account and go to your orders
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    2
                  </span>
                  <p className="text-gray-600">
                    Select the items you want to return
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    3
                  </span>
                  <p className="text-gray-600">
                    Print the return label and attach it to your package
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary rounded-2xl p-8">
              <h2 className="text-2xl font-semibold pb-4">Return Conditions</h2>
              <div className="flex flex-col gap-3 text-gray-600">
                <p>• Items must be unused and in original packaging</p>
                <p>• Returns must be initiated within 30 days of delivery</p>
                <p>• Original receipt or gift receipt required</p>
                <p>• Some items may be non-returnable</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

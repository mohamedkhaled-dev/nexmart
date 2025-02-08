import React, { useEffect } from "react";

export default function Privacy() {
  useEffect(() => {
      document.title = "NexMart | Privacy Policy"
    }, [])
  return (
    <>
      <div className="min-h-screen bg-white flex flex-col justify-center items-center pt-32">
        <div className="w-full lg:w-5/6 2xl:w-4/6">
          <h1 className="text-4xl font-bold text-center mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600 text-center mb-12">
            Last updated: March 2024
          </p>

          <div className="flex flex-col gap-8">
            <div className="bg-primary rounded-2xl p-8">
              <h2 className="text-2xl font-semibold mb-4">
                Information We Collect
              </h2>
              <div className="flex flex-col gap-3 text-gray-600">
                <p>• Personal identification information</p>
                <p>• Contact information</p>
                <p>• Payment details</p>
                <p>• Usage data and preferences</p>
              </div>
            </div>

            <div className="bg-primary rounded-2xl p-8">
              <h2 className="text-2xl font-semibold mb-4">
                How We Use Your Information
              </h2>
              <div className="flex flex-col gap-3 text-gray-600">
                <p>• Process your orders</p>
                <p>• Send order updates</p>
                <p>• Improve our services</p>
                <p>• Communicate about promotions</p>
              </div>
            </div>

            <div className="bg-primary rounded-2xl p-8">
              <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
              <div className="flex flex-col gap-3 text-gray-600">
                <p>• Access your personal data</p>
                <p>• Request data correction</p>
                <p>• Request data deletion</p>
                <p>• Withdraw consent</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

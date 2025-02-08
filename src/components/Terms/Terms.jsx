import React, { useEffect } from "react";

export default function Terms() {
  useEffect(() => {
      document.title = "NexMart | Terms of Services"
    }, [])
  return (
    <>
      <div className="min-h-screen bg-white flex flex-col justify-center items-center pt-32 ">
        <div className="w-full lg:w-5/6 2xl:w-4/6">
          <h1 className="text-4xl font-bold text-center mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-600 text-center mb-12">
            Last updated:{" "}
            {new Date().toLocaleString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>

          <div className="flex flex-col gap-8">
            <div className="bg-primary rounded-2xl p-8">
              <h2 className="text-2xl font-semibold mb-4">Account Terms</h2>
              <div className="flex flex-col gap-3 text-gray-600">
                <p>• You must be 18 years or older</p>
                <p>• You must provide accurate information</p>
                <p>• You are responsible for maintaining account security</p>
                <p>• We reserve the right to terminate accounts</p>
              </div>
            </div>

            <div className="bg-primary rounded-2xl p-8">
              <h2 className="text-2xl font-semibold mb-4">Purchase Terms</h2>
              <div className="flex flex-col gap-3 text-gray-600">
                <p>• Prices are subject to change</p>
                <p>• We reserve the right to refuse service</p>
                <p>• Payment must be made in full</p>
                <p>• Shipping costs are non-refundable</p>
              </div>
            </div>

            <div className="bg-primary rounded-2xl p-8">
              <h2 className="text-2xl font-semibold mb-4">
                Intellectual Property
              </h2>
              <div className="flex flex-col gap-3 text-gray-600">
                <p>• All content is our property</p>
                <p>• You may not use our content without permission</p>
                <p>• Trademarks are protected</p>
                <p>• User content rights are retained by users</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

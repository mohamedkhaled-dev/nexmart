import React, { useEffect } from "react";

export default function Faq() {
  useEffect(() => {
    document.title = "NexMart | FAQ"
  }, [])
  return (
    <>
      <div className="min-h-screen bg-white flex flex-col justify-center items-center pt-32 lg:pt-0">
        <div className="w-full lg:w-5/6 2xl:w-4/6">
          <h1 className="text-4xl font-bold text-center mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 text-center mb-12">
            Find answers to common questions about our services
          </p>

          <div className="flex flex-col gap-6">
            <div className="bg-primary rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-3">
                How long does shipping take?
              </h3>
              <p className="text-gray-600">
                Free shipping takes 3-5 business days.
              </p>
            </div>

            <div className="bg-primary rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-3">
                What is your return policy?
              </h3>
              <p className="text-gray-600">
                We offer free returns within 30 days of purchase for unused
                items in original packaging.
              </p>
            </div>

            <div className="bg-primary rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-3">
                How can I track my order?
              </h3>
              <p className="text-gray-600">
                Once your order ships, you'll receive a tracking number via
                email to monitor your delivery.
              </p>
            </div>

            <div className="bg-primary rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-3">
                Do you ship internationally?
              </h3>
              <p className="text-gray-600">
                Yes, we ship to select countries. Shipping rates vary by
                location.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

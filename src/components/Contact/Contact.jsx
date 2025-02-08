import React, { useEffect } from "react";

export default function Contact() {
  useEffect(() => {
    document.title = "NexMart | Contact";
  }, []);
  return (
    <>
      <div className="min-h-screen bg-white flex flex-col justify-center items-center pt-32 lg:pt-0">
        <div className="w-full lg:w-5/6 2xl:w-4/6">
          <h1 className="text-4xl font-bold text-center pb-4">Contact Us</h1>
          <p className="text-gray-600 text-center pb-12">
            We're here to help. Send us a message and we'll respond as soon as
            possible.
          </p>

          <div className="flex flex-col-reverse lg:flex-row gap-12">
            {/* Contact Information */}
            <div className="flex-1 bg-primary rounded-2xl p-8">
              <h2 className="text-2xl font-semibold pb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold pb-2">Email</h3>
                  <p className="text-gray-600">mohamedkhaled-dev@outlook.com</p>
                </div>
                <div>
                  <h3 className="font-semibold pb-2">Phone</h3>
                  <p className="text-gray-600">+20 (111) 881-5757</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="flex-1">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 pb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 pb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 pb-2">
                    Message
                  </label>
                  <textarea
                    rows="4"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 px-6 rounded-full hover:-translate-y-[0.1rem] transition-transform duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

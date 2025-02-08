import React from "react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-16">
        <div className="flex flex-col lg:flex-row items-start gap-12">
          {/* Left Side - Hero Content */}
          <div className="flex-1">
            <h2 className="text-5xl font-bold mb-4 text-pretty">
              Discover <br />
              Perfect Products for
              <br />
              Every Moment
            </h2>
            <p className="text-gray-600 mb-8">
              Shop with confidence across our diverse range of categories.
              Whether you're upgrading your tech or refreshing your style, we've
              curated the best products just for you.
            </p>
            <Link
              to="/products"
              className="bg-black text-white px-8 py-4 rounded-full inline-flex items-center hover:-translate-y-[0.1rem] transition-transform duration-300"
            >
              Shop now{" "}
              <i className="fa-solid fa-chevron-right ms-2 text-sm"></i>
            </Link>
          </div>

          {/* Hero Description */}
          <div className="flex-1 mt-auto">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <span className="text-gray-600">
                4.9 <span className="text-[0.5rem]">/</span> 399 Reviews
              </span>
            </div>

            <div className="relative">
              <div className="mb-8">
                <h3 className="font-semibold mb-2">
                  Variety, Quality, Trust, Choice
                </h3>
                <p className="text-gray-600">
                  Your ultimate shopping destination. Explore our vast selection
                  of carefully curated products loved by customers worldwide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect } from "react";
import Loader from "../Loader/Loader";
import Error from "../Error/Error";

export default function Brands() {
  useEffect(() => {
    document.title = "NexMart | Brands";
  }, []);

  function getAllBrands() {
    return axios.get(`https://ecommerce.routemisr.com/api/v1/brands`);
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["brands"],
    queryFn: getAllBrands,
    select: (data) => data?.data?.data || [],
  });

  if (isError) {
    return (
      <div className="min-h-screen pt-40 bg-white">
        <Error />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-40 bg-white">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-40 bg-white">
      {/* Header Section */}
      <section className="pb-16">
        <div className="w-full lg:w-1/2 mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Our Trusted Brands</h1>
          <p className="text-gray-600">
            Discover authentic products from leading global brands, all in one
            place
          </p>
        </div>
      </section>

      {/* Brands Layout */}
      <section className="pb-16">
        <div className="flex flex-wrap justify-center">
          {/* Brand Card */}
          {data.map((brand) => (
            <div
              key={brand._id}
              className="group w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 p-2 flex flex-col items-center hover:-translate-y-1 transition-transform duration-300"
            >
              {/* Brand Logo */}
              <div className="flex items-center justify-center bg-primary rounded-2xl ">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </div>

              {/* Brand Name */}
              <span className="mt-4 text-center font-medium group-hover:text-black/70 transition-colors">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Section */}
      <section className="bg-primary py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-8 ">
            We partner with the best brands to bring you authentic, quality
            products
          </h2>
          <div className="flex flex-wrap justify-center items-center ">
            {/* Sample Logos */}
            {data.slice(0, 5).map((logo) => (
              <div key={logo._id} className="w-1/6">
                <img
                  src={logo.image}
                  alt={logo.name}
                  className="w-full h-full object-contain mix-blend-multiply grayscale"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16">
        <div className="flex flex-wrap justify-center gap-12 text-center">
          <div className="w-full sm:w-auto">
            <h3 className="text-3xl font-bold mb-2">40+</h3>
            <p className="text-gray-600">Global Brands</p>
          </div>
          <div className="w-full sm:w-auto">
            <h3 className="text-3xl font-bold mb-2">1K+</h3>
            <p className="text-gray-600">Products</p>
          </div>
          <div className="w-full sm:w-auto">
            <h3 className="text-3xl font-bold mb-2">
              24 <span className="text-sm">/</span> 7
            </h3>
            <p className="text-gray-600">Support</p>
          </div>
        </div>
      </section>
    </div>
  );
}

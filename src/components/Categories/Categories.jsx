import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCategoryFilter } from "../../redux/slices/filterSlice";
import Error from "../Error/Error";
import Loader from "../Loader/Loader";

export default function Categories() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "NexMart | Categories";
  }, []);
  

  // Fetch Categories
  function getCategories() {
    return axios.get(`https://ecommerce.routemisr.com/api/v1/categories`);
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    select: (data) => data?.data?.data || [],
  });

  const dispatch = useDispatch();
  const handleNavigation = (category) => {
    dispatch(setCategoryFilter([category]));
    navigate("/products");
  };

  if (isError) {
    return (
      <div className="min-h-screen pt-40">
        <Error />
      </div>
    );
  }

  if (isLoading)
    return (
      <div className="min-h-screen pt-40">
        <Loader />
      </div>
    );

  return (
    <section className="min-h-screen pt-40">
      {/* Header */}
      <div className="px-4 lg:px-14 mb-20">
        <div className="max-w-[90ch] mx-auto text-center">
          <h2 className="text-5xl lg:text-6xl font-bold mb-6">
            Our Categories
          </h2>
          <p className="text-gray-600 text-lg">
            Explore our collections across different categories
          </p>
        </div>
      </div>

      {/* Categories List */}
      <div className="space-y-32">
        {data.map((category, index) => (
          <div
            key={category._id}
            className={`relative px-4 lg:px-14 ${
              index % 2 === 0 ? "" : "bg-primary py-20"
            }`}
          >
            <div
              className={`flex flex-col ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } items-center gap-12`}
            >
              {/* Image Section */}
              <div className="w-full lg:w-1/2">
                <div className="relative group">
                  <div className="overflow-hidden rounded-3xl">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full aspect-[4/3] object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="w-full lg:w-1/2 space-y-6">
                <div className="space-y-4">
                  <h2 className="text-4xl font-bold">{category.name}</h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Discover our premium {category.name.toLowerCase()}{" "}
                    collection, carefully curated to bring you the finest
                    selection of products.
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <button
                    to={"/products"}
                    onClick={() => handleNavigation(category.name)}
                    className="inline-flex items-center gap-3 bg-black text-white rounded-full pl-8 pr-6 py-4 hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <span className="font-medium">
                      Explore collection
                      <i className="fa-solid fa-chevron-right ms-2 text-sm"></i>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

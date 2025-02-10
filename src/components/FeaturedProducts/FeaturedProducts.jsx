import React, { useContext } from "react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCategoryFilter } from "../../redux/slices/filterSlice";
import { useCart } from "../../hooks/useCart";
import { CartContext } from "../../context/CartContext";
import { showToast } from "../../utils/toastConfig";
import Loader from "../Loader/Loader";
import Error from "../Error/Error";

export default function FeaturedProducts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartServices = useCart();
  const queryClient = useQueryClient();
  const { setCartCount } = useContext(CartContext);

  // Check if user is logged in
  function isUserLoggedIn() {
    return !!localStorage.getItem("token");
  }

  // Fetch products
  function getProducts() {
    return axios.get(`https://ecommerce.routemisr.com/api/v1/products`);
  }

  // Fetch categories
  function getCategories() {
    return axios.get(`https://ecommerce.routemisr.com/api/v1/categories`);
  }

  // UseQuery for products
  const {
    data: products,
    isLoading: productsLoading,
    isError: productsIsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    select: (data) => data?.data?.data || [],
  });

  // UseQuery for categories
  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesIsError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    select: (data) => data?.data?.data || [],
  });

  // Handle navigation to products page with category filter
  const handleNavigation = (category) => {
    dispatch(setCategoryFilter([category]));
    navigate("/products");
  };

  // Handle adding a product to the cart
  const { mutate: addToCart } = useMutation({
    mutationFn: (productId) => cartServices.addToCart(productId),

    onMutate: async () => {
      await queryClient.cancelQueries(["cart"]);
      const previousCart = queryClient.getQueryData(["cart"]);
      showToast.success("Added to cart!");

      // Optimistically update cart count
      setCartCount((prev) => prev + 1);
      return { previousCart };
    },

    // Invalidate cart query on success
    onSuccess: () => {
      console.log("Product added to cart");
      queryClient.invalidateQueries(["cart"]);
    },

    // Roll back on error
    onError: (error, context) => {
      console.log(error);
      setCartCount((prev) => prev - 1);
      queryClient.setQueryData(["cart"], context.previousCart);
      showToast.error("Failed to add to cart");
    },
  });

  const handleAddToCart = (productId) => {
    if (!isUserLoggedIn()) {
      showToast.error("Please login first!");
      navigate("/login");
      return;
    }
    addToCart(productId);
  };

  // Loading and error states
  if (productsLoading || categoriesLoading)
    return (
      <div className="py-8">
        <Loader />
      </div>
    );
  if (productsIsError || categoriesIsError)
    return (
      <div className="py-8">
        <Error />
      </div>
    );

  return (
    <section className="pb-16">
      {categories.map((category) =>
        // Filter products for the current category
        products.filter((product) => product.category.name === category.name)
          .length > 0 ? (
          <div key={category._id} className="mb-12">
            {/* Category Header */}
            <div className="flex flex-col gap-2 mb-6">
              <h2 className="text-3xl font-bold ">{category.name}</h2>
              <button
                to="/products"
                onClick={() => handleNavigation(category.name)}
                className="bg-white border text-black px-6 py-3 rounded-full hover:-translate-y-[0.1rem] transition-transform duration-300 self-end"
              >
                Show more
              </button>
            </div>

            {/* Products Layout */}
            <div className="flex flex-wrap ">
              {products
                .filter((product) => product.category.name === category.name)
                .slice(0, 5)
                .map((product) => (
                  <div
                    key={product.id}
                    className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5 hover:-translate-y-1 transition-transform duration-300 p-4"
                  >
                    <div className="group relative">
                      {/* Category Badge */}
                      <div className="bg-white absolute top-3 left-3 px-2 py-1 text-xs rounded-full opacity-0 -translate-y-full group-hover:opacity-100 group-hover:-translate-y-0 transition-all duration-300 z-10 font-semibold">
                        {product.category.name}
                      </div>

                      {/* Product Image with Link */}
                      <Link
                        to={`/products/${product.category.name}/${product.id}`}
                      >
                        <div className="bg-primary rounded-2xl overflow-hidden relative">
                          <img
                            src={product.imageCover}
                            alt={product.title}
                            className="w-full h-[300px] object-contain px-4 mix-blend-multiply"
                          />
                          {/* Overlay on hover */}
                          <div className="absolute inset-0 bg-black bg-opacity-5 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                        </div>
                        {/* Product Info */}
                        <div className="mt-3">
                          <div className="flex justify-between items-center">
                            <h3 className="text-sm font-medium">
                              {product.title.split(" ").slice(0, 2).join(" ")}
                            </h3>
                            {/* Rating */}
                            <div className="flex items-center">
                              <i className="fas fa-star"></i>
                              <span className="text-sm ml-1">
                                {product.ratingsAverage}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm mt-1">{product.price} EGP</p>
                        </div>
                      </Link>
                      {/* Add to Cart Button */}
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        className="absolute size-12 flex justify-center items-center right-3 top-[67%] bg-black text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md z-10 hover:scale-110"
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : null
      )}
    </section>
  );
}

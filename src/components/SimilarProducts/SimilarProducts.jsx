import React, { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCategoryFilter } from "../../redux/slices/filterSlice";
import { useCart } from "../../hooks/useCart";
import { CartContext } from "../../context/CartContext";
import toast from "react-hot-toast";
import Error from "../Error/Error";
import Loader from "../Loader/Loader";

export default function SimilarProducts() {
  const { category } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartServices = useCart();
  const queryClient = useQueryClient();
  const { setCartCount } = useContext(CartContext);

  function isUserLoggedIn() {
    return !!localStorage.getItem("token");
  }

  function getAllProducts() {
    return axios.get(`https://ecommerce.routemisr.com/api/v1/products/`);
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["allProducts"],
    queryFn: getAllProducts,
    select: (data) =>
      data?.data?.data?.filter(
        (product) => product.category.name === category
      ) || [],
  });

  const handleNavigation = (category) => {
    dispatch(setCategoryFilter([category]));
    navigate("/products");
  };

  // Handle adding a product to the cart
  const { mutate: addToCart, isLoading: addToCartIsLoading } = useMutation({
    mutationFn: (productId) => cartServices.addToCart(productId),
    onMutate: async () => {
      await queryClient.cancelQueries(["cart"]);
      const previousCart = queryClient.getQueryData(["cart"]);
      toast.success("Added to cart!");

      // Optimistically update cart count
      setCartCount((prev) => prev + 1);
      return { previousCart };
    },

    // Invalidate cart query on success
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
    },

    // Roll back on error
    onError: (error, context) => {
      setCartCount((prev) => prev - 1);
      queryClient.setQueryData(["cart"], context.previousCart);
      toast.error("Failed to add to cart");
    },
  });

  const handleAddToCart = (productId) => {
    if (!isUserLoggedIn()) {
      toast.error("Please login first!");
      navigate("/login");
      return;
    }
    addToCart(productId);
  };

  if (isError) {
    return (
      <div className="py-16">
        <Error />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="py-16">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <section className="py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-t pt-14 mb-10">
          <div className="max-w-2xl mb-6 md:mb-0">
            <h2 className="text-4xl font-bold mb-4">You may also like</h2>
            <p className="text-gray-600">
              Discover our premium {category} collection designed with quality
              and versatility in mind. Perfect for any occasion, any style, any
              time.
            </p>
          </div>
          <button
            onClick={() => handleNavigation(category)}
            className="bg-white text-black px-6 py-3 border-black border rounded-full hover:-translate-y-1 transition-transform duration-300 inline-block"
          >
            Show more
          </button>
        </div>

        <div className="flex flex-wrap -mx-2">
          {data?.slice(0, 3).map((product) => (
            <div
              key={product.id}
              className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4 hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="group relative">
                {/* Category Badge  */}
                <div className="bg-white absolute top-3 left-3 px-2 py-1 text-xs rounded-full opacity-0 -translate-y-full group-hover:opacity-100 group-hover:-translate-y-0 transition-all duration-300 z-10 font-semibold">
                  {product.category.name}
                </div>
                <Link
                  to={`/products/${product.category.name}/${product.id}`}
                  className="block"
                >
                  <div className="bg-primary rounded-2xl overflow-hidden relative">
                    <img
                      src={product.imageCover}
                      alt={product.title}
                      className="w-full h-[300px] object-contain px-4 mix-blend-multiply"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-5 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  </div>
                  {/* Product Info */}
                  <div className="mt-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">
                        {product.title.split(" ").slice(0, 2).join(" ")}
                      </h3>
                      <div className="flex items-center">
                        <i className="fas fa-star "></i>
                        <span className="text-sm ml-1">
                          {product.ratingsAverage}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm mt-2 font-semibold">
                      {product.price} EGP
                    </p>
                  </div>
                </Link>
                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(product.id)}
                  className="absolute size-12 flex justify-center items-center right-5 top-[65%] bg-black text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md z-10 hover:scale-110"
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

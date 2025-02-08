import React, { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SimilarProducts from "../SimilarProducts/SimilarProducts";
import { useCart } from "../../hooks/useCart";
import { CartContext } from "../../context/CartContext";
import toast from "react-hot-toast";
import { useWishList } from "../../hooks/useWishList";
import { UserContext } from "../../context/UserContext";
import { showToast } from "../../utils/toastConfig";
import Error from "../Error/Error";
import Loader from "../Loader/Loader";

export default function ProductDetails() {
  const cartServices = useCart();
  const wishListServices = useWishList();
  const { setHasWishlistItems } = useWishList();
  const queryClient = useQueryClient();
  const { setCartCount } = useContext(CartContext);
  const { id } = useParams();
  const [thumbNav, setThumbNav] = useState(null);
  const [mainNav, setMainNav] = useState(null);
  const navigate = useNavigate();
  const { userToken } = useContext(UserContext);

  useEffect(() => {
      document.title = "NexMart | Products"
    }, [])

  // Main slider settings
  const mainNavSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    autoplay: true,
    autoplaySpeed: 3000,
    asNavFor: thumbNav,
  };

  // Thumbnail slider settings
  const thumbnailSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    focusOnSelect: true,
    centerMode: true,
    centerPadding: "0px",
    asNavFor: mainNav,
  };

  function isUserLoggedIn() {
    return !!localStorage.getItem("token");
  }

  function getProductDetails(id) {
    return axios.get(`https://ecommerce.routemisr.com/api/v1/products/${id}`);
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductDetails(id),
    select: (data) => data?.data?.data || [],
  });

  // In your Products component
  const { data: wishlist } = useQuery({
    queryKey: ["wishlist"],
    queryFn: wishListServices.getWishList,
    select: (data) => data?.data?.data || [],
    enabled: !!userToken,
  });

  // Function to check if product is in wishlist
  function isProductInWishlist(productId) {
    return wishlist?.some((item) => item.id === productId);
  }

  // add to cart mutation
  const { mutate: addToCart, isLoading: addToCartIsLoading } = useMutation({
    mutationFn: (productId) => cartServices.addToCart(productId),

    onMutate: async (productId) => {
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

  // Handle adding a product to the cart
  const handleAddToCart = (productId) => {
    if (!isUserLoggedIn()) {
      toast.error("Please login first!");
      navigate("/login");
      return;
    }
    addToCart(productId);
  };

  // add to wishlist mutation
  const { mutate: addToWishList, isLoading: addToWishListIsLoading } =
    useMutation({
      mutationFn: (productId) => wishListServices.addToWishList(productId),
      onMutate: async (productId) => {
        await queryClient.cancelQueries(["wishlist"]);
        const previousWishlist = queryClient.getQueryData(["wishlist"]);

        // Optimistically add the product to the wishlist
        const updatedWishlist = [
          ...(previousWishlist?.data?.data || []),
          { id: productId, _id: productId },
        ];

        queryClient.setQueryData(["wishlist"], {
          ...previousWishlist,
          data: { data: updatedWishlist },
        });

        showToast.success("Added to wishlist!");
        setHasWishlistItems(true);
        return { previousWishlist };
      },

      // Invalidate wishlist query on success
      onSuccess: () => {
        setHasWishlistItems(true);
        queryClient.invalidateQueries(["wishlist"]);
      },

      // Roll back on error
      onError: (error, context) => {
        showToast.error("Failed to add to wishList");
        setHasWishlistItems(false);
        queryClient.setQueryData(["wishlist"], context.previousWishList);
      },
    });

  // Handle removing a product from the wishlist
  const { mutate: removeFromWishlist } = useMutation({
    mutationFn: (productId) => wishListServices.removeItem(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries(["wishlist"]);
      const previousWishlist = queryClient.getQueryData(["wishlist"]);

      // Optimistically remove the item from the wishlist
      const updatedWishlist = previousWishlist.data.data.filter(
        (item) => item._id !== productId
      );

      // Update hasWishlistItems based on the updated wishlist
      if (updatedWishlist.length === 0) {
        setHasWishlistItems(false);
      }

      queryClient.setQueryData(["wishlist"], {
        ...previousWishlist,
        data: { data: updatedWishlist },
      });
      return { previousWishlist };
    },

    // Invalidate wishlist query on success
    onSuccess: () => {
      queryClient.invalidateQueries(["wishlist"]);
    },

    // Roll back on error
    onError: (error, context) => {
      toast.error("Failed to remove from wishlist");
      queryClient.setQueryData(["wishlist"], context.previousWishlist);
    },
  });

  // handle wishlist toggle
  const handleWishlistToggle = (productId) => {
    if (!isUserLoggedIn()) {
      showToast.error("Please login first!");
      navigate("/login");
      return;
    }

    if (isProductInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishList(productId);
    }
  };

  if (isError) {
    return (
      <div className="min-h-screen pt-40">
        <Error />
      </div>
    );
  }

  if(isLoading) {
    return (
      <div className="min-h-screen pt-40">
        <Loader />
      </div>
    );
  }

  return (
    <>
      {/* Product Details Section */}
      <section className="min-h-screen pt-40">
        <div className=" rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images Section */}
            <div className="space-y-4">
              {/* Main Slider */}
              <div className="rounded-xl overflow-hidden">
                <Slider
                  {...mainNavSettings}
                  ref={(slider) => setMainNav(slider)}
                  className="product-main-slider"
                >
                  {data.images.map((image, index) => (
                    <div key={index} className="aspect-w-1 aspect-h-1">
                      <img
                        src={image}
                        alt={`${data.title.split(" ").slice(0, 2).join(" ")} `}
                        className="w-full h-[400px] object-contain mix-blend-multiply"
                      />
                    </div>
                  ))}
                </Slider>
              </div>

              {/* Thumbnail Slider */}
              <div className="px-4">
                <Slider
                  {...thumbnailSettings}
                  ref={(slider) => setThumbNav(slider)}
                  className="product-thumb-slider"
                >
                  {data.images.map((image, index) => (
                    <div key={index} className="px-1">
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="h-24 w-full object-cover rounded cursor-pointer border hover:border-black transition-all mix-blend-multiply"
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            </div>

            {/* Product Details Section */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 text-pretty">
                  {data.title}
                </h1>
                <div className="flex justify-between items-end">
                  <p className="mt-4  font-semibold text-gray-900">
                    <i className="fas fa-star"></i> {data.ratingsAverage}
                  </p>
                  <p className="mt-4 text-2xl font-semibold text-gray-900">
                    {data.price} EGP
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 text-pretty">
                  Description
                </h3>
                <p className="mt-4 text-gray-600">{data.description}</p>
              </div>

              <div className="flex justify-center items-center">
                <div className="flex-1">
                  <button
                    onClick={() => handleAddToCart(data.id)}
                    className="w-full bg-black text-white py-3 px-6 rounded-full hover:-translate-y-1 transition-transform duration-300"
                  >
                    Add to cart
                  </button>
                </div>
                {/* Wishlist Button */}
                <button
                  onClick={() => handleWishlistToggle(data.id)}
                  className="size-12 bg-primary rounded-full flex items-center justify-center z-10 group ms-2 hover:-translate-y-1 transition-transform duration-300"
                >
                  {isProductInWishlist(data.id) ? (
                    <svg
                      className="size-7 text-black hover:scale-110 transition-transform"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  ) : (
                    <svg
                      className="size-7 text-black hover:scale-110 transition-all"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* Additional Product Information */}
              <div className="border-t border-gray-200 pt-6 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Category
                  </h3>
                  <span className="mt-1 text-sm text-gray-900">
                    {data.category.name}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Brand</h3>
                  <span className="mt-1 text-sm text-gray-900">
                    {data.brand.name}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Availability
                  </h3>
                  <span className="mt-1 text-sm text-gray-900">
                    {data.quantity > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Similar Products Section */}
        <SimilarProducts />
      </section>
    </>
  );
}

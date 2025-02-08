import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import {
  setBrandFilter,
  setCategoryFilter,
  setAvgRatingFilter,
} from "../../redux/slices/filterSlice";
import { useCart } from "../../hooks/useCart";
import { CartContext } from "../../context/CartContext";
import { useWishList } from "../../hooks/useWishList";
import { showToast } from "../../utils/toastConfig";
import { UserContext } from "../../context/UserContext";
import Error from "../Error/Error";
import Loader from "../Loader/Loader";
import EmptyProducts from "../EmptyProducts/EmptyProducts";

export default function Products() {
  const [sortOption, setSortOption] = useState("");
  const dispatch = useDispatch();
  const { selectedCategories, selectedBrands, avgRating } = useSelector(
    (store) => store.filters
  );
  const cartServices = useCart();
  const wishListServices = useWishList();
  const { setHasWishlistItems } = useWishList();
  const queryClient = useQueryClient();
  const { setCartCount } = useContext(CartContext);
  const { userToken } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "NexMart | Products";
  }, []);

  function isUserLoggedIn() {
    return !!localStorage.getItem("token");
  }

  function getProducts() {
    return axios.get(`https://ecommerce.routemisr.com/api/v1/products`);
  }
  function getCategories() {
    return axios.get(`https://ecommerce.routemisr.com/api/v1/categories`);
  }
  function getBrands() {
    return axios.get(`https://ecommerce.routemisr.com/api/v1/brands`);
  }

  const {
    data: brands,
    isLoading: brandsLoading,
    isError: brandsIsError,
  } = useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
    select: (data) => data?.data?.data || [],
  });

  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesIsError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    select: (data) => data?.data?.data || [],
  });

  const {
    data: products,
    isLoading: productsLoading,
    isError: productsIsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
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
    onMutate: async () => {
      await queryClient.cancelQueries(["cart"]);
      const previousCart = queryClient.getQueryData(["cart"]);
      showToast.success("Added to cart!");

      // Optimistically update cart count
      setCartCount((prev) => prev + 1);
      return { previousCart };
    },

    // Invalidate the cart query to refetch the updated cart
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
    },

    // Roll back on error
    onError: (error, context) => {
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

      // Invalidate the wishlist query to refetch the updated wishlist
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

    // Invalidate the wishlist query to refetch the updated wishlist
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

  // Filter products based on selected categories, brands, and ratings
  const filteredProducts = products?.filter((product) => {
    const matchesCategory = selectedCategories.length
      ? selectedCategories.includes(product.category?.name)
      : true;
    const matchesBrand = selectedBrands.length
      ? selectedBrands.includes(product.brand?.name)
      : true;
    const matchesRating = avgRating
      ? product.ratingsAverage >= avgRating
      : true;
    return matchesCategory && matchesBrand && matchesRating;
  });

  // Sort products based on the selected sort option
  const sortProducts = () => {
    if (sortOption === "ascending") {
      return filteredProducts.sort((a, b) => a.price - b.price);
    }
    if (sortOption === "descending") {
      return filteredProducts.sort((a, b) => b.price - a.price);
    }
    return filteredProducts;
  };

  // Handle error states
  if (productsIsError || categoriesIsError || brandsIsError) {
    return (
      <div className="min-h-screen pt-40 pb-12">
        <Error />
      </div>
    );
  }

  if (categoriesLoading || brandsLoading || productsLoading) {
    return (
      <div className="min-h-screen pt-40 bg-white">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen pt-40 bg-white">
        {/* Header Section */}
        <section className="pb-8">
          <h1 className="text-4xl font-bold mb-4">Our Products</h1>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-gray-600">
              Discover our curated collection of premium products
            </p>
            {/* Sort Dropdown */}
            <select
              className="p-2 border rounded-lg"
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value={""}>Featured</option>
              <option value={"ascending"}>Price: Low to High</option>
              <option value={"descending"}>Price: High to Low</option>
            </select>
          </div>
        </section>

        {/* Main Content */}
        <section className="pb-16">
          {/* Main Layout */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white p-6 rounded-xl border h-fit">
                {/* Categories Filter */}
                <div className="mb-8">
                  <h3 className="font-semibold mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label
                        key={category._id}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          name="category"
                          value={category.name}
                          checked={selectedCategories.includes(category.name)}
                          onChange={(e) => {
                            dispatch(
                              setCategoryFilter(
                                selectedCategories.includes(e.target.value)
                                  ? selectedCategories.filter(
                                      (item) => item !== e.target.value
                                    ) // Remove the selected category if already selected
                                  : [...selectedCategories, e.target.value] // Add the selected category if not selected
                              )
                            );
                          }}
                          className="accent-black"
                        />
                        <span>{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Brands Filter */}
                <div className="mb-8">
                  <h3 className="font-semibold mb-4">Brands</h3>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <label
                        key={brand._id}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          name="brand"
                          value={brand.name}
                          checked={selectedBrands.includes(brand.name)}
                          onChange={(e) => {
                            dispatch(
                              setBrandFilter(
                                selectedBrands.includes(e.target.value)
                                  ? selectedBrands.filter(
                                      (item) => item !== e.target.value
                                    ) // Remove the selected category if already selected
                                  : [...selectedBrands, e.target.value] // Add the selected category if not selected
                              )
                            );
                          }}
                          className="accent-black"
                        />
                        <span>{brand.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Ratings Filter */}
                <div>
                  <h3 className="font-semibold mb-4">Ratings</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 ">
                      <input
                        type="checkbox"
                        className="accent-black"
                        checked={avgRating === 4}
                        onChange={(e) =>
                          dispatch(setAvgRatingFilter(e.target.checked && 4))
                        }
                      />
                      <span className="flex items-center gap-2">
                        <i className="fas fa-star"></i>
                        <span className="text-sm text-gray-600">4 & up</span>
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="accent-black"
                        checked={avgRating === 3}
                        onChange={(e) =>
                          dispatch(setAvgRatingFilter(e.target.checked && 3))
                        }
                      />
                      <span className="flex items-center gap-2">
                        <i className="fas fa-star"></i>
                        <span className="text-sm text-gray-600">3 & up</span>
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="accent-black"
                        checked={avgRating === 2}
                        onChange={(e) =>
                          dispatch(setAvgRatingFilter(e.target.checked && 2))
                        }
                      />
                      <span className="flex items-center gap-2">
                        <i className="fas fa-star"></i>
                        <span className="text-sm text-gray-600">2 & up</span>
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="accent-black"
                        checked={avgRating === 1}
                        onChange={(e) =>
                          dispatch(setAvgRatingFilter(e.target.checked && 1))
                        }
                      />
                      <span className="flex items-center gap-2">
                        <i className="fas fa-star"></i>
                        <span className="text-sm text-gray-600">1 & up</span>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="lg:w-3/4">
              <div className="flex flex-wrap">
                {sortProducts().length > 0 ? (
                  sortProducts().map((product) => (
                    <div
                      key={product.id}
                      className="w-full sm:w-1/2 lg:w-1/3 p-2 hover:-translate-y-1 transition-transform duration-300"
                    >
                      <div className="group">
                        <div className="relative">
                          {/* Category Badge  */}
                          <div className="bg-white absolute top-3 left-3 px-2 py-1 text-xs rounded-full opacity-0 -translate-y-full group-hover:opacity-100 group-hover:-translate-y-0 transition-all duration-300 z-10 font-semibold">
                            {product.category.name}
                          </div>

                          {/* Wishlist Button */}
                          <button
                            onClick={() => handleWishlistToggle(product.id)}
                            className="absolute top-3 right-3 size-12 bg-white/80 rounded-full flex items-center justify-center z-10 group hover:bg-white transition-colors"
                          >
                            {isProductInWishlist(product.id) ? (
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

                          {/* Product Card */}
                          <Link
                            to={`/products/${product.category.name}/${product.id}`}
                          >
                            <div className="bg-primary rounded-2xl overflow-hidden">
                              <img
                                src={product.imageCover}
                                alt={product.title}
                                className="w-full h-[300px] object-contain px-4 mix-blend-multiply"
                              />
                            </div>
                            {/* Product Info */}
                            <div className="mt-3">
                              <div className="flex justify-between items-center">
                                <h3 className="text-sm font-medium">
                                  {product.title
                                    .split(" ")
                                    .slice(0, 2)
                                    .join(" ")}
                                </h3>
                                {/* Rating */}
                                <div className="flex items-center">
                                  <i className="fas fa-star"></i>
                                  <span className="text-sm ml-1">
                                    {product.ratingsAverage}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm mt-1">
                                {product.price} EGP
                              </p>
                            </div>
                          </Link>

                          {/* Add to Cart Button */}
                          <button
                            onClick={() => handleAddToCart(product.id)}
                            className="w-full bg-black text-white py-3 rounded-full mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:-translate-y-[0.1rem]"
                          >
                            Add to cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // No products found
                  <EmptyProducts />
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

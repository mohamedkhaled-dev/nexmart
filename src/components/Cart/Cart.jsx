import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../context/CartContext";
import { showToast } from "../../utils/toastConfig";
import CheckoutModal from "../CheckoutModal/CheckoutModal";
import { CheckoutContext } from "../../context/CheckoutContext";
import Loader from "../Loader/Loader";
import Error from "../Error/Error";
import EmptyCart from "../EmptyCart/EmptyCart";

export default function Cart() {
  const cartServices = useCart();
  const queryClient = useQueryClient();
  const { setCartCount } = useContext(CartContext);
  const { showCheckout, setShowCheckout } = useContext(CheckoutContext);

  useEffect(() => {
    document.title = "NexMart | Cart";
  }, []);

  // Fetch cart data
  const {
    data: cart,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: cartServices.getCart,
    select: (data) => data?.data?.data || [],
    enabled: !!localStorage.getItem("token"),
  });

  // Update quantity mutation
  const { mutate: updateQuantity } = useMutation({
    mutationFn: ([productId, count]) =>
      cartServices.updateCount(productId, count),

    // Optimistic update
    onMutate: async ([productId, count]) => {
      await queryClient.cancelQueries(["cart"]);
      const previousCart = queryClient.getQueryData(["cart"]);
      const updatedProduct = previousCart.data.data.products.find(
        (product) => product.product.id === productId
      );

      // Prevent updating if product doesn't exist
      if (!updatedProduct) return previousCart;

      // Optimistically update the cart
      const updatedCart = {
        ...previousCart,
        data: {
          ...previousCart.data,
          data: {
            ...previousCart.data.data,
            products: previousCart.data.data.products.map((product) =>
              product.product.id === productId
                ? { ...product, count: count }
                : product
            ),
            totalCartPrice:
              previousCart.data.data.totalCartPrice +
              (count - updatedProduct.count) * updatedProduct.price,
          },
        },
      };

      queryClient.setQueryData(["cart"], updatedCart);
      return { previousCart, updatedProduct };
    },

    // Invalidate cart query on success
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
    },

    // Roll back on error
    onError: (error, context) => {
      showToast.error("Failed to update quantity");
      queryClient.setQueryData(["cart"], context.previousCart);
    },
  });

  // Remove item mutation
  const { mutate: removeItem } = useMutation({
    mutationFn: (productId) => cartServices.removeItem(productId),

    // Optimistic update
    onMutate: async (productId) => {
      await queryClient.cancelQueries(["cart"]);
      const previousCart = queryClient.getQueryData(["cart"]);
      const removedProduct = previousCart.data.data.products.find(
        (product) => product.product.id === productId
      );

      // Prevent updating if product doesn't exist
      if (!removedProduct) return previousCart;

      // Optimistically remove the item from the cart
      const updatedCart = {
        ...previousCart,
        data: {
          ...previousCart.data,
          data: {
            ...previousCart.data.data,
            products: previousCart.data.data.products.filter(
              (product) => product.product.id !== productId
            ),
            totalCartPrice:
              previousCart.data.data.totalCartPrice -
              removedProduct.price * removedProduct.count,
          },
        },
      };

      queryClient.setQueryData(["cart"], updatedCart);
      setCartCount((prev) => prev - 1);
      return { previousCart, removedProduct };
    },

    // Invalidate cart query on success
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
    },

    // Roll back on error
    onError: (error, context) => {
      showToast.error("Failed to remove product");
      queryClient.setQueryData(["cart"], context.previousCart);
      setCartCount((prev) => prev + 1);
    },
  });

  // Clear user cart mutation
  const { mutate: clearCart } = useMutation({
    mutationFn: () => cartServices.clearCart(),

    // Optimistic update
    onMutate: async () => {
      await queryClient.cancelQueries(["cart"]);
      const previousCart = queryClient.getQueryData(["cart"]);

      // Optimistically clear all items from the cart
      const updatedCart = [];

      queryClient.setQueryData(["cart"], updatedCart);
      setCartCount(0);
      return { previousCart };
    },

    // Invalidate cart query on success
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
    },

    // Roll back on error
    onError: (error, context) => {
      showToast.error("Failed to remove product");
      queryClient.setQueryData(["cart"], context.previousCart);
      setCartCount((prev) => prev);
    },
  });

  // Handle error state
  if (isError) {
    return (
      <div className="min-h-screen pt-40 pb-12">
        <Error />
      </div>
    );
  }

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen pt-40 pb-12">
        <Loader />
      </div>
    );
  }

  // Handle empty cart or user not logged in
  if (
    !isLoading &&
    (!cart?.products?.length || !localStorage.getItem("token"))
  ) {
    return (
      <div className="min-h-screen pt-40 pb-12">
        <EmptyCart />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen pt-40 pb-12">
        {/* Cart Header */}
        <div className="flex flex-col items-start sm:flex-row sm:justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold mb-2">My Cart</h2>
          </div>
          <div className="flex self-end items-end">
            <div className="text-center pe-4">
              <p className="text-xl font-semibold">{cart?.products?.length}</p>
              <p className="text-gray-500 text-base">Cart Items</p>
            </div>
            <div className="border-l border-gray-100 ps-4">
              <button
                onClick={() => clearCart()}
                className="flex flex-col items-center gap-1 text-gray-400 hover:text-red-500 transition-colors text-base"
              >
                <svg
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span >Clear All</span>
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1 border-e border-gray-100">
            <div className="divide-y divide-gray-100">
              {cart?.products?.map(
                (product) =>
                  product?.product && (
                    <div className="py-6" key={product.product.id}>
                      {/* Main Product Row */}
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <Link
                          to={`/products/${product.product.category.name}/${product.product.id}`}
                          className="relative w-1/3 sm:size-48  bg-gray-50 rounded-xl p-3 flex-shrink-0 overflow-hidden"
                        >
                          <img
                            src={product.product.imageCover}
                            alt={product.product.title}
                            className="w-full h-full object-contain mix-blend-multiply hover:scale-105 transition-transform duration-300"
                          />
                        </Link>

                        {/* Product Details Column */}
                        <div className="flex-1">
                          {/* Title and Category */}
                          <Link
                            to={`/products/${product.product.category.name}/${product.product.id}`}
                            className="text-base sm:text-lg font-medium hover:text-gray-600 transition-colors line-clamp-2"
                          >
                            {product.product.title}
                          </Link>
                          <p className="text-sm text-gray-500 mt-1">
                            {product.product.category.name}
                          </p>

                          {/* Price Row */}
                          <div className=" mt-2">
                            <p className="text-sm text-gray-500">
                              {product.price} EGP{" "}
                              <span className="text-[0.5rem]">/</span> item
                            </p>
                          </div>

                          {/* Stock Status */}
                          <div className="flex flex-col justify-between items-start mt-2 text-sm gap-2">
                            <div className="flex items-center gap-2 mt-2">
                              <span className="size-2 rounded-full bg-green-500" />
                              <span className=" text-green-500">In Stock</span>
                            </div>
                            <p className="font-semibold pe-4 self-end">
                              {product.price * product.count} EGP
                            </p>
                          </div>

                          {/* Controls Row */}
                          <div className="flex justify-end items-center gap-4 mt-8 pe-4 flex-wrap">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-400">Qty</span>
                              <div className="flex border rounded-lg shadow-sm">
                                <button
                                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  onClick={() =>
                                    updateQuantity([
                                      product.product.id,
                                      product.count - 1,
                                    ])
                                  }
                                  disabled={product.count <= 1}
                                >
                                  −
                                </button>
                                <span className="w-10 h-8 flex items-center justify-center border-x text-sm">
                                  {product.count}
                                </span>
                                <button
                                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                                  onClick={() =>
                                    updateQuantity([
                                      product.product.id,
                                      product.count + 1,
                                    ])
                                  }
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => removeItem(product.product.id)}
                              className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <svg
                                className="size-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="1.5"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              <span className="text-sm">Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
          {/* Cart Summary */}
          <div className="lg:w-80">
            <div className=" rounded-xl p-6 sticky top-40">
              <h2 className="text-xl font-medium mb-6">Cart Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">
                    {cart.totalCartPrice.toFixed(2)} EGP
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-green-500 font-medium">Free</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-gray-100 mt-6 pt-6">
                <span className="font-medium">Total</span>
                <span className="text-lg font-semibold ">
                  {cart.totalCartPrice.toFixed(2)} EGP
                </span>
              </div>

              <div className="mt-8 space-y-3">
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-black text-white h-12 rounded-full hover:-translate-y-0.5 transition-transform duration-300"
                >
                  Proceed to Checkout
                </button>

                <Link
                  to="/products"
                  className="flex items-center justify-center gap-2 w-full h-12 text-gray-500 hover:text-black transition-colors"
                >
                  Continue Shopping
                  <svg
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showCheckout && <CheckoutModal />}
    </>
  );
}

import { useContext, useEffect } from "react";
import { useWishList } from "../../hooks/useWishList";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { CartContext } from "../../context/CartContext";
import toast from "react-hot-toast";
import Loader from "../Loader/Loader";
import Error from "../Error/Error";
import EmptyWishList from "../EmptyWishList/EmptyWishList";

export default function Wishlist() {
  const { setCartCount } = useContext(CartContext);
  const cartServices = useCart();
  const wishListServices = useWishList();
  const { setHasWishlistItems } = useWishList();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "NexMart | Wishlist";
  }, []);

  const {
    data: wishlist,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: wishListServices.getWishList,
    select: (data) => data?.data?.data || [],
    enabled: !!localStorage.getItem("token"),
  });

  function isUserLoggedIn() {
    return !!localStorage.getItem("token");
  }

  // Add to cart mutation
  const { mutate: addToCart } = useMutation({
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

  // Handle adding a product to the cart
  const handleAddToCart = (productId, e) => {
    if (!isUserLoggedIn()) {
      toast.error("Please login first!");
      navigate("/login");
      return;
    }
    addToCart(productId);
    removeFromWishlist(productId, e);
  };

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
        data: {
          data: updatedWishlist,
        },
      });

      return { previousWishlist };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["wishlist"]);
    },
    onError: (error, context) => {
      console.log(error);

      toast.error("Failed to remove from wishlist");
      queryClient.setQueryData(["wishlist"], context.previousWishlist);
    },
  });

  // Calculate total value
  const totalValue =
    wishlist?.reduce((total, item) => total + item.price, 0) || 0;

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

  // Handle empty wishlist or user not logged in
  if (!isLoading && (!wishlist?.length || !localStorage.getItem("token"))) {
    return (
      <div className="min-h-screen pt-40 pb-12">
        <EmptyWishList />
      </div>
    );
  }

  // Render wishlist data
  return (
    <div className="min-h-screen pt-40 pb-12">
      {/* Header with Stats */}
      <div className="flex items-end justify-between mb-12">
        <div>
          <h2 className="text-4xl font-bold mb-2">My Wishlist</h2>
        </div>
        <div className="flex gap-6 text-center">
          <div>
            <p className="text-xl font-semibold">{wishlist?.length}</p>
            <p className="text-gray-500 text-sm">Saved Items</p>
          </div>
          <div className="border-l border-gray-200 pl-6">
            <p className="text-xl font-semibold">{totalValue.toFixed(2)} EGP</p>
            <p className="text-gray-500 text-sm text-end">Total Value</p>
          </div>
        </div>
      </div>

      {/* Wishlist Flex Layout */}
      <div className="flex flex-wrap">
        {wishlist?.map(
          (product) =>
            product?.category && (
              <div
                key={product._id}
                className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-4 mb-8 border-t border-b"
              >
                <Link
                  to={`/products/${product.category.name}/${product.id}`}
                  className="group bg-white rounded-2xl p-4 flex flex-col relative"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square mb-4">
                    <img
                      src={product.imageCover}
                      alt={product.title}
                      className="w-full h-full object-cover rounded-xl mix-blend-multiply"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col">
                    <div className="mb-4">
                      <h3 className="font-medium text-lg mb-1 line-clamp-1">
                        {product.title}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {product.category.name}
                      </p>
                    </div>

                    <div className="mt-auto space-y-3">
                      {/* Stock Status */}
                      <div className="flex items-center gap-2">
                        <span
                          className={`size-2 rounded-full ${
                            product.quantity > 0 ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            product.quantity > 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>

                      {/* Price */}
                      <p className="font-semibold text-lg">
                        {product.price} EGP
                      </p>
                    </div>
                  </div>
                </Link>
                {/* Buttons Container */}
                <div className="relative mt-4">
                  {/* Delete Button */}
                  <button
                    className="absolute text-gray-500 bottom-[240%] right-3 p-2 hover:-translate-y-[0.1rem] hover:text-black transition-all "
                    onClick={(e) => removeFromWishlist(product._id, e)}
                    aria-label="Remove from wishlist"
                  >
                    <svg
                      className="size-5 "
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
                  </button>
                  {/* Add to Cart Button */}
                  <button
                    className={`w-full py-3 rounded-full text-sm transition-all    
                  ${
                    product.quantity > 0
                      ? "bg-black text-white hover:-translate-y-[0.1rem]"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                    onClick={(e) => handleAddToCart(product.id, e)}
                    disabled={product.quantity <= 0}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
}

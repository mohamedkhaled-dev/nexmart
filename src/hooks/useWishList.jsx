import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const baseUrl = "https://ecommerce.routemisr.com/api/v1/wishlist";

export function useWishList() {
  const { userToken } = useContext(UserContext);
  const [hasWishlistItems, setHasWishlistItems] = useState(false);

  const { data: wishlist } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => axios.get(baseUrl, { headers: { token: userToken } }),
    select: (data) => data?.data?.data || [],
    enabled: !!userToken,
  });

  // Update hasWishlistItems when wishlist changes or when userToken changes
  useEffect(() => {
    if (!userToken) {
      setHasWishlistItems(false);
      return;
    }

    if (wishlist && wishlist.length > 0) {
      setHasWishlistItems(true);
    } else {
      setHasWishlistItems(false);
    }
  }, [wishlist, userToken]);

  return {
    getWishList: () => axios.get(baseUrl, { headers: { token: userToken } }),
    addToWishList: (productId) =>
      axios.post(baseUrl, { productId }, { headers: { token: userToken } }),
    removeItem: (productId) =>
      axios.delete(`${baseUrl}/${productId}`, {
        headers: { token: userToken },
      }),
    hasWishlistItems,
    setHasWishlistItems,
  };
}

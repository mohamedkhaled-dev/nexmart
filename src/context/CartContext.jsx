import { useQuery } from "@tanstack/react-query";
import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

const baseUrl = "https://ecommerce.routemisr.com/api/v1/cart";

export const CartContext = createContext();

export default function CartContextProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const { userToken } = useContext(UserContext);
  const [cartId, setCartId] = useState(null);

  // Fetch initial cart data
  const { data: cart } = useQuery({
    queryKey: ["cart"],
    queryFn: () => axios.get(baseUrl, { headers: { token: userToken } }),
    select: (data) => data?.data?.data || [],
    enabled: !!userToken,
  });

  // Update cart count on cart mount & change
  useEffect(() => {
    if (userToken && cart?.products) {
      setCartCount(cart.products.length);
      setCartId(cart._id);
    } else {
      setCartCount(0);
    }
  }, [cart]);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, cartId }}>
      {children}
    </CartContext.Provider>
  );
}

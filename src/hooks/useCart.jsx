import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const baseUrl = "https://ecommerce.routemisr.com/api/v1/cart";

export function useCart() {
  const { userToken } = useContext(UserContext);

  return {
    getCart: () => 
      axios.get(baseUrl, { headers: { token: userToken } }),
    addToCart: (productId) => 
      axios.post(baseUrl, { productId }, { headers: { token: userToken } }),
    updateCount: (productId, count) => 
      axios.put(`${baseUrl}/${productId}`, { count }, { headers: { token: userToken } }),
    removeItem: (productId) => 
      axios.delete(`${baseUrl}/${productId}`, { headers: { token: userToken } }),
    clearCart: () => 
      axios.delete(baseUrl, { headers: { token: userToken } }),
  };
}
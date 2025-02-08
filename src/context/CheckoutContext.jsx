import { createContext, useState } from 'react';

export const CheckoutContext = createContext();

export default function CheckoutContextProvider({ children }) {
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <CheckoutContext.Provider value={{ showCheckout, setShowCheckout }}>
      {children}
    </CheckoutContext.Provider>
  );
}
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();
export default function UserContextProvider({ children }) {
  const [userToken, setUserToken] = useState(localStorage.getItem("token"));

  return (
    <UserContext.Provider value={{ userToken, setUserToken }}>
      {children}
    </UserContext.Provider>
  );
}

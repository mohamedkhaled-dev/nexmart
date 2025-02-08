import { useState } from "react";
import axios from "axios";

const baseUrl = "https://ecommerce.routemisr.com/api/v1/auth";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function makeRequest(endpoint, method, data, headers = {}) {
    setError("");
    setIsLoading(true);
    try {
      const res = await axios({
        method,
        url: `${baseUrl}${endpoint}`,
        data,
        headers,
      });
      return res.data;
    } catch (err) {
      const errorMessage = err.response?.data?.errors?.msg || err.response?.data?.message;
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  const authService = {
    register: (values) => makeRequest("/signup", "post", values),
    login: (values) => makeRequest("/signin", "post", values),
    forgotPassword: (values) => makeRequest("/forgotPasswords", "post", values),
    verifyResetCode: (values) =>
      makeRequest("/verifyResetCode", "post", values),
    resetPassword: (values) => makeRequest("/resetPassword", "put", values),
  };
  return { isLoading, error, setError, authService };
}

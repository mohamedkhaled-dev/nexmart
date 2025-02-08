import React, { useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { UserContext } from "../../context/UserContext";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { setUserToken } = useContext(UserContext);
  const { isLoading, error, setError, authService } = useAuth();

  useEffect(() => {
      document.title = "NexMart"
    }, [])

  async function handleLogin(values) {
    const data = await authService.login(values);
    error && setError("Invalid email or password");
    localStorage.setItem("token", data.token);
    setUserToken(data.token);
    navigate("/");
  }

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter a valid email")
      .required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: handleLogin,
  });

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center pt-32 md:pt-0">
      <div className="w-full lg:w-5/6 2xl:w-4/6">
        <h1 className="text-4xl font-bold pb-2 text-center">Welcome Back</h1>
        <p className="text-gray-600 pb-8 text-center">Login to your account</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-full mb-6 text-center first-letter:uppercase lowercase">
            {error}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 pb-2"
            >
              Email
            </label>
            <input
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter your email"
              autoComplete="email"
            />
            {formik.errors.email && formik.touched.email && (
              <p className="text-sm text-red-600 pl-4 pt-1">
                {formik.errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 pb-2"
            >
              Password
            </label>
            <input
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="password"
              id="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            {formik.errors.password && formik.touched.password && (
              <p className="text-sm text-red-600 pl-4 pt-1">
                {formik.errors.password}
              </p>
            )}
            <div className="flex justify-end mt-2">
              <NavLink
                to="/forgot-password"
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                Forgot Password?
              </NavLink>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 bg-black text-white py-3 px-6 rounded-full flex items-center justify-center transition-transform hover:-translate-y-[0.1rem] duration-300
                ${isLoading && "opacity-70 pointer-events-none"}`}
            >
              {isLoading ? (
                <i className="fas fa-spinner fa-spin mr-2"></i>
              ) : (
                "Login"
              )}
            </button>

            <NavLink
              to="/register"
              className={`flex-1 bg-white text-black border border-black py-3 px-6 rounded-full text-center hover:-translate-y-[0.1rem] transition-transform duration-300
                ${isLoading && "opacity-70 pointer-events-none"}`}
            >
              Register
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { UserContext } from "../../context/UserContext";
import { useAuth } from "../../hooks/useAuth";

export default function Register() {
  const navigate = useNavigate();
  const { setUserToken } = useContext(UserContext);
  const { isLoading, error, authService } = useAuth();

  useEffect(() => {
      document.title = "NexMart"
    }, [])

  // Register user
  async function handleRegister(values) {
    const data = await authService.register(values);
    localStorage.setItem("token", data.token);
    setUserToken(data.token);
    navigate("/");
  }

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .required("Name is required")
      .min(3, "Name must be at least 3 characters"),
    email: yup
      .string()
      .email("Please enter a valid email")
      .required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    rePassword: yup
      .string()
      .required("Please confirm your password")
      .oneOf([yup.ref("password")], "Passwords don't match"),
    phone: yup
      .string()
      .required("Phone number is required")
      .matches(
        /^01[0125][0-9]{8}$/,
        "Please enter a valid Egyptian phone number"
      ),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
    },
    validationSchema,
    onSubmit: handleRegister,
  });

  return (
    <>
      <div className="min-h-screen bg-white flex flex-col justify-center items-center pt-32 md:pt-0">
        {/* Registration Form */}
        <div className="w-full lg:w-5/6 2xl:w-4/6">
          <h1 className="text-4xl font-bold pb-2 text-center">
            Create Account
          </h1>
          <p className="text-gray-600 pb-8 text-center">
            Join us for exclusive offers
          </p>

          {/* form errors */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-full mb-6 text-center first-letter:uppercase lowercase">
              {error}
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 pb-2"
              >
                Full Name
              </label>
              <input
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="text"
                id="name"
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter your full name"
                autoComplete="name"
              />
              {formik.errors.name && formik.touched.name && (
                <p className="text-sm text-red-600 pl-4 pt-1">
                  {formik.errors.name}
                </p>
              )}
            </div>

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

            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="w-full sm:w-1/2">
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
                  placeholder="Create a password"
                  autoComplete="new-password"
                />
                {formik.errors.password && formik.touched.password && (
                  <p className="text-sm text-red-600 pl-4 pt-1">
                    {formik.errors.password}
                  </p>
                )}
              </div>

              <div className="w-full sm:w-1/2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 pb-2"
                >
                  Confirm Password
                </label>
                <input
                  name="rePassword"
                  value={formik.values.rePassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  type="password"
                  id="confirmPassword"
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />
                {formik.errors.rePassword && formik.touched.rePassword && (
                  <p className="text-sm text-red-600 pl-4 pt-1">
                    {formik.errors.rePassword}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 pb-2"
              >
                Phone
              </label>
              <input
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="tel"
                id="phone"
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter your phone"
                autoComplete="tel"
              />
              {formik.errors.phone && formik.touched.phone && (
                <p className="text-sm text-red-600 pl-4 pt-1">
                  {formik.errors.phone}
                </p>
              )}
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
                  "Register"
                )}
              </button>

              <NavLink
                to="/login"
                className={`flex-1 bg-white text-black border border-black py-3 px-6 rounded-full text-center hover:-translate-y-[0.1rem] transition-transform duration-300
                  ${isLoading && "opacity-70 pointer-events-none"}`}
              >
                Login
              </NavLink>
            </div>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            By registering, you agree to our{" "}
            <NavLink to="/terms" className="text-black underline">
              Terms of Service
            </NavLink>{" "}
            and{" "}
            <NavLink to="/privacy" className="text-black underline">
              Privacy Policy
            </NavLink>
          </p>
        </div>
      </div>
    </>
  );
}

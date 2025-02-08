import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { NavLink } from "react-router-dom";
import * as yup from "yup";
import { useAuth } from "../../hooks/useAuth";
import VerifyCode from "../VerifyCode/VerifyCode";

export default function ForgotPassword() {
  const [showVerifyCode, setShowVerifyCode] = useState(false);
  const { isLoading, error, authService } = useAuth();

  useEffect(() => {
      document.title = "NexMart"
    }, [])

  // Handle Forgot Password
  async function handleForgotPassword(values) {
    await authService.forgotPassword(values);
    !error && setShowVerifyCode(true);
  }

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .required("Email is required")
      .email("Please enter a valid email"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: handleForgotPassword,
  });

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center pt-32 md:pt-0">
      <div className="w-full lg:w-5/6 2xl:w-4/6">
        <h1 className="text-4xl font-bold pb-2 text-center">
          Reset Password
        </h1>

        {showVerifyCode ? (
          <VerifyCode />
        ) : (
          <>
            <p className="text-gray-600 pb-8 text-center">
              Enter your email address and we'll send you a reset code
            </p>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-full mb-6 text-center first-letter:uppercase lowercase">
                {error}
              </div>
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 pb-2">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
                    "Send Reset Code"
                  )}
                </button>

                <NavLink
                  to="/login"
                  className="flex-1 bg-white text-black border border-black py-3 px-6 rounded-full text-center hover:-translate-y-[0.1rem] transition-transform duration-300"
                >
                  Back to Login
                </NavLink>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
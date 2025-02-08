import React from "react";
import { useFormik } from "formik";
import { NavLink, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useAuth } from "../../hooks/useAuth"; 

export default function ResetPassword() {
  const navigate = useNavigate();
  const { isLoading, error, authService } = useAuth();

  async function handleResetPassword(values) {
    const data = await authService.resetPassword(values);
    !data && navigate("/login");
  }

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter a valid email")
      .required("Email is required"),
    newPassword: yup
      .string()
      .required("Please enter a new password")
      .min(6, "Password must be at least 6 characters"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      newPassword: "",
    },
    validationSchema,
    onSubmit: handleResetPassword,
  });

  return (
    <>
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
          />
          {formik.errors.email && formik.touched.email && (
            <p className="text-sm text-red-600 pl-4 pt-1">
              {formik.errors.email}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 pb-2">
            New Password
          </label>
          <input
            name="newPassword"
            type="password"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Enter new password"
          />
          {formik.errors.newPassword && formik.touched.newPassword && (
            <p className="text-sm text-red-600 pl-4 pt-1">
              {formik.errors.newPassword}
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
              "Reset Password"
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
  );
}
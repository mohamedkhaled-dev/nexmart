import React, { useState } from "react";
import { useFormik } from "formik";
import { NavLink } from "react-router-dom";
import * as yup from "yup";
import ResetPassword from "../ResetPassword/ResetPassword";
import { useAuth } from "../../hooks/useAuth";

export default function VerifyCode() {
  const [showResetForm, setShowResetForm] = useState(false);
  const { error, authService } = useAuth();

  // Function to verify reset code
  async function handleVerifyCode(values) {
    if (values.resetCode.length > 3 && values.resetCode.length < 7) {
      await authService.verifyResetCode(values);
      if (!error) {
        setShowResetForm(true);
      }
    }
  }

  // Reset code form validation schema
  const validationSchema = yup.object().shape({
    resetCode: yup
      .string()
      .required("Reset code is required")
      .min(4, "Code must be between 4 and 6 digits")
      .max(6, "Code must be between 4 and 6 digits"),
  });

  // Reset code form handling
  const formik = useFormik({
    initialValues: {
      resetCode: "",
    },
    validationSchema,
    validate: handleVerifyCode,
  });

  return (
    <>
      {showResetForm ? (
        <ResetPassword />
      ) : (
        <>
          <p className="text-gray-600 pb-8 text-center">
            Enter the reset code sent to your email
          </p>

          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-full mb-6 text-center first-letter:uppercase lowercase">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 pb-2">
                Reset Code
              </label>
              <input
                name="resetCode"
                type="text"
                maxLength="6"
                value={formik.values.resetCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-black text-center text-2xl tracking-[1em] font-mono"
                placeholder="······"
                autoComplete="one-time-code"
              />
              {formik.errors.resetCode && formik.touched.resetCode && (
                <p className="text-sm text-red-600 pl-4 pt-1">
                  {formik.errors.resetCode}
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <NavLink
                to="/login"
                className="flex-1 bg-white text-black border border-black py-3 px-6 rounded-full text-center hover:-translate-y-[0.1rem] transition-transform duration-300"
              >
                Back to Login
              </NavLink>
            </div>
          </div>
        </>
      )}
    </>
  );
}

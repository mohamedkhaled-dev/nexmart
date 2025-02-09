import React, { useContext } from "react";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

export default function Footer() {
  const { userToken } = useContext(UserContext);
  return (
    <>
      <footer className="bg-white border-t">
        {/* Main Footer Content */}
        <div className="bg-primary">
          <div className="px-4 lg:px-14 py-12">
            <div className="flex flex-wrap justify-between">
              {/* Logo and About */}
              <div className="w-full lg:w-1/2 p-8">
                <Link to="/">
                  <img src={logo} alt="NexMart Logo" className="h-8 mb-6" />
                </Link>
                <p className="text-gray-600 mb-6">
                  Your one-stop destination for all your shopping needs. Quality
                  products, competitive prices, and excellent customer service.
                </p>
                <div className="flex gap-4">
                  {/* Updated Social Media Links */}
                  <a
                    href="https://github.com"
                    target="_blank"
                    className="bg-white p-2 rounded-full group "
                    aria-label="GitHub"
                  >
                    <svg
                      className="size-6 group-hover:scale-110 transition-transform"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.linkedin.com"
                    target="_blank"
                    className="bg-white p-2 rounded-full group"
                    aria-label="LinkedIn"
                  >
                    <svg
                      className="size-6 group-hover:scale-110 transition-transform"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.upwork.com"
                    target="_blank"
                    className="bg-white p-2 rounded-full group"
                    aria-label="Upwork"
                  >
                    <svg
                      className="size-6 group-hover:scale-110 transition-transform"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.546-1.405 0-2.543-1.14-2.543-2.546V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z" />
                    </svg>
                  </a>
                </div>
              </div>
              <div className="w-full lg:w-1/2 flex flex-col gap-8 sm:flex-row p-8">
                {/* Quick Links */}
                <div className="w-full sm:w-1/3">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Quick Links
                  </h4>
                  <ul className="space-y-3">
                    <li>
                      <Link
                        to="/products"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Products
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/categories"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Categories
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/brands"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Brands
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Customer Service */}
                <div className="w-full sm:w-1/3">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Customer Service
                  </h4>
                  <ul className="space-y-3">
                    <li>
                      <Link
                        to="/contact"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Help & Contact
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/shipping"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Shipping Info
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/returns"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Returns
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/faq"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        FAQ
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Account */}
                <div className="w-full sm:w-1/3">
                  <h4 className="font-semibold text-gray-900 mb-4">Account</h4>
                  <ul className="space-y-3">
                    <li>
                      {!userToken && (
                        <Link
                          to="/login"
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Login
                        </Link>
                      )}
                    </li>
                    <li>
                      {!userToken && (
                        <Link
                          to="/register"
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Register
                        </Link>
                      )}
                    </li>
                    <li>
                      <Link
                        to="/orders"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Orders
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/wishlist"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Wishlist
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-white">
          <div className="px-4 lg:px-14 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-600 text-sm">
                © {new Date().getFullYear()} NexMart. All rights reserved.
              </p>
              <div className="flex gap-6">
                <Link
                  to="/privacy"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

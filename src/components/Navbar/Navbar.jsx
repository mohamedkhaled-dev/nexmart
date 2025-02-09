import React, { useContext, useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import user from "../../assets/user.svg";
import basket from "../../assets/basket.svg";
import search from "../../assets/search.svg";
import menu from "../../assets/menu.svg";
import wishlist from "../../assets/wishlist.svg";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { CartContext } from "../../context/CartContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useWishList } from "../../hooks/useWishList";
import { jwtDecode } from "jwt-decode";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBannerOpen, setIsBannerOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const { userToken, setUserToken } = useContext(UserContext);
  const { cartCount, setCartCount } = useContext(CartContext);
  const navigate = useNavigate();
  const { hasWishlistItems, setHasWishlistItems } = useWishList();
  const queryClient = useQueryClient();

  // Get user name from token
  const userName = userToken ? jwtDecode(userToken).name : null;

  useEffect(() => {
    function handleClickOutside(event) {
      if (isSearchExpanded && !event.target.closest(".search-container")) {
        setIsSearchExpanded(false);
        setSearchQuery("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      setIsUserMenuOpen(false);
    };
  }, [isSearchExpanded, userToken]);

  // Navigation Links Data
  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/products", label: "Products" },
    { path: "/categories", label: "Categories" },
    { path: "/brands", label: "Brands" },
  ];

  // Top Right Links Data
  const topRightLinks = [
    { path: "/orders", label: "Order Status" },
    { path: "/contact", label: "Help" },
  ];

  // Action Icons Data
  const actionIcons = [
    {
      path: "/wishlist",
      icon: wishlist,
      alt: "wishlist icon",
      size: "size-7",
      showBadge: hasWishlistItems,
    },
    { path: "/cart", icon: basket, alt: "cart icon", size: "size-6" },
  ];

  // Banner Messages Data
  const bannerMessages = [
    "Take a look at what's new this week.",
    "Enjoy an exclusive 10% coupon for your first purchase.",
    "Get 50% discount on selected items.",
  ];

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    select: (data) => data?.data?.data || [],
  });

  function getProducts() {
    return axios.get(`https://ecommerce.routemisr.com/api/v1/products`);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setUserToken(null);
    setCartCount(0);
    setHasWishlistItems(false);
    queryClient.clear();
    navigate("/login");
  }

  const filteredProducts = products?.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="border-b bg-white fixed top-0 right-0 left-0 z-20">
        {/* Discount Banner */}
        {isBannerOpen && (
          <div className="bg-black text-white overflow-hidden whitespace-nowrap relative">
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md z-10 opacity-75 hover:scale-110 hover:opacity-100 transition-opacity"
              onClick={() => setIsBannerOpen(false)}
              aria-label="Close banner"
            >
              <i className="fas fa-close size-5"></i>
            </button>
            <div className="flex justify-between animate-slide">
              {bannerMessages.map((message, index) => (
                <p key={index} className="text-sm py-2 mr-8">
                  {message}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Top Navigation */}
        <nav className="flex items-center justify-between px-4 lg:px-14 pb-4 pt-6">
          <Link to={"/"} className="-m-1.5 p-1.5">
            <img src={logo} alt="NexMart Logo" width={150} />
          </Link>

          <div className="flex flex-1 justify-end gap-x-4 pe-2">
            {topRightLinks.map((link, index) => (
              <NavLink
                key={index}
                to={link.path}
                className="text-sm/6 font-semibold text-gray-600 hover:text-gray-950 transition-colors"
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Main Navigation */}
        <nav className="flex items-center justify-between px-4 lg:px-14 pb-4">
          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex lg:gap-x-10 bg-primary p-1 rounded-full me-4">
            {navLinks.map((link, index) => (
              <NavLink
                key={index}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm/6 font-semibold text-gray-900 py-2 px-4 rounded-full hover:bg-white transition-all duration-300 ${
                    isActive ? "bg-white" : ""
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden flex justify-center items-center size-12 bg-primary rounded-full font-bold me-4"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
          >
            <img className="size-7" src={menu} alt="mobile menu" />
          </button>

          {/* Search and Action Icons Container */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div
              className={`relative search-container transition-all  ${
                isSearchExpanded ? "flex-1" : "w-auto"
              }`}
            >
              {isSearchExpanded ? (
                <div className="flex items-center w-full">
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="p-3 pe-16 rounded-full bg-primary w-full focus:outline-none focus:ring-2 focus:ring-black transition-all placeholder:text-sm"
                    type="text"
                    placeholder="Search product"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setIsSearchExpanded(false);
                      setSearchQuery("");
                    }}
                    className="absolute top-1/2 -translate-y-1/2 right-3 p-1"
                    aria-label="Close search"
                  >
                    <svg
                      className="size-5 text-gray-500 hover:text-black transition-colors"
                      fill="none"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchExpanded(true)}
                  className="flex justify-center items-center size-12 bg-primary rounded-full group"
                  aria-label="Open search"
                >
                  <img
                    className="size-6 group-hover:scale-110 transition-transform"
                    src={search}
                    alt="search icon"
                  />
                </button>
              )}

              {/* Search Results Dropdown */}
              {searchQuery && isSearchExpanded && (
                <div className="absolute top-14 inset-x-0 bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-2xl max-h-[80vh] overflow-hidden z-50">
                  <div className="sticky top-0 bg-white/90 backdrop-blur-sm p-4 border-b">
                    <h3 className="font-medium text-gray-900">
                      Search Results for "{searchQuery}"
                    </h3>
                  </div>

                  <div className="overflow-y-auto max-h-[60vh] scrollbar-hide">
                    {filteredProducts?.length > 0 ? (
                      <div className="p-2">
                        {filteredProducts?.map((product) => (
                          <Link
                            key={product.id}
                            onClick={() => setSearchQuery("")}
                            to={`/products/${product.category.name}/${product.id}`}
                            className="flex items-center gap-4 p-3 transition-all group "
                          >
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                              <img
                                src={product.imageCover}
                                alt={product.title}
                                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">
                                {product.title}
                              </p>
                              <p className="text-sm text-gray-500">
                                {product.category.name}
                              </p>
                              <p className="text-sm font-semibold text-gray-900">
                                {product.price} EGP
                              </p>
                            </div>
                            <div className="flex-shrink-0 self-center">
                              <svg
                                className="size-5 text-gray-400 group-hover:text-gray-900 transition-colors"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <svg
                          className="size-16 mx-auto text-gray-400 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                        <p className="text-gray-900 font-medium">
                          No products found
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Try searching with different keywords
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Action Icons */}
            {!isSearchExpanded && (
              <>
                {actionIcons.map((icon, index) => (
                  <NavLink
                    key={index}
                    to={icon.path}
                    className="flex justify-center items-center size-12 bg-primary rounded-full group relative"
                  >
                    {cartCount > 0 && icon.path === "/cart" && !!userToken && (
                      <span className="absolute -top-2 -end-2 bg-black text-white rounded-full size-6 flex justify-center items-center text-sm">
                        {cartCount}
                      </span>
                    )}
                    {icon.showBadge && icon.path === "/wishlist" && (
                      <span className="absolute -top-0 -end-0 bg-black rounded-full size-2"></span>
                    )}
                    <img
                      className={`${icon.size} group-hover:scale-110 transition-transform`}
                      src={icon.icon}
                      alt={icon.alt}
                    />
                  </NavLink>
                ))}

                {/* User Menu */}
                <div className="relative">
                  {userToken ? (
                    <>
                      <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex justify-center items-center size-12 bg-primary rounded-full group relative"
                      >
                        <img
                          className="size-6 group-hover:scale-110 transition-transform"
                          src={user}
                          alt="user menu"
                        />
                      </button>

                      {/* Dropdown Menu */}
                      {isUserMenuOpen && (
                        <>
                          {/* Backdrop */}
                          <div
                            className="fixed inset-0 z-20"
                            onClick={() => setIsUserMenuOpen(false)}
                          />

                          {/* Menu */}
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 z-30 border">
                            <div className="px-4 py-3 border-b">
                              <p className="text-sm text-gray-700 truncate">
                                {userName}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                Welcome back!
                              </p>
                            </div>

                            <Link
                              to="/orders"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <svg
                                className="size-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                              </svg>
                              My Orders
                            </Link>

                            <Link
                              to="/wishlist"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <svg
                                className="size-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                              </svg>
                              Wishlist
                            </Link>

                            <div className="border-t mt-1">
                              <button
                                onClick={() => {
                                  handleLogout();
                                  setIsUserMenuOpen(false);
                                }}
                                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                              >
                                <svg
                                  className="size-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                  />
                                </svg>
                                Logout
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <NavLink
                      to="/login"
                      className="flex justify-center items-center size-12 bg-primary rounded-full group"
                    >
                      <img
                        className="size-6 group-hover:scale-110 transition-transform"
                        src={user}
                        alt="login"
                      />
                    </NavLink>
                  )}
                </div>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 z-30 bg-black bg-opacity-50"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="fixed inset-y-0 left-0 z-40 w-full max-w-sm bg-white p-6">
              <div className="flex items-center justify-between">
                <Link to={"/"} className="p-2">
                  <img src={logo} alt="NexMart Logo" width={150} />
                </Link>
                <button
                  type="button"
                  className="absolute top-6 right-6 p-2 rounded-md hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <svg
                    className="size-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mt-12 space-y-4">
                {navLinks.map((link, index) => (
                  <NavLink
                    key={index}
                    to={link.path}
                    className={({ isActive }) =>
                      `block text-base/7 font-semibold text-gray-900 py-2 px-4 rounded-full hover:bg-primary transition-all${
                        isActive ? "bg-primary " : ""
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>

              <div className="mt-8">
                {userToken ? (
                  <span
                    onClick={() => handleLogout()}
                    className="block text-base/7 font-semibold text-gray-900 py-2 px-4 rounded-full hover:bg-primary cursor-pointer transition-all"
                  >
                    Logout
                  </span>
                ) : (
                  <NavLink
                    to={"/login"}
                    className={({ isActive }) =>
                      `block text-base/7 font-semibold text-gray-900 py-2 px-4 rounded-full hover:bg-primary transition-all${
                        isActive ? "bg-primary" : ""
                      }`
                    }
                  >
                    Login
                  </NavLink>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

import { createHashRouter, RouterProvider } from "react-router-dom";
import Cart from "./components/Cart/Cart";
import Home from "./components/Home/Home";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Brands from "./components/Brands/Brands";
import Categories from "./components/Categories/Categories";
import Products from "./components/Products/Products";
import Layout from "./components/Layout/Layout";
import NotFound from "./components/NotFound/NotFound";
import Orders from "./components/Orders/Orders";
import Wishlist from "./components/Wishlist/Wishlist";
import UserContextProvider from "./context/UserContext";
import Contact from "./components/Contact/Contact";
import Shipping from "./components/Shipping/Shipping";
import Returns from "./components/Returns/Returns";
import Faq from "./components/Faq/Faq";
import Privacy from "./components/Privacy/Privacy";
import Terms from "./components/Terms/Terms";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProductDetails from "./components/ProductDetails/ProductDetails";
import { Toaster } from "react-hot-toast";
import { toastStyles } from "./utils/toastConfig";
import { Provider } from "react-redux";
import store from "./redux/store";
import CartContextProvider from "./context/CartContext";
import CheckoutContextProvider from "./context/CheckoutContext";


const query = new QueryClient();
function App() {
  const routes = createHashRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/orders", element: <Orders /> },
        { path: "/cart", element: <Cart /> },
        { path: "/wishlist", element: <Wishlist /> },
        { index: true, element: <Home /> },
        { path: "/register", element: <Register /> },
        { path: "/login", element: <Login /> },
        { path: "/forgot-password", element: <ForgotPassword /> },
        { path: "/products", element: <Products /> },
        { path: "/products/:category/:id", element: <ProductDetails /> },
        { path: "/categories", element: <Categories /> },
        { path: "/brands", element: <Brands /> },
        { path: "/contact", element: <Contact /> },
        { path: "/shipping", element: <Shipping /> },
        { path: "/returns", element: <Returns /> },
        { path: "/faq", element: <Faq /> },
        { path: "/privacy", element: <Privacy /> },
        { path: "/terms", element: <Terms /> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ]);

  return (
    <>
      <QueryClientProvider client={query}>
        <UserContextProvider>
          <CartContextProvider>
            <CheckoutContextProvider>
              <Provider store={store}>
                <RouterProvider router={routes} />
              </Provider>
            </CheckoutContextProvider>
            <Toaster
              position="top-right"
              toastOptions={toastStyles}
              containerStyle={{
                top: 50,
              }}
              gutter={8}
            />
          </CartContextProvider>
        </UserContextProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;

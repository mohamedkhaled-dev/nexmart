import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function Layout() {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      <main className="container my-5 py-14 overflow-x-hidden">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

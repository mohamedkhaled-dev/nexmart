import React, { useEffect } from "react";
import FeaturedProducts from "../FeaturedProducts/FeaturedProducts";
import HeroSection from "../HeroSection/HeroSection";
import MainSlider from "../MainSlider/MainSlider";

export default function Home() {
  useEffect(() => {
    document.title = "NexMart | Home";
  }, []);

  return (
    <div className="min-h-screen pt-40 bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Slider Section */}
      <MainSlider />

      {/* Featured Products */}
      <FeaturedProducts />
    </div>
  );
}

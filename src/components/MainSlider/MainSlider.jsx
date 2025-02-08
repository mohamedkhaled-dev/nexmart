import React from "react";
import Slider from "react-slick";
import img_1 from "../../assets/slider-image-1.jpeg";
import img_2 from "../../assets/slider-image-2.jpeg";
import img_3 from "../../assets/slider-image-3.jpeg";

export default function MainSlider() {
  // Slider settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  // Slider data
  const sliderItems = [
    { id: 1, image: img_1, title: "New Arrivals" },
    { id: 2, image: img_2, title: "Best Sellers" },
    { id: 3, image: img_3, title: "Special Offers" },
  ];
  return (
    <>
      <section className="pb-16">
        <Slider {...settings} className="featured-slider -mx-2">
          {sliderItems.map((item) => (
            <div key={item.id} className="px-2">
                <figure className="relative aspect-[16/9] overflow-hidden rounded-2xl">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover grayscale"
                  />
                </figure>
            </div>
          ))}
        </Slider>

        {/* Stats */}
        <div className="mt-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
            <div className="mb-8 md:mb-0">
              <h2 className="text-4xl font-bold mb-4">We are your choice</h2>
              <p className="text-gray-600 w-full max-w-[500px]">
                Your one-stop destination for all things exceptional. We've
                handpicked the best products across categories to ensure you
                find exactly what you're looking for, backed by quality and
                trusted service.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-8 md:gap-12 justify-end">
            <div className="text-start">
              <h3 className="text-4xl font-bold mb-2">120+</h3>
              <p className="text-gray-600">Happy Customer</p>
            </div>
            <div className="text-start">
              <h3 className="text-4xl font-bold mb-2">
                4.9 <span className="text-sm">/</span> 5
              </h3>
              <p className="text-gray-600">Customer Rating</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

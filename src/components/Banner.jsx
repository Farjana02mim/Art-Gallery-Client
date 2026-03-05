import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Typewriter } from "react-simple-typewriter";
import { motion } from "framer-motion";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import slide1 from "../assets/slide1.jpg";
import slide2 from "../assets/slide2.avif";
import slide3 from "../assets/slide3.jpg";
import slide4 from "../assets/slide4.jpg";

const Banner = () => {
  const slides = [
    {
      id: 1,
      image: slide1,
      title: "Discover Stunning Artworks",
      subtitle: "Explore masterpieces from talented artists around the world.",
    },
    {
      id: 2,
      image: slide2,
      title: "Bring Art Home",
      subtitle: "Find the perfect piece to enhance your living space.",
    },
    {
      id: 3,
      image: slide3,
      title: "Support Creative Minds",
      subtitle: "Connect directly with artists and their unique creations.",
    },
    {
      id: 4,
      image: slide4,
      title: "Art for Every Taste",
      subtitle: "From classic to contemporary, discover artworks that inspire.",
    },
  ];

  return (
    <div className="w-full h-[500px] md:h-[600px] relative">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full overflow-hidden">
              
              <motion.img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover brightness-75"
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
              />

              <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 text-white">
                <motion.h2
                  className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Typewriter
                    words={[slide.title]}
                    loop={1}
                    cursor
                    cursorStyle="|"
                    typeSpeed={70}
                    deleteSpeed={50}
                    delaySpeed={2000}
                  />
                </motion.h2>

                <motion.p
                  className="text-lg md:text-2xl drop-shadow-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  {slide.subtitle}
                </motion.p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;
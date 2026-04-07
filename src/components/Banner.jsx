import React from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { Typewriter } from "react-simple-typewriter";
import { motion } from "framer-motion";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

import slide1 from "../assets/Banner/slide1.jpg";
import slide2 from "../assets/Banner/slide01.jpg";
import slide3 from "../assets/Banner/slide2.jfif";
import slide4 from "../assets/Banner/slide3.jpg";
import slide5 from "../assets/Banner/slide4.jfif";
import slide6 from "../assets/Banner/slide04.jpg";
import slide7 from "../assets/Banner/slide5.jfif";
import slide8 from "../assets/Banner/slide6.jpg";
import slide9 from "../assets/Banner/slide07.jfif";
import slide10 from "../assets/Banner/slide7.jpg";
import slide11 from "../assets/Banner/slide8.jfif";
import slide12 from "../assets/Banner/slide9.jfif";
import slide13 from "../assets/Banner/slide09.jfif";
import slide14 from "../assets/Banner/slide10.jpg";
import slide15 from "../assets/Banner/slide11.jpg";
import slide16 from "../assets/Banner/slide12.jfif";

const slides = [
  { id: 1, image: slide1, title: "Discover Stunning Artworks", subtitle: "Explore masterpieces from talented artists around the world.", path: "/gallery" },
  { id: 2, image: slide2, title: "Bring Art Home", subtitle: "Find the perfect piece to enhance your living space.", path: "/shop" },
  { id: 3, image: slide3, title: "Support Creative Minds", subtitle: "Connect directly with artists and their unique creations.", path: "/artists" },
  { id: 4, image: slide4, title: "Art for Every Taste", subtitle: "From classic to contemporary, discover artworks that inspire.", path: "/gallery" },
  { id: 5, image: slide5, title: "Unique Collections", subtitle: "Browse curated collections from emerging artists.", path: "/collections" },
  { id: 6, image: slide6, title: "Modern Aesthetics", subtitle: "Add a modern touch to your interior.", path: "/gallery" },
  { id: 7, image: slide7, title: "Classic Beauty", subtitle: "Timeless art that never fades.", path: "/gallery" },
  { id: 8, image: slide8, title: "Creative Expression", subtitle: "Every piece tells a unique story.", path: "/artists" },
  { id: 9, image: slide9, title: "Bold & Vibrant", subtitle: "Colorful artworks to energize your space.", path: "/shop" },
  { id: 10, image: slide10, title: "Minimal & Elegant", subtitle: "Less is more with minimalist art.", path: "/gallery" },
  { id: 11, image: slide11, title: "Digital Masterpieces", subtitle: "Explore the future of digital art.", path: "/gallery" },
  { id: 12, image: slide12, title: "Handcrafted Art", subtitle: "Authentic handmade creations.", path: "/shop" },
  { id: 13, image: slide13, title: "Wall Perfection", subtitle: "Turn your walls into a gallery.", path: "/gallery" },
  { id: 14, image: slide14, title: "Art That Inspires", subtitle: "Feel inspired every day.", path: "/gallery" },
  { id: 15, image: slide15, title: "Exclusive Pieces", subtitle: "Own limited edition artworks.", path: "/shop" },
  { id: 16, image: slide16, title: "Gallery Experience", subtitle: "Experience art like never before.", path: "/gallery" },
];

const Banner = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-[500px] md:h-[600px] relative">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        slidesPerView={1}
        loop
        effect="fade"
        autoplay={{ delay: 3500, disableOnInteraction: false }}
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
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 3 }}
              />

              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20"></div>

              <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-20 text-white max-w-3xl">

                <motion.h2
                  className="text-3xl md:text-5xl font-bold mb-4"
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Typewriter
                    words={[slide.title]}
                    loop={false}
                    cursor
                    cursorStyle="|"
                    typeSpeed={70}
                  />
                </motion.h2>

                <motion.p
                  className="text-lg md:text-xl mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  {slide.subtitle}
                </motion.p>

                <motion.button
                  onClick={() => navigate(slide.path)}
                  className="bg-white text-black px-6 py-3 rounded-2xl font-semibold w-fit hover:bg-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  Explore Now →
                </motion.button>

              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;

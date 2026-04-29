// HomePage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Banner from "../components/Banner";
import Card from "../components/Card";
import HomeExtras from "../components/HomeExtras";
import ExtraSection from "./ExtraSection";
import Reviews from "./Reviews/Reviews";
import TrendingArts from "../components/TrendingArts";

const SERVER = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

const reviewsPromise = fetch('/reviews.json').then(res => res.json());

const categories = [
  { name: "All", emoji: "🎨", value: "All" },
  { name: "Folk", emoji: "🖌️", value: "Folk" },
  { name: "Liberation War", emoji: "⚔️", value: "Liberation War" },
  { name: "River", emoji: "🌊", value: "River" },
  { name: "Flowers", emoji: "🌸", value: "Flowers" },
  { name: "Sculptures", emoji: "🗿", value: "Sculptures" },
  { name: "Photography", emoji: "📸", value: "Photography" },
  { name: "Russian Art", emoji: "🎭", value: "Russian Art" },
  { name: "African Art", emoji: "🪘", value: "African Art" },
  { name: "Illustration", emoji: "✏️", value: "Illustration" },
];

const HomePage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const navigate = useNavigate();

  // Fetch latest artworks
useEffect(() => {
  setLoading(true);
  fetch(`${SERVER}/latest-list`)
    .then((res) => res.json())
    .then((data) => {
      setListings(Array.isArray(data) ? data : []);
    })
    .catch((err) => console.error("Failed to load latest listings:", err))
    .finally(() => setLoading(false));
}, []);

  const handleCategoryClick = (category) => {
    setCategoryFilter(category.value);
    setSearchTerm("");
    navigate(`/category-filtered-product/${category.value}`);
  };

  const filteredListings = listings.filter((listing) => {
    const title = listing.title || listing.name || "";
    return title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const displayedCategories = showAllCategories ? categories : categories.slice(0, 4);

  return (
    <div className="space-y-20 min-h-screen">
      {/* Banner */}
      <section><Banner /></section>

      {/* Categories */}
      <section className="w-11/12 mx-auto my-12">
        <h2 className="text-3xl font-bold text-yellow-400 text-center mb-8">
          Browse by Category
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          {displayedCategories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => handleCategoryClick(cat)}
              className={`cursor-pointer rounded-xl shadow-md p-6 flex flex-col items-center justify-center transition-transform hover:scale-105 backdrop-blur-sm
                ${categoryFilter === cat.value
                  ? "bg-yellow-400 text-gray-900 shadow-xl"
                  : "bg-gray-800/80 text-yellow-200 hover:shadow-xl"}`}
            >
              <span className="text-5xl mb-4">{cat.emoji}</span>
              <h3 className="text-xl font-semibold text-center">{cat.name}</h3>
            </div>
          ))}
        </div>

        {!showAllCategories && categories.length > 4 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowAllCategories(true)}
              className="px-6 py-2 rounded-lg bg-yellow-400 text-gray-900 font-semibold hover:bg-yellow-500 transition"
            >
              See more
            </button>
          </div>
        )}
      </section>

      {/* Latest Artworks */}
      <section className="w-11/12 mx-auto">
        <h2 className="text-3xl font-bold text-yellow-400 text-center mb-8">
          Latest Artworks
        </h2>

        {/* Search */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 p-2 text-black rounded-lg w-full max-w-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* Listings */}
        <div className="grid md:grid-cols-3 gap-8">
          {loading ? (
            <div className="flex items-center justify-center col-span-3 min-h-[200px]">
              <div className="w-16 h-16 border-4 border-yellow-400 border-dashed rounded-full animate-spin"></div>
            </div>
          ) : filteredListings.length === 0 ? (
            <p className="text-center col-span-3 text-gray-400">
              No artworks found.
            </p>
          ) : (
            filteredListings.map((listing) => (
              <Card
                key={listing._id?.toString() || listing.id || Math.random()}
                listing={listing}
              />
            ))
          )}
        </div>
      </section>

      {/* Reviews */}
      <section className="w-11/12 mx-auto">
        <Reviews reviewsPromise={reviewsPromise} />
      </section>

      {/* Extras */}
      <section className="w-11/12 mx-auto">
        <HomeExtras />
      </section>

      <section className="w-11/12 mx-auto">
        <ExtraSection />
      </section>

      {/* Trending Arts */}
      <section className="w-11/12 mx-auto">
        <TrendingArts />
      </section>
    </div>
  );
};

export default HomePage;
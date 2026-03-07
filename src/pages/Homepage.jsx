import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Banner from "../components/Banner";
import Card from "../components/Card";
import HomeExtras from "../components/HomeExtras";
import ExtraSection from "./ExtraSection";
import Reviews from "./Reviews/Reviews";

const reviewsPromise = fetch('/reviews.json').then(res=>res.json());

const categories = [
  { name: "Paintings", emoji: "🎨", value: "Painting" },
  { name: "Sculptures", emoji: "🗿", value: "Sculpture" },
  { name: "Photography", emoji: "📸", value: "Photography" },
  { name: "Digital Art", emoji: "💻", value: "Digital Art" },
  { name: "Illustration", emoji: "✏️", value: "Illustration" },
];

const HomePage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Fetch latest 6 artworks
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3000/latest-list")
      .then((res) => res.json())
      .then((data) => {
        setListings(Array.isArray(data) ? data : []);
      })
      .catch((err) =>
        console.error("Failed to load latest listings:", err)
      )
      .finally(() => setLoading(false));
  }, []);

  // Handle category click
  const handleCategoryClick = (category) => {
    setCategoryFilter(category.value);
    navigate(`/category-filtered-product/${category.value}`);
  };

  // Filtered listings based on category + search
  const filteredListings = listings.filter((listing) => {
    const listingCategory = listing.category || "Unknown"; // fallback if category missing
    const listingTitle = listing.title || listing.name || ""; // fallback if title missing

    const matchesCategory =
      categoryFilter === "All" || listingCategory === categoryFilter;
    const matchesSearch = listingTitle
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-20 min-h-screen">
      {/* Banner */}
      <section>
        <Banner />
      </section>

      {/* Categories */}
      <section className="w-11/12 mx-auto my-12">
        <h2 className="text-3xl font-bold text-yellow-400 text-center mb-8">
          Browse by Category
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => handleCategoryClick(cat)}
              className="cursor-pointer bg-gray-800/80 rounded-xl shadow-md hover:shadow-xl p-6 flex flex-col items-center justify-center transition-transform hover:scale-105 backdrop-blur-sm"
            >
              <span className="text-5xl mb-4">{cat.emoji}</span>
              <h3 className="text-xl font-semibold text-yellow-200 text-center">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
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

      {/* Reviws */}
          <div>
            <Reviews reviewsPromise = {reviewsPromise} ></Reviews>
          </div>

      {/* Extras */}
      <section className="w-11/12 mx-auto">
        <HomeExtras />
      </section>

      <section className="w-11/12 mx-auto">
        <ExtraSection />
      </section>
    </div>
  );
};

export default HomePage;
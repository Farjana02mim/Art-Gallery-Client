import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Card from "../components/Card";

const SERVER = "https://art-gallery-server-ashen.vercel.app";

const ArtworksGallery = () => {
  const [artworks, setArtworks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const categories = [
    "All",
    "Folk",
    "Sculptures",
    "Liberation War",
    "Photography",
    "Illustration",
    "River",
    "Flowers",
    "Russian Art",
    "African Art",
  ];

  useEffect(() => {
    setLoading(true);
    fetch(`${SERVER}/listing`)
      .then((res) => res.json())
      .then((data) => {
        setArtworks(data);
        setFiltered(data);
      })
      .catch(() => toast.error("Failed to load artworks"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let temp = [...artworks];

      if (categoryFilter !== "All") {
        temp = temp.filter(
          (a) =>
            (a.category || "").toLowerCase() === categoryFilter.toLowerCase(),
        );
      }

      if (searchTerm) {
        temp = temp.filter((a) => {
          const t = (a.title || a.name || "").toLowerCase();
          return t.includes(searchTerm.toLowerCase());
        });
      }

      setFiltered(temp);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchTerm, categoryFilter, artworks]);

  return (
    <div
      className="min-h-screen py-10 px-3 sm:px-6 md:px-10 
      bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 
      dark:from-gray-800 dark:via-gray-900 dark:to-gray-950"
    >
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Title */}
      <h2
        className="text-2xl sm:text-3xl md:text-4xl font-bold 
        text-gray-800 dark:text-white mb-6 text-center"
      >
        🎨 Artworks Gallery
      </h2>

      {/* 🔍 Search Box */}
      <div className="flex justify-center mb-6">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search artworks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full 
              border border-gray-300 
              bg-white text-gray-800 
              dark:bg-gray-800 dark:text-white dark:border-gray-700
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      {/* 📱 Category Filter (scrollable on mobile) */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2 md:justify-center scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
              ${
                categoryFilter === cat
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white dark:bg-gray-800 p-4 rounded-xl shadow"
            >
              <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          /* ❌ Empty State */
          <div className="col-span-full text-center text-gray-500 dark:text-gray-400 text-lg">
            No artworks found 😔
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item._id}
              className="transform hover:scale-[1.03] transition duration-300"
            >
              <Card listing={item} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ArtworksGallery;

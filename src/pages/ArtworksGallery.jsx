import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Card from "../components/Card";

const ArtworksGallery = () => {
  const [artworks, setArtworks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const categories = [
    "All", "Folk", "Sculptures", "Liberation War",
    "Photography", "Illustration", "River",
    "Flowers", "Russian Art", "African Art"
  ];

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3000/listing")
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
            (a.category || "").toLowerCase() ===
            categoryFilter.toLowerCase()
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
    <div className="min-h-screen py-12 px-4 md:px-10 
      bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 
      dark:from-gray-800 dark:via-gray-850 dark:to-gray-900">

      <ToastContainer position="top-right" autoClose={3000} />

      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-bold 
        text-gray-800 dark:text-white mb-8 text-center">
        🎨 Artworks Gallery
      </h2>

      {/* Search */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search artworks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 rounded-xl 
            border border-gray-300 
            bg-white text-gray-800 
            dark:bg-gray-800 dark:text-white dark:border-gray-700
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Category Filter */}
      <div className="flex justify-center gap-3 mb-10 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
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

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {/* Loader */}
        {loading ? (
          <div className="col-span-full flex justify-center items-center min-h-[200px]">
            <div className="w-14 h-14 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
          </div>
        ) : filtered.length === 0 ? (

          /* Empty State */
          <div className="col-span-full text-center text-gray-500 dark:text-gray-400 text-lg">
            No artworks found 😔
          </div>

        ) : (
          filtered.map((item) => (
            <Card key={item._id} listing={item} />
          ))
        )}
      </div>
    </div>
  );
};

export default ArtworksGallery;
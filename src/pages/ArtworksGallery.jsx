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

  const categories = ["All", "Painting", "Sculpture", "Digital Art", "Photography", "Illustration"];

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

      // Filter by category (case-insensitive)
      if (categoryFilter !== "All") {
        temp = temp.filter(a => (a.category || "").toLowerCase() === categoryFilter.toLowerCase());
      }

      // Filter by search term (title or name)
      if (searchTerm) {
        temp = temp.filter(a => {
          const t = (a.title || a.name || "").toLowerCase();
          return t.includes(searchTerm.toLowerCase());
        });
      }

      setFiltered(temp);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchTerm, categoryFilter, artworks]);

  return (
    <div className="min-h-screen py-10 px-4 md:px-10 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      <ToastContainer position="top-right" autoClose={3000} />

      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Artworks Gallery</h2>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search by title or name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 text-black rounded-lg w-full max-w-md focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>

      <div className="flex justify-center text-black gap-4 mb-6 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-2 rounded-lg font-semibold ${categoryFilter === cat ? "bg-gray-800 text-white" : "bg-white border border-gray-300 hover:bg-gray-100"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center items-center min-h-[200px]">
            <div className="w-16 h-16 border-4 border-gray-800 border-dashed rounded-full animate-spin"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">No artworks found.</div>
        ) : (
          filtered.map(item => <Card key={item._id} listing={item} />)
        )}
      </div>
    </div>
  );
};

export default ArtworksGallery;
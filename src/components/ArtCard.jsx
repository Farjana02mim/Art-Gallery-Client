import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth"; // your Firebase auth hook
const SERVER = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

const ArtCard = ({ art }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);

  // Check if this art is already in user's favorites
  useEffect(() => {
    if (user && art.favoritesByUser?.includes(user.email)) {
      setLiked(true);
    }
  }, [user, art]);

  const handleViewDetails = () => {
    navigate(`/listing-details/${art._id}`);
  };

  const toggleFavorite = async () => {
    if (!user) return alert("Please login first");

    try {
      const token = await user.getIdToken();
      const res = await fetch(`${SERVER}/users/favorite/${art._id}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();
      if (data.success) {
        setLiked(data.favorites.includes(art._id));
      }
    } catch (err) {
      console.error("Failed to toggle favorite", err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700 rounded-xl overflow-hidden transition-colors duration-300">
      <img
        src={art.image || "/placeholder.png"}
        alt={art.title}
        className="h-52 w-full object-cover cursor-pointer transition-transform duration-200 hover:scale-105"
        onClick={handleViewDetails}
      />

      <div className="p-4">
        <h3
          className="text-lg font-semibold cursor-pointer text-gray-900 dark:text-yellow-50 transition-colors duration-300"
          onClick={handleViewDetails}
        >
          {art.title}
        </h3>

        <p className="text-gray-500 dark:text-gray-300 text-sm mt-1">{art.category}</p>

        <p className="text-green-600 dark:text-green-400 font-bold mt-2">
          ${art.price}
        </p>

        <div className="flex justify-between text-sm mt-2 text-gray-500 dark:text-gray-300">
          <span>👁 {art.views || 0}</span>
          <span
            className={`cursor-pointer ${liked ? "text-red-500" : ""}`}
            onClick={toggleFavorite}
          >
            {liked ? "💖" : "🤍"} {art.likes || 0}
          </span>
          <span>⭐ {art.rating || 0}</span>
        </div>

        <button
          onClick={handleViewDetails}
          className="w-full py-2 mt-3 bg-gradient-to-r from-gray-400 to-blue-100 dark:from-gray-700 dark:to-blue-700 text-black dark:text-yellow-50 font-semibold rounded-lg hover:opacity-90 transition"
        >
          See Details
        </button>
      </div>
    </div>
  );
};

export default ArtCard;
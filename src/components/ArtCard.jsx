import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";

const SERVER = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

const ArtCard = ({ art }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [liked, setLiked] = useState(false);

  // 🔹 Favorite check
  useEffect(() => {
    if (user && art.favoritesByUser?.includes(user.email)) {
      setLiked(true);
    }
  }, [user, art]);

  // 🔥 VIEW DETAILS (AUCTION + NORMAL ROUTE)
  const handleViewDetails = () => {
    if (art?.auction?.isAuction) {
      navigate(`/auction/${art._id}`);
    } else {
      navigate(`/listing-details/${art._id}`);
    }
  };

  // 🔥 FAVORITE TOGGLE
  const toggleFavorite = async (e) => {
    e.stopPropagation();

    if (!user) return alert("Please login first");

    try {
      const token = await user.getIdToken();

      const res = await fetch(`${SERVER}/users/favorite/${art._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
    <div className="relative bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700 rounded-xl overflow-hidden transition-colors duration-300 hover:scale-[1.02] duration-200">

      {/* 🔥 AUCTION BADGE */}
      {art?.auction?.isAuction && (
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded z-10">
          🔴 AUCTION
        </span>
      )}

      {/* IMAGE */}
      <img
        src={art.image || "/placeholder.png"}
        alt={art.title}
        className="h-52 w-full object-cover cursor-pointer"
        onClick={handleViewDetails}
      />

      <div className="p-4">

        {/* TITLE */}
        <h3
          onClick={handleViewDetails}
          className="text-lg font-semibold cursor-pointer text-gray-900 dark:text-yellow-50"
        >
          {art.title}
        </h3>

        <p className="text-gray-500 dark:text-gray-300 text-sm mt-1">
          {art.category}
        </p>

        {/* 🔥 PRICE / BID */}
        <p className="text-green-600 dark:text-green-400 font-bold mt-2">
          {art?.auction?.isAuction
            ? `Bid: ${art.auction.currentBid || 0} Tk`
            : `$${art.price}`}
        </p>

        {/* STATS */}
        <div className="flex justify-between text-sm mt-2 text-gray-500 dark:text-gray-300">

          <span>👁 {art.views || 0}</span>

          {/* FAVORITE */}
          <span
            onClick={toggleFavorite}
            className={`cursor-pointer select-none ${
              liked ? "text-red-500" : ""
            }`}
          >
            {liked ? "💖" : "🤍"} {art.likes || 0}
          </span>

          <span>⭐ {art.rating || 0}</span>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleViewDetails}
          className="w-full py-2 mt-3 bg-gradient-to-r from-gray-400 to-blue-100 dark:from-gray-700 dark:to-blue-700 text-black dark:text-yellow-50 font-semibold rounded-lg hover:opacity-90 transition"
        >
          {art?.auction?.isAuction ? "Join Auction" : "See Details"}
        </button>

      </div>
    </div>
  );
};

export default ArtCard;
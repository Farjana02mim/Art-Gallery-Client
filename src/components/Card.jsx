import React from "react";
import { useNavigate } from "react-router-dom";

const Card = ({ listing }) => {
  const navigate = useNavigate();

  const {
    _id,
    title,
    category,
    price,
    location,
    image,
    featured,
    auction,
  } = listing;

  //  SMART ROUTING (auction + normal)
  const handleViewDetails = () => {
    if (auction?.isAuction) {
      navigate(`/auction/${_id}`);
    } else {
      navigate(`/listing-details/${_id}`);
    }
  };

  return (
    <div className="relative card bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-transform duration-300 overflow-hidden">

      {/*  FEATURED BADGE */}
      {featured && (
        <span className="absolute top-3 right-3 bg-yellow-400 text-gray-900 font-semibold px-3 py-1 rounded-full text-sm shadow-md z-10">
          Featured
        </span>
      )}

      {/* 🔴 AUCTION BADGE */}
      {auction?.isAuction && (
        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded z-10">
          🔴 Auction
        </span>
      )}

      <div className="p-6 flex flex-col">

        {/* IMAGE */}
        <figure className="overflow-hidden rounded-xl">
          <img
            className="w-full h-52 md:h-48 object-cover transform hover:scale-105 transition-transform duration-500 cursor-pointer"
            src={image}
            alt={title}
            onClick={handleViewDetails}
          />
        </figure>

        {/* DETAILS */}
        <div className="mt-4 space-y-2 flex-1 flex flex-col">

          {/* TITLE */}
          <h2
            onClick={handleViewDetails}
            className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 cursor-pointer"
          >
            {title}
          </h2>

          <p className="text-gray-700 dark:text-gray-300">
            Category: {category}
          </p>

          {/*  PRICE / BID */}
          <p className="text-gray-700 dark:text-gray-300 font-semibold">
            {auction?.isAuction
              ? `Current Bid: ${auction.currentBid || 0} Tk`
              : parseInt(price) > 0
              ? `Price: $${price}`
              : "Free for Adoption"}
          </p>

          <p className="text-gray-700 dark:text-gray-300">
            Location: {location}
          </p>

          {/*  STATUS */}
          {auction?.isAuction && (
            <p className="text-sm text-red-500 font-semibold">
              Live Auction Item
            </p>
          )}

          {/* BUTTON */}
          <button
            onClick={handleViewDetails}
            className="mt-auto w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold rounded-xl shadow-md hover:scale-105 hover:from-indigo-700 hover:to-blue-600 transition-all duration-300"
          >
            {auction?.isAuction ? "Join Auction" : "See Details"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default Card;
import React from "react";
import { useNavigate } from "react-router-dom";

const Card = ({ listing }) => {
  const navigate = useNavigate();
  const { _id, title, category, price, location, image, featured } = listing;

  const handleViewDetails = () => {
    navigate(`/listing-details/${_id}`);
  };

  return (
    <div className="card relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300 overflow-hidden">
      
      {/* Featured Badge */}
      {featured && (
        <span className="absolute top-3 right-3 bg-yellow-400 text-gray-900 font-semibold px-3 py-1 rounded-full text-sm shadow-md">
          Featured
        </span>
      )}

      <div className="p-6 flex flex-col">
        {/* Image */}
        <figure className="overflow-hidden rounded-xl">
          <img
            className="w-full h-52 md:h-48 object-cover transform hover:scale-105 transition-transform duration-500"
            src={image}
            alt={title}
          />
        </figure>

        {/* Details */}
        <div className="mt-4 space-y-2 flex-1 flex flex-col">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
          <p className="text-gray-700 dark:text-gray-300">Category: {category}</p>
          <p className="text-gray-700 dark:text-gray-300">
            {parseInt(price) > 0 ? `Price: $${price}` : "Free for Adoption"}
          </p>
          <p className="text-gray-700 dark:text-gray-300">Location: {location}</p>

          {/* Button */}
          <button
            onClick={handleViewDetails}
            className="mt-auto w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold rounded-xl shadow-md hover:scale-105 hover:from-indigo-700 hover:to-blue-600 transition-all duration-300"
          >
            See Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
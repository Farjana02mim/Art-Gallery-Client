import React from "react";
import { useNavigate } from "react-router-dom";

const Card = ({ listing }) => {
  const navigate = useNavigate();
  const { _id, name, category, price, location, image } = listing;

  const handleViewDetails = () => {
    navigate(`/listing-details/${_id}`);
  };

  return (
    <div className="card bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300 overflow-hidden">
      <div className="p-4">
        <figure>
          <img
            className="w-full h-48 object-cover rounded-xl"
            src={image}
            alt={name}
          />
        </figure>
        <div className="mt-3">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">{name}</h2>
          <p className="text-gray-600 mb-1">Category: {category}</p>
          <p className="text-gray-600 mb-1">
            {parseInt(price) > 0 ? `Price: $${price}` : "Free for Adoption"}
          </p>
          <p className="text-gray-600 mb-3">Location: {location}</p>
          <button
            onClick={handleViewDetails}
            className="w-full py-2 bg-gradient-to-r from-gray-400 to-blue-100 text-black font-semibold rounded-lg hover:opacity-90 transition"
          >
            See Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;

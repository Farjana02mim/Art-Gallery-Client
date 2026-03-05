// src/pages/ListingDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SERVER_URL = "http://localhost:3000";

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${SERVER_URL}/listing/${id}`)
      .then((res) => res.json())
      .then((data) => setListing(data))
      .catch((err) => {
        console.error("Failed to load listing:", err);
        toast.error("Failed to load listing details");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleBuyNow = () => {
    // Navigate to payment route with listing ID or full data
    navigate("/payment", { state: { listing } });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-yellow-400 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <p className="text-center text-gray-500 mt-10">
        Listing not found.
      </p>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex flex-col md:flex-row gap-6 bg-white rounded-xl shadow-md p-6">
        {/* Image */}
        <img
          src={listing.image}
          alt={listing.title}
          className="w-full md:w-1/2 h-96 object-cover rounded-xl"
        />

        {/* Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
            <p className="text-gray-700 mb-1"><strong>Artist:</strong> {listing.artistName}</p>
            <p className="text-gray-700 mb-1"><strong>Category:</strong> {listing.category}</p>
            <p className="text-gray-700 mb-1"><strong>Year:</strong> {listing.year}</p>
            <p className="text-gray-700 mb-4"><strong>Price:</strong> ${listing.price}</p>
            <p className="text-gray-600">{listing.description}</p>
          </div>

          <button
            onClick={handleBuyNow}
            className="mt-6 w-full py-3 bg-gradient-to-r from-gray-400 to-blue-100 text-black font-semibold rounded-lg hover:opacity-90 transition"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
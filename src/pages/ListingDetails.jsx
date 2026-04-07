import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../hooks/useAuth";

const SERVER_URL = "http://localhost:3000";

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load listing data
  const fetchListing = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${SERVER_URL}/listing/${id}`);
      const data = await res.json();
      setListing(data);
    } catch (error) {
      toast.error("Failed to load listing");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  if (!id) return;

  const fetchListingAndIncrementViews = async () => {
    try {
      setLoading(true);

      // 1️⃣ Fetch listing
      const res = await fetch(`${SERVER_URL}/listing/${id}`);
      if (!res.ok) throw new Error("Listing not found");
      const data = await res.json();
      setListing(data);

      // 2️⃣ Increment views using the exact _id from MongoDB
      if (data._id) {
        const viewRes = await fetch(`${SERVER_URL}/listing/views/${data._id}`, {
          method: "PATCH",
        });
        if (viewRes.ok) {
          const viewData = await viewRes.json();
          if (viewData.success && viewData.views !== undefined) {
            setListing(prev => ({ ...prev, views: viewData.views }));
          }
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  fetchListingAndIncrementViews();
}, [id]);

  // Handle Like
const handleLike = async () => {
  try {
    // 1️⃣ Like increment
    const likeRes = await fetch(`${SERVER_URL}/listing/like/${id}`, {
      method: "PATCH",
    });

    const likeData = await likeRes.json();

    if (likeData.modifiedCount > 0) {
      setListing(prev => ({
        ...prev,
        likes: (prev.likes || 0) + 1,
      }));
    }

    // 🔥 DEBUG (VERY IMPORTANT)
    //console.log("Token:", token);

    // 2️⃣ Favorite add (FIXED)
    const favRes = await fetch(`${SERVER_URL}/users/favorite/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ FIX
      },
    });

    // 🔥 DEBUG
    //console.log("Status:", favRes.status);

    const favData = await favRes.json();
   // console.log("Fav Data:", favData);

    if (favData.success) {
      toast.success("Added to favorites 💖");
    }

  } catch (error) {
    console.error(error);
    toast.error("Failed to like or favorite");
  }
};

  // Buy Now
  const handleBuyNow = () => {
    navigate(`/dashboard/payment/${id}`, { state: { listing } });
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!listing) return <p className="text-center mt-10">Listing not found</p>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex flex-col md:flex-row gap-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        {/* Image */}
        <img
          src={listing.image}
          alt={listing.title}
          className="w-full md:w-1/2 h-96 object-cover rounded-xl"
        />

        {/* Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">{listing.title}</h1>
            <p><strong>Artist:</strong> {listing.name}</p>
            <p><strong>Category:</strong> {listing.category}</p>
            <p><strong>Year:</strong> {listing.year}</p>
            <p className="text-green-600 text-lg font-semibold">${listing.price}</p>
            <p className="text-gray-600 mb-4">{listing.description}</p>

            <div className="flex gap-6 text-sm text-gray-600">
              <span>👁 {listing.views || 0} Views</span>
              <span>❤️ {listing.likes || 0} Likes</span>
              <span>⭐ {listing.rating || 0}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleLike}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg"
            >
              ❤️ Like
            </button>

            <button
              onClick={handleBuyNow}
              className="flex-1 py-3 bg-gradient-to-r from-gray-400 to-blue-200 text-black font-semibold rounded-lg"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
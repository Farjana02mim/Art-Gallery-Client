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
  const [purchased, setPurchased] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(true);

  // =========================
  // Load listing + views
  // =========================
  useEffect(() => {
    if (!id) return;

    const fetchListing = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${SERVER_URL}/listing/${id}`);
        if (!res.ok) throw new Error("Listing not found");

        const data = await res.json();
        setListing(data);

        // increment views
        await fetch(`${SERVER_URL}/listing/views/${data._id}`, {
          method: "PATCH",
        });

      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  // =========================
  // Check Purchase
  // =========================
  useEffect(() => {
    const checkPurchase = async () => {
      if (!token || !id) return;

      try {
        setCheckingPurchase(true);

        const res = await fetch(
          `${SERVER_URL}/check-purchase/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setPurchased(data.purchased);

      } catch (err) {
        console.log(err);
      } finally {
        setCheckingPurchase(false);
      }
    };

    checkPurchase();
  }, [id, token]);

  // =========================
  // Like + Favorite
  // =========================
  const handleLike = async () => {
    try {
      await fetch(`${SERVER_URL}/listing/like/${id}`, {
        method: "PATCH",
      });

      setListing(prev => ({
        ...prev,
        likes: (prev.likes || 0) + 1,
      }));

      const favRes = await fetch(`${SERVER_URL}/users/favorite/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const favData = await favRes.json();

      if (favData.success) {
        toast.success("Added to favorites 💖");
      }

    } catch (err) {
      toast.error("Action failed");
    }
  };

  // =========================
  // Buy Now
  // =========================
  const handleBuyNow = () => {
    navigate(`/dashboard/payment/${id}`, {
      state: { listing },
    });
  };

  // =========================
  // Download (secured)
  // =========================
const handleDownload = async () => {
  try {
    const token = await user.getIdToken(); // IMPORTANT FIX

    const res = await fetch(`${SERVER_URL}/download/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    window.open(data.downloadUrl, "_blank");

  } catch (err) {
    toast.error(err.message);
  }
};

  // =========================
  // Loading UI
  // =========================
  if (loading || !listing) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-6">

      <ToastContainer />

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
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
              {listing.title}
            </h1>

            <p><strong>Artist:</strong> {listing.name}</p>
            <p><strong>Category:</strong> {listing.category}</p>
            <p><strong>Year:</strong> {listing.year}</p>

            <p className="text-green-600 text-lg font-semibold">
              ${listing.price}
            </p>

            <p className="text-gray-600 mb-4">
              {listing.description}
            </p>

            <div className="flex gap-6 text-sm text-gray-600">
              <span>👁 {listing.views || 0}</span>
              <span>❤️ {listing.likes || 0}</span>
              <span>⭐ {listing.rating || 0}</span>
            </div>
          </div>

          {/* =========================
              ACTION BUTTONS
          ========================= */}
          <div className="flex gap-3 mt-6">

            {/* LIKE */}
            <button
              onClick={handleLike}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg"
            >
              ❤️ Like
            </button>

            {/* PURCHASE LOGIC */}
            {checkingPurchase ? (
              <button className="px-4 py-2 bg-gray-300 rounded-lg">
                Checking...
              </button>
            ) : purchased ? (
              <button
                onClick={handleDownload}
                className="flex-1 py-3 bg-green-500 text-white font-semibold rounded-lg"
              >
                ⬇ Download Art
              </button>
            ) : (
              <button
                onClick={handleBuyNow}
                className="flex-1 py-3 bg-gradient-to-r from-gray-400 to-blue-200 text-black font-semibold rounded-lg"
              >
                Buy Now
              </button>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
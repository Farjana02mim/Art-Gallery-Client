import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";

const SERVER = "https://art-gallery-server-ashen.vercel.app";

const AuctionDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [art, setArt] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [timeLeft, setTimeLeft] = useState("");

  // 🔹 Load Art
  const fetchArt = async () => {
    try {
      const res = await axios.get(`${SERVER}/listing/${id}`);
      setArt(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load art ❌");
    }
  };

  useEffect(() => {
    fetchArt();
  }, [id]);

  // 🔥 FIX: always use auction object safely
  const auction = art?.auction;

  // 🔹 Live Timer (FIXED)
  useEffect(() => {
    if (!auction?.endTime) return;

    const interval = setInterval(() => {
      const diff = new Date(auction.endTime) - new Date();

      if (diff <= 0) {
        setTimeLeft("Auction Ended");
        clearInterval(interval);
        return;
      }

      const hrs = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);

      setTimeLeft(`${hrs}h ${mins}m ${secs}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [auction]);

  // 🔹 Place Bid
  const handleBid = async () => {
    if (!user) {
      return toast.warning("Login first ⚠️");
    }

    if (!auction) {
      return toast.error("Auction data not found ❌");
    }

    if (!bidAmount || Number(bidAmount) <= auction.currentBid) {
      return toast.error(
        `Bid must be higher than ${auction.currentBid} Tk`
      );
    }

    try {
      const token = await user.getIdToken();

      await axios.patch(
        `${SERVER}/auction/bid/${id}`,
        { bidAmount: Number(bidAmount) },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Bid placed successfully 🔥");

      setBidAmount("");
      fetchArt();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Bid failed ❌");
    }
  };

  if (!art) return <p className="text-center mt-10">Loading...</p>;

  // 🔥 FIXED LIVE CHECK
  const isLive =
    auction?.isAuction === true &&
    auction?.endTime &&
    new Date(auction.endTime) > new Date();

  return (
    <div className="max-w-3xl mx-auto p-5">

      {/* 🔥 IMAGE */}
      <img
        src={art.image}
        alt={art.title}
        className="w-full rounded-xl shadow-md"
      />

      {/* 🔥 TITLE */}
      <h2 className="text-2xl font-bold mt-4">{art.title}</h2>

      {/* 🔥 STATUS */}
      <div className="flex justify-between mt-2 text-sm">
        <span>
          💰 Starting Price:{" "}
          <b>{auction?.startPrice ?? art.startPrice} Tk</b>
        </span>
        <span>⏱️ {timeLeft}</span>
      </div>

      {/* 🔥 LIVE BADGE */}
      {isLive && (
        <p className="text-green-600 font-semibold mt-2">
          🟢 Live Auction
        </p>
      )}

      {/* 🔥 CURRENT BID */}
      {auction && (
        <p className="mt-2 text-sm">
          💰 Current Bid:{" "}
          <b>{auction.currentBid} Tk</b>
        </p>
      )}

      {/* 🔥 BID INPUT */}
      {isLive && (
        <div className="mt-4 flex gap-2">
          <input
            type="number"
            min={(auction?.currentBid || 0) + 1}
            placeholder="Enter your bid"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            className="border p-2 rounded w-full"
          />

          <button
            onClick={handleBid}
            className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
          >
            Bid
          </button>
        </div>
      )}

      {/* 🔥 Auction End */}
      {!isLive && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          ⛔ Auction has ended or not started
        </div>
      )}
    </div>
  );
};

export default AuctionDetails;
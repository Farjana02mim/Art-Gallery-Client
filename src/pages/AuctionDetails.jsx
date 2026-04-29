import { useEffect, useState } from "react";
import axios from "axios";

const SERVER = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

const AuctionDetails = ({ artId, user }) => {

  const [art, setArt] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [bids, setBids] = useState([]);
  const [timeLeft, setTimeLeft] = useState("");

  // 🔹 Load Art
  const fetchArt = async () => {
    const res = await axios.get(`${SERVER}/listing/${artId}`);
    setArt(res.data);
  };

  // 🔹 Load Bids
  const fetchBids = async () => {
    const res = await axios.get(`${SERVER}/bids/${artId}`);
    setBids(res.data);
  };

  useEffect(() => {
    fetchArt();
    fetchBids();
  }, [artId]);

  // 🔹 Timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (art?.auction?.endTime) {
        const diff = new Date(art.auction.endTime) - new Date();

        if (diff <= 0) {
          setTimeLeft("Auction Ended");
          clearInterval(interval);
        } else {
          const mins = Math.floor(diff / 60000);
          const secs = Math.floor((diff % 60000) / 1000);
          setTimeLeft(`${mins}m ${secs}s`);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [art]);

  // 🔹 Place Bid
  const handleBid = async () => {
    try {
      const res = await axios.post(`${SERVER}/bid/${artId}`,
        { amount: Number(bidAmount) },
        {
          headers: {
            authorization: `Bearer ${user?.accessToken}`
          }
        }
      );

      alert(res.data.message);

      setBidAmount("");
      fetchArt();
      fetchBids();

    } catch (error) {
      alert(error.response?.data?.message || "Bid failed");
    }
  };

  if (!art) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>

      <h2>{art.title}</h2>
      <img src={art.image} alt="" width="100%" />

      <p>💰 Current Bid: {art.auction?.currentBid} Tk</p>
      <p>⏱️ Time Left: {timeLeft}</p>

      {/* 🔹 Bid Input */}
      {timeLeft !== "Auction Ended" && (
        <>
          <input
            type="number"
            placeholder="Enter your bid"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
          />
          <button onClick={handleBid}>Place Bid</button>
        </>
      )}

      {/* 🔹 Winner */}
      {timeLeft === "Auction Ended" && (
        <h3>🏆 Winner: {art.auction?.highestBidder || "No bids"}</h3>
      )}

      {/* 🔹 Bid History */}
      <h3>📊 Bid History</h3>
      <ul>
        {bids.map((b, i) => (
          <li key={i}>
            {b.email} → {b.amount} Tk
          </li>
        ))}
      </ul>

    </div>
  );
};

export default AuctionDetails;
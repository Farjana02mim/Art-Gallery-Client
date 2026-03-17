import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Statistics = () => {
  const axiosSecure = useAxiosSecure();

  const [stats, setStats] = useState({
    users: 0,
    artists: 0,
    listings: 0,
    revenue: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total users
        const usersRes = await axiosSecure.get("/users");
        const artistsRes = await axiosSecure.get("/artists?status=approved");
        const listingsRes = await axiosSecure.get("/listing");
        const salesRes = await axiosSecure.get("/sales-summary");

        setStats({
          users: usersRes.data.length,
          artists: artistsRes.data.length,
          listings: listingsRes.data.length,
          revenue: salesRes.data.totalRevenue || 0,
        });
      } catch (err) {
        console.error("Failed to fetch statistics", err);
      }
    };

    fetchStats();
  }, []);

  const cardData = [
    { title: "Total Users", value: stats.users, color: "bg-blue-500" },
    { title: "Total Artists", value: stats.artists, color: "bg-green-500" },
    { title: "Total Listings", value: stats.listings, color: "bg-purple-500" },
    { title: "Total Revenue", value: `$${stats.revenue}`, color: "bg-yellow-500" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center">Dashboard Statistics</h2>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardData.map((card, index) => (
          <div
            key={index}
            className={`flex flex-col justify-center items-center p-6 rounded-xl shadow-lg ${card.color} text-white hover:scale-105 transition-transform duration-300`}
          >
            <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
            <p className="text-3xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Statistics;
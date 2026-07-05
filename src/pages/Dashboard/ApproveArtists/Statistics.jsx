import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaUsers, FaUserTie, FaPalette, FaDollarSign } from "react-icons/fa";

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
    {
      title: "Total Users",
      value: stats.users,
      icon: <FaUsers />,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Total Artists",
      value: stats.artists,
      icon: <FaUserTie />,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Total Listings",
      value: stats.listings,
      icon: <FaPalette />,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Total Revenue",
      value: `$${stats.revenue}`,
      icon: <FaDollarSign />,
      color: "from-yellow-500 to-orange-500",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">
          Dashboard Statistics
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Overview of your platform performance
        </p>
      </div>

      {/* Cards */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardData.map((card, index) => (
          <div
            key={index}
            className={`relative p-6 rounded-2xl text-white shadow-lg 
            bg-gradient-to-r ${card.color} 
            hover:scale-105 transition-transform duration-300`}
          >
            {/* Icon */}
            <div className="absolute top-4 right-4 text-3xl opacity-20">
              {card.icon}
            </div>

            {/* Content */}
            <h3 className="text-lg font-medium">{card.title}</h3>
            <p className="text-3xl font-bold mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Extra Section (Optional future charts) */}
      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Growth Overview
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            (You can add charts here later)
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Recent Activity
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            (Recent sales, users, etc.)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;

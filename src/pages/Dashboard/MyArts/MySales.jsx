import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../context/AuthContext";

const SERVER = "https://art-gallery-server-ashen.vercel.app";

const MySales = () => {
  const { user } = useContext(AuthContext);

  const {
    data: sales = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["my-sales", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const token = await user.getIdToken();

      const res = await fetch(`${SERVER}/my-sales?email=${user.email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch sales");
      return res.json();
    },
  });

  // Loading
  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="w-12 h-12 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );

  // Error
  if (error)
    return (
      <p className="text-center mt-10 text-lg text-red-500">{error.message}</p>
    );

  // Empty
  if (sales.length === 0)
    return (
      <p className="text-center mt-10 text-lg text-gray-500 dark:text-gray-400">
        No Sales Found 😔
      </p>
    );

  return (
    <div
      className="min-h-screen py-10 px-4 
      bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 
      dark:from-gray-900 dark:via-gray-950 dark:to-black"
    >
      <div className="w-11/12 mx-auto">
        {/* Title */}
        <h2
          className="text-3xl md:text-4xl font-bold mb-8 text-center 
          text-gray-800 dark:text-white"
        >
          💰 My Sales
        </h2>

        {/* Table Card */}
        <div
          className="overflow-x-auto rounded-2xl shadow-lg 
          bg-white dark:bg-gray-900"
        >
          <table className="table w-full">
            {/* Head */}
            <thead className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
              <tr>
                <th className="px-4 py-3">Buyer</th>
                <th className="px-4 py-3">Art</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Medium</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {sales.map((sale) => (
                <tr
                  key={sale._id}
                  className="border-b border-gray-200 dark:border-gray-700 
                    hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {sale.buyerName || sale.buyerEmail}
                  </td>

                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                    {sale.artTitle}
                  </td>

                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {sale.category || "-"}
                  </td>

                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {sale.medium || "-"}
                  </td>

                  <td className="px-4 py-3 font-bold text-green-600">
                    ${sale.price}
                  </td>

                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {new Date(sale.date).toLocaleDateString()}
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium
                        ${
                          sale.status === "completed"
                            ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                            : sale.status === "pending"
                              ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300"
                              : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                    >
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MySales;

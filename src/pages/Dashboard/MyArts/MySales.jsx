import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../context/AuthContext";

const MySales = () => {
  const { user } = useContext(AuthContext);

  const { data: sales = [], isLoading, error } = useQuery({
    queryKey: ["my-sales", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      // Firebase ID token নাও
      const token = await user.getIdToken();

      const res = await fetch(
        `http://localhost:3000/my-sales?email=${user.email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch sales");
      return res.json();
    },
  });

  if (isLoading)
    return <p className="text-center mt-10 text-xl">Loading...</p>;

  if (error)
    return (
      <p className="text-center mt-10 text-xl text-red-500">
        {error.message}
      </p>
    );

  if (sales.length === 0)
    return <p className="text-center mt-10 text-xl">No Sales Found</p>;

  return (
    <div className="w-11/12 mx-auto py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">My Sales</h2>
      <div className="overflow-x-auto">
        <table className="table w-full border border-gray-200">
          <thead className="bg-gray-200 text-gray-800">
            <tr>
              <th className="px-4 py-2">Buyer</th>
              <th className="px-4 py-2">Art Title</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Medium</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr
                key={sale._id}
                className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
              >
                <td className="px-4 py-2">{sale.buyerName || sale.buyerEmail}</td>
                <td className="px-4 py-2 font-semibold">{sale.artTitle}</td>
                <td className="px-4 py-2">{sale.category || "-"}</td>
                <td className="px-4 py-2">{sale.medium || "-"}</td>
                <td className="px-4 py-2 text-green-600 font-bold">${sale.price}</td>
                <td className="px-4 py-2">
                  {new Date(sale.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 capitalize">{sale.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MySales;
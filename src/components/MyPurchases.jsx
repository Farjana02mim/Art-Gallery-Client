import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../context/AuthContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const MyPurchases = () => {
  const { user } = useContext(AuthContext);

  const {
    data: purchases = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["purchases", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const token = await user.getIdToken();

      const res = await fetch(
        `http://localhost:3000/myPurchases?email=${user.email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
  });

  // PDF Download
  const handleDownloadPDF = () => {
    if (!purchases.length) return;

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("My Art Purchases Report", 14, 20);

    const columns = [
      "Art ID",
      "Price",
      "Transaction ID",
      "Status",
      "Date",
    ];

    const rows = purchases.map((p) => [
      p.artId,
      `$${p.amount}`,
      p.transactionId,
      p.paymentStatus || "Paid",
      p.created_at
        ? new Date(p.created_at).toLocaleDateString()
        : "",
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 30,
    });

    doc.save("my-purchases.pdf");
  };

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
      <p className="text-center mt-10 text-red-500">
        Failed to load purchases
      </p>
    );

  return (
    <div className="min-h-screen py-10 px-4 
      bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 
      dark:from-gray-900 dark:via-gray-950 dark:to-black">

      <div className="w-11/12 mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-3xl md:text-4xl font-bold 
            text-gray-800 dark:text-white">
            🛒 My Purchases
          </h2>

          <button
            onClick={handleDownloadPDF}
            className="btn btn-primary"
          >
            ⬇️ Download Report
          </button>
        </div>

        {/* Table Card */}
        <div className="overflow-x-auto rounded-2xl shadow-lg 
          bg-white dark:bg-gray-900">

          <table className="table w-full">

            {/* Head */}
            <thead className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
              <tr>
                <th>Art ID</th>
                <th>Price</th>
                <th>Transaction</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {purchases.length > 0 ? (
                purchases.map((p) => (
                  <tr
                    key={p._id || p.transactionId}
                    className="border-b border-gray-200 dark:border-gray-700 
                      hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    <td className="text-gray-700 dark:text-gray-300">
                      {p.artId}
                    </td>

                    <td className="text-green-600 font-bold">
                      ${p.amount}
                    </td>

                    <td className="text-gray-700 dark:text-gray-300">
                      {p.transactionId}
                    </td>

                    {/* Status Badge */}
                    <td>
                      <span className="px-3 py-1 text-xs rounded-full 
                        bg-blue-100 text-blue-600 
                        dark:bg-blue-900 dark:text-blue-300 font-medium">
                        {p.paymentStatus || "Paid"}
                      </span>
                    </td>

                    <td className="text-gray-600 dark:text-gray-400">
                      {p.created_at
                        ? new Date(p.created_at).toLocaleDateString()
                        : ""}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-6 text-gray-500 dark:text-gray-400"
                  >
                    No purchases found 😔
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default MyPurchases;
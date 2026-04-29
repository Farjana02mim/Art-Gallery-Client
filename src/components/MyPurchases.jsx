import { useContext, useMemo } from "react";
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
      const SERVER = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

      const res = await fetch(
       `${SERVER}/myPurchases?email=${user.email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      // ✅ FIX: backend may send {success, data}
      return Array.isArray(data)
        ? data
        : Array.isArray(data.data)
        ? data.data
        : [];
    },
  });

  // ======================
  // TOTAL SPENT
  // ======================
  const totalSpent = useMemo(() => {
    return purchases.reduce(
      (sum, p) => sum + (Number(p.amount) || 0),
      0
    );
  }, [purchases]);

  // ======================
  // PDF DOWNLOAD
  // ======================
  const handleDownloadPDF = () => {
    if (!purchases.length) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Art Gallery - Purchase Report", 14, 20);

    doc.setFontSize(11);
    doc.text(`Total Purchases: ${purchases.length}`, 14, 30);
    doc.text(`Total Spent: $${totalSpent}`, 14, 36);

    const rows = purchases.map((p) => [
      p.artTitle || p.artId,
      `$${p.amount || 0}`,
      p.transactionId || "-",
      p.paymentStatus || "Paid",
      p.created_at
        ? new Date(p.created_at).toLocaleString()
        : "N/A",
    ]);

    autoTable(doc, {
      head: [["Art", "Price", "Transaction", "Status", "Date"]],
      body: rows,
      startY: 45,
    });

    doc.save("my-purchases.pdf");
  };

  // ======================
  // LOADING
  // ======================
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="w-12 h-12 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  // ======================
  // ERROR
  // ======================
  if (error) {
    return (
      <p className="text-center mt-10 text-red-500">
        Failed to load purchases
      </p>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-gray-900 dark:via-gray-950 dark:to-black">

      <div className="w-11/12 mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">

          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
            🛒 My Purchases
          </h2>

          <button
            onClick={handleDownloadPDF}
            disabled={!purchases.length}
            className="btn btn-primary disabled:opacity-50"
          >
            ⬇️ Download Report
          </button>

        </div>

        {/* SUMMARY */}
        <div className="mb-6 p-5 rounded-xl bg-white dark:bg-gray-900 shadow flex justify-between">

          <p className="text-gray-700 dark:text-gray-300">
            Total Purchases: <b>{purchases.length}</b>
          </p>

          <p className="text-green-600 font-bold text-lg">
            Total Spent: ${totalSpent}
          </p>

        </div>

        {/* EMPTY STATE */}
        {purchases.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-2xl">😔 No purchases found</p>
            <p className="text-sm">Buy something to see here</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl shadow-lg bg-white dark:bg-gray-900">

            <table className="table w-full">

              <thead className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                <tr>
                  <th>Art</th>
                  <th>Price</th>
                  <th>Transaction</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {purchases.map((p) => (
                  <tr
                    key={p._id || p.transactionId}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >

                    {/* ART */}
                    <td className="flex items-center gap-3 p-2">
                      <img
                        src={p.image || "https://via.placeholder.com/50"}
                        className="w-12 h-12 rounded object-cover"
                        alt="art"
                      />
                      <span>{p.artTitle || p.artId}</span>
                    </td>

                    {/* PRICE */}
                    <td className="text-green-600 font-bold">
                      ${p.amount || 0}
                    </td>

                    {/* TXN */}
                    <td className="text-xs text-gray-600">
                      {p.transactionId || "-"}
                    </td>

                    {/* STATUS */}
                    <td>
                      <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600">
                        {p.paymentStatus || "Paid"}
                      </span>
                    </td>

                    {/* DATE */}
                    <td className="text-sm text-gray-500">
                      {p.created_at
                        ? new Date(p.created_at).toLocaleString()
                        : "N/A"}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}

      </div>
    </div>
  );
};

export default MyPurchases;
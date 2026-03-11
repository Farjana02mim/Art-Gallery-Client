import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../context/AuthContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const MyPurchases = () => {
  const { user } = useContext(AuthContext);

  const { data: purchases = [] } = useQuery({
    queryKey: ["purchases", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      if (!user) return [];

      // Firebase token fetch
      const token = await user.getIdToken();

      const res = await fetch(
        `http://localhost:3000/myPurchases?email=${user.email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Token pathao
          },
        }
      );

      const data = await res.json();

      // Array safe handle
      return Array.isArray(data) ? data : [];
    },
  });

  // PDF Download
  const handleDownloadPDF = () => {
    if (!purchases || purchases.length === 0) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("My Art Purchases Report", 14, 20);

    const columns = [
      "Art ID",
      "Price",
      "Transaction ID",
      "Payment Status",
      "Date",
    ];

    const rows = purchases.map((p) => [
      p.artId,
      `$${p.amount}`,
      p.transactionId,
      p.paymentStatus || "Paid",
      p.created_at ? new Date(p.created_at).toLocaleDateString() : "",
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 30,
    });

    doc.save("my-purchases.pdf");
  };

  return (
    <div className="w-11/12 mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">My Purchases</h2>

        <button onClick={handleDownloadPDF} className="btn btn-primary">
          Download Report
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-gray-200 text-gray-800">
            <tr>
              <th>Art ID</th>
              <th>Price</th>
              <th>Transaction</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {purchases.length > 0 ? (
              purchases.map((p) => (
                <tr
                  key={p._id || p.transactionId}
                  className="odd:bg-white even:bg-gray-50 hover:bg-gray-100"
                >
                  <td>{p.artId}</td>
                  <td className="text-green-600 font-bold">${p.amount}</td>
                  <td>{p.transactionId}</td>
                  <td className="text-blue-600">{p.paymentStatus || "Paid"}</td>
                  <td>
                    {p.created_at
                      ? new Date(p.created_at).toLocaleDateString()
                      : ""}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 py-4">
                  No purchases found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyPurchases;
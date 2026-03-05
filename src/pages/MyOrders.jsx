import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "react-toastify/dist/ReactToastify.css";

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch orders for logged-in user
  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = await user.getIdToken();
        const res = await fetch(
          `https://pet-adoption-server-chi.vercel.app/my-downloads?email=${user.email}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Network response was not ok");

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        //console.error(err);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // Download PDF
  const handleDownloadPDF = () => {
    if (orders.length === 0) return toast.info("No orders to download!");

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("My Orders Report", 14, 20);

    const tableColumn = [
      "Product Name",
      "Buyer Name",
      "Price",
      "Quantity",
      "Address",
      "Date",
      "Phone",
      "Notes",
    ];

    const tableRows = orders.map((o) => [
      o.productName || "",
      o.buyerName || "",
      `$${o.price || 0}`,
      o.quantity || 0,
      o.address || "",
      o.date ? new Date(o.date).toLocaleDateString() : "",
      o.phone || "",
      o.notes || o.additionalNotes || "",
    ]);

    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 30 });
    doc.save("my-orders.pdf");
  };

  // Delete order
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const token = await user.getIdToken();
      const res = await fetch(`https://pet-adoption-server-chi.vercel.app/orders/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        setOrders(orders.filter((o) => o._id !== id));
        Swal.fire("Deleted!", "Order has been deleted.", "success");
      } else {
        Swal.fire("Error!", "Failed to delete order.", "error");
      }
    } catch (err) {
     // console.error(err);
      Swal.fire("Error!", "Failed to delete order.", "error");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#FFF5EB] via-[#FCE7F3] to-[#F3F4F6]">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-pink-600">My Orders</h2>
        <button
          onClick={handleDownloadPDF}
          className="bg-pink-400 text-white px-3 py-1 rounded-lg text-sm hover:bg-pink-500 transition"
        >
          Download Report
        </button>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full bg-white/80 backdrop-blur-lg rounded-lg shadow-md">
            <thead>
              <tr className="bg-pink-200 text-gray-800">
                <th className="px-4 py-2">Product Name</th>
                <th className="px-4 py-2">Buyer Name</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Address</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center text-black py-4">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o._id} className="border-t">
                    <td className="px-4 text-black py-2">{o.productName}</td>
                    <td className="px-4 text-black py-2">{o.buyerName}</td>
                    <td className="px-4 text-black py-2">${o.price}</td>
                    <td className="px-4 text-black py-2">{o.quantity}</td>
                    <td className="px-4 text-black py-2">{o.address}</td>
                    <td className="px-4 text-black py-2">
                      {new Date(o.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 text-black py-2">{o.phone}</td>
                    <td className="px-4 text-black py-2">
                      <button
                        onClick={() => handleDelete(o._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrders;

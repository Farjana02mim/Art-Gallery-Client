import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddListing = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const [form, setForm] = useState({
    name: "",
    category: "Paintings",
    price: "",
    location: "",
    description: "",
    image: "",
    date: "",
    email: user?.email || "",
  });
  const [loading, setLoading] = useState(false);

  if (!user)
    return <Navigate to="/signin" state={{ from: location }} replace />;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:3000/listing",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            price: form.category === "Paintings" ? 0 : form.price,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to add listing");
      toast.success("Listing added successfully!");
      setForm({
        name: "",
        category: "Paintings",
        price: "",
        location: "",
        description: "",
        image: "",
        date: "",
        email: user.email,
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 md:px-10 bg-gray-900 dark:bg-gray-800">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-3xl mx-auto bg-gray-100 dark:bg-gray-700/70 backdrop-blur-lg rounded-3xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
          Add New Artwork
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Artwork Name"
            value={form.name}
            onChange={handleChange}
            className="input input-bordered w-full rounded bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-yellow-50"
            required
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="input input-bordered w-full rounded bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-yellow-50"
            required
          >
            <option value="Paintings">Paintings</option>
            <option value="Sculptures">Sculptures</option>
            <option value="Photography">Photography</option>
            <option value="Digital Art">Digital Art</option>
          </select>

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="input input-bordered w-full rounded bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-yellow-50"
            required={form.category !== "Paintings"}
            disabled={form.category === "Paintings"}
          />

          <input
            type="text"
            name="location"
            placeholder="Gallery / Location"
            value={form.location}
            onChange={handleChange}
            className="input input-bordered w-full rounded bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-yellow-50"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="input input-bordered w-full rounded bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-yellow-50"
            required
          />

          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
            className="input input-bordered w-full rounded bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-yellow-50"
            required
          />

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="input input-bordered w-full rounded bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-yellow-50"
            required
          />

          <input
            type="email"
            name="email"
            value={form.email}
            readOnly
            className="input input-bordered w-full rounded bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-yellow-50"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold text-gray-900 dark:text-gray-800 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-600 transition"
            }`}
          >
            {loading ? "Adding..." : "Add Artwork"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddListing;
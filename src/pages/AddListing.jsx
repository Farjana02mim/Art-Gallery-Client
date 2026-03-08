import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const AddListing = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const initialForm = {
    title: "",
    name: user?.displayName || "",
    category: "Paintings",
    medium: "",
    dimensions: "",
    year: new Date().getFullYear(),
    price: "",
    description: "",
    location: "",
    country: "",
    imageFile: null,
    email: user?.email || "",
    featured: false,
    rating: 0,
    views: 0,
    likes: 0,
  };

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  if (!user) return <Navigate to="/signin" state={{ from: location }} replace />;

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else if (type === "file") {
      setForm({ ...form, [name]: files[0] });
      setImagePreview(URL.createObjectURL(files[0]));
    } else if (type === "number") {
      setForm({ ...form, [name]: Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";

      if (form.imageFile) {
        try {
          const formData = new FormData();
          formData.append("image", form.imageFile);

          const imgRes = await axios.post(
            `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host}`,
            formData
          );
          imageUrl = imgRes.data.data.url;
        } catch (err) {
          toast.error("Image upload failed!");
          setLoading(false);
          return;
        }
      }

      const dataToSend = {
        title: form.title,
        name: form.name,
        category: form.category,
        medium: form.medium,
        dimensions: form.dimensions,
        year: Number(form.year),
        price: Number(form.price),
        description: form.description,
        location: form.location,
        country: form.country,
        email: form.email,
        image: imageUrl,
        created_at: new Date(),
        updated_at: new Date(),
        views: Number(form.views) || 0,
        likes: Number(form.likes) || 0,
        featured: form.featured,
        rating: Number(form.rating) || 0,
      };

      const res = await fetch("http://localhost:3000/listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) throw new Error("Failed to add listing");

      toast.success("Artwork added successfully!");

      // Reset form but keep user info
      setForm({ ...initialForm, name: user.displayName, email: user.email });
      setImagePreview(null);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 md:px-10 bg-gray-100 dark:bg-gray-900">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-10">
        <h2 className="text-3xl font-bold text-yellow-500 mb-8 text-center">
          Add New Artwork
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            name="title"
            placeholder="Artwork Title"
            value={form.title}
            onChange={handleChange}
            className="input input-bordered w-full rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-yellow-50"
            required
          />

          <input
            type="text"
            name="name"
            placeholder="Artist Name"
            value={form.name}
            onChange={handleChange}
            className="input input-bordered w-full rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-yellow-50"
            required
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="input input-bordered w-full rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-yellow-50"
          >
            <option value="Paintings">Paintings</option>
            <option value="Sculptures">Sculptures</option>
            <option value="Photography">Photography</option>
            <option value="Digital Art">Digital Art</option>
          </select>

          <input
            type="text"
            name="medium"
            placeholder="Medium (e.g., Oil on Canvas)"
            value={form.medium}
            onChange={handleChange}
            className="input input-bordered w-full rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-yellow-50"
          />

          <input
            type="text"
            name="dimensions"
            placeholder="Dimensions (e.g., 30 x 40 inches)"
            value={form.dimensions}
            onChange={handleChange}
            className="input input-bordered w-full rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-yellow-50"
          />

          <input
            type="number"
            name="year"
            placeholder="Year"
            value={form.year}
            onChange={handleChange}
            className="input input-bordered w-full rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-yellow-50"
            min="1900"
            max={new Date().getFullYear()}
          />

          <input
            type="number"
            name="price"
            placeholder="Price (USD)"
            value={form.price}
            onChange={handleChange}
            className="input input-bordered w-full rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-yellow-50"
          />

          <input
            type="text"
            name="location"
            placeholder="Gallery / Location"
            value={form.location}
            onChange={handleChange}
            className="input input-bordered w-full rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-yellow-50"
          />

          <input
            type="text"
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
            className="input input-bordered w-full rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-yellow-50"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="input input-bordered w-full rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-yellow-50 col-span-full"
            rows="4"
            required
          />

          {/* Custom File Upload */}
          <div className="col-span-full flex flex-col md:flex-row items-start gap-4">
            <label className="w-full md:w-1/2 cursor-pointer bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-yellow-50 border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 transition">
              <span>{form.imageFile ? form.imageFile.name : "Choose Image"}</span>
              <input
                type="file"
                name="imageFile"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
                required
              />
            </label>

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full md:w-1/2 h-40 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
              />
            )}
          </div>

          <label className="flex items-center gap-2 col-span-full">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
            />
            <span className="text-gray-800 dark:text-yellow-50 font-medium">
              Featured Artwork
            </span>
          </label>

          <input
            type="email"
            name="email"
            value={form.email}
            readOnly
            className="input input-bordered w-full rounded bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-yellow-50 col-span-full"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-gray-900 dark:text-gray-800 col-span-full ${
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
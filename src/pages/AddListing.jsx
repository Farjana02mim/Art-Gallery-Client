import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const SERVER = "https://art-gallery-server-ashen.vercel.app";

const AddListing = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const initialForm = {
    title: "",
    name: user?.displayName || "",
    category: "All",
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

    //  AUCTION FIELD
    isAuction: false,
    startPrice: "",
    startTime: "",
    endTime: "",
  };

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  if (!user)
    return <Navigate to="/signin" state={{ from: location }} replace />;

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

      //  Image upload
      if (form.imageFile) {
        try {
          const formData = new FormData();
          formData.append("image", form.imageFile);

          const imgRes = await axios.post(
            `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host}`,
            formData,
          );
          imageUrl = imgRes.data.data.url;
        } catch (err) {
          toast.error("Image upload failed!");
          setLoading(false);
          return;
        }
      }

      //  FINAL DATA
      const dataToSend = {
        title: form.title,
        name: form.name,
        category: form.category,
        medium: form.medium,
        dimensions: form.dimensions,
        year: Number(form.year),
        price: form.isAuction ? 0 : Number(form.price), // auction হলে price off
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

        //  AUCTION SEND
        isAuction: form.isAuction,
        startPrice: Number(form.startPrice),
        startTime: form.startTime,
        endTime: form.endTime,
      };

      const res = await fetch(`${SERVER}/listing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) throw new Error("Failed to add listing");

      toast.success("Artwork added successfully!");

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

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <input
            type="text"
            name="title"
            placeholder="Artwork Title"
            value={form.title}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />

          <input
            type="text"
            name="name"
            placeholder="Artist Name"
            value={form.name}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="input input-bordered w-full"
          >
            <option value="All">All</option>
            <option value="Folk">Folk</option>
            <option value="Liberation War">Liberation War</option>
            <option value="River">River</option>
            <option value="Flowers">Flowers</option>
            <option value="Sculptures">Sculptures</option>
            <option value="Photography">Photography</option>
            <option value="Russian Art">Russian Art</option>
            <option value="African Art">African Art</option>
            <option value="Illustration">Illustration</option>
          </select>

          <input
            type="text"
            name="medium"
            placeholder="Medium"
            value={form.medium}
            onChange={handleChange}
            className="input input-bordered w-full"
          />

          <input
            type="text"
            name="dimensions"
            placeholder="Dimensions"
            value={form.dimensions}
            onChange={handleChange}
            className="input input-bordered w-full"
          />

          <input
            type="number"
            name="year"
            value={form.year}
            onChange={handleChange}
            className="input input-bordered w-full"
          />

          {/*  PRICE */}
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            disabled={form.isAuction}
            className="input input-bordered w-full"
          />

          {/*  AUCTION TOGGLE */}
          <div className="col-span-full flex items-center gap-3">
            <input
              type="checkbox"
              name="isAuction"
              checked={form.isAuction}
              onChange={handleChange}
            />
            <label>Enable Auction</label>
          </div>

          {/*  AUCTION FIELDS */}
          {form.isAuction && (
            <>
              <input
                type="number"
                name="startPrice"
                placeholder="Start Price"
                value={form.startPrice}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />

              <input
                type="datetime-local"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />

              <input
                type="datetime-local"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </>
          )}

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="input input-bordered w-full"
          />

          <input
            type="text"
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
            className="input input-bordered w-full"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="input input-bordered col-span-full"
            required
          />

          <input
            type="file"
            name="imageFile"
            accept="image/*"
            onChange={handleChange}
            className="col-span-full"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="col-span-full btn btn-primary"
          >
            {loading ? "Adding..." : "Add Artwork"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddListing;

import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";

const SERVER = "https://art-gallery-server-ashen.vercel.app";

const UpdateArt = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [art, setArt] = useState(null);
  const [form, setForm] = useState({
    title: "",
    category: "All",
    price: "",
    location: "",
    description: "",
    imageFile: null,
    imageUrl: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ================= Fetch Art Details =================
  useEffect(() => {
    const fetchArt = async () => {
      try {
        const res = await fetch(`${SERVER}/listing/${id}`);
        if (!res.ok) throw new Error("Art not found");

        const data = await res.json();

        // Ownership check
        if (data.email !== user.email) {
          setError("You are not authorized to edit this art.");
          return;
        }

        setArt(data);
        setForm({
          title: data.title || "",
          category: data.category || "All",
          price: data.price || "",
          location: data.location || "",
          description: data.description || "",
          imageFile: null,
          imageUrl: data.image || "",
        });
        setImagePreview(data.image || null);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load art");
      } finally {
        setLoading(false);
      }
    };

    fetchArt();
  }, [id, user.email]);

  // ================= Form Handlers =================
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setForm({ ...form, imageFile: files[0] });
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = form.imageUrl;

      if (form.imageFile) {
        const formData = new FormData();
        formData.append("image", form.imageFile);

        const imgRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host}`,
          formData,
        );
        imageUrl = imgRes.data.data.url;
      }

      const updatedArt = {
        title: form.title,
        category: form.category,
        price: Number(form.price),
        location: form.location,
        description: form.description,
        image: imageUrl,
      };

      const res = await fetch(`${SERVER}/listing/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedArt),
      });

      const data = await res.json();
      if (data.modifiedCount > 0) {
        toast.success("Art Updated Successfully!");
        navigate("/dashboard/my-arts");
      } else {
        toast.info("No changes made.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update art.");
    } finally {
      setLoading(false);
    }
  };

  // ================= Loading Skeleton =================
  if (loading) {
    return (
      <div className="w-10/12 md:w-8/12 mx-auto py-10 space-y-4">
        <div className="animate-pulse bg-gray-300 dark:bg-gray-700 h-10 w-1/2 rounded mx-auto mb-6"></div>
        <div className="animate-pulse bg-gray-200 dark:bg-gray-800 h-8 rounded"></div>
        <div className="animate-pulse bg-gray-200 dark:bg-gray-800 h-8 rounded"></div>
        <div className="animate-pulse bg-gray-200 dark:bg-gray-800 h-8 rounded"></div>
        <div className="animate-pulse bg-gray-200 dark:bg-gray-800 h-40 rounded"></div>
        <div className="animate-pulse bg-gray-200 dark:bg-gray-800 h-10 w-full rounded mt-4"></div>
      </div>
    );
  }

  // ================= Error State =================
  if (error) {
    return (
      <div className="text-center mt-20 text-red-600 text-xl">
        {error}
        <br />
        <button
          onClick={() => navigate("/dashboard/my-arts")}
          className="btn btn-primary mt-4"
        >
          Back to My Arts
        </button>
      </div>
    );
  }

  // ================= Form Render =================
  return (
    <div className="w-10/12 md:w-8/12 mx-auto py-10 bg-gray-100 dark:bg-gray-900 rounded-xl shadow-lg p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-yellow-50">
        Update Art
      </h2>

      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="input input-bordered w-full bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-yellow-50"
          placeholder="Title"
          required
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="input input-bordered w-full bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-yellow-50"
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
          name="price"
          value={form.price}
          onChange={handleChange}
          type="number"
          className="input input-bordered w-full bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-yellow-50"
          placeholder="Price"
          required
        />

        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          className="input input-bordered w-full bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-yellow-50"
          placeholder="Location"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="textarea textarea-bordered w-full bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-yellow-50"
          placeholder="Description"
        />

        <div className="flex flex-col md:flex-row items-start gap-4">
          <input
            type="file"
            name="imageFile"
            accept="image/*"
            onChange={handleChange}
            className="input input-bordered w-full md:w-1/2 bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-yellow-50"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full md:w-1/2 h-40 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`btn btn-primary w-full ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Updating..." : "Update Art"}
        </button>
      </form>
    </div>
  );
};

export default UpdateArt;

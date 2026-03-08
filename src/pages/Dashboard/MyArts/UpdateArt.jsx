import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";

const UpdateArt = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [art, setArt] = useState({});
  const [form, setForm] = useState({
    title: "",
    category: "Paintings",
    price: "",
    location: "",
    description: "",
    imageFile: null,
    imageUrl: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch art details
  useEffect(() => {
    fetch(`http://localhost:3000/listing/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setArt(data);
        setForm({
          title: data.title || "",
          category: data.category || "Paintings",
          price: data.price || "",
          location: data.location || "",
          description: data.description || "",
          imageFile: null,
          imageUrl: data.image || "",
        });
        setImagePreview(data.image || null);
      });
  }, [id]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setForm({ ...form, imageFile: files[0] });
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Handle update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = form.imageUrl;

      // Upload new image if file selected
      if (form.imageFile) {
        const formData = new FormData();
        formData.append("image", form.imageFile);

        const imgRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host}`,
          formData
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

      const res = await fetch(`http://localhost:3000/listing/${id}`, {
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

  return (
    <div className="w-10/12 md:w-8/12 mx-auto py-10 bg-gray-100 dark:bg-gray-900 rounded-xl shadow-lg p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-yellow-50">
        Update Art
      </h2>

      <form onSubmit={handleUpdate} className="space-y-4">
        {/* Title */}
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="input input-bordered w-full bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-yellow-50"
          placeholder="Title"
          required
        />

        {/* Category */}
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="input input-bordered w-full bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-yellow-50"
        >
          <option value="Paintings">Paintings</option>
          <option value="Sculptures">Sculptures</option>
          <option value="Photography">Photography</option>
          <option value="Digital Art">Digital Art</option>
        </select>

        {/* Price */}
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          type="number"
          className="input input-bordered w-full bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-yellow-50"
          placeholder="Price"
          required
        />

        {/* Location */}
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          className="input input-bordered w-full bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-yellow-50"
          placeholder="Location"
        />

        {/* Description */}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="textarea textarea-bordered w-full bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-yellow-50"
          placeholder="Description"
        />

        {/* Image Upload + Preview */}
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

        {/* Submit */}
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
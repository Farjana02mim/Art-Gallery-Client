import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../components/Card";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SERVER = "https://art-gallery-server-ashen.vercel.app";

const CategoryFilteredProducts = () => {
  const { categoryName } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const decodedCategory = decodeURIComponent(categoryName || "");

  useEffect(() => {
    setLoading(true);

    // ✅ FIX: use /listing API
    const url =
  decodedCategory === "All"
    ? `${SERVER}/listing`
    : `${SERVER}/listing?category=${decodedCategory}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch category items");
        return res.json();
      })
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load category items");
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, [decodedCategory]);

  return (
    <div className="w-11/12 mx-auto my-16">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-3xl font-bold text-center mb-10 text-yellow-400">
        Showing Results for:{" "}
        <span className="text-yellow-200 capitalize">
          {decodedCategory}
        </span>
      </h1>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="w-16 h-16 border-4 border-yellow-400 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : items.length === 0 ? (
        <p className="text-center text-gray-400">
          No products found.
        </p>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item) =>
            item ? (
              <Card
                key={item._id?.toString() || item.id || Math.random()}
                listing={item}
              />
            ) : null
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryFilteredProducts;
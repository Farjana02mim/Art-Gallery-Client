import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import ArtCard from "../../components/ArtCard";

const SERVER = "http://localhost:3000";

const Favorites = () => {
  const [favoriteArts, setFavoriteArts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, token } = useAuth(); 

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user || !token) return;

      try {
        setLoading(true);
        const res = await fetch(`${SERVER}/users/favorites`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch favorites");

        const data = await res.json();
        setFavoriteArts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user, token]);

  if (loading) {
    return <div className="text-center py-10 text-lg font-semibold">Loading favorites...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500 font-semibold">Error: {error}</div>;
  }

  if (favoriteArts.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 font-semibold space-y-4">
        <p>You have no favorite arts yet.</p>
        <Link
          to="/gallery"
          className="text-blue-500 hover:underline"
        >
          Browse the gallery and add some!
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold mb-6 text-center">❤️ My Favorite Arts</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {favoriteArts.map((art) => (
          <ArtCard key={art._id} art={art} />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
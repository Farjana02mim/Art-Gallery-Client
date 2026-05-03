import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const SERVER ="https://art-gallery-server-ashen.vercel.app";

const ArtistDetails = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${SERVER}/artists/${id}`) // backend এ single artist route
      .then((res) => res.json())
      .then((data) => {
        setArtist(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch artist details:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-center mt-16">Loading...</p>;

  if (!artist)
    return <p className="text-center mt-16 text-red-500">Artist not found</p>;

  return (
    <section className="max-w-4xl mx-auto my-16 p-4">
      <Link
        to="/artists"
        className="text-yellow-500 underline mb-4 inline-block"
      >
        ← Back to Artists
      </Link>

      <div className="bg-gray-700 dark:bg-gray-800 p-6 rounded-xl shadow flex flex-col md:flex-row gap-6">
        {/* Image */}
        <img
          src={artist.image || "https://via.placeholder.com/200"}
          alt={artist.name}
          className="w-48 h-48 rounded-full object-cover mx-auto md:mx-0"
        />

        {/* Details */}
        <div className="text-white flex-1">
          <h2 className="text-3xl font-bold mb-2">{artist.name}</h2>
          <p className="text-yellow-500 text-xl mb-2">{artist.title}</p>
          {artist.experience && (
            <p className="mb-2">Experience: {artist.experience} years</p>
          )}
          {artist.portfolio && (
  <p className="mb-2">
    Portfolio:{" "}
    <a
      href={artist.portfolio}
      target="_blank"
      rel="noopener noreferrer"
      className="text-yellow-400 underline break-all"
    >
      {artist.portfolio}
    </a>
  </p>
)}
          {artist.bio && <p className="mt-4">{artist.bio}</p>}
        </div>
      </div>
    </section>
  );
};

export default ArtistDetails;
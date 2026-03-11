import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Artists = () => {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    // API থেকে latest approved artists fetch
    fetch("http://localhost:3000/artists?status=pending") // approved artist
      .then((res) => res.json())
      .then((data) => setArtists(data))
      .catch((err) => console.error("Failed to fetch artists:", err));
  }, []);

  return (
    <section className="max-w-6xl mx-auto my-16 px-4">
      
      {/* Header with Be An Artist button */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-yellow-500 mb-4 md:mb-0">
          Our Artists
        </h2>
        <Link to="/artist">
          <button className="bg-yellow-500 text-black px-6 py-2 rounded-lg hover:bg-yellow-600 transition">
            Be An Artist
          </button>
        </Link>
      </div>

      {/* Artists Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {artists.length > 0 ? (
          artists.map((artist) => (
            <div
              key={artist._id}
              className="bg-gray-700 dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center"
            >
              <img
                src={artist.image || "https://via.placeholder.com/150"}
                alt={artist.name}
                className="w-32 h-32 rounded-full mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-white text-center">
                {artist.name}
              </h3>
              <p className="text-gray-300 text-center mb-4">{artist.title}</p>

              {/* View Details Button */}
              <Link to={`/artists/${artist._id}`}>
  <button className="mt-4 bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 transition w-full">
    View Details
  </button>
</Link>
            </div>
          ))
        ) : (
          <p className="text-gray-400 col-span-full text-center">
            No artists found.
          </p>
        )}
      </div>
    </section>
  );
};

export default Artists;
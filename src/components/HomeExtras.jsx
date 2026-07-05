import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUserFriends } from "react-icons/fa";

const SERVER = "https://art-gallery-server-ashen.vercel.app";

const HomeExtras = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${SERVER}/latest-artists`)
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setArtists(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Failed to load artists:", err);
        setError("Failed to load artists. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="w-11/12 mx-auto py-16 relative">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          Meet Our <span className="text-yellow-500">Artists</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-4 text-sm md:text-base">
          Discover talented artists behind the artworks and explore their
          creative journeys.
        </p>
      </div>

      {/* View All Button */}
      <Link to="/artists">
        <button className="absolute top-6 right-0 md:right-2 bg-yellow-500 text-black px-4 py-2 rounded-full hover:bg-yellow-600 transition-all duration-300 flex items-center gap-2 shadow-lg">
          <FaUserFriends />
          <span className="hidden sm:inline">View All</span>
        </button>
      </Link>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="w-16 h-16 border-4 border-yellow-400 border-dashed rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="text-center py-12">
          <p className="text-red-400 text-sm">{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              setError(null);
              fetch(`${SERVER}/latest-artists`)
                .then((res) => {
                  if (!res.ok) throw new Error(`Server error: ${res.status}`);
                  return res.json();
                })
                .then((data) => setArtists(Array.isArray(data) ? data : []))
                .catch((err) =>
                  setError("Failed to load artists. Please try again later."),
                )
                .finally(() => setLoading(false));
            }}
            className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded-full text-sm hover:bg-yellow-600 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && artists.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">No artists found yet.</p>
        </div>
      )}

      {/* Artist Cards */}
      {!loading && !error && artists.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {artists.map((artist) => (
            <Link
              to={`/artists/${artist._id}`}
              key={artist._id}
              className="group backdrop-blur-lg border rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 shadow-lg
                bg-white border-gray-200 hover:bg-yellow-50
                dark:bg-black dark:border-white/10 dark:hover:bg-white/5 block"
            >
              {/* Avatar */}
              <div className="overflow-hidden rounded-full w-32 h-32 mx-auto mb-4 ring-2 ring-yellow-400/30 group-hover:ring-yellow-500 transition">
                <img
                  src={artist.image || "/placeholder-artist.png"}
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  onError={(e) => {
                    e.target.src = "/placeholder-artist.png";
                  }}
                />
              </div>

              {/* Name */}
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                {artist.name}
              </h3>

              {/* Title */}
              <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                {artist.title}
              </p>

              {/* Experience badge */}
              {artist.experience && (
                <span className="inline-block mt-3 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs rounded-full">
                  {artist.experience}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default HomeExtras;

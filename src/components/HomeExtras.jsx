import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUserFriends } from "react-icons/fa";

// 🔥 backend URL (localhost + vercel support)
const SERVER =
  import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

const HomeExtras = () => {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    fetch(`${SERVER}/latest-artists`)
      .then((res) => res.json())
      .then((data) => setArtists(data))
      .catch((err) => console.error("Failed to load artists", err));
  }, []);

  return (
    <section className="w-11/12 mx-auto py-16 relative">

      {/* 🔥 Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          Meet Our <span className="text-yellow-500">Artists</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-4 text-sm md:text-base">
          Discover talented artists behind the artworks and explore their creative journeys.
        </p>
      </div>

      {/* 🔥 View All Button */}
      <Link to="/artists">
        <button className="absolute top-6 right-0 md:right-2 bg-yellow-500 text-black px-4 py-2 rounded-full hover:bg-yellow-600 transition-all duration-300 flex items-center gap-2 shadow-lg">
          <FaUserFriends />
          <span className="hidden sm:inline">View All</span>
        </button>
      </Link>

      {/* 🔥 Artist Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

        {artists.map((artist) => (
          <div
            key={artist._id}
            className="group backdrop-blur-lg border rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 shadow-lg
            bg-white border-gray-200 hover:bg-white
            dark:bg-black dark:border-white/10 dark:hover:bg-white/8"
          >
            {/* Image */}
            <div className="overflow-hidden rounded-full w-32 h-32 mx-auto mb-4">
              <img
                src={artist.image}
                alt={artist.name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
            </div>

            {/* Name */}
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
              {artist.name}
            </h3>

            {/* Title */}
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
              {artist.title}
            </p>
          </div>
        ))}

      </div>
    </section>
  );
};

export default HomeExtras;
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUserFriends } from "react-icons/fa"; // React Icon

const HomeExtras = () => {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/latest-artists")
      .then(res => res.json())
      .then(data => setArtists(data));
  }, []);

  return (
    <section className="relative text-center my-16">

      {/* Top Right Button */}
      <Link to="/artists">
        <button className="absolute top-0 right-10 bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 transition flex items-center gap-2">
          <FaUserFriends /> ALL
        </button>
      </Link>

      <h2 className="text-3xl font-bold text-yellow-500 mb-6">
        Meet Our Artists
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">

        {artists.map((artist) => (
          <div
            key={artist._id}
            className="bg-gray-700 dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <img
              src={artist.image}
              alt={artist.name}
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 className="text-xl font-semibold text-white">
              {artist.name}
            </h3>
            <p className="text-gray-300">
              {artist.title}
            </p>
          </div>
        ))}

      </div>
    </section>
  );
};

export default HomeExtras;
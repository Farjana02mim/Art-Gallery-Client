import hero1 from "../assets/hero1.jpg";
import hero2 from "../assets/hero2.jpg";
import hero3 from "../assets/hero3.jpg";
import { Link } from "react-router-dom";   // এটা add করতে হবে

const artists = [
  { id: 1, name: "Alice Smith", photo: hero1, title: "Contemporary Artist" },
  { id: 2, name: "Bob Johnson", photo: hero2, title: "Abstract Painter" },
  { id: 3, name: "Cathy Lee", photo: hero3, title: "Digital Illustrator" },
];

const HomeExtras = () => {
  return (
    <section className="relative text-center my-16">
      
      {/* Top Right Button */}
      <Link to="/artist">
        <button className="absolute top-0 right-10 bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 transition">
          Be Artist
        </button>
      </Link>

      <h2 className="text-3xl font-bold text-yellow-500 mb-6">
        Meet Our Artists
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {artists.map((artist) => (
          <div
            key={artist.id}
            className="bg-gray-700 dark:bg-gray-800 backdrop-blur-md p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <img
              src={artist.photo}
              alt={artist.name}
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {artist.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">{artist.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomeExtras;
import { useNavigate } from "react-router-dom";

const SERVER = "http://localhost:3000"; // your backend

const ArtCard = ({ art }) => {
  const navigate = useNavigate();

  // Navigate to listing details without incrementing views
  const handleViewDetails = () => {
    navigate(`/listing-details/${art._id}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700 rounded-xl overflow-hidden transition-colors duration-300">
      <img
        src={art.image || "/placeholder.png"}
        alt={art.title}
        className="h-52 w-full object-cover cursor-pointer transition-transform duration-200 hover:scale-105"
        onClick={handleViewDetails} // just navigate
      />

      <div className="p-4">
        <h3
          className="text-lg font-semibold cursor-pointer text-gray-900 dark:text-yellow-50 transition-colors duration-300"
          onClick={handleViewDetails} // just navigate
        >
          {art.title}
        </h3>

        <p className="text-gray-500 dark:text-gray-300 text-sm mt-1">{art.category}</p>

        <p className="text-green-600 dark:text-green-400 font-bold mt-2">
          ${art.price}
        </p>

        <div className="flex justify-between text-sm mt-2 text-gray-500 dark:text-gray-300">
          <span>👁 {art.views || 0}</span>
          <span>❤️ {art.likes || 0}</span>
          <span>⭐ {art.rating || 0}</span>
        </div>

        <button
          onClick={handleViewDetails}
          className="w-full py-2 mt-3 bg-gradient-to-r from-gray-400 to-blue-100 dark:from-gray-700 dark:to-blue-700 text-black dark:text-yellow-50 font-semibold rounded-lg hover:opacity-90 transition"
        >
          See Details
        </button>
      </div>
    </div>
  );
};

export default ArtCard;
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 p-6">
      <h1 className="text-9xl font-extrabold text-red drop-shadow-lg animate-bounce">
        404
      </h1>
      <h2 className="text-3xl md:text-5xl font-bold mt-4 text-red drop-shadow-md">
        Oops! Page Not Found
      </h2>
      <p className="text-lg md:text-xl text-red mt-2 mb-6 text-center drop-shadow-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-white text-pink-500 font-semibold rounded-lg shadow-lg hover:bg-pink-500 hover:text-white transition-colors duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;

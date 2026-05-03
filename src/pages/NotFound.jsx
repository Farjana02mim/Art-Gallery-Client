import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 transition-colors">
      <h1 className="text-[12rem] md:text-[15rem] font-extrabold text-gray-900 dark:text-gray-100 mb-6 drop-shadow-md animate-fade-in">
        404
      </h1>
      <h2 className="text-3xl md:text-5xl font-bold text-gray-800 dark:text-gray-200 mb-4">
        Oops! Page Not Found!
      </h2>
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 text-center max-w-md mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 hover:from-indigo-700 hover:to-blue-600 transition-transform duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
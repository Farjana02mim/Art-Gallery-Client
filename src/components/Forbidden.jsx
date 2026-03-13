import React from 'react';
import { Link } from 'react-router-dom';
import { FaBan } from 'react-icons/fa';

const Forbidden = () => {
  return (
    <div className="h-[90vh] flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      <FaBan className="text-6xl text-red-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
      <p className="mb-6 text-center max-w-md">
        You do not have permission to view this page. Please contact the administrator if you believe this is a mistake.
      </p>
      <Link 
        to="/" 
        className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default Forbidden;
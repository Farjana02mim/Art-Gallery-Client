import React from "react";
import { Link } from "react-router-dom";

const PaymentCancelled = () => {
  return (
    <div className="min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-red-50 to-gray-100 
      dark:from-gray-900 dark:to-black px-4">

      <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 max-w-md w-full text-center space-y-6">

        {/* Icon */}
        <div className="text-6xl">❌</div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-red-500">
          Payment Cancelled
        </h2>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-400">
          Your payment was cancelled. No charges were made.  
          You can try again anytime.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">

          <Link to="/gallery">
            <button className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
              🔁 Try Again
            </button>
          </Link>

          <Link to="/dashboard/my-purchases">
            <button className="w-full py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-lg">
              🛒 Go to My Purchases
            </button>
          </Link>

        </div>

      </div>
    </div>
  );
};

export default PaymentCancelled;
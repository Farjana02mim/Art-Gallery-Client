import React from "react";
import { FaQuoteLeft, FaStar } from "react-icons/fa";

const ReviewCard = ({ review }) => {
  const {
    userName,
    review: testimonial,
    user_photoURL,
    ratings,
    date,
  } = review;

  return (
    <div className="card max-w-md bg-base-100 shadow-xl p-6">
      <div className="card-body gap-4">
        {/* Quote Icon */}
        <FaQuoteLeft className="text-primary text-3xl" />

        {/* Review Text */}
        <p className="text-base-content/80">{testimonial}</p>

        {/* Ratings */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <FaStar
              key={i}
              className={`text-yellow-400 ${i < Math.round(ratings) ? "" : "opacity-40"}`}
            />
          ))}
          <span className="text-sm text-base-content/50 ml-2">
            {ratings.toFixed(1)}
          </span>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-4 mt-4">
          <div className="avatar">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img src={user_photoURL} alt={userName} />
            </div>
          </div>

          <div>
            <h4 className="font-semibold">{userName}</h4>
            <p className="text-sm text-base-content/60">
              {new Date(date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;

import React from "react";

const MyContainer = ({ className = "", children }) => {
  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
};

export default MyContainer;

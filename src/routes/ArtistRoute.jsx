import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ClimbingBoxLoader } from "react-spinners";
import Forbidden from "../components/Forbidden";
import useRole from "../hooks/useRole";

const ArtistRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const { role, roleLoading } = useRole();
  const location = useLocation();

  if (loading || roleLoading) {
    return (
      <div className="h-[97vh] flex items-center justify-center">
        <ClimbingBoxLoader color="#e74c3c" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (role !== "artist") {
    return <Forbidden />;
  }

  return children;
};

export default ArtistRoute;
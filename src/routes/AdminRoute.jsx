import React, { useContext } from "react";
import { useLocation, Navigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import Forbidden from "../components/Forbidden";
import { ClimbingBoxLoader } from "react-spinners";
import useRole from "../hooks/useRole";

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  const { role, roleLoading } = useRole();

  if (loading || roleLoading) {
    return (
      <div className="h-[97vh] flex items-center justify-center">
        <ClimbingBoxLoader color="#e74c3c" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role !== "admin") {
    return <Forbidden />;
  }

  return children;
};

export default AdminRoute;

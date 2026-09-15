import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { RootState } from "../store";

const ProtectedRoute: React.FC = () => {
  const { accessToken, user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!accessToken || !user) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

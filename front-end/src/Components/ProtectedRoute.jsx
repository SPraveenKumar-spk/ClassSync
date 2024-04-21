import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useAuth } from "../store/auth";

function ProtectedRoute({ component, ...rest }) {
  const { token } = useAuth();

  return token ? (
    <Route {...rest} element={component} />
  ) : (
    <Navigate to="/login" replace />
  );
}

export default ProtectedRoute;

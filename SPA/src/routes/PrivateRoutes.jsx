import { Navigate, Outlet } from "react-router";

import useAuth from "../contexts/auth/auth.hook.jsx";

const PrivateRoute = () => {
  const { signed, user } = useAuth();

  return signed ? (
    user.emailVerified ? (
      <Outlet />
    ) : (
      <Navigate to="/verify" />
    )
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;

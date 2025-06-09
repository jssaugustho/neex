import { Navigate, Outlet } from "react-router";

import useUser from "../hooks/useUser/useUser.jsx";
import useAuth from "../hooks/useAuth/useAuth.jsx";

import PreLoader from "../components/PreLoader/PreLoader.jsx";

const PrivateRoute = () => {
  const { signed, user } = useAuth();

  const { isLoading, isError } = useUser();

  if (isError) return <PreLoader />;

  if (isLoading) return <PreLoader />;

  if (!signed) return <Navigate to="/login" />;

  if (!user.emailVerified) return <Navigate to="/verify" />;

  return <Outlet />;
};

export default PrivateRoute;

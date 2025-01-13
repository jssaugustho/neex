import { Outlet, useLocation } from "react-router";

import { useLayoutEffect, useState } from "react";
import Loader from "../components/Loader/Loader.jsx";

const ComponentLoader = ({ time = 800 }) => {
  const [loading, setLoading] = useState(false);

  const navigation = useLocation();

  useLayoutEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, time);
    return () => clearInterval(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  return <>{loading ? <Loader /> : <Outlet />}</>;
};

export default ComponentLoader;

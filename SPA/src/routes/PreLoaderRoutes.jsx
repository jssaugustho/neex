import { Outlet } from "react-router";
import PreLoader from "../components/PreLoader/PreLoader.jsx";
import { useEffect, useState } from "react";

const PreLoaderRoute = ({ time = 1500, show = true }) => {
  const [showLoader, setShowLoader] = useState(show);

  useEffect(() => {
    setTimeout(() => {
      setShowLoader(false);
    }, time);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Outlet />
      {showLoader ? <PreLoader /> : null}
    </>
  );
};

export default PreLoaderRoute;

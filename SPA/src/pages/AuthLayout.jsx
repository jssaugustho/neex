import { Outlet } from "react-router";
import "./AuthLayout.css";

export default function AuthLayout() {
  return (
    <>
      <div className="auth-container">
        <div>
          <Outlet />
        </div>
        <div className="right">
          <h1 className="title">Faça seu login.</h1>
        </div>
      </div>
    </>
  );
}

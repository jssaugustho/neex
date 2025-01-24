import "./AuthLayout.css";

import { NavLink, Outlet } from "react-router";

import LightLogo from "../../assets/light-theme-logo.png";
import DarkLogo from "../../assets/dark-theme-logo.png";

import useAuth from "../../contexts/auth/auth.hook";
import useTheme from "../../contexts/theme/theme.hook";

import PreLoader from "../../components/PreLoader/PreLoader";

export default function AuthLayout() {
  const { signed, user } = useAuth();
  const { theme } = useTheme();

  return (
    <>
      <div className="flex-row-center">
        {signed && user.emailVerified ? <PreLoader hide={true} /> : null}
        <div className="column align-start-column">
          <div className="mobile-breakpoint-box form-width content-box mid-gap align-left vertical-padding">
            <NavLink to="/login">
              <img
                className="logo"
                src={theme == "light-theme" ? LightLogo : DarkLogo}
                alt="Lux CRM ©"
              />
            </NavLink>
            <div className="content-box">
              <Outlet />
            </div>
          </div>
        </div>
        <div className="column gradient-bg">
          <h1 className="title">Faça seu login.</h1>
        </div>
      </div>
    </>
  );
}

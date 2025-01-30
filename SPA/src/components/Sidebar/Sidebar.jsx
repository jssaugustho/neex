import "./Sidebar.css";

import CtaItem from "./NavItem/CtaItem/CtaItem.jsx";
import NavItem from "./NavItem/NavItem/NavItem.jsx";

import useAuth from "../../contexts/auth/auth.hook.jsx";
import Profile from "./Profile/Profile.jsx";
import LogoutButton from "./LogoutButton/LogoutButton.jsx";

function Sidebar() {
  const { toggleNavBar, setToggleNavBar } = useAuth();

  return (
    <nav className={`sidebar ${toggleNavBar ? "collapse" : ""}`}>
      <Profile />
      <div
        role="button"
        tabIndex={0}
        className="close-button gradient-bg"
        onClick={() => setToggleNavBar((p) => !p)}
        onKeyDown={(e) => {
          if (e.key == "Enter") setToggleNavBar((p) => !p);
        }}
      >
        <div className="content-box close-button-icon-box">
          <i
            className={`fi fi-rr-angle-small-right close-button-icon ${
              !toggleNavBar ? "rotate" : ""
            }`}
          ></i>
        </div>
      </div>
      <ul className="y-nav-section nav-items nav-box">
        <CtaItem icon="fi fi-sr-play" cta={true} marginBottom={true}>
          Passo a Passo
        </CtaItem>
        <NavItem link="/dashboard" icon="fi fi-rr-dashboard">
          Visão Geral
        </NavItem>
        <NavItem link="/leads" icon="fi fi-rr-users">
          Leads
        </NavItem>
        <NavItem link="/campanhas" icon="fi fi-rr-megaphone">
          Campanhas
        </NavItem>
        <NavItem link="/forms" icon="fi fi-rr-form">
          Formulários
        </NavItem>
        <NavItem link="/pages" icon="fi fi-rr-file-user">
          Páginas
        </NavItem>
        <NavItem link="/plan" icon="fi fi-rr-file-invoice-dollar">
          Assinaturas
        </NavItem>
        <NavItem link="/settings" icon="fi fi-rr-settings">
          Preferências
        </NavItem>
      </ul>
      <LogoutButton />
    </nav>
  );
}

export default Sidebar;

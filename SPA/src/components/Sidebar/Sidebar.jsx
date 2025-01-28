import "./Sidebar.css";

import CtaItem from "./NavItem/CtaItem/CtaItem.jsx";
import NavItem from "./NavItem/NavItem/NavItem.jsx";

import useAuth from "../../contexts/auth/auth.hook";

function Sidebar() {
  const { user, signOut, toggleNavBar, setToggleNavBar } = useAuth();

  function handleUserLogout(e) {
    e.preventDefault();
    signOut();
  }

  return (
    <nav className={`sidebar ${toggleNavBar ? "collapse" : ""}`}>
      <div
        role="button"
        tabIndex={0}
        className="close-button gradient-bg"
        onClick={() => setToggleNavBar((p) => !p)}
      >
        <div className="content-box close-button-icon-box">
          <i
            className={`fi fi-rr-angle-small-right close-button-icon ${
              !toggleNavBar ? "rotate" : ""
            }`}
          ></i>
        </div>
      </div>
      <div
        className={`small-horizontal-padding profile-box ${
          toggleNavBar ? "hide-nav-item" : ""
        }`}
      >
        <div className={`inline-flex-center small-gap profile`}>
          <div className="box">
            <div className="content-box mid-profile-image">
              <i className="fi fi-ss-user user-icon"></i>
            </div>
          </div>
          <div className={`content-box profile-data micro-gap`}>
            <div className="paragraph ellipsis-text profile-name">
              {user.name}
            </div>
            <div className="paragraph ellipsis-text profile-email">
              {user.email}
            </div>
          </div>
        </div>
      </div>
      <ul className="y-nav-section nav-items nav-box">
        <CtaItem icon="fi fi-sr-play" cta={true}>
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
        <NavItem link="/settings" icon="fi fi-rr-settings">
          Configurações
        </NavItem>
      </ul>
      <div className={`content-box logout-box`}>
        <div
          role="button"
          tabIndex={0}
          onClick={handleUserLogout}
          className={`flex-row-center small-gap logout-button ${
            toggleNavBar ? "hide-nav-link" : ""
          }`}
        >
          <div className="content-box mid-icon-box gradient-bg">
            <i className="fi fi-rr-sign-out-alt logout-icon"></i>
          </div>
          <div className={`flex-row-center ${toggleNavBar ? "hide" : ""}`}>
            <p className="paragraph logout-text">Sair</p>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Sidebar;

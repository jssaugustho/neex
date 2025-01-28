import "./Sidebar.css";

import useAuth from "../../contexts/auth/auth.hook";
import NavItem from "./NavItem/NavItem";

function Sidebar() {
  const { user, signOut } = useAuth();

  function handleUserLogout(e) {
    e.preventDefault();
    signOut();
  }

  return (
    <nav className="sidebar ">
      <div className="close-button gradient-bg"></div>
      <div className="small-horizontal-padding profile-box">
        <div className="inline-flex-center small-gap profile">
          <div className="box">
            <div className="content-box mid-profile-image">
              <i className="fi fi-ss-user user-icon"></i>
            </div>
          </div>
          <div className=" content-box profile-data micro-gap">
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
        <NavItem icon="fi fi-sr-play" cta={true}>
          Passo a Passo
        </NavItem>
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
        <NavItem
          link="/settings"
          icon="fi fi-rr-settings"
          subLinks={[
            {
              title: "Geral",
              link: "/settings/geral",
            },
            {
              title: "Notificações",
              link: "/settings/notify",
            },
          ]}
        >
          Configurações
        </NavItem>
      </ul>
      <div className="content-box logout-box">
        <div
          role="button"
          tabIndex={0}
          onClick={handleUserLogout}
          className="flex-row-center small-gap logout-button"
        >
          <div className="content-box mid-icon-box gradient-bg">
            <i className="fi fi-rr-sign-out-alt logout-icon"></i>
          </div>
          <div className="flex-row-center" role="button" tabIndex={0}>
            Sair
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Sidebar;

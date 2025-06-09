import "./LogoutButton.css";

import useAuth from "../../../hooks/useAuth/useAuth.jsx";

function LogoutButton() {
  const { signOut, toggleNavBar } = useAuth();

  function handleUserLogout(e) {
    e.preventDefault();
    signOut();
  }

  return (
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
  );
}

export default LogoutButton;

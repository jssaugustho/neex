import useAuth from "../../../contexts/auth/auth.hook";

import "./Profile.css";

function Profile() {
  const { user, toggleNavBar } = useAuth();

  return (
    <div
      className={`small-horizontal-padding profile-box ${
        toggleNavBar ? "hide-nav-item" : ""
      }`}
    >
      <div className={`inline-flex-center small-gap profile`}>
        <div className="box">
          <div
            role="button"
            tabIndex={0}
            className="content-box mid-profile-image"
          >
            <i className="fi fi-ss-user user-icon"></i>
          </div>
        </div>
        <div className={`content-box profile-data micro-gap`}>
          <div role="button" className="paragraph ellipsis-text profile-name">
            {user.name}
          </div>
          <div role="button" className="paragraph ellipsis-text profile-email">
            {user.email}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

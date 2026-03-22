import React from "react";
import "../styles/Chat.css";

const UserProfile = ({ user }) => {
  return (
    <div className="profile-bar">
      <div className="profile-left">
        <div className="profile-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h3>{user.name}</h3>
          <span>{user.email}</span>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;


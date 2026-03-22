import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SidebarSettings = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  return (
    <div className="sidebar-settings" ref={dropdownRef}>
      <i
        className="fas fa-cog"
        onClick={() => setOpen(!open)}
        title="Settings"
      ></i>

      {open && (
        <div className="settings-dropdown-bottom">
          <div onClick={handleProfile}>
            <i className="fas fa-user"></i> Profile
          </div>
          <div onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarSettings;

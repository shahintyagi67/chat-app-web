import React, { useState } from "react";
import "../styles/ProfilePage.css";
import API from "../services/api";

const ProfilePage = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(storedUser);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(storedUser?.name || "");
  const [email, setEmail] = useState(storedUser?.email || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!name.trim() || !email.trim()) {
      alert("All fields required");
      return;
    }

    try {
      setLoading(true);

      const res = await API.put(`/customer/update/${user._id}`, {
        name,
        email,
      });

      const updatedUser = res.data.data;

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      console.log(err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">

        <div className="profile-avatar-large">
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <h2 className="profile-name">
          {isEditing ? (
            <input
              className="profile-edit-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          ) : (
            user?.name
          )}
        </h2>

        <p className="profile-email">
          {isEditing ? (
            <input
              className="profile-edit-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          ) : (
            user?.email
          )}
        </p>

        <div className="profile-info-box">
          <div className="profile-info-row">
            <span>Name</span>
            <span>{user?.name}</span>
          </div>
          <div className="profile-info-row">
            <span>Email</span>
            <span>{user?.email}</span>
          </div>
        </div>

        <div className="profile-buttons">
          {isEditing ? (
            <>
              <button
                className="profile-edit-btn"
                onClick={handleUpdate}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>

              <button
                className="profile-logout-btn"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              className="profile-edit-btn"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;


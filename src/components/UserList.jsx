import React from "react";
import "../styles/Chat.css";

const UserList = ({ users, onlineUsers, selectedUser, setSelectedUser }) => {
  return (
    <div className="user-list-panel">
      {users.map((u) => (
        <div
          key={u._id}
          className={`user-item ${selectedUser?._id === u._id ? "active" : ""}`}
          onClick={() => setSelectedUser(u)}
        >
          <i className="fas fa-user-circle user-avatar"></i>
          <div className="user-info">
            <p className="user-name">{u.name}</p>
            <span className="user-last">Click to chat</span>
          </div>
          {onlineUsers.includes(u._id) && <span className="online-dot"></span>}
        </div>
      ))}
    </div>
  );
};

export default UserList;

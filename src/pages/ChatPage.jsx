import React, { useEffect, useState } from "react";
import API from "../services/api";
import { socket } from "../socket";

import UserProfile from "../components/UserProfile";
import UserList from "../components/UserList";
import ChatWindow from "../components/ChatWindow";

import "../styles/Chat.css";
import SidebarSettings from "../components/SidebarSettings";

const ChatPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState({});
  

  

useEffect(() => {
  const loadUsers = async () => {
    try {
      const res = await API.get("/customer/users");
      setUsers(res.data.data.filter(u => u._id !== user._id));
    } catch (err) {
      console.log("Users fetch error:", err.response?.data);
    }
  };
  loadUsers();
}, [user._id]);


useEffect(() => {
  const fetchConversations = async () => {
    try {
      const res = await API.get(`/message/all/${user._id}`);
      setMessages(res.data.data);
    } catch (err) {
      console.log("Conversation fetch error:", err.response?.data);
    }
  };
  fetchConversations();
}, [user._id]);



  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      socket.emit("user-online", user._id);
    });

    socket.on("online-users", (ids) => setOnlineUsers(ids));

    socket.on("receive-message", (msg) => {
      setMessages(prev => {
        const senderId = msg.senderId;
        const currentMessages = prev[senderId] || [];
        return { ...prev, [senderId]: [...currentMessages, msg] };
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [user._id]);

    if (!token || !user) {
    return null; 
  }


  return (
    <div className="chat-page">
      <div className="chat-layout">
        {/* LEFT SIDEBAR */}
        {/* <div className="chat-left">
          <UserProfile user={user} />
          <UserList
            users={users}
            onlineUsers={onlineUsers}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />
        </div> */}
        {/* <div className="chat-left">
  <UserProfile user={user} />
  <UserList
    users={users}
    onlineUsers={onlineUsers}
    selectedUser={selectedUser}
    setSelectedUser={setSelectedUser}
  />


  <div className="sidebar-bottom">
    <UserProfile user={user} />
  </div>
</div> */}
<div className="chat-left">
  <UserProfile user={user} />

  <UserList
    users={users}
    onlineUsers={onlineUsers}
    selectedUser={selectedUser}
    setSelectedUser={setSelectedUser}
  />
  
  <SidebarSettings />
</div>



        {/* RIGHT CHAT */}
        <div className="chat-right">
          <ChatWindow
            user={user}
            selectedUser={selectedUser}
            messages={messages[selectedUser?._id] || []}
            setMessages={setMessages}
             onlineUsers={onlineUsers} 
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

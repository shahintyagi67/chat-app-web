import { useState, useRef, useEffect } from "react";
import { socket } from "../socket";
import "../styles/Chat.css";
import EmojiPicker from "emoji-picker-react";
import API from "../services/api";

const ChatWindow = ({
  user,
  selectedUser,
  messages,
  setMessages,
  onlineUsers,
}) => {
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);
  const [showEmoji, setShowEmoji] = useState(false);
   const emojiRef = useRef(null); // 👈 NEW

  // 👇 Close picker on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setShowEmoji(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
     setShowEmoji(false);
  };

  const sendMessage = () => {
    if (!selectedUser || !text.trim()) return;

    const newMsg = { senderId: user._id, message: text };

    socket.emit("send-message", {
      senderId: user._id,
      receiverId: selectedUser._id,
      message: text,
    });

    setMessages((prev) => {
      const current = prev[selectedUser._id] || [];
      return { ...prev, [selectedUser._id]: [...current, newMsg] };
    });

    setText("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedUser) {
    return <div className="chat-empty">Select a chat to start messaging</div>;
  }

  const deleteMessage = async (messageId) => {
    try {
      await API.delete(`/message/delete/${messageId}`);

      setMessages((prev) => {
        const updated = prev[selectedUser._id].filter(
          (msg) => msg._id !== messageId,
        );
        return { ...prev, [selectedUser._id]: updated };
      });
    } catch (err) {
      console.log("Delete error:", err.response?.data);
    }
  };

  return (
    <div className="chat-window">
      {/* HEADER */}
      <div className="chat-header">
        <div className="chat-header-left">
          <i className="fas fa-user-circle chat-user-icon"></i>
          <div>
            <h4>{selectedUser.name}</h4>

            <span
              className={`chat-status ${onlineUsers.includes(selectedUser._id) ? "online" : "offline"}`}
            >
              {onlineUsers.includes(selectedUser._id) ? "online" : "offline"}
            </span>
          </div>
        </div>
      </div>

      {/* MESSAGES */}
      {/* <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={m.senderId === user._id ? "msg me" : "msg"}>
            {m.message}
          </div>
          
          
        ))}
        <div ref={messagesEndRef} />
      </div> */}

      {/* MESSAGES */}
      <div className="chat-messages">
        {messages.map((m) => (
          <div
            key={m._id}
            className={m.senderId === user._id ? "msg me" : "msg"}
          >
            <span className="msg-text">{m.message}</span>

            {m.senderId === user._id && m._id && (
              <span className="delete-btn" onClick={() => deleteMessage(m._id)}>
                <i className="fas fa-trash"></i>
              </span>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="chat-input">
        <i className="fas fa-paperclip"></i>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        {/* <i className="far fa-smile"></i> */}
      <div className="emoji-container" ref={emojiRef}>
          <i
            className="far fa-smile"
            onClick={() => setShowEmoji((prev) => !prev)}
            style={{ cursor: "pointer" }}
          ></i>
          {showEmoji && (
            <div className="emoji-picker">
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                theme="dark"
                width={300}
                height={400}
              />
            </div>
          )}
        </div>

        <button onClick={sendMessage}>
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;

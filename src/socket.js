import { io } from "socket.io-client";

// export const socket = io("http://localhost:5000", {
export const socket = io("https://chat-app-api-twy4.onrender.com", {
  autoConnect: false,
  transports: ["websocket"],
});



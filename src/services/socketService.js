import { io } from "socket.io-client";

const SOCKET_URL = process.env.GATSBY_SOCKET_URL || "http://localhost:3000";

const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket"],
});

export default socket;

import { createContext, useState, useEffect } from "react";
import { useWebSocket } from "../hook/useWebSocket";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const socket = useWebSocket();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.on("users-update", (updatedUsers) => {
        setUsers(updatedUsers);
      });
    }
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, users }}>
      {children}
    </SocketContext.Provider>
  );
};

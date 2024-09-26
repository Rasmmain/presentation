import { createContext, useContext } from "react";
import useWebSocket from "../hook/useWebSocket";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socket = useWebSocket("http://localhost:5000");

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === null) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

import { useEffect, useRef, useCallback } from "react";
import io from "socket.io-client";

const useWebSocket = (url) => {
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io(url);

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [url]);

  const emit = useCallback((eventName, data) => {
    if (socket.current) {
      socket.current.emit(eventName, data);
    }
  }, []);

  const on = useCallback((eventName, callback) => {
    if (socket.current) {
      socket.current.on(eventName, callback);
    }
  }, []);

  const off = useCallback((eventName, callback) => {
    if (socket.current) {
      socket.current.off(eventName, callback);
    }
  }, []);

  return { emit, on, off };
};

export default useWebSocket;

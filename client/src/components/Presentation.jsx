import { useState, useContext } from "react";
import ToolPanel from "./ToolPanel";
import Slide from "./Slide";
import UserList from "./UserList";
import { SocketContext } from "../contexts/SocketContext";

const Presentation = () => {
  const { socket } = useContext(SocketContext);
  const [currentSlide, setCurrentSlide] = useState(null);

  return (
    <div className="h-screen flex">
      <div className="w-1/5 bg-gray-100 p-4">
        <SlideThumbnails setCurrentSlide={setCurrentSlide} />
      </div>

      <div className="w-3/5 p-4">
        <ToolPanel socket={socket} />
        <Slide slide={currentSlide} />
      </div>

      <div className="w-1/5 bg-gray-100 p-4">
        <UserList socket={socket} />
      </div>
    </div>
  );
};

export default Presentation;

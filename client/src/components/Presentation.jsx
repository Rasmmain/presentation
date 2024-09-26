import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Slide from "./Slide";
import UserList from "./UserList";
import ToolPanel from "./ToolPanel";
import { useSocket } from "../contexts/SocketContext";

const Presentation = ({ nickname }) => {
  const { id } = useParams();
  const [presentation, setPresentation] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [userRole, setUserRole] = useState("viewer");
  const socket = useSocket();

  console.log(id);

  useEffect(() => {
    fetch(`http://localhost:5000/api/presentations/${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        setPresentation(data);
        setUserRole(data.creator === nickname ? "creator" : "viewer");
      });

    socket.emit("joinPresentation", { presentationId: id, nickname });

    // Listen for updates
    socket.on("slideUpdate", (updatedSlide) => {
      setPresentation((prev) => ({
        ...prev,
        slides: prev.slides.map((slide) =>
          slide.id === updatedSlide.id ? updatedSlide : slide
        ),
      }));
    });

    socket.on("roleUpdate", ({ user, newRole }) => {
      if (user === nickname) {
        setUserRole(newRole);
      }
    });

    return () => {
      socket.off("slideUpdate");
      socket.off("roleUpdate");
      socket.emit("leavePresentation", { presentationId: id, nickname });
    };
  }, [id, nickname, socket]);

  const addSlide = () => {
    if (userRole === "creator") {
      const newSlide = { id: Date.now(), content: [] };
      setPresentation((prev) => ({
        ...prev,
        slides: [...prev.slides, newSlide],
      }));
      socket.emit("addSlide", { presentationId: id, slide: newSlide });
    }
  };

  const removeSlide = (slideId) => {
    if (userRole === "creator") {
      setPresentation((prev) => ({
        ...prev,
        slides: prev.slides.filter((slide) => slide.id !== slideId),
      }));
      socket.emit("removeSlide", { presentationId: id, slideId });
    }
  };

  if (!presentation) return <div>Loading...</div>;

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-200 p-4 overflow-y-auto">
        {presentation?.slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`p-2 mb-2 cursor-pointer ${
              index === currentSlide ? "bg-blue-200" : "bg-white"
            }`}
            onClick={() => setCurrentSlide(index)}
          >
            Slide {index + 1}
            {userRole === "creator" && (
              <button
                onClick={() => removeSlide(slide.id)}
                className="ml-2 text-red-500"
              >
                X
              </button>
            )}
          </div>
        ))}
        {userRole === "creator" && (
          <button
            onClick={addSlide}
            className="w-full bg-green-500 text-white p-2 rounded mt-2"
          >
            Add Slide
          </button>
        )}
      </div>
      <div className="flex-grow">
        <ToolPanel userRole={userRole} />
        <Slide
          slide={presentation?.slides[currentSlide]}
          userRole={userRole}
          socket={socket}
          presentationId={id}
        />
      </div>
      <UserList
        presentationId={id}
        currentUser={nickname}
        userRole={userRole}
      />
    </div>
  );
};

export default Presentation;

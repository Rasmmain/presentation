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
  const [users, setUsers] = useState([]);
  const socket = useSocket();
  const [tool, setTool] = useState("text");
  const [color, setColor] = useState("#000000");
  const [currentText, setCurrentText] = useState("");
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleSelectTool = (selectedTool) => {
    setTool(selectedTool);
  };

  const handleSetColor = (selectedColor) => {
    setColor(selectedColor);
  };

  const handleZoomIn = () => {
    setZoomLevel((prevZoom) => prevZoom * 1.1);
  };

  const handleZoomOut = () => {
    setZoomLevel((prevZoom) => prevZoom / 1.1);
  };

  useEffect(() => {
    // Fetch presentation data
    fetch(`http://localhost:5000/api/presentations/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setPresentation(data);
        setUserRole(data.creator === nickname ? "creator" : "viewer");
      });

    socket.emit("joinPresentation", { presentationId: id, nickname });

    // Listen for updates
    socket.on("slideUpdate", handleSlideUpdate);
    socket.on("newSlide", handleNewSlide);
    socket.on("slideRemoved", handleSlideRemoved);
    socket.on("userJoined", handleUserJoined);
    socket.on("userLeft", handleUserLeft);
    socket.on("roleUpdate", handleRoleUpdate);

    return () => {
      socket.off("slideUpdate", handleSlideUpdate);
      socket.off("newSlide", handleNewSlide);
      socket.off("slideRemoved", handleSlideRemoved);
      socket.off("userJoined", handleUserJoined);
      socket.off("userLeft", handleUserLeft);
      socket.off("roleUpdate", handleRoleUpdate);
      socket.emit("leavePresentation", { presentationId: id, nickname });
    };
  }, [id, nickname, socket]);

  const handleSlideUpdate = (updatedSlide) => {
    setPresentation((prev) => ({
      ...prev,
      slides: prev.slides.map((slide) =>
        slide.id === updatedSlide.id ? updatedSlide : slide
      ),
    }));
  };

  const handleNewSlide = (newSlide) => {
    setPresentation((prev) => ({
      ...prev,
      slides: [...prev.slides, newSlide],
    }));
  };

  const handleSlideRemoved = (slideId) => {
    setPresentation((prev) => ({
      ...prev,
      slides: prev.slides.filter((slide) => slide.id !== slideId),
    }));
    if (currentSlide >= presentation.slides.length - 1) {
      setCurrentSlide((prev) => Math.max(0, prev - 1));
    }
  };

  const handleUserJoined = (user) => {
    setUsers((prev) => [...prev, user]);
  };

  const handleUserLeft = (nickname) => {
    setUsers((prev) => prev.filter((user) => user.nickname !== nickname));
  };

  const handleRoleUpdate = ({ user, newRole }) => {
    if (user === nickname) {
      setUserRole(newRole);
    }
    setUsers((prev) =>
      prev.map((u) => (u.nickname === user ? { ...u, role: newRole } : u))
    );
  };

  const addSlide = () => {
    if (userRole === "creator") {
      const newSlide = { id: Date.now(), content: [] };
      socket.emit("addSlide", { presentationId: id, slide: newSlide });
      setPresentation((prev) => ({
        ...prev,
        slides: [...(prev.slides || []), newSlide],
      }));
    }
  };

  useEffect(() => {
    if (
      presentation &&
      presentation.slides.length === 0 &&
      userRole === "creator"
    ) {
      addSlide();
    }
  }, [presentation, userRole]);

  const removeSlide = (slideId) => {
    if (userRole === "creator") {
      socket.emit("removeSlide", { presentationId: id, slideId });

      setPresentation((prev) => ({
        ...prev,
        slides: prev.slides.filter((slide) => slide.id !== slideId),
      }));
    }
  };

  const updateSlide = (slideId, content) => {
    if (userRole === "creator" || userRole === "editor") {
      socket.emit("updateSlide", { presentationId: id, slideId, content });
    }
  };

  const updateUserRole = (userNickname, newRole) => {
    if (userRole === "creator") {
      socket.emit("updateUserRole", {
        presentationId: id,
        nickname: userNickname,
        newRole,
      });
    }
  };

  const addTextBlock = () => {
    if (userRole === "creator" || userRole === "editor") {
      console.log(presentation);

      if (
        presentation.slides.length > 0 &&
        currentSlide >= 0 &&
        currentSlide < presentation.slides.length
      ) {
        const slide = presentation.slides[currentSlide];
        const newContent = [
          ...(slide.content || []),
          { id: Date.now(), type: "text", text: "New text block" },
        ];

        updateSlide(slide.id, newContent);
      } else {
        console.error(
          "No slides available or invalid currentSlide index. Please add a slide first."
        );
      }
    }
  };

  if (!presentation) return <div>Loading...</div>;

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-200 p-4 overflow-y-auto">
        {presentation.slides.map((slide, index) => (
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
      <div className="flex-grow flex flex-col">
        <ToolPanel
          userRole={userRole}
          onAddTextBlock={addTextBlock}
          onSelectTool={handleSelectTool}
          onSetColor={handleSetColor}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onTextInputChange={setCurrentText}
        />
        <div className="flex-grow overflow-auto">
          <Slide
            slide={presentation.slides[currentSlide]}
            userRole={userRole}
            onUpdateSlide={updateSlide}
            zoomLevel={zoomLevel}
          />
        </div>
      </div>
      <UserList
        users={users}
        currentUser={nickname}
        userRole={userRole}
        onUpdateUserRole={updateUserRole}
      />
    </div>
  );
};

export default Presentation;

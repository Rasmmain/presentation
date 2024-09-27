import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const Slide = ({ slide, userRole, onUpdateSlide }) => {
  const canvasRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [currentText, setCurrentText] = useState("");
  const [tool, setTool] = useState("text");
  const [color, setColor] = useState("#000000");
  const [isTyping, setIsTyping] = useState(false);
  const [typingPosition, setTypingPosition] = useState({ x: 100, y: 100 });
  const { id } = useParams();


  const BACKEND_URL = "http://localhost:5000/api";


  const addTextBlock = async (x, y, text) => {
    if (userRole === "creator" || userRole === "editor") {
      const newContent = [
        ...(slide.content || []),
        { id: Date.now(), type: "text", text, x, y, color },
      ];


      const response = await fetch(
        `${BACKEND_URL}/presentations/${id}/slides/${slide.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            presentation_id: id,
            slide_order: 1,
            content: newContent,
          }),
        }
      );

      if (response.ok) {
        onUpdateSlide(slide.id, newContent); 
      } else {
        console.error("Failed to update slide content in the backend.");
      }

      setCurrentText("");
    } else {
      console.error("Only creators or editors can add content.");
    }
  };

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoomLevel;
    const y = (e.clientY - rect.top) / zoomLevel;

    if (tool === "text") {
      setTypingPosition({ x, y });
      setIsTyping(true);
    }
  };

  const handleKeyDown = (e) => {
    if (isTyping && e.key === "Enter" && currentText.trim() !== "") {
      const { x, y } = typingPosition;
      addTextBlock(x, y, currentText);
      setCurrentText("");
    }
  };


  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    ctx.scale(zoomLevel, zoomLevel); 

    slide?.content?.forEach((item) => {
      if (item.type === "text") {
        ctx.font = "16px Arial";
        ctx.fillStyle = item.color;
        ctx.fillText(item.text, item.x, item.y);
      }
    });
  }, [slide, zoomLevel]);

  
  useEffect(() => {
    if (isTyping) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isTyping, currentText]);

  return (
    <div className="relative flex-grow">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="border"
        onClick={handleCanvasClick}
        style={{ transform: `scale(${zoomLevel})` }}
      />

      {isTyping && (
        <input
          type="text"
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value)}
          className="absolute"
          style={{
            top: typingPosition.y * zoomLevel,
            left: typingPosition.x * zoomLevel,
            outline: "none",
            fontSize: "16px",
          }}
          placeholder="Type and press Enter..."
          autoFocus
        />
      )}
    </div>
  );
};

export default Slide;

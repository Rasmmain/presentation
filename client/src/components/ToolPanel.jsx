// import { PlusCircle, Type, Image, Square } from "lucide-react";
import { useState } from "react";

const ToolPanel = ({
  userRole,
  onAddTextBlock,
  onSelectTool,
  onSetColor,
  onZoomIn,
  onZoomOut,
  onTextInputChange,
}) => {
  if (userRole === "viewer") return null;

  const [selectedTool, setSelectedTool] = useState("text");
  const [selectedColor, setSelectedColor] = useState("#000000");

  const tools = ["text", "rectangle", "circle", "arrow", "eraser"];

  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
    onSelectTool(tool);
  };

  const handleColorChange = (e) => {
    const color = e.target.value;
    setSelectedColor(color);
    onSetColor(color);
  };

  return (
    <div className="bg-gray-200 p-2 flex justify-between items-center">
      {userRole === "creator" || userRole === "editor" ? (
        <>
          <div className="flex space-x-4">
            {tools.map((tool) => (
              <button
                key={tool}
                className={`p-2 rounded ${
                  selectedTool === tool ? "bg-blue-500 text-white" : "bg-white"
                }`}
                onClick={() => handleToolSelect(tool)}
              >
                {tool.charAt(0).toUpperCase() + tool.slice(1)}
              </button>
            ))}
          </div>

          <div className="ml-4">
            <label htmlFor="colorPicker" className="mr-2">
              Color:
            </label>
            <input
              id="colorPicker"
              type="color"
              value={selectedColor}
              onChange={handleColorChange}
            />
          </div>

          <div className="ml-4 flex space-x-2">
            <button
              className="bg-green-500 text-white p-2 rounded"
              onClick={onZoomIn}
            >
              Zoom In
            </button>
            <button
              className="bg-red-500 text-white p-2 rounded"
              onClick={onZoomOut}
            >
              Zoom Out
            </button>
          </div>

          <div className="ml-4">
            <button
              className="bg-purple-500 text-white p-2 rounded"
              onClick={onAddTextBlock}
            >
              Add Text Block
            </button>
          </div>

          {selectedTool === "text" && (
            <div className="ml-4">
              <input
                type="text"
                placeholder="Write text here"
                className="border p-2"
                onChange={(e) => onTextInputChange(e.target.value)}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-gray-500">You are a Viewer</div>
      )}
    </div>
  );
};

export default ToolPanel;

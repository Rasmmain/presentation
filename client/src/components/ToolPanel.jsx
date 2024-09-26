import { PlusCircle, Type, Image, Square } from "lucide-react";

const ToolPanel = ({ userRole, onAddTextBlock, onAddImage, onAddShape }) => {
  if (userRole === "viewer") return null;

  return (
    <div className="bg-gray-100 p-2 flex space-x-2">
      <button
        onClick={onAddTextBlock}
        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        title="Add Text"
      >
        <Type size={20} />
      </button>
      <button
        onClick={onAddImage}
        className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
        title="Add Image"
      >
        <Image size={20} />
      </button>
      <button
        onClick={onAddShape}
        className="p-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        title="Add Shape"
      >
        <Square size={20} />
      </button>
    </div>
  );
};

export default ToolPanel;

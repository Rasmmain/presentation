

const ToolPanel = ({ socket }) => {
  const handleToolClick = (tool) => {
    socket.emit("tool-selected", tool);
  };

  return (
    <div className="flex justify-between items-center p-2 bg-gray-200 shadow">
      <button className="btn" onClick={() => handleToolClick("pen")}>
        Pen
      </button>
      <button className="btn" onClick={() => handleToolClick("rectangle")}>
        Rectangle
      </button>
      <button className="btn" onClick={() => handleToolClick("text")}>
        Text Block
      </button>
    </div>
  );
};

export default ToolPanel;

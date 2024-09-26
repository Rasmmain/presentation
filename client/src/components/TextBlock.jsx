import  { useState } from "react";
import ReactMarkdown from "react-markdown";

const TextBlock = ({ id, content, isEditable, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(content);

  const handleDoubleClick = () => {
    if (isEditable) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    onUpdate(id, text);
  };

  if (isEditing) {
    return (
      <textarea
        className="w-full p-2 border rounded"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
        autoFocus
      />
    );
  }

  return (
    <div onDoubleClick={handleDoubleClick} className="p-2">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default TextBlock;

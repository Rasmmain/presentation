import{ useState } from "react";
import ReactMarkdown from "react-markdown";

const TextBlock = ({ text, position, onTextChange }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div
      style={{ left: position.x, top: position.y }}
      className="absolute border p-2"
      onDoubleClick={() => setIsEditing(true)}
    >
      {isEditing ? (
        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          onBlur={() => setIsEditing(false)}
        />
      ) : (
        <ReactMarkdown>{text}</ReactMarkdown>
      )}
    </div>
  );
};

export default TextBlock;

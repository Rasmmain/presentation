import TextBlock from "./TextBlock";

const Slide = ({ slide, userRole, onUpdateSlide }) => {
  const handleTextBlockUpdate = (blockId, newContent) => {
    const updatedContent = slide.content.map((block) =>
      block.id === blockId ? { ...block, text: newContent } : block
    );
    onUpdateSlide(slide.id, updatedContent);
  };

  return (
    <div className="w-full h-full bg-white shadow-lg">
      {slide?.content.map((block) => {
        switch (block.type) {
          case "text":
            return (
              <TextBlock
                key={block.id}
                id={block.id}
                content={block.text}
                isEditable={userRole === "creator" || userRole === "editor"}
                onUpdate={handleTextBlockUpdate}
              />
            );

          default:
            return null;
        }
      })}
    </div>
  );
};

export default Slide;

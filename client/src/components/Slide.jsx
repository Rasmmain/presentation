import { useEffect, useRef } from "react";

const Slide = ({ slide }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      drawContent(context, slide);
    }
  }, [slide]);

  const drawContent = (context, slide) => {
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    slide?.elements.forEach((element) => {
      console.log(element);
    });
  };

  return (
    <canvas
      ref={canvasRef}
      className="border w-full h-full"
      width="800"
      height="600"
    ></canvas>
  );
};

export default Slide;

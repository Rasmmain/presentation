import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PresentationList = () => {
  const [presentations, setPresentations] = useState([]);

  useEffect(() => {
    fetch("/api/presentations")
      .then((res) => res.json())
      .then((data) => setPresentations(data));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Presentations</h1>
      <div className="grid grid-cols-3 gap-4">
        {presentations.map((presentation) => (
          <Link
            key={presentation.id}
            to={`/presentation/${presentation.id}`}
            className="border rounded p-4 shadow hover:bg-gray-50"
          >
            <img
              src={presentation.thumbnailUrl}
              alt={presentation.name}
              className="w-full h-40 object-cover"
            />
            <h2 className="text-lg font-semibold mt-2">{presentation.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PresentationList;

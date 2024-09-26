import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSocket } from "../contexts/SocketContext";
import Modal from "./Modal";

const PresentationList = ({ nickname }) => {
  const [presentations, setPresentations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const fetchPresentations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/presentations"
        );
        setPresentations(response.data);
      } catch (error) {
        console.log(error);

        // setPresentations(response.data);
      }
    };

    fetchPresentations();
  }, []);

  const socket = useSocket();

  const handleSlideUpdate = () => {
    console.log("handleSlideUpdate");
  };

  const handleUserJoined = () => {
    console.log("handleUserJoined");
  };

  useEffect(() => {
    socket.on("slideUpdate", handleSlideUpdate);
    socket.on("userJoined", handleUserJoined);

    return () => {
      socket.off("slideUpdate", handleSlideUpdate);
      socket.off("userJoined", handleUserJoined);
    };
  }, [socket]);

  const createPresentation = () => {
    fetch("http://localhost:5000/api/presentations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creator: nickname, title }),
    })
      .then((response) => response.json())
      .then((newPresentation) => {
        setPresentations((prevPresentations) => [
          ...prevPresentations,
          newPresentation,
        ]);
        setShowModal(false);
        setTitle("");
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl mb-4">Presentations</h1>
      <button
        onClick={() => setShowModal(true)}
        className="mb-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Create New Presentation
      </button>

      {/* Modal */}
      {showModal && (
        <Modal
          title={title}
          setTitle={setTitle}
          createPresentation={createPresentation}
          closeModal={() => setShowModal(false)}
        />
      )}

      <ul className="space-y-2">
        {presentations.map((presentation) => {
          console.log(presentation);

          return (
            <li key={presentation.id} className="bg-white p-4 rounded shadow">
              <Link
                to={`/presentation/${presentation.id}`}
                className="text-blue-500 hover:underline"
              >
                {presentation.title ||
                  `Untitled Presentation ${presentation.id}`}
              </Link>
              <p className="text-sm text-gray-500">
                Created by: {presentation.creator}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PresentationList;

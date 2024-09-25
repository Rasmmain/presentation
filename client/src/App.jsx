import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PresentationList from "./components/PresentationList";
import Presentation from "./components/Presentation";
import { SocketProvider } from "./contexts/SocketContext";

const App = () => {
  const [nickname, setNickname] = useState("");

  const handleNicknameSubmit = (event) => {
    event.preventDefault();
    setNickname(event.target.nickname.value);
  };

  if (!nickname) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <form
          onSubmit={handleNicknameSubmit}
          className="bg-white p-8 rounded shadow-md"
        >
          <h2 className="text-2xl mb-4">Enter your nickname</h2>
          <input
            type="text"
            name="nickname"
            placeholder="Your nickname"
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <SocketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PresentationList />} />
          <Route path="/presentation/:id" element={<Presentation />} />
        </Routes>
      </Router>
    </SocketProvider>
  );
};

export default App;

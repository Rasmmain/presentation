const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const db = require("./db");
const presentationsRouter = require("./routes/presentations");
const usersRouter = require("./routes/users");
const setupWebSockets = require("./socket");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Routes

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use("/api/presentations", presentationsRouter);
app.use("/api/users", usersRouter);

// WebSocket setup
setupWebSockets(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, io };

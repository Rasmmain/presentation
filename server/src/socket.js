// server/src/socket.js
const handleSocketConnections = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Join presentation room
    socket.on("join-presentation", (presentationId) => {
      socket.join(presentationId);
      console.log(`User joined presentation ${presentationId}`);
    });

    // Broadcast slide changes to all users in the room
    socket.on("slide-updated", (presentationId, updatedSlide) => {
      io.to(presentationId).emit("slide-updated", updatedSlide);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });
};

module.exports = handleSocketConnections;

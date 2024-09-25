const db = require("./db");

function setupWebSockets(io) {
  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("joinPresentation", async ({ presentationId, nickname }) => {
      socket.join(`presentation_${presentationId}`);
      // Add user to the presentation's user list in the database
      await db.query(
        'INSERT INTO presentation_users (presentation_id, user_nickname, role) VALUES (?, ?, "viewer") ON DUPLICATE KEY UPDATE role = "viewer"',
        [presentationId, nickname]
      );
      // Notify other users
      io.to(`presentation_${presentationId}`).emit("userJoined", { nickname });
    });

    socket.on("leavePresentation", async ({ presentationId, nickname }) => {
      socket.leave(`presentation_${presentationId}`);
      // Remove user from the presentation's user list in the database
      await db.query(
        "DELETE FROM presentation_users WHERE presentation_id = ? AND user_nickname = ?",
        [presentationId, nickname]
      );
      // Notify other users
      io.to(`presentation_${presentationId}`).emit("userLeft", { nickname });
    });

    socket.on("updateSlide", async ({ presentationId, slideId, content }) => {
      // Update slide content in the database
      await db.query(
        "UPDATE slides SET content = ? WHERE id = ? AND presentation_id = ?",
        [JSON.stringify(content), slideId, presentationId]
      );
      // Broadcast the update to all clients in the presentation
      io.to(`presentation_${presentationId}`).emit("slideUpdate", {
        slideId,
        content,
      });
    });

    socket.on("addSlide", async ({ presentationId, slide }) => {
      // Add new slide to the database
      const [result] = await db.query(
        "INSERT INTO slides (presentation_id, content) VALUES (?, ?)",
        [presentationId, JSON.stringify(slide.content)]
      );
      slide.id = result.insertId;
      // Broadcast the new slide to all clients in the presentation
      io.to(`presentation_${presentationId}`).emit("newSlide", slide);
    });

    socket.on("removeSlide", async ({ presentationId, slideId }) => {
      // Remove slide from the database
      await db.query(
        "DELETE FROM slides WHERE id = ? AND presentation_id = ?",
        [slideId, presentationId]
      );
      // Broadcast the removal to all clients in the presentation
      io.to(`presentation_${presentationId}`).emit("slideRemoved", { slideId });
    });

    socket.on(
      "updateUserRole",
      async ({ presentationId, nickname, newRole }) => {
        // Update user role in the database
        await db.query(
          "UPDATE presentation_users SET role = ? WHERE presentation_id = ? AND user_nickname = ?",
          [newRole, presentationId, nickname]
        );
        // Broadcast the role update to all clients in the presentation
        io.to(`presentation_${presentationId}`).emit("roleUpdate", {
          user: nickname,
          newRole,
        });
      }
    );

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
}

module.exports = setupWebSockets;

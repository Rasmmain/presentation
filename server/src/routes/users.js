const express = require("express");
const router = express.Router();
const db = require("../db");

// Get users for a specific presentation
router.get("/presentation/:presentationId", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM presentation_users WHERE presentation_id = ?",
      [req.params.presentationId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

// Add a user to a presentation
router.post("/presentation/:presentationId", async (req, res) => {
  const { nickname, role } = req.body;
  try {
    await db.query(
      "INSERT INTO presentation_users (presentation_id, user_nickname, role) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE role = ?",
      [req.params.presentationId, nickname, role, role]
    );
    res
      .status(201)
      .json({ message: "User added to presentation successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding user to presentation", error });
  }
});

// Update a user's role in a presentation
router.put("/presentation/:presentationId/:nickname", async (req, res) => {
  const { role } = req.body;
  try {
    await db.query(
      "UPDATE presentation_users SET role = ? WHERE presentation_id = ? AND user_nickname = ?",
      [role, req.params.presentationId, req.params.nickname]
    );
    res.json({ message: "User role updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating user role", error });
  }
});

// Remove a user from a presentation
router.delete("/presentation/:presentationId/:nickname", async (req, res) => {
  try {
    await db.query(
      "DELETE FROM presentation_users WHERE presentation_id = ? AND user_nickname = ?",
      [req.params.presentationId, req.params.nickname]
    );
    res.json({ message: "User removed from presentation successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing user from presentation", error });
  }
});

module.exports = router;

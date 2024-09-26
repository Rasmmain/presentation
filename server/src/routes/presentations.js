const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM presentations");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching presentations", error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM presentations WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Presentation not found" });
    }
    const presentation = rows[0];

    const [slides] = await db.query(
      "SELECT * FROM slides WHERE presentation_id = ? ORDER BY slide_order",
      [req.params.id]
    );
    presentation.slides = slides.map((slide) => ({
      ...slide,
      content: JSON.parse(slide.content),
    }));

    res.json(presentation);
  } catch (error) {
    res.status(500).json({ message: "Error fetching presentation", error });
  }
});

router.post("/", async (req, res) => {
  const { title, creator } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO presentations (title, creator) VALUES (?, ?)",
      [title, creator]
    );
    res.status(201).json({ id: result.insertId, title, creator });
  } catch (error) {
    res.status(500).json({ message: "Error creating presentation", error });
  }
});

router.put("/:id", async (req, res) => {
  const { title } = req.body;
  try {
    await db.query("UPDATE presentations SET title = ? WHERE id = ?", [
      title,
      req.params.id,
    ]);
    res.json({ message: "Presentation updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating presentation", error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM presentations WHERE id = ?", [req.params.id]);
    res.json({ message: "Presentation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting presentation", error });
  }
});

module.exports = router;

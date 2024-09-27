const express = require("express");
const Presentation = require("../models/Presentation.js");
const router = express.Router();

// Get all presentations
router.get("/", async (req, res) => {
  const presentations = await Presentation.findAll();
  res.json(presentations);
});

// Get a specific presentation by ID
router.get("/:id", async (req, res) => {
  const presentation = await Presentation.findById(req.params.id);
  if (!presentation) {
    return res.status(404).json({ error: "Presentation not found" });
  }
  res.json(presentation);
});

// Create a new presentation
router.post("/", async (req, res) => {
  const { title, creator } = req.body;
  const newPresentation = await Presentation.create(title, creator);
  res.json(newPresentation);
});

// Add a new slide to a presentation
router.post("/:id/slides", async (req, res) => {
  const presentation = await Presentation.findById(req.params.id);
  if (!presentation) {
    return res.status(404).json({ error: "Presentation not found" });
  }
  const { content } = req.body; 
  const newSlide = await presentation.addSlide(content);
  res.json(newSlide);
});

router.put("/:id/slides/:slideId", async (req, res) => {
  try {
    console.log("Receivedsss PUT request to update slide:", req.params.slideId);
    console.log("Receivedssss content:", req.body.content);
    const slideId = parseInt(req.params.slideId, 10);
    console.log("slideId  " + slideId);

    const presentation = await Presentation.findById(req.params.id);
    if (!presentation) {
      return res.status(404).json({ error: "Presentation not found" });
    }

    const { content } = req.body;
    console.log("Contet  " + { ...content });
    await presentation.updateSlide(req.params.slideId, content);

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Remove a slide
router.delete("/:id/slides/:slideId", async (req, res) => {
  const presentation = await Presentation.findById(req.params.id);
  if (!presentation) {
    return res.status(404).json({ error: "Presentation not found" });
  }
  await presentation.removeSlide(req.params.slideId);
  res.json({ success: true });
});

module.exports = router;

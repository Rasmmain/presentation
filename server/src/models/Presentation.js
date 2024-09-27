const db = require("../db");

class Presentation {
  constructor(id, title, creator, createdAt) {
    this.id = id;
    this.title = title;
    this.creator = creator;
    this.createdAt = createdAt;
    this.slides = [];
  }

  static async findAll() {
    const [rows] = await db.query("SELECT * FROM presentations");
    return rows.map(
      (row) => new Presentation(row.id, row.title, row.creator, row.created_at)
    );
  }

  static async findById(id) {
    const [rows] = await db.query("SELECT * FROM presentations WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0) return null;
    const presentation = new Presentation(
      rows[0].id,
      rows[0].title,
      rows[0].creator,
      rows[0].created_at
    );
    await presentation.loadSlides();
    return presentation;
  }

  static async create(title, creator) {
    const [result] = await db.query(
      "INSERT INTO presentations (title, creator) VALUES (?, ?)",
      [title, creator]
    );
    return new Presentation(result.insertId, title, creator, new Date());
  }

  async loadSlides() {
    const [rows] = await db.query(
      "SELECT * FROM slides WHERE presentation_id = ? ORDER BY slide_order",
      [this.id]
    );
    this.slides = rows.map((row) => ({
      id: row.id,
      order: row.slide_order,
      content: JSON.parse(row.content),
    }));
  }

  async updateSlide(slideId, content) {
    await db.query(
      "UPDATE slides SET content = ? WHERE id = ? AND presentation_id = ?",
      [JSON.stringify(content), slideId, this.id]
    );

    const slideIndex = this.slides.findIndex((slide) => slide.id === slideId);
    if (slideIndex !== -1) {
      this.slides[slideIndex].content = content;
    }
  }

  async addSlide(content) {
    const order = this.slides.length;
    const [result] = await db.query(
      "INSERT INTO slides (presentation_id, slide_order, content) VALUES (?, ?, ?)",
      [this.id, order, JSON.stringify(content)]
    );
    const newSlide = { id: result.insertId, order, content };
    this.slides.push(newSlide);
    return newSlide;
  }

  async updateSlide(slideId, content) {
    await db.query(
      "UPDATE slides SET content = ? WHERE id = ? AND presentation_id = ?",
      [JSON.stringify(content), slideId, this.id]
    );
    const slideIndex = this.slides.findIndex((slide) => slide.id === slideId);
    if (slideIndex !== -1) {
      this.slides[slideIndex].content = content;
    }
  }

  async removeSlide(slideId) {
    await db.query("DELETE FROM slides WHERE id = ? AND presentation_id = ?", [
      slideId,
      this.id,
    ]);
    this.slides = this.slides.filter((slide) => slide.id !== slideId);
    for (let i = 0; i < this.slides.length; i++) {
      await db.query("UPDATE slides SET slide_order = ? WHERE id = ?", [
        i,
        this.slides[i].id,
      ]);
      this.slides[i].order = i;
    }
  }
}

module.exports = Presentation;

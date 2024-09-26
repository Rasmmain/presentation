const db = require('../db');

class User {
  constructor(nickname, role) {
    this.nickname = nickname;
    this.role = role;
  }

  static async findByPresentationId(presentationId) {
    const [rows] = await db.query('SELECT * FROM presentation_users WHERE presentation_id = ?', [presentationId]);
    return rows.map(row => new User(row.user_nickname, row.role));
  }

  static async addToPresentation(presentationId, nickname, role) {
    await db.query('INSERT INTO presentation_users (presentation_id, user_nickname, role) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE role = ?', 
      [presentationId, nickname, role, role]);
  }

  static async updateRole(presentationId, nickname, newRole) {
    await db.query('UPDATE presentation_users SET role = ? WHERE presentation_id = ? AND user_nickname = ?', 
      [newRole, presentationId, nickname]);
  }

  static async removeFromPresentation(presentationId, nickname) {
    await db.query('DELETE FROM presentation_users WHERE presentation_id = ? AND user_nickname = ?', 
      [presentationId, nickname]);
  }
}

module.exports = User;
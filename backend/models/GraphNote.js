const { pool } = require('../config/database');

class GraphNote {
  static async create(userId, noteData) {
    const { title, content, color, tags, links, isFavorite } = noteData;
    const result = await pool.query(
      `INSERT INTO graph_notes (user_id, title, content, color, tags, links, is_favorite)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [userId, title, content, color, tags, links, isFavorite || false]
    );
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const result = await pool.query(
      `SELECT * FROM graph_notes WHERE user_id = $1 ORDER BY updated_at DESC`,
      [userId]
    );
    return result.rows;
  }

  static async update(noteId, userId, noteData) {
    const { title, content, color, tags, links, isFavorite } = noteData;
    const result = await pool.query(
      `UPDATE graph_notes 
       SET title = COALESCE($1, title),
           content = COALESCE($2, content),
           color = COALESCE($3, color),
           tags = COALESCE($4, tags),
           links = COALESCE($5, links),
           is_favorite = COALESCE($6, is_favorite),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
      [title, content, color, tags, links, isFavorite, noteId, userId]
    );
    return result.rows[0];
  }

  static async delete(noteId, userId) {
    const result = await pool.query(
      `DELETE FROM graph_notes WHERE id = $1 AND user_id = $2 RETURNING *`,
      [noteId, userId]
    );
    return result.rows[0];
  }

  static async deleteAll(userId) {
    const result = await pool.query(
      `DELETE FROM graph_notes WHERE user_id = $1 RETURNING *`,
      [userId]
    );
    return result.rows;
  }
}

module.exports = GraphNote;
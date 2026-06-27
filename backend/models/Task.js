const { pool } = require('../config/database');

class Task {
  static async create(userId, taskData) {
    const { title, description, category, priority, status, color, dueDate, tags } = taskData;
    const result = await pool.query(
      `INSERT INTO tasks (user_id, title, description, category, priority, status, color, due_date, tags)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [userId, title, description, category, priority, status, color, dueDate, tags]
    );
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const result = await pool.query(
      `SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  }

  static async update(taskId, userId, taskData) {
    const { title, description, category, priority, status, color, dueDate, tags } = taskData;
    const result = await pool.query(
      `UPDATE tasks 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           category = COALESCE($3, category),
           priority = COALESCE($4, priority),
           status = COALESCE($5, status),
           color = COALESCE($6, color),
           due_date = COALESCE($7, due_date),
           tags = COALESCE($8, tags),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 AND user_id = $10
       RETURNING *`,
      [title, description, category, priority, status, color, dueDate, tags, taskId, userId]
    );
    return result.rows[0];
  }

  static async delete(taskId, userId) {
    const result = await pool.query(
      `DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *`,
      [taskId, userId]
    );
    return result.rows[0];
  }

  static async deleteAll(userId) {
    const result = await pool.query(
      `DELETE FROM tasks WHERE user_id = $1 RETURNING *`,
      [userId]
    );
    return result.rows;
  }
}

module.exports = Task;
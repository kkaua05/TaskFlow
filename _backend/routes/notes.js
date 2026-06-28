const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// GET todas as notas
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM notes ORDER BY updated_at DESC');
    res.json({ success: true, notes: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST criar nota
router.post('/', async (req, res) => {
  try {
    const { title, content, color, tags, attachments, isFavorite } = req.body;
    const result = await pool.query(
      `INSERT INTO notes (title, content, color, tags, attachments, is_favorite)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, content, color || '#4F46E5', tags || [], attachments || [], isFavorite || false]
    );
    res.json({ success: true, note: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT atualizar nota
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, color, tags, attachments, isFavorite } = req.body;
    const result = await pool.query(
      `UPDATE notes 
       SET title = COALESCE($1, title),
           content = COALESCE($2, content),
           color = COALESCE($3, color),
           tags = COALESCE($4, tags),
           attachments = COALESCE($5, attachments),
           is_favorite = COALESCE($6, is_favorite),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [title, content, color, tags, attachments, isFavorite, id]
    );
    res.json({ success: true, note: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE excluir nota
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM notes WHERE id = $1', [id]);
    res.json({ success: true, message: 'Nota excluída' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
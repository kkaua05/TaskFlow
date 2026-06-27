const express = require('express');
const router = express.Router();
const GraphNote = require('../models/GraphNote');
const authMiddleware = require('../middleware/auth');

// GET todas as notas do grafo
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notes = await GraphNote.findByUserId(req.userId);
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST criar nota
router.post('/', authMiddleware, async (req, res) => {
  try {
    const note = await GraphNote.create(req.userId, req.body);
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT atualizar nota
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const note = await GraphNote.update(req.params.id, req.userId, req.body);
    if (!note) {
      return res.status(404).json({ error: 'Nota não encontrada' });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE excluir nota
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const note = await GraphNote.delete(req.params.id, req.userId);
    if (!note) {
      return res.status(404).json({ error: 'Nota não encontrada' });
    }
    res.json({ message: 'Nota excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE todas as notas
router.delete('/', authMiddleware, async (req, res) => {
  try {
    await GraphNote.deleteAll(req.userId);
    res.json({ message: 'Todas as notas foram excluídas' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
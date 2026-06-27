const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authMiddleware = require('../middleware/auth');

// GET todas as tarefas
router.get('/', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.findByUserId(req.userId);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST criar tarefa
router.post('/', authMiddleware, async (req, res) => {
  try {
    const task = await Task.create(req.userId, req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT atualizar tarefa
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.update(req.params.id, req.userId, req.body);
    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE excluir tarefa
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.delete(req.params.id, req.userId);
    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    res.json({ message: 'Tarefa excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE todas as tarefas
router.delete('/', authMiddleware, async (req, res) => {
  try {
    await Task.deleteAll(req.userId);
    res.json({ message: 'Todas as tarefas foram excluídas' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
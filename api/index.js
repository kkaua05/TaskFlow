const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
});

// Inicializar tabelas (executado uma vez)
let tablesInitialized = false;
const initDatabase = async () => {
  if (tablesInitialized) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        priority VARCHAR(50) DEFAULT 'medium',
        status VARCHAR(50) DEFAULT 'pending',
        color VARCHAR(20) DEFAULT '#4F46E5',
        due_date TIMESTAMP,
        tags TEXT[] DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS graph_notes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        color VARCHAR(20) DEFAULT '#4F46E5',
        tags TEXT[] DEFAULT '{}',
        links TEXT[] DEFAULT '{}',
        is_favorite BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    tablesInitialized = true;
    console.log('✅ Tabelas verificadas/criadas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error.message);
  }
};

// Middleware para inicializar banco na primeira requisição
app.use(async (req, res, next) => {
  if (!tablesInitialized) {
    await initDatabase();
  }
  next();
});

// ============== TAREFAS ==============
app.get('/api/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json({ success: true, tasks: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, category, priority, status, color, due_date, tags } = req.body;
    const result = await pool.query(
      `INSERT INTO tasks (title, description, category, priority, status, color, due_date, tags)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [title, description, category, priority || 'medium', status || 'pending', color || '#4F46E5', due_date, tags || []]
    );
    res.json({ success: true, task: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, priority, status, color, due_date, tags } = req.body;
    const result = await pool.query(
      `UPDATE tasks SET 
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        category = COALESCE($3, category),
        priority = COALESCE($4, priority),
        status = COALESCE($5, status),
        color = COALESCE($6, color),
        due_date = COALESCE($7, due_date),
        tags = COALESCE($8, tags),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 RETURNING *`,
      [title, description, category, priority, status, color, due_date, tags, id]
    );
    res.json({ success: true, task: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    res.json({ success: true, message: 'Tarefa excluída' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const total = await pool.query('SELECT COUNT(*) FROM tasks');
    const completed = await pool.query("SELECT COUNT(*) FROM tasks WHERE status = 'completed'");
    const pending = await pool.query("SELECT COUNT(*) FROM tasks WHERE status IN ('pending', 'in-progress')");
    const overdue = await pool.query("SELECT COUNT(*) FROM tasks WHERE due_date < NOW() AND status != 'completed'");
    
    res.json({
      success: true,
      stats: {
        total: parseInt(total.rows[0].count),
        completed: parseInt(completed.rows[0].count),
        pending: parseInt(pending.rows[0].count),
        overdue: parseInt(overdue.rows[0].count)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


// ============== GRAPH NOTES ==============
app.get('/api/graph-notes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM graph_notes ORDER BY updated_at DESC');
    res.json({ success: true, notes: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/graph-notes', async (req, res) => {
  try {
    const { title, content, color, tags, links, isFavorite } = req.body;
    const result = await pool.query(
      `INSERT INTO graph_notes (title, content, color, tags, links, is_favorite)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, content, color || '#4F46E5', tags || [], links || [], isFavorite || false]
    );
    res.json({ success: true, note: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/graph-notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, color, tags, links, isFavorite } = req.body;
    const result = await pool.query(
      `UPDATE graph_notes SET 
        title = COALESCE($1, title),
        content = COALESCE($2, content),
        color = COALESCE($3, color),
        tags = COALESCE($4, tags),
        links = COALESCE($5, links),
        is_favorite = COALESCE($6, is_favorite),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 RETURNING *`,
      [title, content, color, tags, links, isFavorite, id]
    );
    res.json({ success: true, note: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/graph-notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM graph_notes WHERE id = $1', [id]);
    res.json({ success: true, message: 'Nota excluída' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============== TEST & HEALTH ==============
app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as time');
    res.json({ success: true, message: '✅ Banco de dados conectado!', timestamp: result.rows[0].time });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = app;


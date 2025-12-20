require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

app.get('/tasks', async (req, res) => {
    console.log('GET /tasks');
    const result = await pool.query(`
        SELECT tasks.id, tasks.title, tasks.is_completed, 
        COALESCE(categories.name, 'Genel') AS category_name
        FROM tasks
        LEFT JOIN categories ON tasks.category_id = categories.id
        ORDER BY tasks.id ASC
    `);
    res.json(result.rows);
});
app.post('/tasks', async (req, res) => {
    console.log('POST /tasks - Body:', req.body);
    const { title, user_id, category_id } = req.body;
    const result = await pool.query(
        'INSERT INTO tasks (title, user_id, category_id) VALUES ($1, $2, $3) RETURNING *',
        [title, user_id || 1, category_id || null]
    );
    console.log('Eklendi');
    res.status(201).json(result.rows[0]);
});

app.delete('/tasks/:id', async (req, res) => {
    console.log('DELETE /tasks/' + req.params.id);
    await pool.query('DELETE FROM tasks WHERE id = $1', [req.params.id]);
    res.json({ message: 'OK' });
});

app.listen(PORT, () => {
    console.log('Sunucu 3000 de calisiyor');
});
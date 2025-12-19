const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'todo_app',
    password: 'sql123',
    port: 5432,
});

// Görevleri Çek
app.get('/tasks', async (req, res) => {
    try {
        const sqlSorgusu = `
            SELECT 
                tasks.id, 
                tasks.title, 
                tasks.is_completed, 
                categories.name AS category_name
            FROM tasks
            LEFT JOIN categories ON tasks.category_id = categories.id
            ORDER BY tasks.id ASC;
        `;
        const result = await pool.query(sqlSorgusu);
        res.json(result.rows);
    } catch (err) {
        console.error("Hata:", err.message);
        res.status(500).send("Veri çekilemedi!");
    }
});


app.post('/tasks', async (req, res) => {
    try {
  
        const { title, user_id, category_id } = req.body; 
        
       
        const result = await pool.query(
            'INSERT INTO tasks (title, user_id, category_id) VALUES ($1, $2, $3) RETURNING *',
            [title, user_id, category_id]
        );
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error("SQL Ekleme Hatası:", err.message);
        res.status(500).send("Veritabanına kaydedilemedi!");
    }
});

// Görev Sil
app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    res.json({ message: "Silindi" });
});

app.listen(3000, () => console.log("Sunucu 3000'de çalışıyor"));
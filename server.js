const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const port = 3000;

// Database connection setup
const pool = new Pool({
    user: 'your_db_user',
    host: 'localhost',
    database: 'your_db_name',
    password: 'your_db_password',
    port: 5432,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

app.post('/submit', async (req, res) => {
    const { pole, rating, quantity, location, status } = req.body;
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    try {
        // Insert data into the database
        await pool.query('INSERT INTO poles (pole, rating, quantity, location, status, date) VALUES ($1, $2, $3, $4, $5, $6)', [pole, rating, quantity, location, status, date]);

        // Logic for handling imbalance
        const result = await pool.query('SELECT SUM(quantity) as total_quantity FROM poles WHERE location = $1 AND rating = $2', [location, rating]);
        const totalQuantity = result.rows[0].total_quantity;
        
        // Assuming 2-pole system for imbalance calculation
        const imbalanceQty = Math.abs(totalQuantity - quantity * 2);
        const imbalancePole = totalQuantity > quantity * 2 ? pole : null;
        const statusClass = imbalanceQty > 0 ? 'status-critical' : 'status-balanced';

        await pool.query('UPDATE poles SET imbalance_qty = $1, imbalance_pole = $2, status_class = $3 WHERE location = $4 AND rating = $5', [imbalanceQty, imbalancePole, statusClass, location, rating]);

        res.json({ message: 'Data submitted successfully!' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

app.get('/dashboard', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM poles');
        res.json(result.rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
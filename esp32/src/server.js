const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Configure PostgreSQL connection
const pool = new Pool({
    user: 'your_user',
    host: 'localhost',
    database: 'your_database',
    password: 'your_password',
    port: 5432,
});

// Endpoint to get data
app.get('/getData', async (req, res) => {
    const { start_time, end_time } = req.query;

    try {
        const result = await pool.query(
            'SELECT time, value FROM magfield_data WHERE time BETWEEN $1 AND $2',
            [start_time, end_time]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Endpoint to upload magnetic field data
app.post('/uploadMagField', async (req, res) => {
    const { time, value } = req.body;

    try {
        await pool.query(
            'INSERT INTO magfield_data (time, value) VALUES ($1, $2)',
            [time, value]
        );
        res.status(201).json({ message: 'Magnetic field data uploaded successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to upload data' });
    }
});

// Endpoint to update interference data
app.post('/updateInterference', async (req, res) => {
    const { time, value } = req.body;

    try {
        await pool.query(
            'INSERT INTO interference_data (time, value) VALUES ($1, $2)',
            [time, value]
        );
        res.status(201).json({ message: 'Interference data updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update data' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

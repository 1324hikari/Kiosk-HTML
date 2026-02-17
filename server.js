const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'kiosk_user',
    password: 'Admin_123',
    database: 'kiosk_db'
});

const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

app.get('/api/images', (req, res) => {
    // Pointing to images folder
    const imagesDir = 'images/'; 
    
    fs.readdir(imagesDir, (err, files) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Unable to scan images directory' });
        }
        const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
        res.json(imageFiles);
    });
});

app.get('/api/orders/display', (req, res) => {
    db.query("SELECT id, status, items_summary FROM orders WHERE status IN ('Pending', 'Preparing', 'Done', 'Canceled') ORDER BY id DESC", (err, results) => {
        res.json(results);
    });
});

app.get('/api/items', (req, res) => {
    db.query("SELECT * FROM menu_items", (err, results) => res.json(results));
});

app.post('/api/add', (req, res) => {
    const { name, image, category, price } = req.body;
    db.query("INSERT INTO menu_items (name, image, category, price) VALUES (?, ?, ?, ?)", 
    [name, image, category, price], (err) => res.send("Added"));
});

app.delete('/api/remove/:id', (req, res) => {
    db.query("DELETE FROM menu_items WHERE id = ?", [req.params.id], (err) => res.send("Deleted"));
});

app.post('/api/orders', (req, res) => {
    const { items, total } = req.body;
    db.query("INSERT INTO orders (items_summary, total_amount) VALUES (?, ?)", 
    [items, total], (err, result) => res.json({ id: result.insertId }));
});

app.get('/api/orders', (req, res) => {
    db.query("SELECT * FROM orders WHERE status = 'Pending' ORDER BY created_at ASC", (err, results) => res.json(results));
});

app.get('/api/orders/history', (req, res) => {
    db.query("SELECT * FROM orders WHERE status != 'Pending' ORDER BY created_at DESC", (err, results) => res.json(results));
});

app.put('/api/orders/status/:id', (req, res) => {
    const { status } = req.body;
    db.query("UPDATE orders SET status = ? WHERE id = ?", [status, req.params.id], (err) => res.send("Updated"));
});

app.delete('/api/orders/purge', (req, res) => {
    db.query("SELECT * FROM orders", (err, results) => {
        if (err) return res.status(500).json({ error: "Read failed" });
        let totalRev = 0;
        let logText = `PURGE LOG - ${new Date().toLocaleString()}\n----------------------\n`;
        results.forEach(o => {
            if(o.status === 'Done') totalRev += parseFloat(o.total_amount);
            logText += `Order #${o.id} | ${o.status} | ₱${o.total_amount} | ${o.items_summary}\n`;
        });
        logText += `----------------------\nTOTAL REVENUE: ₱${totalRev.toFixed(2)}`;
        const filename = `LOG_${Date.now()}.txt`;
        fs.writeFileSync(path.join(logDir, filename), logText);
        db.query("TRUNCATE TABLE orders", (err) => {
            if (err) return res.status(500).json({ error: "Clear failed" });
            res.json({ success: true, file: filename });
        });
    });
});

app.listen(3000, '0.0.0.0', () => console.log("Server Running on port 3000 (Network Ready)"));
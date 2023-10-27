const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database(':memory:'); // This creates an in-memory SQLite database.

// Middleware
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve static files from the root directory

// Database Initialization
db.serialize(() => {
    db.run("CREATE TABLE devices (id TEXT PRIMARY KEY, name TEXT, model TEXT)");
});
// Endpoint to register a device
app.post('/register', (req, res) => {
    const { id, name, model } = req.body;
    if (!id || !name || !model) {
        return res.status(400).send('Missing device information');
    }

    const stmt = db.prepare("INSERT INTO devices (id, name, model) VALUES (?, ?, ?)");
    stmt.run(id, name, model, (err) => {
        if (err) {
            return res.status(500).send('Failed to register device');
        }
        res.send('Device registered successfully');
    });
});

// Endpoint to list all registered devices
app.get('/devices', (req, res) => {
    db.all("SELECT * FROM devices", [], (err, rows) => {
        if (err) {
            return res.status(500).send('Failed to fetch devices');
        }
        res.json(rows);
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



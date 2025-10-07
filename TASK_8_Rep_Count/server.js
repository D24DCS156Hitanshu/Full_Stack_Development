const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Data file path
const dataFile = path.join(__dirname, 'data.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({ count: 0 }));
}

// Get current count
app.get('/api/count', (req, res) => {
    const data = JSON.parse(fs.readFileSync(dataFile));
    res.json(data);
});

// Update count
app.post('/api/count', (req, res) => {
    const data = JSON.parse(fs.readFileSync(dataFile));
    data.count = req.body.count;
    fs.writeFileSync(dataFile, JSON.stringify(data));
    res.json(data);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

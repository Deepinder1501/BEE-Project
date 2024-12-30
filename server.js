const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.post('/submit', (req, res) => {
    const formData = req.body;

    fs.readFile('data.json', 'utf8', (err, data) => {
        let currentData = [];
        if (err && err.code === 'ENOENT') {
            currentData = [];
        } else if (err) {
            return res.status(500).json({ message: 'Error reading data file' });
        } else {
            currentData = data ? JSON.parse(data) : [];
        }

        currentData.push(formData);

        fs.writeFile('data.json', JSON.stringify(currentData, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error saving data' });
            }
            res.status(200).json({ message: 'Data submitted successfully!' });
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

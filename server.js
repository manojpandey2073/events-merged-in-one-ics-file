const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware to parse JSON
app.use(bodyParser.json());

// Serve static files (like index.html)
app.use(express.static(path.join(__dirname)));

// Route to serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API route to handle POST requests
app.post('/submit', (req, res) => {
    const { email, data } = req.body;

    console.log('Received data:', { email, data });

    try {
        // Process the data as needed
        console.log('Processing data...');

        // Mock response
        res.status(200).json({ message: 'Data saved successfully!' });
    } catch (error) {
        console.error('Error processing data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

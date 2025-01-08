const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;
<<<<<<< HEAD
=======

>>>>>>> b1eaa3e5993e199020b5a7bc51ccfba2ed96ae46
// Middleware to parse JSON
app.use(bodyParser.json());

app.post('/', (req, res) => {
<<<<<<< HEAD
=======
     res.sendFile(path.join(__dirname, 'index.html'));
>>>>>>> b1eaa3e5993e199020b5a7bc51ccfba2ed96ae46
    const { email, data } = req.body;

    console.log('Received data:', { email, data });

    // Mock ICS file creation or data handling
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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

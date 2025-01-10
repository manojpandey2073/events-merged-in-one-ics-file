const express = require('express');
const bodyParser = require('body-parser');
const ics = require('ics');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON data
app.use(bodyParser.json());

// Endpoint to process data and generate merged ICS file
app.post('/saveICS', async (req, res) => {
    const { email, data } = req.body; // Extract the email and event data

    if (!data || !Array.isArray(data)) {
        return res.status(400).json({ error: 'Invalid event data' });
    }

    try {
        const events = data.map((event) => ({
            title: event.title || 'Untitled Event',
            description: event.description || '',
            start: event.start || [],
            duration: event.duration || { hours: 1, minutes: 0 },
            location: event.location || '',
        }));

        // Generate ICS file
        ics.createEvents(events, (error, value) => {
            if (error) {
                console.error('Error generating ICS:', error);
                return res.status(500).json({ error: 'Failed to generate ICS file' });
            }

            // Save the ICS file to the server
            const fileName = `events_${Date.now()}.ics`;
            const filePath = path.join(__dirname, 'public', fileName);

            fs.writeFile(filePath, value, (err) => {
                if (err) {
                    console.error('Error saving ICS file:', err);
                    return res.status(500).json({ error: 'Failed to save ICS file' });
                }

                // Respond with the download link
                const fileUrl = `${req.protocol}://${req.get('host')}/public/${fileName}`;
                res.status(200).json({ message: 'ICS file created successfully', fileUrl });
            });
        });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Serve static files (like the generated ICS files)
app.use('/public', express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

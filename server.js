const express = require('express');
const bodyParser = require('body-parser');
const ics = require('ics'); // For ICS file generation
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 10000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Serve static files (e.g., CSS, JS, HTML) from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html on the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to handle form submissions and generate ICS file
app.post('/saveICS', (req, res) => {
  try {
    const { email, data } = req.body;

    // Ensure email and data are present
    if (!email || !data || !Array.isArray(data)) {
      return res.status(400).json({ message: 'Invalid request: Missing email or data' });
    }

    // Log received data for debugging
    console.log('Received data:', { email, data });

    // Create a list of events to generate the ICS file
    const events = data.map(event => {
      // Validate the start date
      if (!Array.isArray(event.start) || event.start.length !== 5) {
        console.error('Invalid start date format for event:', event);
        return null;
      }

      return {
        title: event.title,
        description: event.description,
        location: event.location,
        start: event.start,
        duration: {
          hours: Number(event.duration.hours),
          minutes: Number(event.duration.minutes)
        }
      };
    }).filter(Boolean); // Remove invalid events

    if (events.length === 0) {
      return res.status(400).json({ message: 'No valid events to create ICS file.' });
    }

    // Generate a single ICS file containing all events
    const result = ics.createEvents(events);

    if (result.error) {
      console.error('Error creating ICS file:', result.error);
      return res.status(500).json({ message: 'Failed to create ICS file.' });
    }

    // Save the ICS file to a temporary directory
    const fileName = `events_${Date.now()}.ics`;
    const filePath = path.join(__dirname, 'public', fileName);
    fs.writeFileSync(filePath, result.value);

    // Send the URL back to the client
    const fileURL = `http://localhost:${PORT}/${fileName}`;
    res.status(200).json({ fileURL });

  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

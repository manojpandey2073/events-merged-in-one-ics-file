const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const ics = require('ics'); // If you use the ics library for ICS file generation

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

    // Example of generating an ICS file (adjust based on your use case)
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
        start: event.start, // Make sure this is in the format expected by ics
        duration: event.duration,
      };
    }).filter(Boolean); // Remove invalid events

    // Generate ICS content for each valid event
    const icsData = events.map(event => {
      const result = ics.createEvent(event);
      if (result.error) {
        console.error('Error creating ICS event:', result.error);
        return null;
      }
      return result.value;
    }).filter(Boolean).join('\n'); // Combine all ICS events into one file

    // If no valid events, return an error
    if (!icsData) {
      return res.status(400).json({ message: 'No valid events to create ICS file.' });
    }

    // Send the ICS data as a file response
    res.setHeader('Content-Disposition', 'attachment; filename="events.ics"');
    res.setHeader('Content-Type', 'text/calendar');
    res.status(200).send(icsData);
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

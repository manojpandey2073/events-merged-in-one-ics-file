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

    // Log received data
    console.log('Received data:', { email, data });

    // Example of generating an ICS file (adjust based on your use case)
    const events = data.map(event => ({
      title: event.title,
      description: event.description,
      location: event.location,
      start: event.start,
      duration: event.duration,
    }));

    const icsData = events.map(event => {
      const result = ics.createEvent(event);
      if (result.error) {
        console.error('Error creating ICS event:', result.error);
        return null;
      }
      return result.value;
    }).filter(Boolean).join('\n'); // Combine all ICS events

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

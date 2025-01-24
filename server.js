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
  console.log(req.body.data[0].duration.minutes)
  console.log('this is----->>', req.body[0]);
  
  ics.createEvents(req.body.data, (error, value) => {
      if (error) {
          console.log(error)
          return
      }
       // Define the events directory
       const eventsDir = path.join(__dirname, 'public');
       // Write the ICS file to the events directory
       const fileName = `${req.body.data[0].title}.ics`;
       const filePath = path.join(eventsDir, fileName);
       fs.writeFileSync(filePath, value);
     
      setTimeout(() => {
          console.log('this is-----done----->>');
          res.json({ fileURL: `https://events-merged-in-one-ics-file-1.onrender.com/events/${fileName}` });
      }, 1000);

  });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

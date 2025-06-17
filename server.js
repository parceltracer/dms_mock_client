const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from React
app.use(express.static(path.join(__dirname, 'client/build')));

// API Routes
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from production!' });
});

app.get('/api/areas/', async (req, res) => {
    try {
        const response = await fetch("https://api.parceltracer.app/v1/external/areas/", {
            method: "GET",
            headers: {
                "X-Api-Key": 'OAdCVgTa2j07FhSCM-aLUJhwYo9qeU6l6VnHxUohXyZrM-Wo64Yxjw46G61e39huLN9ROleFhFMOphHDnDkQnA',
            }
        })

        res.json(await response.json())
    } catch {
        res.json({"error": true})

    }
})

// Handle React routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
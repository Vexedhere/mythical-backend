const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors()); 
app.use(express.json());

// Pulls key from Render's Environment Variables
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// FIX: This shows a message when you visit the link in a browser
app.get('/', (req, res) => {
    res.send(`
        <body style="background:#020202;color:#a855f7;font-family:sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;">
            <h1 style="font-style:italic;text-transform:uppercase;letter-spacing:4px;">Mythical AI Engine</h1>
            <p style="color:#64748b;font-weight:bold;">STATUS: ONLINE | NEURAL LINK: ACTIVE</p>
        </body>
    `);
});

// FIX: This handles the error if you visit /api/chat in a browser
app.get('/api/chat', (req, res) => {
    res.status(405).send("Neural Link requires a POST request from the Mythical Portal.");
});

// The actual Chat Logic
app.post('/api/chat', async (req, res) => {
    try {
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: "llama-3.1-8b-instant",
            messages: req.body.messages
        }, {
            headers: { 'Authorization': `Bearer ${GROQ_API_KEY}` }
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Neural Link Offline." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Mythical Server active on port ${PORT}`));

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors()); 
app.use(express.json());

// Pulls key from Render's Environment Variables (Security First!)
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// 1. Home Route: Shows status when visiting the URL in a browser
app.get('/', (req, res) => {
    res.send(`
        <body style="background:#020202;color:#a855f7;font-family:sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;margin:0;">
            <div style="padding:40px;border:1px solid #333;border-radius:30px;background:#050505;text-align:center;box-shadow:0 20px 50px rgba(0,0,0,0.5);">
                <h1 style="font-style:italic;text-transform:uppercase;letter-spacing:5px;margin:0;">Mythical AI Engine</h1>
                <p style="color:#64748b;font-weight:800;margin-top:10px;font-size:12px;letter-spacing:2px;">STATUS: <span style="color:#22c55e;">ONLINE</span></p>
                <div style="height:2px;width:50px;background:#a855f7;margin:20px auto;"></div>
                <p style="color:#475569;font-size:10px;">NEURAL LINK READY FOR POST REQUESTS</p>
            </div>
        </body>
    `);
});

// 2. Chat Route: The actual AI processing engine
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
        console.error("Inference Error:", error.message);
        res.status(500).json({ error: "Neural Link Offline." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Mythical Server active on port ${PORT}`));

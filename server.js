const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// FOUNDER FIX: Open CORS for seamless GitHub Pages communication
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY || "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";
let activeSessions = new Map(); 

app.post('/api/auth', (req, res) => {
    const { passcode, googleName } = req.body;
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
    
    const staff = {"C@MN26": "Chethan", "T@MN26": "Thaman", "M@MN26": "Maddy"};
    let authorizedName = googleName || staff[passcode];

    if (authorizedName) {
        activeSessions.set(clientIp, authorizedName); 
        return res.json({ success: true, name: authorizedName });
    }
    res.status(401).json({ success: false });
});

app.post('/api/chat', async (req, res) => {
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
    
    if (!activeSessions.has(clientIp)) {
        return res.status(403).json({ error: "Session Expired. Please Logout and Login again." });
    }

    try {
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: "llama-3.1-8b-instant",
            messages: req.body.messages
        }, {
            headers: { 'Authorization': `Bearer ${GROQ_API_KEY}` }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Neural Link Offline." });
    }
});

app.post('/api/logout', (req, res) => {
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
    activeSessions.delete(clientIp);
    res.json({ success: true });
});

app.get('/', (req, res) => res.send("Mythical AI Engine: Online | By Chethan"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Port ${PORT} Bound`));

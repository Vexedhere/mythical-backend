const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Professional CORS configuration to allow your GitHub Pages domain
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Founder's Engine Key
const GROQ_API_KEY = process.env.GROQ_API_KEY || "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";

// Isolated Session Map: Maps Client IP to Username
let activeSessions = new Map(); 

// 1. AUTHENTICATION: Registers IP to the Mythical Network
app.post('/api/auth', (req, res) => {
    const { passcode, googleName } = req.body;
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
    
    const staff = {"C@MN26": "Chethan", "T@MN26": "Thaman", "M@MN26": "Maddy"};
    let authorizedName = googleName || staff[passcode];

    if (authorizedName) {
        activeSessions.set(clientIp, authorizedName); 
        console.log(`🔐 Node Authorized: ${authorizedName} at IP ${clientIp}`);
        return res.json({ success: true, name: authorizedName });
    }
    res.status(401).json({ success: false, message: "Unauthorized Access" });
});

// 2. NEURAL LINK: Chat Processing
app.post('/api/chat', async (req, res) => {
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
    
    if (!activeSessions.has(clientIp)) {
        return res.status(403).json({ error: "Session Expired. Please Re-login." });
    }

    try {
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: "llama-3.1-8b-instant",
            messages: req.body.messages
        }, {
            headers: { 'Authorization': `Bearer ${GROQ_API_KEY}` },
            timeout: 10000 
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Neural Link Offline." });
    }
});

// 3. TERMINATE: Logout
app.post('/api/logout', (req, res) => {
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
    activeSessions.delete(clientIp);
    res.json({ success: true });
});

// 4. PUBLIC STATUS PAGE
app.get('/', (req, res) => res.send("Mythical AI Engine: Online | By Chethan"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Mythical Engine active on port ${PORT}`);
});

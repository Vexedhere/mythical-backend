const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors()); 
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY || "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";

// Memory-based session storage (Resets when Render sleeps)
let activeSessions = {}; 

// --- AUTHENTICATION ENDPOINT ---
app.post('/api/auth', (req, res) => {
    const { passcode, googleName } = req.body;
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
    
    const staff = {"C@MN26": "Chethan", "T@MN26": "Thaman", "M@MN26": "Maddy"};
    
    let authorizedName = googleName || staff[passcode];

    if (authorizedName) {
        activeSessions[clientIp] = authorizedName; 
        console.log(`🔐 Session Authorized: ${authorizedName} | IP: ${clientIp}`);
        return res.json({ success: true, name: authorizedName });
    }
    res.status(401).json({ success: false, message: "Unauthorized" });
});

// --- CHAT ENDPOINT (IP PROTECTED) ---
app.post('/api/chat', async (req, res) => {
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
    
    if (!activeSessions[clientIp]) {
        return res.status(403).json({ error: "IP mismatch or Session Expired. Please Re-login." });
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
    delete activeSessions[clientIp];
    res.json({ success: true });
});

app.get('/', (req, res) => res.send("Mythical AI Engine: Status Online | By Chethan"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server active on port ${PORT}`));

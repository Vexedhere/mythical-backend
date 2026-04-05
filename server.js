const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors()); 
app.use(express.json());

// FOUNDER KEY: This is your actual Groq Engine Link
const GROQ_API_KEY = process.env.GROQ_API_KEY || "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";

// --- IP Guard & Session Logic ---
let activeSessions = {}; 

app.post('/api/auth', (req, res) => {
    const { passcode } = req.body;
    // We use 'x-forwarded-for' because Render acts as a proxy
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    const staff = {
        "C@MN26": "Chethan", 
        "T@MN26": "Thaman", 
        "M@MN26": "Maddy"
    };
    
    if (staff[passcode]) {
        activeSessions[clientIp] = staff[passcode]; 
        console.log(`🔐 Session Authorized for: ${staff[passcode]} at IP: ${clientIp}`);
        return res.json({ success: true, name: staff[passcode], ip: clientIp });
    }
    res.status(401).json({ success: false, message: "Invalid Passcode" });
});

app.post('/api/chat', async (req, res) => {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    // IP Verification
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
        console.error("Groq API Error:", error.message);
        res.status(500).json({ error: "Neural Link Offline. Check API Credits." });
    }
});

app.post('/api/logout', (req, res) => {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    delete activeSessions[clientIp];
    console.log(`🚫 Session Terminated for IP: ${clientIp}`);
    res.json({ success: true });
});

// Status Page
app.get('/', (req, res) => {
    res.send(`
        <body style="background:#020202;color:#a855f7;font-family:sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;margin:0;">
            <h1 style="font-style:italic;text-transform:uppercase;letter-spacing:5px;">Mythical AI Engine</h1>
            <p style="color:#64748b;font-weight:800;font-size:12px;">STATUS: ONLINE | KEY: LOADED</p>
        </body>
    `);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Mythical Server active on port ${PORT}`));

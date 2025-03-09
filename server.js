import express from 'express';
import dotenv from 'dotenv';
import SIP from 'sip.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// SIP Client Connection
const connectSIP = (extension, password) => {
    try {
        const userAgent = new SIP.UA({
            uri: `sip:${extension}@${process.env.SIP_DOMAIN}`,
            password: password,
            wsServers: process.env.SIP_SERVER,
        });

        userAgent.on('registered', () => console.log(`User ${extension} registered.`));
        userAgent.on('registrationFailed', (err) => console.error('Registration failed:', err));

        return true;
    } catch (error) {
        console.error('SIP Connection Error:', error);
        return false;
    }
};

// Login Route
app.post('/auth/login', (req, res) => {
    const { extension, password } = req.body;
    const success = connectSIP(extension, password);

    success
        ? res.status(200).json({ message: "Login successful" })
        : res.status(401).json({ message: "Invalid credentials" });
});

// Call History Route
app.get('/calls/history/:userId', (req, res) => {
    const { userId } = req.params;
    const callLogs = [
        { id: 1, caller: '101', receiver: '102', duration: '5 mins', timestamp: '2025-03-10' },
        { id: 2, caller: '101', receiver: '103', duration: '10 mins', timestamp: '2025-03-12' }
    ];

    const userLogs = callLogs.filter(log => log.caller === userId || log.receiver === userId);
    res.json(userLogs);
});

// Recording Route
app.get('/recordings/:userId', (req, res) => {
    const { userId } = req.params;
    const recordings = [
        { id: 1, userId: '101', file: '/recordings/101-call1.mp3' },
        { id: 2, userId: '101', file: '/recordings/101-call2.mp3' }
    ];

    const userRecordings = recordings.filter(record => record.userId === userId);
    res.json(userRecordings);
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

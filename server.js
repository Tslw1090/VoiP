import express from 'express';
import dotenv from 'dotenv';
import dgram from 'dgram';
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('client'));

// SIP Client Connection
const connectSIP = (extension, password) => {
    try {
        const client = dgram.createSocket('udp4');
        const [host, port] = process.env.SIP_DOMAIN.split(':');
        let nonce = '';
        let realm = '';
        let authHeader = '';

        const sendRegister = (authHeader = '') => {
            const branch = 'z9hG4bK' + Math.random().toString(36).substr(2, 9);
            const tag = Math.random().toString(36).substr(2, 8);
            const callId = Math.random().toString(36).substr(2, 8) + '@localhost';

            let message = `REGISTER sip:${process.env.SIP_DOMAIN} SIP/2.0\r\n` +
                `Via: SIP/2.0/UDP localhost:5060;branch=${branch}\r\n` +
                `To: <sip:${extension}@${process.env.SIP_DOMAIN}>\r\n` +
                `From: <sip:${extension}@${process.env.SIP_DOMAIN}>;tag=${tag}\r\n` +
                `CSeq: 1 REGISTER\r\n` +
                `Call-ID: ${callId}\r\n` +
                `Contact: <sip:${extension}@localhost:5060>\r\n` +
                `Expires: 3600\r\n`;
            if (authHeader) {
                message += `Authorization: ${authHeader}\r\n`;
            }
            message += `Content-Length: 0\r\n\r\n`;

            client.send(message, 0, message.length, parseInt(port), host, (err) => {
                if (err) {
                    console.error('UDP send error:', err);
                    client.close();
                } else {
                    console.log(`REGISTER sent to ${host}:${port}`);
                }
            });
        };

        client.on('message', (msg, rinfo) => {
            const response = msg.toString();
            console.log('SIP Response:', response.split('\r\n')[0]);
            if (response.startsWith('SIP/2.0 200')) {
                console.log(`User ${extension} registered.`);
                client.close();
            } else if (response.startsWith('SIP/2.0 401')) {
                // Parse WWW-Authenticate
                const authLine = response.split('\r\n').find(line => line.startsWith('WWW-Authenticate:'));
                if (authLine && !authHeader) {
                    const params = authLine.split(' ')[1].split(',');
                    realm = params.find(p => p.includes('realm='))?.split('=')[1]?.replace(/"/g, '');
                    nonce = params.find(p => p.includes('nonce='))?.split('=')[1]?.replace(/"/g, '');
                    const qop = params.find(p => p.includes('qop='))?.split('=')[1]?.replace(/"/g, '');
                    const ha1 = crypto.createHash('md5').update(`${extension}:${realm}:${password}`).digest('hex');
                    const ha2 = crypto.createHash('md5').update(`REGISTER:sip:${process.env.SIP_DOMAIN}`).digest('hex');
                    const nc = '00000001';
                    const cnonce = Math.random().toString(36).substr(2, 8);
                    let responseHash;
                    if (qop === 'auth') {
                        responseHash = crypto.createHash('md5').update(`${ha1}:${nonce}:${nc}:${cnonce}:${qop}:${ha2}`).digest('hex');
                    } else {
                        responseHash = crypto.createHash('md5').update(`${ha1}:${nonce}:${ha2}`).digest('hex');
                    }
                    authHeader = `Digest username="${extension}", realm="${realm}", nonce="${nonce}", uri="sip:${process.env.SIP_DOMAIN}", response="${responseHash}", algorithm=MD5, qop=${qop}, nc=${nc}, cnonce="${cnonce}"`;
                    sendRegister(authHeader);
                }
            } else {
                console.error('Registration failed:', response.split('\r\n')[0]);
                client.close();
            }
        });

        // Timeout
        setTimeout(() => {
            console.error('Registration timeout');
            client.close();
        }, 10000);

        sendRegister(); // Initial send
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

// Call Route
app.post('/call/make', (req, res) => {
    const { number } = req.body;
    // Placeholder for call logic
    console.log(`Initiating call to ${number}`);
    res.status(200).json({ message: `Call to ${number} initiated` });
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
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));

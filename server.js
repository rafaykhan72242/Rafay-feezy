const express = require('express');
const bodyParser = require('body-parser');
const login = require('facebook-chat-api');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

let api = null;
let stopFlag = false;
const PORT = 5000;

// Load Appstate from file
const appState = JSON.parse(fs.readFileSync('./appstate.json', 'utf8'));

login({ appState: appState }, (err, newApi) => {
    if (err) {
        console.error(' Login failed:', err);
        return;
    }

    api = newApi;
    console.log(`Server running on http://localhost:${PORT}`);
});

app.post('/start', (req, res) => {
    if (!api) return res.status(500).send('API not ready');

    const { uid, message, delay } = req.body;

    if (!uid || !message || !delay) {
        return res.status(400).send('Missing uid, message or delay');
    }

    stopFlag = false;

    const sendLoop = async () => {
        while (!stopFlag) {
            api.sendMessage(message, uid, (err) => {
                if (err) console.error('Message failed:', err);
                else console.log(`Message sent to ${uid}`);
            });
            await new Promise(resolve => setTimeout(resolve, delay * 1000));
        }
    };

    sendLoop();
    res.send('Started auto-sending messages.');
});

app.post('/stop', (req, res) => {
    stopFlag = true;
    res.send('Stopped sending messages.');
});

app.listen(PORT, () => {
    // This will now show properly in Termux without emoji
    console.log(`Server is live at http://localhost:${PORT}`);
});
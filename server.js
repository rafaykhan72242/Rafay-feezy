const express = require("express");
const login = require("facebook-chat-api");
const fs = require("fs");

const app = express();
app.use(express.json());

const PORT = 5000;

app.post("/send-message", async (req, res) => {
    const { uid, message, delay } = req.body;
    let appstate;

    try {
        appstate = JSON.parse(fs.readFileSync("appstate.json", "utf8"));
    } catch (err) {
        return res.status(500).send("❌ Failed to load appstate.json");
    }

    login({ appState: appstate }, (err, api) => {
        if (err) return res.status(500).send("❌ Login failed");

        api.setOptions({ forceLogin: true });

        const send = () => {
            api.sendMessage(message, uid, (err) => {
                if (err) console.error("❌ Error sending message:", err);
                else console.log("✅ Message sent at", new Date().toLocaleTimeString());
            });
        };

        send();
        const loop = setInterval(send, delay * 1000);

        res.send("🚀 Message loop started.");
    });
});

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});

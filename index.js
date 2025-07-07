const login = require("facebook-chat-api");
const fs = require("fs");

const appState = JSON.parse(fs.readFileSync("appstate.json", "utf8"));

login({ appState }, (err, api) => {
    if (err) {
        console.error("❌ Login failed:", err);
        return;
    }

    const uid = "9410555209045909"; // ✅ Use correct Facebook UID here
    const message = "🔥 Working message from bot!";
    const delay = 5; // seconds

    console.log("🤖 Bot started. Sending messages to UID:", uid);

    const send = () => {
        api.sendMessage(message, uid, (err) => {
            if (err) {
                console.error("❌ Message failed:", err?.errorSummary || err);
            } else {
                console.log("✅ Message sent at", new Date().toLocaleTimeString());
            }
        });
    };

    // Repeated sending
    setInterval(send, delay * 1000);
});

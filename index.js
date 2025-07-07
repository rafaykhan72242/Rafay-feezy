const login = require("facebook-chat-api");
const fs = require("fs");

const appState = JSON.parse(fs.readFileSync("appstate.json", "utf8"));

login({ appState }, (err, api) => {
    if (err) {
        console.error("❌ Login failed:", err);
        return;
    }

    const uid = "7969592606420291"; // 👈 Replace with actual UID
    const message = "Hello! Test from bot 🚀";
    const delay = 5; // seconds

    console.log("🤖 Bot started. Sending messages to UID:", uid);

    setInterval(() => {
        api.sendMessage(message, uid, (err) => {
            if (err) {
                console.error("❌ Message failed:", err);
            } else {
                console.log("✅ Message sent at", new Date().toLocaleTimeString());
            }
        });
    }, delay * 1000);
});

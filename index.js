const login = require("facebook-chat-api");
const fs = require("fs");

const appState = JSON.parse(fs.readFileSync("appstate.json", "utf8"));

login({ appState, selfListen: false }, (err, api) => {
    if (err) return console.error("❌ Login failed:", err);

    const uid = "9410555209045909"; // your working Facebook UID
    const message = "🔥 Patched bot: message every 5 sec!";
    const delay = 5; // seconds

    console.log("🤖 Bot started. Sending to UID:", uid);

    setInterval(() => {
        api.sendMessage(message, uid, (err) => {
            if (err) {
                console.error("❌ Send error:", err.errorSummary || err);
            } else {
                console.log("✅ Sent at", new Date().toLocaleTimeString());
            }
        });
    }, delay * 1000);
});

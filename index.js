const login = require("facebook-chat-api");
const fs = require("fs");

// Load appstate.json for login
const appState = JSON.parse(fs.readFileSync("appstate.json", "utf8"));

login({ appState }, (err, api) => {
    if (err) {
        console.error("❌ Login failed:", err);
        return;
    }

    const uid = "9410555209045909"; // 👉 Replace with working UID
    const message = "🔥 Hello again! Bot is working.";
    const delay = 5; // seconds

    console.log("🤖 Bot started. Sending messages to UID:", uid);

    // Repeated message loop
    setInterval(() => {
        api.sendMessage({ body: message }, uid, (err) => {
            if (err) {
                console.error("❌ Failed to send message:", err?.errorSummary || err);
            } else {
                console.log("✅ Message sent at", new Date().toLocaleTimeString());
            }
        });
    }, delay * 1000);
});

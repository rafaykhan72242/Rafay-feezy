const login = require("facebook-chat-api");
const fs = require("fs");

const appState = JSON.parse(fs.readFileSync("appstate.json", "utf8"));

login({ appState }, (err, api) => {
    if (err) {
        console.error("❌ Login failed:", err);
        return;
    }

    // Get latest 10 inbox threads
    api.getThreadList(10, null, ["INBOX"], (err, list) => {
        if (err) {
            console.error("❌ Failed to fetch threads:", err);
            return;
        }

        // Match thread by name (Rafay khan)
        const thread = list.find(t => t.name && t.name.toLowerCase() === "rafay khan");

        if (!thread) {
            console.error("❌ Could not find 'Rafay khan' in recent threads.");
            return;
        }

        const threadID = thread.threadID;
        const message = "🔥 Hello Rafay Khan! Bot is working.";
        const delay = 5; // in seconds

        console.log("🤖 Sending to 'Rafay khan' | Thread ID:", threadID);

        setInterval(() => {
            api.sendMessage({ body: message }, threadID, (err) => {
                if (err) {
                    console.error("❌ Message failed:", err?.errorSummary || err);
                } else {
                    console.log("✅ Message sent at", new Date().toLocaleTimeString());
                }
            });
        }, delay * 1000);
    });
});

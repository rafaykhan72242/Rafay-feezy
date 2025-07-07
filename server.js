const login = require("facebook-chat-api");
const fs = require("fs");
const readline = require("readline");

const appstate = JSON.parse(fs.readFileSync("appstate.json", "utf8"));

login({ appState: appstate }, (err, api) => {
    if (err) return console.error("Login failed:", err);

    console.log("✅ Logged in successfully.\n");

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question("👤 Enter Facebook UID: ", (uid) => {
        rl.question("💬 Enter messages (separate lines with \\n): ", (msgInput) => {
            rl.question("⏱️ Enter delay (in seconds): ", (delayInput) => {
                const messages = msgInput.split("\\n");
                const delay = parseInt(delayInput) * 1000;
                let index = 0;

                const sendLoop = () => {
                    if (index >= messages.length) index = 0;
                    api.sendMessage(messages[index], uid, (err) => {
                        if (err) return console.error("❌ Failed to send:", err);
                        console.log(`✅ Sent: "${messages[index]}"`);
                    });
                    index++;
                    setTimeout(sendLoop, delay);
                };

                sendLoop();
                rl.close();
            });
        });
    });
});

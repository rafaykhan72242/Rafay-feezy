const login = require("facebook-chat-api");
const fs = require("fs");
const readline = require("readline");

const appState = JSON.parse(fs.readFileSync("appstate.json", "utf8"));

login({ appState }, (err, api) => {
  if (err) return console.error("Login failed:", err);

  console.log("✅ Logged in successfully.");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question("Enter UID: ", (uid) => {
    rl.question("Type message (use \n for new lines): ", (message) => {
      rl.question("Enter delay in seconds: ", (delayInput) => {
        rl.close();
        const delay = parseInt(delayInput) * 1000;

        console.log(`Sending messages to ${uid} every ${delay / 1000} seconds...`);
        setInterval(() => {
          api.sendMessage(message.replace(/\\n/g, "\n"), uid, (err) => {
            if (err) {
              console.log("❌ Failed to send:", err);
            } else {
              console.log("✅ Message sent at", new Date().toLocaleTimeString());
            }
          });
        }, delay);
      });
    });
  });
});

const login = require("facebook-chat-api");
const fs = require("fs");
const readline = require("readline");

if (!fs.existsSync("appstate.json")) {
  console.error("❌ appstate.json not found. Please add your Facebook appstate file.");
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (query) => new Promise((resolve) => rl.question(query, resolve));

login({ appState: JSON.parse(fs.readFileSync("appstate.json", "utf8")) }, async (err, api) => {
  if (err) return console.error("❌ Login failed:", err);

  console.log("✅ Logged in successfully!");

  const uid = await ask("👤 Enter UID of recipient: ");
  const message = await ask("💬 Enter your message (use \n for new lines): ");
  const delay = parseInt(await ask("⏱️ Enter delay in seconds: "), 10) * 1000;
  rl.close();

  if (!uid || !message || isNaN(delay)) {
    console.error("❌ Invalid input. Please check UID, message, and delay.");
    return;
  }

  const sendMessage = () => {
    api.sendMessage(message.replace(/\n/g, "
"), uid, (err) => {
      if (err) {
        console.error("❌ Failed to send:", err);
      } else {
        console.log("✅ Message sent at", new Date().toLocaleTimeString());
      }
    });
  };

  sendMessage();
  setInterval(sendMessage, delay);
});

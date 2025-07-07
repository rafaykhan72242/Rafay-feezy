const login = require("facebook-chat-api");
const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

(async () => {
  let appState;
  try {
    appState = JSON.parse(fs.readFileSync("appstate.json", "utf8"));
  } catch (err) {
    console.error("❌ Failed to load appstate.json:", err.message);
    process.exit(1);
  }

  const uid = await ask("Enter Facebook UID: ");
  const rawMessage = await ask("Enter message (use \\n for new lines): ");
  const delaySeconds = parseInt(await ask("Enter delay (seconds): "), 10);
  rl.close();

  const message = rawMessage.replace(/\\n/g, "\n");
  const delay = isNaN(delaySeconds) ? 10 : delaySeconds;

  login({ appState }, (err, api) => {
    if (err) {
      console.error("❌ Login failed:", err);
      return;
    }

    console.log("✅ Logged in successfully. Sending messages every", delay, "seconds...");

    const sendLoop = () => {
      api.sendMessage(message, uid, (err) => {
        if (err) {
          console.error("❌ Failed to send:", err);
        } else {
          console.log("✅ Message sent at", new Date().toLocaleTimeString());
        }
      });
    };

    sendLoop(); // first send immediately
    setInterval(sendLoop, delay * 1000); // then send repeatedly
  });
})();

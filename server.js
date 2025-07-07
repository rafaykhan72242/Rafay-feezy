const express = require("express"); const login = require("facebook-chat-api"); const fs = require("fs"); const readline = require("readline");

const app = express(); const PORT = 5000;

app.use(express.json());

// Load appstate let appState; try { appState = JSON.parse(fs.readFileSync("appstate.json", "utf8")); } catch (error) { console.error("❌ Failed to read appstate.json. Make sure the file exists and is valid JSON."); process.exit(1); }

// Login and prompt user for input login({ appState }, (err, api) => { if (err) { console.error("❌ Login error:", err); return; } console.log("✅ Logged in successfully!");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question("Enter UID to send message: ", (uid) => { rl.question("Enter message (use | to separate multiple messages): ", (messageInput) => { const messages = messageInput.split("|").map(m => m.trim());

rl.question("Enter delay in seconds: ", (delayInput) => {
    const delay = parseInt(delayInput) * 1000;

    console.log("🚀 Starting message loop...");
    let index = 0;

    const sendMessage = () => {
      if (index >= messages.length) index = 0; // loop messages
      api.sendMessage(messages[index], uid, (err) => {
        if (err) {
          console.error("❌ Error sending message:", err);
        } else {
          console.log(`✅ Message sent: "${messages[index]}" at ${new Date().toLocaleTimeString()}`);
        }
      });
      index++;
    };

    sendMessage(); // Send first
    setInterval(sendMessage, delay);
    rl.close();
  });
});

}); });

app.listen(PORT, () => { console.log(🌐 Server running on http://localhost:${PORT}); });


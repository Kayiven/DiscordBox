const { Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = (client) => {
client.buttons = new Collection();

const buttonsPath = path.join(process.cwd(), "buttons");
function loadButtons(dir) { const files = fs.readdirSync(dir);
for (const file of files) { const fullPath = path.join(dir, file);

if (fs.statSync(fullPath).isDirectory()) {
loadButtons(fullPath); continue; }
if (!file.endsWith(".js")) continue;

const button = require(fullPath);
client.buttons.set(button.customId, button);
}}

loadButtons(buttonsPath);
client.on("interactionCreate", async (interaction) => {
if (!interaction.isButton()) return;

const button = client.buttons.get(interaction.customId);

if (!button) return;
await button.execute(interaction, client); 
}); };

const { Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = (client) => {
client.buttons = new Collection();

const commandsPath = path.join(__dirname, "../commands")
function loadButtons(dir) {
if (!fs.existsSync(dir)) return;

for (const file of fs.readdirSync(dir)) {
const fullPath = path.join(dir, file);
if (fs.statSync(fullPath).isDirectory()) {

loadButtons(fullPath);
continue; }

if (!file.endsWith(".js")) continue;
const command = require(fullPath);
if (!command.buttons) continue;

for (const [id, button] of Object.entries(command.buttons)) {
client.buttons.set(id, button);
}}}

loadButtons(commandsPath);
client.on("interactionCreate", async (interaction) => {
if (!interaction.isButton()) return;

const button = client.buttons.get(interaction.customId);
if (!button) return;
try {

await button(interaction, client);
} catch (error) {

console.error("[BUTTON ERROR]", error);
}})};

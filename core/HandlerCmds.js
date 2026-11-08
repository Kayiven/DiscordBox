// Updathing this Packges sonneer
const { Collection } = require("discord.js");
const path = require('node:path');
const fs = require('node:fs');

module.exports = (client) => {
client.commands = new Collection();

const commandsPath = path.join(__dirname, '../comds');
function loaderComds(directory) {
const files = fs.readdirSync(directory, { withFileTypes: true });

for(const file of files) {
const filePath = path.join(directory, file.name);
   
if(file.isDirectory()) { loaderComds(filePath); 
continue; }

if (!file.name.endsWith('.js')) continue;
const command = require(filePath);

if(!command.name || typeof command.execute !== 'function') {
console.warn(`[warning] The command you runing not in our data ${filePath}`);
continue; }

client.commands.set(command.name, command);
console.log(`[info] Command loaded: ${command.name}`); }}

loaderComds(commandsPath)};

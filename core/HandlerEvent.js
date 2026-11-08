const path = require('node:path');
const fs = require('node:fs');

module.exports = (client) => {
const eventsPath = path.join(__dirname, '../evonts');

function loaderevonts(directory) {
const files = fs.readdirSync(directory, { withFileTypes: true });

for(const file of files){
const filePath = path.join(directory, file.name);

if(file.isDirectory()) { loaderevonts(filePath);
continue; }

if(!file.name.endsWith('.js')) continue;
const event = require(filePath);

if(!event.name || typeof event.execute !== 'function') {
console.warn(`[warning] The event you runing not in our data ${filePath}`);
continue; }

const method = event.once ? 'once' : 'on';
client[method](event.name, (...args) => { event.execute(...args, client);
});

console.log(`[info] Events loaded: ${event.name}`);
}}

loaderevonts(eventsPath)};
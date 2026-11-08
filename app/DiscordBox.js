const { Client, GatewayIntentBits } = require("discord.js");
const path = require('node:path');
const dotenv = require('dotenv');

// update this path sonner with new clean one !!!
dotenv.config({
path: path.resolve(__dirname, '../Env/.env.TKBOT'),
quiet: true
});

const client = new Client({intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent ]});
require('../core/handlercmds')(client);
require('../core/HandlerEvent')(client);


client.login(process.env.TKBOT);

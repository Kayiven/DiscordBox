const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent ]});
require('../core/HandlerEnvs')();
require('../core/handlercmds')(client);
require('../core/HandlerEvent')(client);


client.login(process.env.TKBOT);

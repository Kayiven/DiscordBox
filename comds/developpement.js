const { EmbedBuilder } = require("@discordjs/builders")

module.exports = {
 name:'Version 0.1',
 description:'Command for development',
 Permissions:[""],
 cooldown: 0,
 
async execute(message, args, client) {
const C = new EmbedBuilder()
.setTitle("Version 0.1")
.setDescription("This is the first version of the bot, it is still in development and may contain bugs.")
.setColor("#00FF00")
.setFooter({text:"Bot by TKBOT"})

await message.reply({ embeds: [embed] }); 
}
}

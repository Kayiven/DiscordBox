const { EmbedBuilder } = require("@discordjs/builders")

module.exports = {
 name:'status',
 description:'Command for development',
 Permissions:[""],
 cooldown: 0,
 
async execute(message, args, client) {
const status = new EmbedBuilder()
.setTitle(" status")
.setDescription("This Status To Show information about channels acces and count System for specifque guild")
.addFields(
{ name: 'Client', value: 'Some value here' },
{ name: '\u200B', value: '\u200B' },
{ name: 'Inline field title', value: 'Some value here', inline: true },
{ name: 'Inline field title', value: 'Some value here', inline: true },
	)

await message.reply({ embeds: [status] }); 
}
}

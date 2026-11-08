const prefix_Oi = "!"

module.exports = {
 name: "messageCreate",
 description: "Event triggered when a message is created",

async execute(message, client){
 if(message.author.bot) return; // ignore messages from DM
 if(!message.content.startsWith(prefix_Oi)) return; // ignore messages for now more up comming
   
 const args = message.content.slice(prefix_Oi.length).trim().split(/ +/);
 const commandName = args.shift().toLowerCase();
 const command = client.commands.get(commandName)
 
 if(!command) return;
 try{
 await command.execute(message, args, client);
 
}catch(error){
console.error(error);
await message.reply("There was in error trying to be executeed !");

}}};

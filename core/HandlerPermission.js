
const { MessageFlags } = require("discord.js");
function HandlerPermissions(client) {

// Get permission settings from the command.
function getSettings(command) {
return command.permissions || null;
}

// Check whether Prefix or Slash is enabled.
function isEnabled(command, type) {
const settings = getSettings(command);

if (!settings) return false;
return settings[type] === true;
}

// Check Discord permissions.
function hasPermissions(memberPermissions, required = []) {
if (!Array.isArray(required)) return false;
if (required.length === 0) return true;
if (!memberPermissions) return false
return memberPermissions.has(required);
}

// Send permission error messages.
async function deny(context, content) {
const { message, interaction } = context;
if (interaction) {
const response = {
content,
flags: MessageFlags.Ephemeral
};

if (interaction.replied || interaction.deferred) {
return interaction.followUp(response);
}

return interaction.reply(response);
}if (message) {
return message.reply({ content });
}}

// Main permission checker.
async function check(command, context) {
const settings = getSettings(command);

// Every command must define permissions.
if (!settings) {
console.warn(`[PERMISSIONS] Missing settings: ${command.name}`);
await deny(context, "This command has no permission configuration.");
return false;
}

const { message, interaction } = context;
// Detect command type.
const type = interaction ? "slash" : "prefix";

// Check whether command type is enabled.
if (!isEnabled(command, type)) {
return false;
}

const guild = interaction
? interaction.guild
: message.guild;

const member = interaction
? interaction.member
: message.member;

// Require a server.
if (!guild || !member) {
await deny(context, "This command can only be used in a server.");
return false;
}

// Get user ID.
const userId = interaction
? interaction.user.id
: message.author.id;

// Owner-only check.
if (settings.ownerOnly === true) {
const owners = client.owners || [];

if (!owners.includes(userId)) {
await deny(context, "Only the bot owner can use this command.");
return false;
}}

// Check user permissions.
const userPermissions = interaction
? interaction.memberPermissions
: member.permissions;

if (!hasPermissions(userPermissions, settings.user)) {
await deny(context, "You don't have the required permissions.");
return false;
}

// Check bot permissions.
const botMember = guild.members.me;

if (!hasPermissions(botMember?.permissions, settings.bot)) {
await deny(context, "I don't have the required permissions.");
return false;
}

return true;
} return { getSettings, isEnabled, check };

} module.exports = HandlerPermissions;

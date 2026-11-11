const {Collection, REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");

function HandlerCommands(client) {

const COMMANDS_PATH = path.join(__dirname, "../comds");

// Command collections.
client.commands = new Collection();
client.prefixCommands = new Collection();
client.slashCommands = new Collection();

    // Initialize permission handler if not already initialized.
    if (!client.permissions) {
    const HandlerPermissions = require("./HandlerPermission");
    client.permissions = HandlerPermissions(client);
    }

    // Find all command files, including nested folders.
    function getCommandFiles(directory) {
    const files = [];
    if (!fs.existsSync(directory)) return files;

    const items = fs.readdirSync(directory, {withFileTypes: true});
    for (const item of items) {
    const fullPath = path.join(directory, item.name);

    if (item.isDirectory()) {
    files.push(...getCommandFiles(fullPath));
    } else if (item.isFile() && item.name.endsWith(".js")) 
    {files.push(fullPath);}}

    return files; }

    // Validate command permission settings.
    function validatePermissions(command) {
    const permissions = command.permissions;

    if (!permissions || typeof permissions !== "object") {
    console.warn(`[COMMAND] Missing permissions: ${command.name}`);
    return false;}

    if (
    typeof permissions.prefix !== "boolean" ||
    typeof permissions.slash !== "boolean" ||
    !Array.isArray(permissions.user) ||
    !Array.isArray(permissions.bot) ||
    typeof permissions.ownerOnly !== "boolean"
    ) {
    console.warn(`[COMMAND] Invalid permissions: ${command.name}`);
    return false;
    } return true;}

    // Register Prefix commands and aliases.
    function registerPrefix(command) {
        if (!client.permissions.isEnabled(command, "prefix")) return;

        const names = [
            command.name,
            ...(Array.isArray(command.aliases) ? command.aliases : [])
        ];

        for (const name of names) {
            if (typeof name !== "string" || !name.trim()) continue;

            const key = name.toLowerCase();

            if (client.prefixCommands.has(key)) {
                console.warn(`[PREFIX] Duplicate name or alias: ${key}`);
                continue;
            }

            client.prefixCommands.set(key, command);
        }
    }

    // Register Slash commands.
    function registerSlash(command) {
        if (!client.permissions.isEnabled(command, "slash")) return;

        if (!command.data || typeof command.data.toJSON !== "function") {
            console.warn(`[SLASH] Missing Slash data: ${command.name}`);
            return;
        }

        const data = command.data.toJSON();
        const name = data.name.toLowerCase();

        if (client.slashCommands.has(name)) {
            console.warn(`[SLASH] Duplicate command: ${name}`);
            return;
        }

        client.slashCommands.set(name, command);
    }

    // Load all commands.
    function loadCommands() {
        const files = getCommandFiles(COMMANDS_PATH);

        for (const file of files) {
            try {
                const command = require(file);

                if (
                    !command ||
                    typeof command.name !== "string" ||
                    !command.name.trim() ||
                    typeof command.execute !== "function"
                ) {
                    console.warn(`[COMMAND] Invalid file: ${file}`);
                    continue;
                }

                const name = command.name.toLowerCase();

                if (client.commands.has(name)) {
                    console.warn(`[COMMAND] Duplicate command: ${name}`);
                    continue;
                }

                if (!validatePermissions(command)) continue;

                // Save the main command.
                client.commands.set(name, command);

                // Register enabled command types.
                registerPrefix(command);
                registerSlash(command);

                console.log(`[COMMAND] Loaded: ${name}`);

            } catch (error) {
                console.error(`[COMMAND] Failed to load: ${file}`, error);
            }
        }

        console.log(`[COMMAND] Total loaded: ${client.commands.size}`);
        console.log(`[PREFIX] Registered: ${client.prefixCommands.size}`);
        console.log(`[SLASH] Registered: ${client.slashCommands.size}`);
    }

    // Deploy active Slash commands.
    async function deploySlash() {
        const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;

        if (!TOKEN || !CLIENT_ID) {
            console.warn("[SLASH] Missing TOKEN or CLIENT_ID.");
            return;
        }

        const commands = [...client.slashCommands.values()]
            .map(command => command.data.toJSON());

        const rest = new REST({ version: "10" }).setToken(TOKEN);

        const route = GUILD_ID
            ? Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID)
            : Routes.applicationCommands(CLIENT_ID);

        await rest.put(route, { body: commands });

        console.log(`[SLASH] Successfully deployed ${commands.length} commands.`);
    }

    // Start command loading.
    loadCommands();

    // Deploy after the bot is ready.
    client.once("ready", () => {
        deploySlash().catch(error => {
            console.error("[SLASH] Deployment error:", error);
        });
    });

    return {
        loadCommands,
        deploySlash,
        getCommandFiles
    };
}

module.exports = HandlerCommands;


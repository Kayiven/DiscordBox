module.exports = {
    customId: "ping",

    async execute(interaction) {
        await interaction.reply({
            content: "Pong! 🏓",
            ephemeral: true
        });
    }
};

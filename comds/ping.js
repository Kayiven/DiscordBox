module.exports = {
    name: "ping",
    description: "Ping command",

    async execute(message, args, client) {
        const { ActionRowBuilder, ButtonBuilder, ButtonStyle } =
            require("discord.js");

        const button = new ButtonBuilder()
            .setCustomId("ping_again")
            .setLabel("Ping Again")
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder()
            .addComponents(button);

        await message.reply({
            content: "Pong!",
            components: [row]
        });
    },

    buttons: {
        ping_again: async (interaction, client) => {
            await interaction.reply({
                content: "Pong again! 🏓",
                ephemeral: true
            });
        }
    }
};

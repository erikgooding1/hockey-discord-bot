const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        const locale = interaction.locale;
        console.log(locale);
        await interaction.deferReply({ ephemeral: true });
        await wait(4000);
        await interaction.followUp({ content: 'Secret Pong!', ephemeral: true });
        for (let i = 0; i < 10; i++) {
            await wait(500);
            if (i % 2 == 0) {
                await interaction.followUp('Ping!');
            }
            else {
                await interaction.followUp('Pong!');
            }
        }
        const message = await interaction.fetchReply();
        console.log(message.content);
        await interaction.deleteReply();
    },

};
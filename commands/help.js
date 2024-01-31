const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const command = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Provides help for the bot.');

const helpEmbed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle('Help for NHL Info Bot')
    .setAuthor({ name: 'NHL Info Bot', iconURL: 'https://logodownload.org/wp-content/uploads/2021/06/nhl-logo.png', url: 'https://discord.js.org' })
    .setDescription('NHL Info Bot is a Discord bot that retrieves live and historical statistics for the NHL, visit our website below for command documentation and more information.')
    .setThumbnail('https://logodownload.org/wp-content/uploads/2021/06/nhl-logo.png')
    .addFields(
        { name: 'Commands', value: '`/nextgame` `/standings` `/help`', inline: true },
    )


const website = new ButtonBuilder()
        .setLabel('Website')
        .setURL('https://hockey-bot.egood.tech/')
        .setStyle(ButtonStyle.Link);

const actionRow = new ActionRowBuilder()
        .addComponents(website);




module.exports = {
    data: command,
    async execute(interaction) {
        await interaction.reply({ 
            components: [actionRow],
            embeds: [helpEmbed]
        })
    },
};
const { SlashCommandBuilder, hyperlink, EmbedBuilder, Client } = require('discord.js');
const { getPlayer } = require('../scripts/getplayer');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playerinfo')
        .setDescription('Retrieves general info about a player')
        .addStringOption(option => 
            option
            .setName('player-name')
            .setDescription('Player name')
            .setRequired(true)),
            async execute(interaction) {
                console.log(interaction.options.getString('player-name'))
                const playerName = await interaction.options.getString('player-name');
                try {
                    let player = await getPlayer(playerName);
                    console.log(player);

                        const playerEmbed = new EmbedBuilder()
                            .setColor(0x0099FF)
                            .setAuthor({ name: 'NHL Info Bot', iconURL: 'https://logodownload.org/wp-content/uploads/2021/06/nhl-logo.png', url: 'https://discord.js.org' })
                            .setThumbnail(player.headshot);
                            playerEmbed.addFields(
                            {name: 'Name', value: `${player.name}`},
                            {name: 'Team', value: `${player.teamLogo} ${player.team}`},
                            {name: 'Position', value: `${player.position}`},
                            {name: 'Birthdate', value: `${player.birthdate}`},
                            {name: 'number', value: `${player.number}`}

                        )
                        await interaction.reply({
                            embeds: [playerEmbed],
                        });
                        

                } catch (error) {
                    console.error('Error fetching player:', error);
                    await interaction.reply('Error fetching player. Please try again later.');
                }
                
            }
        
}
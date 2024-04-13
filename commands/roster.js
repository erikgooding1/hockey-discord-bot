const { SlashCommandBuilder, hyperlink } = require('discord.js');
const { getRoster } = require('../scripts/teamroster');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roster')
        .setDescription('Get a teams current or former roster')
        .addStringOption(option => 
            option
            .setName('team')
            .setDescription('Team to retrieve roster from')
            .setAutocomplete(true)
            .setRequired(true))
            .addStringOption(option => 
                option
                .setName('year')
                .setDescription('Year of teams roster. Leave blank for current roster')
                .setRequired(false)),
            async autocomplete(interaction) {
                const focusedValue = interaction.options.getFocused().toLowerCase();
                const choices = [{ name: 'Avalanche', value: 'COL' },
                { name: 'Blackhawks', value: 'CHI' },
                { name: 'Blues', value: 'STL' },
                { name: 'Blue Jackets', value: 'CBJ' },
                { name: 'Bruins', value: 'BOS' },
                { name: 'Canadiens', value: 'MTL' },
                { name: 'Canucks', value: 'VAN' },
                { name: 'Capitals', value: 'WSH' },
                { name: 'Coyotes', value: 'ARI' },
                { name: 'Devils', value: 'NJD' },
                { name: 'Flames', value: 'CGY' },
                { name: 'Flyers', value: 'PHI' },
                { name: 'Golden Knights', value: 'VGK' },
                { name: 'Hurricanes', value: 'CAR' },
                { name: 'Islanders', value: 'NYI' },
                { name: 'Jets', value: 'WPG' },
                { name: 'Kings', value: 'LAK' },
                { name: 'Kraken', value: 'SEA' },
                { name: 'Lightning', value: 'TBL' },
                { name: 'Maple Leafs', value: 'TOR' },
                { name: 'Oilers', value: 'EDM' },
                { name: 'Panthers', value: 'FLA' },
                { name: 'Penguins', value: 'PIT' },
                { name: 'Predators', value: 'NSH' },
                { name: 'Rangers', value: 'NYR' },
                { name: 'Red Wings', value: 'DET' },
                { name: 'Sabres', value: 'BUF' },
                { name: 'Senators', value: 'OTT' },
                { name: 'Sharks', value: 'SJS' },
                { name: 'Stars', value: 'DAL' },
                { name: 'Wild', value: 'MIN' }];
                const filtered = choices.filter(choice => choice.name.toLowerCase().startsWith(focusedValue));
                let options;
                if (filtered.length > 25) {
                    options = filtered.slice(0, 25);
                }
                else {
                    options = filtered;
                }
                await interaction.respond(
                    options.map(choice => ({ name: choice.name, value: choice.value })),
                );
            },
            async execute(interaction) {
                const teamABBR = interaction.options.getString('team');
                const year = interaction.options.getString('year');
                try {
                    const roster = await getRoster(teamABBR, year);
                    if (roster) {
                        let rosterMessage = "Skaters:\n";
                        roster.skaters.forEach(player => {
                            rosterMessage += `#${player.number} | ${player.position} | ${player.name}\n`;
                        });
                        rosterMessage += "\nGoalies:\n";
                        roster.goalies.forEach(player => {
                            rosterMessage += `#${player.number} | ${player.position} | ${player.name}\n`;
                        });
                        await interaction.reply(rosterMessage);
                    } else {
                        await interaction.reply('Failed to fetch roster data.');
                    }
                } catch (error) {
                    console.error('Error fetching roster:', error);
                    await interaction.reply('Error fetching roster. Please try again later.');
                }
            }
        
}
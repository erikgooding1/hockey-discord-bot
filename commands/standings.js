const { SlashCommandBuilder, hyperlink } = require('discord.js');
const axios = require('axios');
const rootUrl = 'https://api-web.nhle.com/v1';

async function getStandings(year, format) {
    // TODO: Add handling for when format value is provided
    let standings = [];

    const processResponse = (response) => {
        response.data.standings.forEach(record => {
            const divisionName = record.divisionName;
            const teamName = record.teamName.default;
            const points = record.points;
            standings.push({ divisionName: divisionName, teamName: teamName, points: points });
        });
    }

    const formatStandings = (standings) => {
        let atlanticStandings = '';
        let metropolitanStandings = '';
        let centralStandings = '';
        let pacificStandings = '';
        standings.forEach(record => {
            switch (record.divisionName) {
                case 'Atlantic':
                    atlanticStandings += `${record.teamName} - ${record.points}\n`;
                    break;
                case 'Metropolitan':
                    metropolitanStandings += `${record.teamName} - ${record.points}\n`;
                    break;
                case 'Central':
                    centralStandings += `${record.teamName} - ${record.points}\n`;
                    break;
                case 'Pacific':
                    pacificStandings += `${record.teamName} - ${record.points}\n`;
                    break;
                default:
                    break;
            }
        });
        let formattedStandings = 'Atlantic Division:\n' + atlanticStandings + '\nMetropolitan Division:\n' + metropolitanStandings + '\nCentral Division:\n' + centralStandings + '\nPacific Division:\n' + pacificStandings;
        return formattedStandings;
    }

    if (year == null) {
        await axios.get(`${rootUrl}/standings/now`, {
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
            }
        }).then(response => processResponse(response));
    } else {
        // TODO: Add handling for when year value is provided
        return 5;
    }
    return formatStandings(standings);
}
module.exports = {
    data: new SlashCommandBuilder()
        .setName('standings')
        .setDescription("Get standings for any NHL year")
        .addStringOption(option =>
            option
                .setName('year')
                .setDescription('Year to retrieve, leave blank for current year')
                .setRequired(false))
        .addStringOption(option =>
            option
                .setName('format')
                .setDescription('Format to retrieve, default is by division')
                .setRequired(false)),
    async execute(interaction) {
        const year = interaction.options.getString('year');
        const standings = await getStandings(year);

        await interaction.reply(`Standings for ${year == null ? 'current' : year} season: \n\n${standings}`);
        
    }
};
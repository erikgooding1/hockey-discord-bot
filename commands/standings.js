const { SlashCommandBuilder, hyperlink } = require('discord.js');
const axios = require('axios');
const rootUrl = 'https://api-web.nhle.com/v1';

async function getStandings(year, format) {
    // TODO: Add handling for when format value is provided
    let standings = [];

    const processResponse = (response) => {
        response.data.standings.forEach(record => {
            standings.push({ 
                divisionName: record.divisionName, 
                conferenceName: record.conferenceName, 
                wildcardSequence: record.wildcardSequence, 
                teamName: record.teamName.default, 
                wins: record.wins, losses: record.losses, 
                otLosses: record.otLosses, 
                points: record.points 
            });
        });
    }

    const formatStandings = (standings, format) => {

        const formatConferenceStandings = (standings) => {
            console.log("Conference formatting");
            let easternStandings = '';
            let westernStandings = '';
            standings.forEach(record => {
                if(record.conferenceName === 'Eastern') {
                    easternStandings += `${record.teamName} - ${record.wins}W - ${record.losses}L - ${record.otLosses}OT - ${record.points}P\n`;
                } else {
                    westernStandings += `${record.teamName} - ${record.wins}W - ${record.losses}L - ${record.otLosses}OT - ${record.points}P\n`;
                }
            });
            let formattedStandings = 'Eastern Conference:\n' + easternStandings + '\nWestern Conference:\n' + westernStandings;
            return formattedStandings;
        }

        const formatWildcardStandings = (standings) => {
        }

        const formatLeagueStandings = (standings) => {

        }

        const formatDivisionStandings = (standings) => {
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


        switch (format) {
            case 'conference':
                return formatConferenceStandings(standings);
            case 'wildcard':
                return formatWildcardStandings(standings);
            case 'league':
                return formatLeagueStandings(standings);
            case 'division':
            default:
                return formatDivisionStandings(standings);
        }

    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    let requestUrl;

    if (year == null) {
            requestUrl = `${rootUrl}/standings/now`;
    } else {
        if(year + 1 >= currentYear) {
            requestUrl = `${rootUrl}/standings/now`;
        } else {
            requestUrl = `${rootUrl}/standings/${parseInt(year)+1}-02-01`
        }
    }

    await axios.get(requestUrl, {
        headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
        }
    }).then(response => processResponse(response));
    
    return formatStandings(standings, format);
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
                .addChoices(
                    {name: "Conference", value: "conference"},
                    {name: "Wildcard", value: "wildcard"},
                    {name: "League", value: "league"},
                    {name: "Division", value: "division"}
                )
                .setRequired(false)),

    async execute(interaction) {
        const year = interaction.options.getString('year');
        const format = interaction.options.getString('format');
        const standings = await getStandings(year, format);

        await interaction.reply(`Standings for ${year == null ? 'current' : year} season: \n\n${standings}`);

    }
};
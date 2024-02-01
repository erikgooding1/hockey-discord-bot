const { SlashCommandBuilder, hyperlink, EmbedBuilder } = require('discord.js');
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
                teamAbbrev: record.teamAbbrev.default,
                wins: record.wins, losses: record.losses,
                otLosses: record.otLosses,
                points: record.points
            });
        });
    }

    const formatStandings = (standings, format) => {

        // Function to calculate padding for each property
        function calculatePadding(value, maxWidth) {
            const padding = maxWidth - value.toString().length + 1;
            return ' '.repeat(padding);
        }

        // Calculate maximum widths for each property
        const maxWidths = {
            divisionName: Math.max(...standings.map(record => record.divisionName.length)),
            conferenceName: Math.max(...standings.map(record => record.conferenceName.length)),
            wildcardSequence: Math.max(...standings.map(record => record.wildcardSequence.toString().length)),
            teamName: Math.max(...standings.map(record => record.teamName.length)),
            teamAbbrev: Math.max(...standings.map(record => record.teamAbbrev.length), 6),
            wins: Math.max(...standings.map(record => record.wins.toString().length), 3),
            losses: Math.max(...standings.map(record => record.losses.toString().length), 3),
            otLosses: Math.max(...standings.map(record => record.otLosses.toString().length), 4),
            points: Math.max(...standings.map(record => record.points.toString().length), 3),
        };

        let standingsHeader = `\`TEAM${calculatePadding('TEAM', maxWidths.teamAbbrev)}W${calculatePadding('W', maxWidths.wins)}L${calculatePadding('L', maxWidths.losses)}OTL${calculatePadding('OTL', maxWidths.otLosses)}PTS${calculatePadding('PTS', maxWidths.points)}\n`;
        //let buildRecordString(record) = `${record.teamAbbrev}${calculatePadding(record.teamAbbrev, maxWidths.teamAbbrev)}${record.wins}${calculatePadding(record.wins, maxWidths.wins)}${record.losses}${calculatePadding(record.losses, maxWidths.losses)}${record.otLosses}${calculatePadding(record.otLosses, maxWidths.otLosses)}${record.points}${calculatePadding(record.points, maxWidths.points)}\n`;
        const buildRecordString = (record) => {
            return `${record.teamAbbrev}${calculatePadding(record.teamAbbrev, maxWidths.teamAbbrev)}${record.wins}${calculatePadding(record.wins, maxWidths.wins)}${record.losses}${calculatePadding(record.losses, maxWidths.losses)}${record.otLosses}${calculatePadding(record.otLosses, maxWidths.otLosses)}${record.points}${calculatePadding(record.points, maxWidths.points)}\n`;
        }

        const formatConferenceStandings = (standings) => {
            let easternStandings = standingsHeader;
            let westernStandings = standingsHeader;
            standings.forEach(record => {
                if (record.conferenceName === 'Eastern') {
                    easternStandings += buildRecordString(record);

                } else {
                    westernStandings += buildRecordString(record);
                }
            });
            easternStandings += '`\n';
            westernStandings += '`\n';
            let formattedStandings = 'Eastern Conference:\n' + easternStandings + 'Western Conference:\n' + westernStandings;
            return formattedStandings;
        }

        const formatWildcardStandings = (standings) => {
            let atlanticStandings = standingsHeader;
            let metropolitanStandings = standingsHeader;
            let centralStandings = standingsHeader;
            let pacificStandings = standingsHeader;
            let eastWildcardStandings = standingsHeader;
            let westWildcardStandings = standingsHeader;

            standings.forEach(record => {
                if (record.wildcardSequence == 0) {
                    console.log(record.teamName);
                    switch (record.divisionName) {
                        case 'Atlantic':
                            atlanticStandings += buildRecordString(record);
                            break;
                        case 'Metropolitan':
                            metropolitanStandings += buildRecordString(record);
                            break;
                        case 'Central':
                            centralStandings += buildRecordString(record);
                            break;
                        case 'Pacific':
                            pacificStandings += buildRecordString(record);
                            break;
                        default:
                            break;
                    }
                } else {
                    switch (record.conferenceName) {
                        case 'Eastern':
                            eastWildcardStandings += buildRecordString(record);
                            break;
                        case 'Western':
                            westWildcardStandings += buildRecordString(record);
                            break;
                        default:
                            break;
                    }
                }
                
            });
            atlanticStandings += '`\n';
            metropolitanStandings += '`\n';
            centralStandings += '`\n';
            pacificStandings += '`\n';
            eastWildcardStandings += '`\n';
            westWildcardStandings += '`\n';
            let formattedStandings = "East\n" + atlanticStandings + metropolitanStandings + eastWildcardStandings + "West\n" + centralStandings + pacificStandings + westWildcardStandings;
            console.log(formattedStandings);
            return formattedStandings;
        }

        const formatLeagueStandings = (standings) => {
            let leagueStandings = standingsHeader;
            standings.forEach(record => {
                leagueStandings += buildRecordString(record);
            });
            leagueStandings += '`\n';
            return leagueStandings;
        }

        const formatDivisionStandings = (standings) => {
            let atlanticStandings = standingsHeader;
            let metropolitanStandings = standingsHeader;
            let centralStandings = standingsHeader;
            let pacificStandings = standingsHeader;
            standings.forEach(record => {
                switch (record.divisionName) {
                    case 'Atlantic':
                        atlanticStandings += buildRecordString(record);
                        break;
                    case 'Metropolitan':
                        metropolitanStandings += buildRecordString(record);
                        break;
                    case 'Central':
                        centralStandings += buildRecordString(record);
                        break;
                    case 'Pacific':
                        pacificStandings += buildRecordString(record);
                        break;
                    default:
                        break;
                }
            });
            atlanticStandings += '`\n';
            metropolitanStandings += '`\n';
            centralStandings += '`\n';
            pacificStandings += '`\n';
            let formattedStandings = "Atlantic Division:\n" + atlanticStandings + "Metropolitan Division:\n" + metropolitanStandings + "Central Division:\n" + centralStandings + "Pacific Division:\n" + pacificStandings;
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
        if (year + 1 >= currentYear) {
            requestUrl = `${rootUrl}/standings/now`;
        } else {
            requestUrl = `${rootUrl}/standings/${parseInt(year) + 1}-02-01`
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
                    { name: "Conference", value: "conference" },
                    { name: "Wildcard", value: "wildcard" },
                    { name: "League", value: "league" },
                    { name: "Division", value: "division" }
                )
                .setRequired(false)),

    async execute(interaction) {
        const year = interaction.options.getString('year');
        const format = interaction.options.getString('format');

        const standingsEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setAuthor({ name: 'NHL Info Bot', iconURL: 'https://logodownload.org/wp-content/uploads/2021/06/nhl-logo.png', url: 'https://discord.js.org' })

        const standings = await getStandings(year, format);
        standingsEmbed.addFields({
            name: 'NHL Standings', value: `${standings}`, inline: false
        });
        await interaction.reply({
            embeds: [standingsEmbed],
        })
        //await interaction.reply(`Standings for ${year == null ? 'current' : year} season: \n\n${standings}`);

    }
};
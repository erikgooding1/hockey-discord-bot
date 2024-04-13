const { SlashCommandBuilder, hyperlink, EmbedBuilder, Client } = require('discord.js');
const axios = require('axios');
const rootUrl = 'https://api-web.nhle.com/v1';
const teamLogos = require('../assets/teamlogos.json');


async function getStandings(year, format) {
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

        let maxWidths;

        if(parseInt(year) > 1974) {
            maxWidths = {
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
        } else {
            maxWidths = {
                teamName: Math.max(...standings.map(record => record.teamName.length)),
                teamAbbrev: Math.max(...standings.map(record => record.teamAbbrev.length), 6),
                wins: Math.max(...standings.map(record => record.wins.toString().length), 3),
                losses: Math.max(...standings.map(record => record.losses.toString().length), 3),
                otLosses: Math.max(...standings.map(record => record.otLosses.toString().length), 4),
                points: Math.max(...standings.map(record => record.points.toString().length), 3),
            };
        }

        // Calculate maximum widths for each property
        

        let standingsHeader = `\`TEAM${calculatePadding('TEAM', 9)}W${calculatePadding('W', maxWidths.wins)}L${calculatePadding('L', maxWidths.losses)}OTL${calculatePadding('OTL', maxWidths.otLosses)}PTS${calculatePadding('PTS', maxWidths.points)}\`\n`;

        // Builds a string for each teams record provided all necessary data values, and also fetches team logo
        const buildRecordString = (record) => {
            let teamLogo = teamLogos[record.teamAbbrev];
            return `${teamLogo} \`${record.teamAbbrev}${calculatePadding(record.teamAbbrev, maxWidths.teamAbbrev)}${record.wins}${calculatePadding(record.wins, maxWidths.wins)}${record.losses}${calculatePadding(record.losses, maxWidths.losses)}${record.otLosses}${calculatePadding(record.otLosses, maxWidths.otLosses)}${record.points}${calculatePadding(record.points, maxWidths.points)}\`\n`;
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
            easternStandings += '\n';
            westernStandings += '\n';
            return {
                easternStandings: easternStandings,
                westernStandings: westernStandings

            }
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
                    if(record.conferenceName == "Eastern") {
                        eastWildcardStandings += buildRecordString(record);
                    } else {
                        westWildcardStandings += buildRecordString(record);
                    }
                }
                
            });
            atlanticStandings += '\n';
            metropolitanStandings += '\n';
            centralStandings += '\n';
            pacificStandings += '\n';
            eastWildcardStandings += '\n';
            westWildcardStandings += '\n';
            return {
                atlanticStandings: atlanticStandings,
                metropolitanStandings: metropolitanStandings,
                centralStandings: centralStandings,
                pacificStandings: pacificStandings,
                eastWildcardStandings: eastWildcardStandings,
                westWildcardStandings: westWildcardStandings
            }
            //return formattedStandings;
        }

        const formatLeagueStandings = (standings) => {
            let leagueStandings = standingsHeader;

            standings.forEach(record => {
                leagueStandings += buildRecordString(record);
            });

            return {
                leagueStandings: leagueStandings
            }
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
            atlanticStandings += '\n';
            metropolitanStandings += '\n';
            centralStandings += '\n';
            pacificStandings += '\n';
            return {
                atlanticStandings: atlanticStandings,
                metropolitanStandings: metropolitanStandings,
                centralStandings: centralStandings,
                pacificStandings: pacificStandings,
            }
        }

        if(parseInt(year) < 1975) {
            format = 'league';
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

    let requestUrl;

    if (year == null) {
        // If year is not provided get current season's standings
        requestUrl = `${rootUrl}/standings/now`;
    } else {

        // Else retrieve the end date for the season provided to make the request for the final standings of that date
        await axios.get(`${rootUrl}/standings-season`, {
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
            }
        }).then(response => {
            response.data.seasons.forEach(season => {
                if (Math.floor(season.id/10000) == year) {
                    requestUrl = `${rootUrl}/standings/${season.standingsEnd}`;
                }
            }
            );
        });
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

        const currDate = new Date();
        let currentSeason = currDate.getFullYear();
        if(currDate.getMonth() < 8) {
            currentSeason--;
        }

        if(!(!year || (parseInt(year) >= 1917 && parseInt(year) <= currentSeason))) {

            console.log("Invalid year");
            await interaction.reply(`Invalid year. Enter a value between 1917 and ${currentSeason}`);

        } else {
            const standingsEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setAuthor({ name: 'NHL Info Bot', iconURL: 'https://logodownload.org/wp-content/uploads/2021/06/nhl-logo.png', url: 'https://discord.js.org' })

            const standings = await getStandings(year, format);
            switch (format) {
                case 'conference':
                    standingsEmbed.addFields(
                        {name: 'Eastern Conference', value: `${standings.easternStandings}`},
                        {name: 'Western Conference', value: `${standings.westernStandings}`}
                    );
                    break;
                case 'wildcard':
                    standingsEmbed.addFields(
                        {name: 'Atlantic', value: `${standings.atlanticStandings}`},
                        {name: 'Metropolitan', value: `${standings.metropolitanStandings}`},
                        {name: 'Eastern WC', value: `${standings.eastWildcardStandings}`},
                        {name: 'Central', value: `${standings.centralStandings}`},
                        {name: 'Western', value: `${standings.pacificStandings}`}, 
                        {name: 'Western WC', value: `${standings.westWildcardStandings}`}
                    );
                    break;
                case 'league':
                    // uses setDescription due to fields having 1024 char limit
                    standingsEmbed.setDescription(`${standings.leagueStandings}`);
                    break;
                case 'division':
                default:
                    standingsEmbed.addFields(
                        {name: 'Atlantic', value: `${standings.atlanticStandings}`},
                        {name: 'Metropolitan', value: `${standings.metropolitanStandings}`},
                        {name: 'Central', value: `${standings.centralStandings}`},
                        {name: 'Western', value: `${standings.pacificStandings}`}
                    );
            }
            await interaction.reply({
                embeds: [standingsEmbed],
            });
        }

        

    }
};
const { SlashCommandBuilder, hyperlink } = require('discord.js');
const axios = require('axios');
const rootUrl = 'https://api-web.nhle.com/v1';

async function getNextGameDetails(teamABBR) {
    let details = {};
    await axios.get(`${rootUrl}/club-schedule/${teamABBR}/week/now`).then(response => {
        const rawDate = response.data.games[0].startTimeUTC;
        const venueOffset = response.data.games[0].venueUTCOffset;
        const utcTime = new Date(Date.parse(rawDate));
        const venueDateAndTime = new Date(utcTime.getTime() + (parseInt(venueOffset) * 60 * 60 * 1000));

        const homeTeamName = response.data.games[0].homeTeam.abbrev;
        const awayTeamName = response.data.games[0].awayTeam.abbrev;

        details.gameCenter = response.data.games[0].gameCenterLink;

        if (response.data.games[0].gameState = 'FUT') {
            details.status = 'Preview';
        }
        else {
            details.status = 'Live';
            details.homeTeamScore = 1;
            details.awayTeamScore = 2;
        }

        details.homeTeamName = homeTeamName;
        details.awayTeamName = awayTeamName;
        details.date = venueDateAndTime;
        details.timeZone = response.data.games[0].venueTimezone;
    });
    return details;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nextgame')
        .setDescription("Get your team's next game!")
        .addStringOption(option =>
            option
                .setName('team')
                .setDescription('Team to retrieve next game of')
                .setAutocomplete(true)
                .setRequired(true)),
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const choices = [{ name: 'Devils', value: 'NJD' },
        { name: 'Islanders', value: 'NYI' },
        { name: 'Rangers', value: 'NYR' },
        { name: 'Flyers', value: 'PHI' },
        { name: 'Penguins', value: 'PIT' },
        { name: 'Bruins', value: 'BOS' },
        { name: 'Sabres', value: 'BUF' },
        { name: 'Canadiens', value: 'MTL' },
        { name: 'Senators', value: 'OTT' },
        { name: 'Maple Leafs', value: 'TOR' },
        { name: 'Hurricanes', value: 'CAR' },
        { name: 'Panthers', value: 'FLA' },
        { name: 'Lightning', value: 'TBL' },
        { name: 'Capitals', value: 'WSH' },
        { name: 'Blackhawks', value: 'CHI' },
        { name: 'Red Wings', value: 'DET' },
        { name: 'Predators', value: 'NSH' },
        { name: 'Blues', value: 'STL' },
        { name: 'Flames', value: 'CGY' },
        { name: 'Avalanche', value: 'COL' },
        { name: 'Oilers', value: 'EDM' },
        { name: 'Canucks', value: 'VAN' },
        { name: 'Stars', value: 'DAL' },
        { name: 'Kings', value: 'LAK' },
        { name: 'Sharks', value: 'SJS' },
        { name: 'Blue Jackets', value: 'CBJ' },
        { name: 'Wild', value: 'MIN' },
        { name: 'Jets', value: 'WPG' },
        { name: 'Coyotes', value: 'ARI' },
        { name: 'Golden Knights', value: 'VGK' },
        { name: 'Kraken', value: 'SEA' }];
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
        const details = await getNextGameDetails(teamABBR);
        let outputDate;
        let minute;

        if (details.date.getHours() > 12) {
            const hour = details.date.getHours() - 12;
            details.date.getMinutes() == 0 ? minute = '00' : minute = details.date.getMinutes();

            outputDate = details.date.getMonth() + 1 + '/' + details.date.getDate() + '/' + details.date.getFullYear()
                + ' ' + hour + ':' + minute + 'pm';
        }
        else {
            details.date.getMinutes() == 0 ? minute = '00' : minute = details.date.getMinutes();
            outputDate = details.date.getMonth() + 1 + '/' + details.date.getDate() + '/' + details.date.getFullYear()
                + ' ' + details.date.getHours() + ':' + minute + 'am';
        }

        const url = 'https://www.nhl.com' + details.gameCenter;
        const link = hyperlink('Gamecenter', url);

        if (details.status == 'Live') {
            await interaction.reply(`${details.status}: ${details.homeTeamName} vs. ${details.awayTeamName}\n${details.homeTeamName}: ${details.homeTeamScore}\n${details.awayTeamName}: ${details.awayTeamScore}\nPeriod: ${details.period}\n${link}`);
        }
        else {
            await interaction.reply(`${details.homeTeamName} vs. ${details.awayTeamName}\nGame Date: ${outputDate} ${details.timeZone}\n${link}`);
        }
    },
};
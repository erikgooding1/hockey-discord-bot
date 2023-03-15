const { SlashCommandBuilder, hyperlink } = require('discord.js');
const axios = require('axios');
const rootUrl = 'https://statsapi.web.nhl.com/api/v1';

async function getNextGameDetails(teamID) {
    // eslint-disable-next-line prefer-const
    let details = {};
    await axios.get(`${rootUrl}/teams/${teamID}?expand=team.schedule.next`).then(response => {
        const rawDate = response.data.teams[0].nextGameSchedule.dates[0].games[0].gameDate;
        const gameDate = new Date(Date.parse(rawDate));

        const homeTeamName = response.data.teams[0].nextGameSchedule.dates[0].games[0].teams.home.team.name;
        const awayTeamName = response.data.teams[0].nextGameSchedule.dates[0].games[0].teams.away.team.name;

        details.gameCenter = response.data.teams[0].nextGameSchedule.dates[0].games[0].gamePk;

        if (response.data.teams[0].nextGameSchedule.dates[0].games[0].status.abstractGameState == 'Live') {
            details.status = 'Live';
            details.homeTeamScore = response.data.teams[0].nextGameSchedule.dates[0].games[0].teams.home.score;
            details.awayTeamScore = response.data.teams[0].nextGameSchedule.dates[0].games[0].teams.away.score;
            details.period = response.data.teams[0].nextGameSchedule.dates[0].games[0].status.statusCode;
        }
        else {
            details.status = 'Preview';
        }

        details.homeTeamName = homeTeamName;
        details.awayTeamName = awayTeamName;
        details.date = gameDate;
        details.timeZone = response.data.teams[0].venue.timeZone.tz;
    });
    return details;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nextgame')
        .setDescription('Get the caps next game!')
        .addStringOption(option =>
            option
                .setName('team')
                .setDescription('Team to retrieve next game of')
                .setAutocomplete(true)
                .setRequired(true)),
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const choices = [{ name: 'Devils', value: '1' },
        { name: 'Islanders', value: '2' },
        { name: 'Rangers', value: '3' },
        { name: 'Flyers', value: '4' },
        { name: 'Penguins', value: '5' },
        { name: 'Bruins', value: '6' },
        { name: 'Sabres', value: '7' },
        { name: 'Canadiens', value: '8' },
        { name: 'Senators', value: '9' },
        { name: 'Maple Leafs', value: '10' },
        { name: 'Hurricanes', value: '12' },
        { name: 'Panthers', value: '13' },
        { name: 'Lightning', value: '14' },
        { name: 'Capitals', value: '15' },
        { name: 'Blackhawks', value: '16' },
        { name: 'Red Wings', value: '17' },
        { name: 'Predators', value: '18' },
        { name: 'Blues', value: '19' },
        { name: 'Flames', value: '20' },
        { name: 'Avalanche', value: '21' },
        { name: 'Oilers', value: '22' },
        { name: 'Canucks', value: '23' },
        { name: 'Stars', value: '25' },
        { name: 'Kings', value: '26' },
        { name: 'Sharks', value: '28' },
        { name: 'Blue Jackets', value: '29' },
        { name: 'Wild', value: '30' },
        { name: 'Jets', value: '52' },
        { name: 'Coyotes', value: '53' },
        { name: 'Golden Knights', value: '54' },
        { name: 'Kraken', value: '55' }];
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
        const teamID = interaction.options.getString('team');
        const details = await getNextGameDetails(teamID);
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

        const url = 'https://www.nhl.com/gamecenter/' + details.gameCenter;
        const link = hyperlink('Gamecenter', url);

        if (details.status == 'Live') {
            await interaction.reply(`${details.status}: ${details.homeTeamName} vs. ${details.awayTeamName}\n${details.homeTeamName}: ${details.homeTeamScore}\n${details.awayTeamName}: ${details.awayTeamScore}\nPeriod: ${details.period}\n${link}`);
        }
        else {
            await interaction.reply(`${details.homeTeamName} vs. ${details.awayTeamName}\nGame Date: ${outputDate} ${details.timeZone}\n${link}`);
        }
    },
};
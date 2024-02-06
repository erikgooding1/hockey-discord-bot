const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

// api endpoints and filters:
// https://api.nhle.com/stats/rest/en/config

async function getStatLeaders(stat, year) {
  // API endpoints
  const skaterLeadersUrl = "https://api.nhle.com/stats/rest/en/leaders";
  const skaterSummaryUrl = "https://api.nhle.com/stats/rest/en/skater/summary";
  const goalieSummaryUrl = "https://api.nhle.com/stats/rest/en/goalie/summary";
  const skaterRealtimeUrl = "https://api.nhle.com/stats/rest/en/skater/realtime";

  // Arrays of stats with associated API endpoints
  const skaterSummaryStats = ["points", "goals", "assists", "shots", "plusMinus", "penaltyMinutes", "timeOnIce", "faceoffWinPct", "powerplayGoals", "shGoals"];
  const skaterRealtimeStats = ["hits", "blockedShots"];
  const goalieSummaryStats = ["saves", "savePercentage", "goalsAgainstAverage", "shutouts", "wins", "losses", "overtimeLosses", "goalsAgainst", "shotsAgainst"];

  // Helper functions
  function convertYearToYearID(parseIntyear) {
    const nextYear = parseInt(year) + 1;
    return parseInt(`${year}${nextYear}`);
  }

  let requestUrl = "";
  if (year === null) {
    const date = new Date();
    const month = date.getMonth();
    if (month < 9) {
      year = date.getFullYear() - 1;
    } else {
      year = date.getFullYear();
    }
  }
  const yearID = convertYearToYearID(year);

  if(skaterSummaryStats.includes(stat)) {
    requestUrl = `${skaterSummaryUrl}?limit=5&sort=${stat}&dir=DESC&cayenneExp=seasonId=${yearID}`;
  } else if (skaterRealtimeStats.includes(stat)) {
    requestUrl = `${skaterRealtimeUrl}?limit=5&sort=${stat}&dir=DESC&cayenneExp=seasonId=${yearID}`;
  } else if (goalieSummaryStats.includes(stat)) {
    requestUrl = `${goalieSummaryUrl}?limit=5&sort=${stat}&dir=DESC&cayenneExp=seasonId=${yearID}`;
  } else {
    return "Something is wrong";
  }
  try {
    const response = await axios.get(requestUrl);
    if (response.status === 200) {
      let statString = `Leaders in ${stat} for the ${year} season:\n`;
      let data = response.data.data;

      for (let i = 0; i < 5; i++) {
        //Will need to add logic for goalie name retrieval
        let playerName = data[i]["skaterFullName"];
        statString += `${i+1}. ${playerName} - ${data[i][stat]}\n`;
      }
      
      console.log(`Got the top ${stat} leaders.`);
      return statString;
    } else {
      console.log(`Error: ${response.status}`);
      return `Error: ${response.status}`;
    }
  } catch (error) {
    console.error(error);
    return `Error: ${error}`;
  }

}

  module.exports = {
    data: new SlashCommandBuilder()
      .setName('topstats')
      .setDescription('Get the leaders for various stats in the NHL.')
      .addStringOption(option =>
        option
            .setName('stat')
            .setDescription('Stat to retrieve.')
            .setRequired(true)
            .addChoices(
              // /skater/summary
              { name: "Points", value: "points" },
              { name: "Goals", value: "goals" },
              { name: "Assists", value: "assists" },
              { name: "Shots", value: "shots" },
              { name: "Plus/Minus", value: "plusMinus" },
              { name: "Penalty Minutes", value: "penaltyMinutes" },
              { name: "Time On Ice", value: "timeOnIce" },
              { name: "Faceoff Win Percentage", value: "faceoffWinPct" },
              { name: "Powerplay Goals", value: "powerplayGoals" },
              { name: "Shorthanded Goals", value: "shGoals"},

              // /skater/realtime
              { name: "Hits", value: "hits" },
              { name: "Blocked shots", value: "blockedShots" },
              
              // /goalie/summary
              { name: "Saves", value: "saves" },
              { name: "Save Percentage", value: "savePct" },
              { name: "Goals Against Average", value: "goalsAgainstAverage" },
              { name: "Shutouts", value: "shutouts" },
              { name: "Wins", value: "wins" },
              { name: "Losses", value: "losses" },
              { name: "Overtime Losses", value: "otLosses" },
              { name: "Goals Against", value: "goalsAgainst" },
              { name: "Shots Against", value: "shotsAgainst" },
            )
      )
      .addStringOption(option =>
        option
          .setName('year')
          .setDescription('Year to rerieve, leave blank for current season.')
          .setRequired(false)),

    async execute(interaction) {
      const stat = interaction.options.getString('stat');
      const year = interaction.options.getString('year');

      const retrievedStats = await getStatLeaders(stat, year);

      await interaction.reply(`${retrievedStats}`);
    }
      
  };
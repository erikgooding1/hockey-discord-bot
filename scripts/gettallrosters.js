const axios = require('axios');
const { getRoster } = require('./teamroster');
const fs = require('fs');

const nhl_teams = [
    "ANA", "ARI", "BOS", "BUF", "CGY", "CAR", "CHI", "COL",
    "CBJ", "DAL", "DET", "EDM", "FLA", "LAK", "MIN", "MTL",
    "NSH", "NJD", "NYI", "NYR", "OTT", "PHI", "PIT", "SJS",
    "STL", "TBL", "TOR", "VAN", "VGK", "WSH", "WPG", "SEA"
];

const rootUrl = 'https://api-web.nhle.com/v1';

async function getAllRosters( year = "current") {

    const rostersObject = {};

    await Promise.all(nhl_teams.map(async team => {
        try {
            const roster = await getRoster(team, year);
            rostersObject[team] = roster;
        } catch (error) {
            console.error(`Error fetching roster for ${team}:`, error);
        }
    }));

    return rostersObject;

    /*
    const jsonData = JSON.stringify(rostersObject, null, 2);

    fs.writeFile('teams.json', jsonData, err => {
        if(err) {
            console.error('Error writing JSON file:', err);
            return;
        }
    })
    console.log("Written.");
    */
    
}

function pushPlayer(array, player) {
    array.push({
        name: player["firstName"]["default"] + " " + player["lastName"]["default"],
        number: player["sweaterNumber"],
        position: player["positionCode"],
        playerId: player["id"]
    })
}

//getAllRosters();

module.exports = { getAllRosters }
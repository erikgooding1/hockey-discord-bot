const axios = require('axios');

const nhl_teams = [
    "ANA", "ARI", "BOS", "BUF", "CGY", "CAR", "CHI", "COL",
    "CBJ", "DAL", "DET", "EDM", "FLA", "LAK", "MIN", "MTL",
    "NSH", "NJD", "NYI", "NYR", "OTT", "PHI", "PIT", "SJS",
    "STL", "TBL", "TOR", "VAN", "VGK", "WSH", "WPG", "SEA"
];

const rootUrl = 'https://api-web.nhle.com/v1';


function getRoster(team, year = "current") {
    let requestUrl = rootUrl;
    if(!year) {
        year = "current";
    }
    if(year == "current") {
        requestUrl += `/roster/${team}/current`;
    } else {
        requestUrl += `/roster/${team}/${parseInt(year)}${parseInt(year)+1}`
    }

    //console.log(requestUrl)

    return new Promise((resolve, reject) => {
        if (nhl_teams.includes(team)) {
            axios.get(requestUrl, {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                }
            })
                .then(response => {
                    let skaters = [];
                    let goalies = [];

                    response.data["forwards"].forEach(forward => {
                        pushPlayer(skaters, forward);
                    });

                    response.data["defensemen"].forEach(defenseman => {
                        pushPlayer(skaters, defenseman);
                    });

                    response.data["goalies"].forEach(goalie => {
                        pushPlayer(goalies, goalie);
                    });

                    /*skaters.forEach(forward => {
                        console.log("#" + forward["number"] + " | " + forward["position"], " | " + forward["name"]);
                    });

                    goalies.forEach(goalie => {
                        console.log("#" + goalie["number"] + " | " + goalie["position"], " | " + goalie["name"]);
                    });
                    */

                    const rosterData = {
                        skaters: skaters,
                        goalies: goalies
                    };
                    resolve(rosterData);
                })
                .catch(error => {
                    console.error("Error fetching roster:", error);
                    reject("Error fetching roster data");
                });
        } else {
            console.log("Invalid Team");
            reject("Invalid Team");
        }
    });
}

function pushPlayer(array, player) {
    array.push({
        name: player["firstName"]["default"] + " " + player["lastName"]["default"],
        number: player["sweaterNumber"],
        position: player["positionCode"],
        playerId: player["id"]
    })
}


module.exports = { getRoster }
const axios = require('axios');
const { getAllRosters } = require('./gettallrosters');
const fs = require('fs');
const teamLogos = require('../assets/teamlogos.json');

async function getPlayer(playerName) {


    const seasonRoster = await getAllRosters();
    let found = false;
    let playerId = 0;

    return new Promise((resolve, reject) => {
    
        for(let team in seasonRoster) {
            if(found) {
                break;
            }
            if(seasonRoster.hasOwnProperty(team)) {
                for(let skater in seasonRoster[team]["skaters"]) {
                    if(seasonRoster[team]["skaters"][skater]["name"] == playerName) {
                        console.log("Found!");
                        found = true;
                        playerId = seasonRoster[team]["skaters"][skater]["playerId"];
                        break;
                    }
                }
                if(found) {
                    break;
                }
                for(let goalie in seasonRoster[team]["goalies"]) {
                    if(goalie["name"] == playerName) {
                        found = true;
                        playerId = goalie["id"];
                        break;
                    }
                }
            }
            
            
        }
        if(!found) {
            reject("Player not found");
        } else {

            console.log("PLAYER ID" + playerId);
            const requestUrl = `https://api-web.nhle.com/v1/player/${playerId}/landing`;


            

                    axios.get(requestUrl, {
                        headers: {
                            'Cache-Control': 'no-cache',
                            'Pragma': 'no-cache',
                        }
                    }).then(response => {
                        console.log(playerName);
                        console.log(teamLogos[response.data["currentTeamAbbrev"]]);
                        console.log(response.data["currentTeamAbbrev"]);
                        console.log(response.data["position"]);
                        console.log(response.data["headshot"]);
                        console.log(response.data["birthDate"]);
                        console.log(response.data["sweaterNumber"]);

                        const player = {
                            name: playerName,
                            teamLogo: teamLogos[response.data["currentTeamAbbrev"]],
                            team: response.data["currentTeamAbbrev"],
                            position: response.data["position"],
                            headshot: response.data["headshot"],
                            birthdate: response.data["birthDate"],
                            number: response.data["sweaterNumber"]
                        }
                        
                        resolve(player);
                            
                        
                    });

            
        }

    });
} 


//etPlayer("Alex Ovechkin");

module.exports = { getPlayer }
const nhl_teams = [
    "ANA", "ARI", "BOS", "BUF", "CGY", "CAR", "CHI", "COL",
    "CBJ", "DAL", "DET", "EDM", "FLA", "LAK", "MIN", "MTL",
    "NSH", "NJD", "NYI", "NYR", "OTT", "PHI", "PIT", "SJS",
    "STL", "TBL", "TOR", "VAN", "VGK", "WSH", "WPG", "SEA"
]

// Save this code in a file named script.js

// Access command line arguments
const args = process.argv;

// Print the arguments
console.log('Arguments:', args);

// Access specific arguments
const arg1 = args[2]; // The first argument after 'node' and the script filename
const arg2 = args[3]; // The second argument
// You can continue this pattern to access more arguments if needed

// Print specific arguments
console.log('First argument:', arg1);
console.log('Second argument:', arg2);

// Example usage: node script.js arg1 arg2

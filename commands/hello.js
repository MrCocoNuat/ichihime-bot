const { helloMessage } = require('../message');

async function handleHelloCommand(interaction) {
        const tiles = [
            '1 Man', '2 Man', '3 Man', '4 Man', '5 Man', '6 Man', '7 Man', '8 Man', '9 Man',
            '1 Pin', '2 Pin', '3 Pin', '4 Pin', '5 Pin', '6 Pin', '7 Pin', '8 Pin', '9 Pin',
            '1 Sou', '2 Sou', '3 Sou', '4 Sou', '5 Sou', '6 Sou', '7 Sou', '8 Sou', '9 Sou',
            'East', 'South', 'West', 'North', 'White Dragon', 'Green Dragon', 'Red Dragon'
        ];
        const luckyTile = tiles[Math.floor(Math.random() * tiles.length)];
        await interaction.reply(helloMessage(luckyTile));
}

module.exports = {
    handleHelloCommand
};
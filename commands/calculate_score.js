const { invalidFuMessage, requiredFuMessage, pointsTsumoMessage, pointsRonMessage } = require("../message");

function handleCalculateScoreCommand(interaction) {
    // get arguments
    const han = interaction.options.getInteger('han');
    const fu = interaction.options.getInteger('fu') || 0;
    const isDealer = interaction.options.getBoolean('dealer') || false;
    const isTsumo = interaction.options.getBoolean('tsumo') || false;
    if (fu != 25 && fu % 10 !== 0) {
        // 0 fu is allowed for hands that don't require fu
        interaction.reply(invalidFuMessage()); 
        return;
    }

    // calculate score
    let basePoints;
    if (han >= 13) {
        basePoints = 8000; // Yakuman
    }
    else if (han >= 11) {
        basePoints = 6000; // Sanbaiman
    }
    else if (han >= 8) {
        basePoints = 4000; // Baiman
    }
    else if (han >= 6) {
        basePoints = 3000; // Haneman
    }
    else if (han === 5) {
        basePoints = 2000; // Mangan
    }
    else {
        if (fu < 20 || fu > 110) {
            interaction.reply(requiredFuMessage());
            return;
        }
        basePoints = fu * Math.pow(2, han + 2);
        if (basePoints > 2000) basePoints = 2000; // Cap at Mangan
    }
    
    if (isTsumo){
        const pointsPerPlayer = Math.ceil(basePoints / 100) * 100;
        interaction.reply(pointsTsumoMessage(han, fu, isDealer, pointsPerPlayer));
    } else {
        const totalPoints = Math.ceil(basePoints * (isDealer ? 6 : 4) / 100) * 100;
        interaction.reply(pointsRonMessage(han, fu, isDealer, totalPoints));   
    }
}

module.exports = { handleCalculateScoreCommand };
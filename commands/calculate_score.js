function handleCalculateScoreCommand(interaction) {
    // get arguments
    const han = interaction.options.getInteger('han');
    const fu = interaction.options.getInteger('fu') || 0;
    const isDealer = interaction.options.getBoolean('dealer') || false;
    const isTsumo = interaction.options.getBoolean('tsumo') || false;
    if (fu != 25 && fu % 10 !== 0) {
        interaction.reply('Fu must be 25 or a multiple of 10.'); // 0 fu is allowed for hands that don't require fu
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
            interaction.reply('Fu is required to calculate score for this hand');
            return;
        }
        basePoints = fu * Math.pow(2, han + 2);
        if (basePoints > 2000) basePoints = 2000; // Cap at Mangan
    }
    
    if (isTsumo){
        const pointsPerPlayer = Math.ceil(basePoints / 100) * 100;
        interaction.reply(`A ${han}h ${fu}f ${isDealer ? 'dealer ' : ''}tsumo scores ${isDealer ? `${pointsPerPlayer * 2} all` : `${pointsPerPlayer}/${pointsPerPlayer * 2}`}`);
    } else {
        const totalPoints = Math.ceil(basePoints * (isDealer ? 6 : 4) / 100) * 100;
        interaction.reply(`A ${han}h ${fu}f ${isDealer ? 'dealer ' : ''}ron scores ${totalPoints} points`);   
    }
}

module.exports = { handleCalculateScoreCommand };
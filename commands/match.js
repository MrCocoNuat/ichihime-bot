// commands/match.js
const { insertGame, selectFriendCode } = require('../db');
const { matchInProgressMessage } = require('../message');

function getPlayerMentionsWithCodes(players, callback) {
    if (players.length === 0) return callback('');
    let mentions = [];
    let count = 0;
    players.forEach(id => {
        selectFriendCode(id, (err, row) => {
            let code = row && row.friendCode ? row.friendCode : 'friend code not set!';
            mentions.push(`<@${id}> - ${code}`);
            count++;
            if (count === players.length) {
                callback(mentions.join('\n'));
            }
        });
    });
}

async function handleMatchCommand(interaction) {
    const players = [];
    const capacity = interaction.options.getInteger('players') || 4;
    getPlayerMentionsWithCodes(players, async (playerMentions) => {
        await interaction.reply({
            content: matchInProgressMessage(players, capacity, playerMentions)
        });
        const message = await interaction.fetchReply();
        insertGame(message, players, capacity);
    });
}

module.exports = { handleMatchCommand, getPlayerMentionsWithCodes };

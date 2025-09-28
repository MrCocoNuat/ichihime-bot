// commands/match.js
const db = require('../db');

function getPlayerMentionsWithCodes(players, callback) {
    if (players.length === 0) return callback('');
    let mentions = [];
    let count = 0;
    players.forEach(id => {
        db.get('SELECT friendCode FROM player WHERE discordId = ?', [id], (err, row) => {
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
            content: `Matchmaking started!\nPlayers (${players.length}/${capacity}):\n${playerMentions}\nReact with 👍 to join!`
        });
        const msg = await interaction.fetchReply();
        db.run(`INSERT INTO game (messageId, channelId, players, capacity, completed) VALUES (?, ?, ?, ?, 0)`,
            [msg.id, msg.channel.id, JSON.stringify(players), capacity]);
    });
}

module.exports = { handleMatchCommand, getPlayerMentionsWithCodes };

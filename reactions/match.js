// reactions/match.js
const db = require('../db');
const { getPlayerMentionsWithCodes } = require('../commands/match');
const { matchCompletedMessage, matchJoinNotifMessage, matchInProgressMessage, matchCanceledMessage } = require('../message');

function markGameCompleted(reaction, game, players, playerMentions, forced = false) {
    db.run(`UPDATE game SET players = ?, completed = 1 WHERE messageId = ?`, [JSON.stringify(players), reaction.message.id]);
    const content = matchCompletedMessage(forced, players, game.capacity, playerMentions);
    reaction.message.edit(content);
    // re-notify players to join the match
    reaction.message.reply({ content: matchJoinNotifMessage(players)});
}

function updateGamePlayersAndMessage(reaction, players, playerMentions, game) {
    const content = matchInProgressMessage(players, game.capacity, playerMentions);
    db.run(`UPDATE game SET players = ? WHERE messageId = ?`, [JSON.stringify(players), reaction.message.id]);
    reaction.message.edit(content);
}

function markGameCanceled(reaction) {
    db.run(`UPDATE game SET completed = -1 WHERE messageId = ?`, [reaction.message.id]);
    reaction.message.edit(matchCanceledMessage());
}

function handleMatchReactionAdd(reaction, user) {
    const validEmojis = ['❌', '👍', '✅'];
    if (user.bot || !validEmojis.includes(reaction.emoji.name)) return; 
    db.get(`SELECT * FROM game WHERE messageId = ?`, [reaction.message.id], (err, game) => {
        if (err || !game || game.completed) return; // No game found or already completed
        switch (reaction.emoji.name) {
            case '❌':
                markGameCanceled(reaction);
                break;
            case '👍': {
                let players = JSON.parse(game.players);
                if (players.includes(user.id) || players.length >= game.capacity) return;
                players.push(user.id);
                getPlayerMentionsWithCodes(players, (playerMentions) => {
                    if (players.length >= game.capacity) {
                        markGameCompleted(reaction, game, players, playerMentions);
                    } else {
                        updateGamePlayersAndMessage(reaction, players, playerMentions, game);
                    }
                });
                break;
            }
            case '✅': {
                let players = JSON.parse(game.players);
                getPlayerMentionsWithCodes(players, (playerMentions) => {
                    markGameCompleted(reaction, game, players, playerMentions, true);
                });
                break;
            }
        }
    });
}

function handleMatchReactionRemove(reaction, user) {
    const validEmojis = ['👍'];
    if (!validEmojis.includes(reaction.emoji.name) || user.bot) return;
    db.get(`SELECT * FROM game WHERE messageId = ?`, [reaction.message.id], (err, game) => {
        if (err || !game || game.completed) return; // No game found or already completed
        switch (reaction.emoji.name) {
            case '👍': {
                let players = JSON.parse(game.players);
                if (!players.includes(user.id)) return;
                players = players.filter(id => id !== user.id);
                getPlayerMentionsWithCodes(players, (playerMentions) => {
                    updateGamePlayersAndMessage(reaction, players, playerMentions, game);
                });
                break;
            }
        }
    });
}

module.exports = { handleMatchReactionAdd, handleMatchReactionRemove };

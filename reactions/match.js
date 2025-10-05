// reactions/match.js
const db = require('../db_schema');
const { getPlayerMentionsWithCodes } = require('../commands/match');
const { matchCompletedMessage, matchJoinNotifMessage, matchInProgressMessage, matchCanceledMessage } = require('../message');
const { updateGameCanceled, updateGamePlayers, updateGameCompleted, selectGame } = require('../db');

function markGameCompleted(reaction, game, players, playerMentions, forced = false) {
    updateGameCompleted(reaction.message.id, players);
    reaction.message.edit(matchCompletedMessage(forced, players, game.capacity, playerMentions, game.scheduledTime));
    // re-notify players to join the match
    reaction.message.reply({ content: matchJoinNotifMessage(players)});
}

function updateGamePlayersAndMessage(reaction, players, playerMentions, game) {
    updateGamePlayers(reaction.message.id, players);
    reaction.message.edit(matchInProgressMessage(players, game.capacity, playerMentions, game.scheduledTime));
}

function markGameCanceled(reaction) {
    updateGameCanceled(reaction.message.id);
    reaction.message.edit(matchCanceledMessage());
}

function handleMatchReactionAdd(reaction, user) {
    const validEmojis = ['❌', '👍', '✅'];
    if (user.bot || !validEmojis.includes(reaction.emoji.name)) return; 
    selectGame(reaction.message.id, (err, game) => {
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
    selectGame(reaction.message.id, (err, game) => {
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

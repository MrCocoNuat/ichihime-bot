// reactions/match.js
const db = require('../db');
const { getPlayerMentionsWithCodes } = require('../commands/match');

function handleMatchReactionAdd(reaction, user) {
    if (user.bot) return;
    // Cancel game with ❌
    if (reaction.emoji.name === '❌') {
        db.get(`SELECT * FROM game WHERE messageId = ?`, [reaction.message.id], (err, game) => {
            if (err || !game || game.completed) return; // message doesn't correspond to an open game
            db.run(`UPDATE game SET completed = 1 WHERE messageId = ?`, [reaction.message.id]);
            reaction.message.edit('Matchmaking canceled.');
        });
        return;
    }
    if (reaction.emoji.name === '👍') {
        db.get(`SELECT * FROM game WHERE messageId = ?`, [reaction.message.id], (err, game) => {
            if (err || !game || game.completed) return; // message doesn't correspond to an open game
            let players = JSON.parse(game.players);
            if (players.includes(user.id) || players.length >= game.capacity) return;
            players.push(user.id);
            getPlayerMentionsWithCodes(players, (playerMentions) => {
                let content;
                if (players.length >= game.capacity) {
                    content = `Matchmaking completed!\nPlayers (${players.length}/${game.capacity}):\n${playerMentions}\nGame is full!`;
                    db.run(`UPDATE game SET players = ?, completed = 1 WHERE messageId = ?`, [JSON.stringify(players), reaction.message.id]);
                } else {
                    content = `Matchmaking started!\nPlayers (${players.length}/${game.capacity}):\n${playerMentions}\nReact with 👍 to join!`;
                    db.run(`UPDATE game SET players = ? WHERE messageId = ?`, [JSON.stringify(players), reaction.message.id]);
                }
                reaction.message.edit(content);
            });
        });
    }
}

function handleMatchReactionRemove(reaction, user) {
    if (reaction.emoji.name !== '👍' || user.bot) return;
    db.get(`SELECT * FROM game WHERE messageId = ?`, [reaction.message.id], (err, game) => {
        if (err || !game || game.completed) return; // message doesn't correspond to an open game
        let players = JSON.parse(game.players);
        if (!players.includes(user.id)) return;
        players = players.filter(id => id !== user.id);
        db.run(`UPDATE game SET players = ? WHERE messageId = ?`, [JSON.stringify(players), reaction.message.id]);
        getPlayerMentionsWithCodes(players, (playerMentions) => {
            const content = `Matchmaking started!\nPlayers (${players.length}/${game.capacity}):\n${playerMentions}\nReact with 👍 to join!`;
            reaction.message.edit(content);
        });
    });
}

module.exports = { handleMatchReactionAdd, handleMatchReactionRemove };

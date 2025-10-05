const db = require('./db_schema');

function upsertFriendCode(discordId, friendCode, cb){
    db.run(`INSERT INTO player (discordId, friendCode) VALUES (?, ?) ON CONFLICT(discordId) DO UPDATE SET friendCode = ?`,
            [discordId, friendCode, friendCode],
            cb
        );
}

function selectFriendCode(discordId, cb){
    db.get('SELECT friendCode FROM player WHERE discordId = ?', [discordId], cb);
}

function insertGame(message, players, capacity){
    db.run(`INSERT INTO game (messageId, channelId, players, capacity, completed) VALUES (?, ?, ?, ?, 0)`,
            [message.id, message.channel.id, JSON.stringify(players), capacity]);
}

function updateGameCanceled(messageId){
    db.run(`UPDATE game SET completed = -1 WHERE messageId = ?`, [messageId]);
}

function updateGamePlayers(messageId, players){
    db.run(`UPDATE game SET players = ? WHERE messageId = ?`, [JSON.stringify(players), messageId]);
}

function updateGameCompleted(messageId, players){
    db.run(`UPDATE game SET players = ?, completed = 1 WHERE messageId = ?`, [JSON.stringify(players), messageId]);
}

function selectGame(messageId, cb){
    db.get(`SELECT * FROM game WHERE messageId = ?`, [messageId], cb);
}


module.exports = {
    upsertFriendCode,
    selectFriendCode,
    insertGame,
    updateGameCanceled,
    updateGamePlayers,
    updateGameCompleted,
    selectGame
}
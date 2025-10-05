const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./public.sqlite');

db.run(`CREATE TABLE IF NOT EXISTS game (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    messageId TEXT,
    channelId TEXT,
    players TEXT,
    capacity INTEGER,
    completed INTEGER DEFAULT 0
)`);

db.run(`CREATE TABLE IF NOT EXISTS player (
    discordId TEXT PRIMARY KEY,
    friendCode TEXT,
    rating INTEGER DEFAULT 1000
)`);


db.run("ALTER TABLE game ADD COLUMN scheduledTime DATETIME", (err) => {
    // Ignore error if column already exists
});


module.exports = db;

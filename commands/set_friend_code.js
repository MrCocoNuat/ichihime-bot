// commands/set_friend_code.js
const db = require('../db');

async function handleSetFriendCodeCommand(interaction) {
    const code = interaction.options.getString('code');
    const discordId = interaction.user.id;
    if (!/^\d{9}$/.test(code)) {
        interaction.reply('Friend code must be exactly 9 digits.');
        return;
    }
    db.run(`INSERT INTO player (discordId, friendCode) VALUES (?, ?) ON CONFLICT(discordId) DO UPDATE SET friendCode = ?`,
        [discordId, code, code],
        err => {
            if (err) {
                interaction.reply('Failed to set friend code.');
            } else {
                interaction.reply(`Your friend code has been recorded as: ${code}`);
            }
        }
    );
}

module.exports = { handleSetFriendCodeCommand };

// commands/set_friend_code.js
const db = require('../db');

async function handleSetFriendCodeCommand(interaction) {
    const code = interaction.options.getString('code');
    const discordId = interaction.user.id;
    if (!/^\d{1,9}$/.test(code)) {
        interaction.reply('Friend code must be 1 to 9 digits.');
        return;
    }
    const paddedCode = code.padStart(9, '0');
    db.run(`INSERT INTO player (discordId, friendCode) VALUES (?, ?) ON CONFLICT(discordId) DO UPDATE SET friendCode = ?`,
        [discordId, paddedCode, paddedCode],
        err => {
            if (err) {
                interaction.reply('Failed to set friend code.');
            } else {
                interaction.reply(`Your friend code has been recorded as: ${paddedCode}`);
            }
        }
    );
}

module.exports = { handleSetFriendCodeCommand };

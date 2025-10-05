// commands/set_friend_code.js
const db = require('../db');
const { friendCodeValidationFailedMessage, friendCodeSaveFailedMessage, friendCodeSavedMessage } = require('../message');

async function handleSetFriendCodeCommand(interaction) {
    const code = interaction.options.getString('code');
    const discordId = interaction.user.id;
    if (!/^\d{1,9}$/.test(code)) {
        interaction.reply(friendCodeValidationFailedMessage());
        return;
    }
    const paddedCode = code.padStart(9, '0');
    db.run(`INSERT INTO player (discordId, friendCode) VALUES (?, ?) ON CONFLICT(discordId) DO UPDATE SET friendCode = ?`,
        [discordId, paddedCode, paddedCode],
        err => {
            if (err) {
                interaction.reply(friendCodeSaveFailedMessage());
            } else {
                interaction.reply(friendCodeSavedMessage(paddedCode));
            }
        }
    );
}

module.exports = { handleSetFriendCodeCommand };

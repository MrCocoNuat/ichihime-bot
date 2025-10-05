// commands/set_friend_code.js
const { upsertFriendCode } = require('../db');
const { friendCodeValidationFailedMessage, friendCodeSaveFailedMessage, friendCodeSavedMessage } = require('../message');

async function handleSetFriendCodeCommand(interaction) {
    const code = interaction.options.getString('code');
    const discordId = interaction.user.id;
    if (!/^\d{1,9}$/.test(code)) {
        interaction.reply({content: friendCodeValidationFailedMessage(), ephemeral: true});
        return;
    }
    const paddedCode = code.padStart(9, '0');
    upsertFriendCode(discordId, paddedCode, err => {
                if (err) {
                    interaction.reply({content: friendCodeSaveFailedMessage(), ephemeral: true});
                } else {
                    interaction.reply(friendCodeSavedMessage(paddedCode));
                }
            });
}

module.exports = { handleSetFriendCodeCommand };

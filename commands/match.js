// commands/match.js
const { ianaTimezone } = require('../base');
const { insertGame, selectFriendCode } = require('../db');
const { matchInProgressMessage, matchTimeValidationFailedMessage } = require('../message');
const { DateTime } = require("luxon");

function getPlayerMentionsWithCodes(players, callback) {
    if (players.length === 0) return callback('');
    let mentions = [];
    let count = 0;
    players.forEach(id => {
        selectFriendCode(id, (err, row) => {
            let code = row && row.friendCode ? row.friendCode : 'friend code not set';
            mentions.push(`<@${id}> - ${code}`);
            count++;
            if (count === players.length) {
                callback(mentions.join('\n'));
            }
        });
    });
}

function parseScheduledDateTime(scheduledTimeStr) {
    // mandate HH:MM format
    if (!scheduledTimeStr) return null;
    const dateTimeMatch = scheduledTimeStr.match(/^(\d{2}):(\d{2})$/); // don't allow any other temporal components
    if (!dateTimeMatch) return null;

    let scheduledTime = DateTime.fromISO(scheduledTimeStr, { zone: ianaTimezone });
    if ( ! scheduledTime.isValid) return null;

    // Determine if the scheduled time is today or tomorrow
    if (scheduledTime <= DateTime.now()) {
        // Scheduled time is earlier than current ET time, so it's for tomorrow
        scheduledTime = scheduledTime.plus({days: 1});
    }

    return scheduledTime.toJSDate();
}

async function handleMatchCommand(interaction) {
    const players = [];
    const capacity = interaction.options.getInteger('players') || 4;
    const scheduledDateTimeStr = interaction.options.getString('scheduled_time');
    const scheduledDateTime = parseScheduledDateTime(scheduledDateTimeStr);
    if (scheduledDateTime === null && scheduledDateTimeStr) {
        // parsing from a given time string failed
        interaction.reply({content: matchTimeValidationFailedMessage(), ephemeral: true});
        return;
    }

    getPlayerMentionsWithCodes(players, async (playerMentions) => {
        await interaction.reply({
            content: matchInProgressMessage(players, capacity, playerMentions, scheduledDateTime)
        });
        const message = await interaction.fetchReply();
        insertGame(message, players, capacity, scheduledDateTime);
    });
}

module.exports = { handleMatchCommand, getPlayerMentionsWithCodes };

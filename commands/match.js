// commands/match.js
const { insertGame, selectFriendCode } = require('../db');
const { matchInProgressMessage, matchTimeValidationFailedMessage } = require('../message');

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
    // HH:MM format
    if (!scheduledTimeStr) return null;
    const dateTimeMatch = scheduledTimeStr.match(/^(\d{2}):(\d{2})$/);
    if (!dateTimeMatch) return null;

    let scheduledHour = parseInt(dateTimeMatch[1], 10);
    let scheduledMinute = parseInt(dateTimeMatch[2], 10);
    if (scheduledHour < 0 || scheduledHour > 23 || scheduledMinute < 0 || scheduledMinute > 59) return null;
    console.log(`Parsed scheduled time: ${scheduledHour}:${scheduledMinute}`);

    const now = new Date();

    // Determine if the scheduled time is today or tomorrow
    const scheduledTime = new Date();
    console.log(scheduledTime);
    // these operations act as with local time
    scheduledTime.setHours(scheduledHour);
    scheduledTime.setMinutes(scheduledMinute);
    if (scheduledTime <= now) {
        // Scheduled time is earlier than current ET time, so it's for tomorrow
        scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    scheduledTime.setSeconds(0);
    scheduledTime.setMilliseconds(0);

    return scheduledTime;
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

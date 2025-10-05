// listeners.js
const db = require('./db');
const { handleMatchCommand } = require('./commands/match');
const { handleSetFriendCodeCommand } = require('./commands/set_friend_code');
const { handleMatchReactionAdd, handleMatchReactionRemove } = require('./reactions/match');
const { handleCalculateScoreCommand } = require('./commands/calculate_score');
const { handleHelloCommand } = require('./commands/hello');
const { handleShowHandCommand } = require('./commands/show_hand');
const {
    COMMAND_HELLO,
    COMMAND_MATCH,
    COMMAND_SHOW_HAND,
    COMMAND_CALCULATE_SCORE,
    COMMAND_SET_FRIEND_CODE
} = require('./commands');
const { welcomeMessage } = require('./message');

function fetchReactionAndMessage(reaction) {
    return (async () => {
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('Failed to fetch reaction:', error);
                return false;
            }
        }
        if (reaction.message.partial) {
            try {
                await reaction.message.fetch();
            } catch (error) {
                console.error('Failed to fetch message:', error);
                return false;
            }
        }
        return true;
    })();
}

function attachListeners(client, welcomeChannelId) {
    console.log('Attaching event listeners...');

    client.on('interactionCreate', async interaction => {
        if (!interaction.isChatInputCommand()) return;
        const { commandName } = interaction;
        if (commandName === COMMAND_HELLO) {
            await handleHelloCommand(interaction);
        }
        if (commandName === COMMAND_MATCH) {
            await handleMatchCommand(interaction);
        }
        if (commandName === COMMAND_SET_FRIEND_CODE) {
            await handleSetFriendCodeCommand(interaction);
        }
        if (commandName === COMMAND_CALCULATE_SCORE) {
            await handleCalculateScoreCommand(interaction);
        }
        if (commandName === COMMAND_SHOW_HAND) {
            await handleShowHandCommand(interaction);
        }
    });

    client.on('messageReactionAdd', async (reaction, user) => {    
        if (!(await fetchReactionAndMessage(reaction))) return;
        handleMatchReactionAdd(reaction, user);
    });

    client.on('messageReactionRemove', async (reaction, user) => {
        if (!(await fetchReactionAndMessage(reaction))) return;
        handleMatchReactionRemove(reaction, user);
    });

    client.on('guildMemberAdd', async member => {
        if (!welcomeChannelId) return;
        const channel = member.guild.channels.cache.get(welcomeChannelId);
        if (!channel) return;
        channel.send({
            content: welcomeMessage(member.id)
        });
    });

    console.log('Event listeners attached.');
}

module.exports = attachListeners;

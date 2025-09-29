// listeners.js
const db = require('./db');
const { handleMatchCommand } = require('./commands/match');
const { handleSetFriendCodeCommand } = require('./commands/set_friend_code');
const { handleMatchReactionAdd, handleMatchReactionRemove } = require('./reactions/match');
const { handleCalculateScoreCommand } = require('./commands/calculate_score');
const { handleHelloCommand } = require('./commands/hello');

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
    function getPlayerMentionsWithCodes(players, callback) {
        if (players.length === 0) return callback('');
        let mentions = [];
        let count = 0;
        players.forEach(id => {
            db.get('SELECT friendCode FROM player WHERE discordId = ?', [id], (err, row) => {
                let code = row && row.friendCode ? row.friendCode : 'friend code not set!';
                mentions.push(`<@${id}> - ${code}`);
                count++;
                if (count === players.length) {
                    callback(mentions.join('\n'));
                }
            });
        });
    }

    client.on('interactionCreate', async interaction => {
        if (!interaction.isChatInputCommand()) return;
        const { commandName } = interaction;
        if (commandName === 'hello') {
            await handleHelloCommand(interaction);
        }
        if (commandName === 'match') {
            await handleMatchCommand(interaction);
        }
        if (commandName === 'set_friend_code') {
            await handleSetFriendCodeCommand(interaction);
        }
        if (commandName === 'calculate_score') {
            await handleCalculateScoreCommand(interaction);
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
            content: `Welcome <@${member.id}>! Please set your Mahjong Soul friend code using /set_friend_code.`
        });
    });

    console.log('Event listeners attached.');
}

module.exports = attachListeners;

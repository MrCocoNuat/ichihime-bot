const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const { token, clientId, guildId, welcomeChannelId } = require('./env');
const { commands }  = require('./commands');
const attachListeners = require('./listeners');
const { refreshRolesMessage } = require('./roles/roles');

const rest = new REST({ version: '10' }).setToken(token);
(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER', 'GUILD_MEMBER']
});

client.once('clientReady', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    refreshRolesMessage(client);
});

attachListeners(client, welcomeChannelId);

client.login(token);
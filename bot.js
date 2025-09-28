const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
require('dotenv').config();
const commands = require('./commands');
const attachListeners = require('./listeners');

const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const welcomeChannelId = process.env.WELCOME_CHANNEL_ID;

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
    partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER']
});

client.once('clientReady', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

attachListeners(client, welcomeChannelId);

client.login(token);
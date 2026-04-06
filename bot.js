const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const { token, clientId, guildId, welcomeChannelId } = require('./env');
const { commands } = require('./commands');
const attachListeners = require('./listeners');
const { refreshRolesMessages } = require('./roles/roles');

console.log("ichihime-bot version 0.1.2");

// Transient network errors that bot.js will self-recover from
const TRANSIENT_ERRORS = ['ECONNRESET', 'ECONNREFUSED', 'ETIMEDOUT', 'EPIPE', 'EAI_AGAIN'];

process.on('unhandledRejection', (reason, promise) => {
    const code = reason?.code || reason?.message || '';
    const isTransient = TRANSIENT_ERRORS.some(e => code.includes(e));
    if (isTransient) {
        console.warn('[unhandledRejection] Transient network error, not exiting:', reason);
    } else {
        console.error('[unhandledRejection] Fatal rejection at:', promise, 'reason:', reason);
        process.exit(1);
    }
});

process.on('uncaughtException', (err) => {
    console.error('[uncaughtException]', err);
    process.exit(1);
});

// Register slash commands with retry on transient failure
async function registerCommands(retries = 5, delay = 5000) {
    const rest = new REST({ version: '10' }).setToken(token);
    for (let i = 0; i < retries; i++) {
        try {
            console.log('Refreshing application (/) commands...');
            await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
            console.log('Successfully reloaded application (/) commands.');
            return;
        } catch (err) {
            const isTransient = TRANSIENT_ERRORS.some(e => (err.code || err.message || '').includes(e));
            if (isTransient && i < retries - 1) {
                console.warn(`Command registration failed (attempt ${i + 1}/${retries}), retrying in ${delay}ms...`, err.message);
                await new Promise(res => setTimeout(res, delay * Math.pow(2, i))); // exponential backoff
            } else {
                console.error('Command registration failed fatally:', err);
                return; // Non-fatal to bot operation — log and continue
            }
        }
    }
}

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

// discord.js emits this when it gives up reconnecting (close code 1000, non-resumable)
client.on('shardDisconnect', (event, shardId) => {
    console.warn(`[shardDisconnect] Shard ${shardId} disconnected, code: ${event.code}`);
});

client.on('shardReconnecting', (shardId) => {
    console.log(`[shardReconnecting] Shard ${shardId} reconnecting...`);
});

client.on('shardResume', (shardId, replayedEvents) => {
    console.log(`[shardResume] Shard ${shardId} resumed, replayed ${replayedEvents} events.`);
});

client.on('error', (err) => {
    // Client-level errors are often transient (network); log but don't exit
    console.error('[client.error]', err);
});

client.once('clientReady', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    refreshRolesMessages(client);
});

attachListeners(client, welcomeChannelId);

// Login with retry for net interface startup timing issues
async function startBot(retries = 10, delay = 5000) {
    for (let i = 0; i < retries; i++) {
        try {
            await client.login(token);
            return;
        } catch (err) {
            const isTransient = TRANSIENT_ERRORS.some(e => (err.code || err.message || '').includes(e));
            if (isTransient && i < retries - 1) {
                console.warn(`Login failed (attempt ${i + 1}/${retries}), retrying in ${delay}ms...`, err.message);
                await new Promise(res => setTimeout(res, delay));
            } else {
                console.error('Login failed fatally:', err);
                process.exit(1);
            }
        }
    }
}

registerCommands().then(() => startBot());
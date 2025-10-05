// env.js
require('dotenv').config();

const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const welcomeChannelId = process.env.WELCOME_CHANNEL_ID;
const env = process.env.NODE_ENV

module.exports = {
    token,
    clientId,
    guildId,
    welcomeChannelId,
    env
};

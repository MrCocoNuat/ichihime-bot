// env.js
require('dotenv').config();

const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const welcomeChannelId = process.env.WELCOME_CHANNEL_ID;

module.exports = {
    token,
    clientId,
    guildId,
    welcomeChannelId
};

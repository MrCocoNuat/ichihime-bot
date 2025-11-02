// env.js
require('dotenv').config();

const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const welcomeChannelId = process.env.WELCOME_CHANNEL_ID;
const rolesChannelId = process.env.ROLES_CHANNEL_ID;
const roleIdHaku = process.env.ROLE_ID_HAKU;
const roleIdHatsu = process.env.ROLE_ID_HATSU;
const roleIdChun = process.env.ROLE_ID_CHUN;
const rolesMessageId = process.env.ROLES_MESSAGE_ID;
const env = process.env.NODE_ENV

module.exports = {
    token,
    clientId,
    guildId,
    welcomeChannelId,
    rolesChannelId,
    roleIdHaku,
    roleIdHatsu,
    roleIdChun,
    rolesMessageId,
    env
};

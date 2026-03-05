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
const colorRolesMessageId = process.env.ROLES_MESSAGE_ID;
const roleIdDrg = process.env.ROLE_ID_DRG;
const otherGameRolesMessageId = process.env.ROLES_MESSAGE_ID_2;
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
    colorRolesMessageId,
    roleIdDrg,
    otherGameRolesMessageId,
    env
};

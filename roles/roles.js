const { rolesChannelId, roleIdHaku, roleIdHatsu, roleIdChun, rolesMessageId} = require('../env.js');
const { rolesMessage, emojiId } = require('../message.js');


const emojiRoleMap = ({
    [emojiId({ num: 5, suit: 'z' })]: roleIdHaku,
    [emojiId({ num: 6, suit: 'z' })]: roleIdHatsu,
    [emojiId({ num: 7, suit: 'z' })]: roleIdChun
});

async function refreshRolesMessage(client) {
    const channel = await client.channels.fetch(rolesChannelId);
    console.log(`Refreshing roles message... id ${rolesMessageId}`);
    if (rolesMessageId){
        // Message already exists
        const msg = await channel.messages.fetch(rolesMessageId);
        msg.edit(rolesMessage());
        return;
    } 
    // Send new message
    const msg = await channel.send(rolesMessage());
    // React with each emoji
    for (const emoji of Object.keys(emojiRoleMap)) {
        await msg.react(emoji);
    }
}

async function handleRolesReactionAdd(reaction, user) {
    console.log('Handling roles reaction add...');
    if (reaction.partial) await reaction.fetch();
    if (user.bot) return;
    if (reaction.message.id !== rolesMessageId) return;
    console.log(`step1: ${reaction.emoji.id}`);
    console.log(emojiRoleMap);
    const roleId = emojiRoleMap[reaction.emoji.id];
    if (!roleId) return;
    console.log("step2");
    const member = await reaction.message.guild.members.fetch(user.id);
    if (!member) return;
    console.log("step3");
    if (!member.roles.cache.has(roleId)) {
        console.log(`Adding role ${roleId} to user ${user.id}`);
        await member.roles.add(roleId);
    }
}

async function handleRolesReactionRemove(reaction, user) {
    if (reaction.partial) await reaction.fetch();
    if (user.bot) return;
    if (reaction.message.id !== rolesMessageId) return;

    const roleId = emojiRoleMap[reaction.emoji.id];
    if (!roleId) return;

    const member = await reaction.message.guild.members.fetch(user.id);
    if (!member) return;

    if (member.roles.cache.has(roleId)) {
        console.log(`Removing role ${roleId} from user ${user.id}`);
        await member.roles.remove(roleId);
    }
}


module.exports = {
    emojiRoleMap,
    refreshRolesMessage,
    handleRolesReactionAdd,
    handleRolesReactionRemove
}
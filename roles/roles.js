const { rolesChannelId, roleIdHaku, roleIdHatsu, roleIdChun, colorRolesMessageId, roleIdDrg, otherGameRolesMessageId} = require('../env.js');
const { colorRolesMessage, otherGameRolesMessage, emojiId } = require('../message.js');

// warning! undefined and null as keys don't operate as well as you'd like! use an actual dummy string value instead
const rolesMessages = ({
    [colorRolesMessageId]: colorRolesMessage,
    [otherGameRolesMessageId]: otherGameRolesMessage 
})

// map by id and then if null by name (default emoji)
const emojiRoleMap = ({
    [emojiId({ num: 5, suit: 'z' })]: {[colorRolesMessageId]: roleIdHaku},
    [emojiId({ num: 6, suit: 'z' })]: {[colorRolesMessageId]: roleIdHatsu},
    [emojiId({ num: 7, suit: 'z' })]: {[colorRolesMessageId]: roleIdChun},
    ["⛏️"]: {[otherGameRolesMessageId]: roleIdDrg}
});

async function refreshRolesMessages(client) {
    const channel = await client.channels.fetch(rolesChannelId);
    
    Object.entries(rolesMessages).forEach(async ([id, contentGetter]) => {
        console.log(`Refreshing roles message... id ${id}`);
        if (id !== "null"){ // autocoerce to string... figure out a defaulting later
            // Message already exists
            const msg = await channel.messages.fetch(id);
            msg.edit(contentGetter());
            return;
        } 
        // Send new message
        const msg = await channel.send(contentGetter());
        // React with each emoji that belongs on the message
        for (const [emoji, messageObj] of Object.entries(emojiRoleMap)) {
            if (messageObj[id]) await msg.react(emoji);
        }
    });
}

async function handleRolesReactionAdd(reaction, user) {
    console.log('Handling roles reaction add...');
    if (reaction.partial) await reaction.fetch();
    if (user.bot) return;

    const messageObj = emojiRoleMap[reaction.emoji.id] ?? emojiRoleMap[reaction.emoji.name];
    const roleId = messageObj[reaction.message.id];
    console.log(`emoji, role: ${reaction.emoji.id ?? reaction.emoji.name}, ${roleId}`);
    if (!roleId) return;

    const member = await reaction.message.guild.members.fetch(user.id);
    if (!member) return;

    if (!member.roles.cache.has(roleId)) {
        console.log(`Adding role ${roleId} to user ${user.id}`);
        await member.roles.add(roleId);
    }
}

async function handleRolesReactionRemove(reaction, user) {
    console.log("Handling roles reaction remove...")
    if (reaction.partial) await reaction.fetch();
    if (user.bot) return;

    const messageObj = emojiRoleMap[reaction.emoji.id] ?? emojiRoleMap[reaction.emoji.name];
    const roleId = messageObj[reaction.message.id];
    console.log(`emoji, role: ${reaction.emoji.id ?? reaction.emoji.name}, ${roleId}`);
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
    refreshRolesMessages,
    handleRolesReactionAdd,
    handleRolesReactionRemove
}
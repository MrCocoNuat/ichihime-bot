const { env } = require("./env");

const MESSAGE_WELCOME = 1;
const MESSAGE_HELLO = 2;
const MESSAGE_INVALID_FU = 3;
const MESSAGE_REQUIRED_FU = 4;
const MESSAGE_POINTS_TSUMO = 5;
const MESSAGE_POINTS_RON = 6;
const MESSAGE_MATCH_IN_PROGRESS = 7;
const MESSAGE_MATCH_COMPLETED = 8;
const MESSAGE_MATCH_JOIN_NOTIF = 9;
const MESSAGE_MATCH_CANCELED = 10;
const MESSAGE_FRIEND_CODE_VALIDATION_FAILED = 11;
const MESSAGE_FRIEND_CODE_SAVE_FAILED = 12;
const MESSAGE_FRIEND_CODE_SAVED = 13;
const MESSAGE_SHOW_HAND_VALIDATION_FAILED = 14;
const MESSAGE_SHOW_HAND = 15;
const MESSAGE_MATCH_TIME_VALIDATION_FAILED = 16;

const decorate = (str) => ((env?.toLowerCase() != "prod" && env?.toLowerCase() != "production")? `⚠️ Bot running in environment: ${env}\n` : "") + str; 


const welcomeMessage = (memberId) => decorate(`Welcome <@${memberId}>! Please set your Mahjong Soul friend code using /set_friend_code.`);
const helloMessage = (tile) => decorate(`Hi there! Your lucky tile for today is ${tile}!`);
const invalidFuMessage = () => decorate('Fu must be 25 or a multiple of 10.');
const requiredFuMessage = () => decorate('Fu is required to calculate score for this hand');
const pointsTsumoMessage = (han, fu, isDealer, pointsPerPlayer) => decorate(`A ${han}h ${fu > 0? `${fu}f ` : ""}${isDealer ? 'dealer ' : ''}tsumo scores ${isDealer ? `${pointsPerPlayer * 2} all` : `${pointsPerPlayer}/${pointsPerPlayer * 2}`}`);
const pointsRonMessage = (han, fu, isDealer, totalPoints) => decorate(`A ${han}h ${fu > 0? `${fu}f ` : ""}${isDealer ? 'dealer ' : ''}ron scores ${totalPoints} points`); 
const matchInProgressMessage = (players, capacity, playerMentions, scheduledTime) => decorate(`Matchmaking started!\n${scheduledTime? "Scheduled for " + new Date(scheduledTime).toLocaleString('en-US', { timeZone: 'America/New_York' }) + " Eastern\n": ""}Players (${players.length}/${capacity}):\n${playerMentions}\nReact with 👍 to join!`);
const matchCompletedMessage = (forced, players, capacity, playerMentions, scheduledTime) => decorate(`Matchmaking completed${forced ? ' (skipped)' : ''}!\n${scheduledTime? "Scheduled for " + new Date(scheduledTime).toLocaleString('en-US', { timeZone: 'America/New_York' }) + " Eastern\n": ""}Players (${players.length}/${capacity}):\n${playerMentions}`);
const matchJoinNotifMessage = (players) => decorate(`Please join the match!\n${players.map(id => `<@${id}>`).join('\n')}`);
const matchCanceledMessage = () => decorate('Matchmaking canceled.');
const friendCodeValidationFailedMessage = () => decorate('Friend code must be 1 to 9 digits.');
const friendCodeSaveFailedMessage = () => decorate('Failed to set friend code.');
const friendCodeSavedMessage = (friendCode) => decorate(`Your friend code has been recorded as: ${friendCode}`);
const showHandValidationFailedMessage = (input) => decorate(`input "${input}" is not a valid set of tiles`);
const showHandMessage = (tiles) => decorate(tiles.map(emojiFragment).join(''));
const matchTimeValidationFailedMessage = () => decorate('Invalid scheduled time format. Please use HH:MM in 24-hour format.');


function emojiFragment(tile) {
    // emoji-specific IDs
    const emojiMap = {
        m: [
            { name: '1m', id: '1422069333949153402' },
            { name: '2m', id: '1422069338479001671' },
            { name: '3m', id: '1422069344677920808' },
            { name: '4m', id: '1422209197340229792' },
            { name: '5m', id: '1422209201660231721' },
            { name: '6m', id: '1422209283474329640' },
            { name: '7m', id: '1422209412851826699' },
            { name: '8m', id: '1422209474487124119' },
            { name: '9m', id: '1422209517336133764' },
            { name: '5rm', id: '1422209204164235337' }
        ],
        p: [
            { name: '1p', id: '1422069335840784395' },
            { name: '2p', id: '1422069339926040586' },
            { name: '3p', id: '1422209942353346742' },
            { name: '4p', id: '1422209198544130179' },
            { name: '5p', id: '1422209202780241961' },
            { name: '6p', id: '1422209307490910279' },
            { name: '7p', id: '1422209429046300792' },
            { name: '8p', id: '1422209488978448446' },
            { name: '9p', id: '1422209528639918223' },
            { name: '5rp', id: '1422209205263269929' }
        ],
        s: [
            { name: '1s', id: '1422069336910073916' },
            { name: '2s', id: '1422069341716877435' },
            { name: '3s', id: '1422069347828109382' },
            { name: '4s', id: '1422209199483392131' },
            { name: '5s', id: '1422209256819527713' },
            { name: '6s', id: '1422209331645907086' },
            { name: '7s', id: '1422209441440337982' },
            { name: '8s', id: '1422209503092543488' },
            { name: '9s', id: '1422209539905687562' },
            { name: '5rs', id: '1422209236305317919' }
        ],
        z: [
            { name: '1z', id: '1422069337774231673' },
            { name: '2z', id: '1422069343566696619' },
            { name: '3z', id: '1422209160212250839' },
            { name: '4z', id: '1422209200833958028' },
            { name: '5z', id: '1422209269268217906' },
            { name: '6z', id: '1422209347903164476' },
            { name: '7z', id: '1422209455201849394' }
        ]
    };
    let emojiObj;
    if (tile.num === '0') {
        // can't be an honor tile
        emojiObj = emojiMap[tile.suit][9];
    } else {
        emojiObj = emojiMap[tile.suit][parseInt(tile.num) - 1];
    }
    return `<:${emojiObj.name}:${emojiObj.id}>`;
}



module.exports = {
    welcomeMessage,
    helloMessage,
    invalidFuMessage,
    requiredFuMessage,
    pointsTsumoMessage,
    pointsRonMessage,
    matchInProgressMessage,
    matchCompletedMessage,
    matchJoinNotifMessage,
    matchCanceledMessage,
    friendCodeValidationFailedMessage,
    friendCodeSaveFailedMessage,
    friendCodeSavedMessage,
    showHandValidationFailedMessage,
    showHandMessage,
    matchTimeValidationFailedMessage
}
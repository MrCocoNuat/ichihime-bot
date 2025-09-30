// commands.js
const { SlashCommandBuilder } = require('discord.js');

const COMMAND_HELLO = 'hello';
const COMMAND_MATCH = 'match';
const COMMAND_SHOW_HAND = 'show_hand';
const COMMAND_CALCULATE_SCORE = 'calculate_score';
const COMMAND_SET_FRIEND_CODE = 'set_friend_code';

const commands = [
    new SlashCommandBuilder()
        .setName(COMMAND_HELLO)
        .setDescription('Says hello!'),
    new SlashCommandBuilder()
        .setName(COMMAND_MATCH)
        .setDescription('Start a mahjong match (3-4 players)')
        .addIntegerOption(option =>
            option.setName('players')
                .setDescription('Number of players (3-4)')
                .setRequired(false)
                .setMinValue(3)
                .setMaxValue(4)),
    new SlashCommandBuilder()
        .setName(COMMAND_SHOW_HAND)
        .setDescription('Show a graphical representation of a Mahjong hand')
        .addStringOption(option =>
            option.setName('tiles')
                .setRequired(true)
                .setDescription('Tiles in standard format, e.g. 123m456p789s11z. 0 or r can be used for red fives')),
    new SlashCommandBuilder()
        .setName(COMMAND_CALCULATE_SCORE)
        .setDescription('Calculate the score of a hand given han and fu')
        .addIntegerOption(option =>
            option.setName('han')
                .setDescription('Number of han (1-13+)')
                .setRequired(true)
                .setMinValue(1))
        .addIntegerOption(option =>
            option.setName('fu')
                .setDescription('Number of fu (20-110)')
                .setRequired(false)
                .setMinValue(0)
                .setMaxValue(110))
        .addBooleanOption(option =>
            option.setName('dealer')
                .setDescription('Is the winner the dealer?')
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('tsumo')
                .setDescription('Was the win by tsumo (self-draw)?')
                .setRequired(false)),
    new SlashCommandBuilder()
        .setName(COMMAND_SET_FRIEND_CODE)
        .setDescription('Set your Mahjong Soul friend code')
        .addStringOption(option =>
            option.setName('code')
                .setDescription('Your friend code')
                .setRequired(true)),
];

module.exports = {
    commands,
    COMMAND_HELLO,
    COMMAND_MATCH,
    COMMAND_SHOW_HAND,
    COMMAND_CALCULATE_SCORE,
    COMMAND_SET_FRIEND_CODE
};

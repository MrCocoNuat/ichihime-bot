// commands.js
const { SlashCommandBuilder } = require('discord.js');

const commands = [
    new SlashCommandBuilder()
        .setName('hello')
        .setDescription('Says hello!'),
    new SlashCommandBuilder()
        .setName('match')
        .setDescription('Start a mahjong match (3-4 players)')
        .addIntegerOption(option =>
            option.setName('players')
                .setDescription('Number of players (3-4)')
                .setRequired(false)
                .setMinValue(3)
                .setMaxValue(4)),
    new SlashCommandBuilder()
        .setName('calculate_score')
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
        .setName('set_friend_code')
        .setDescription('Set your Mahjong Soul friend code')
        .addStringOption(option =>
            option.setName('code')
                .setDescription('Your friend code')
                .setRequired(true)),
];

module.exports = commands;

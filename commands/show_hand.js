const { escapeHeading } = require('discord.js');
const { guildId } = require('../env');
const { showHandMessage, showHandValidationFailedMessage } = require('../message');

// commands/show.js
async function handleShowHandCommand(interaction) {
    const input = interaction.options.getString('tiles');

    // Parse input - extract this into a function later
    const suitOrder = ['m', 'p', 's', 'z'];
    let tiles = [];
    let current = [];
    let suit = '';
    try {
        for (let i = 0; i < input.length; i++) {
            const c = input[i];
            if ('mpsz'.includes(c)) {
                suit = c;
                if (current.length === 0) throw new Error('Flush with empty current');
                current.forEach(t => {
                    if (suit === 'z'){
                        if (!/[1-7]/.test(t)){
                            throw new Error('Invalid honor tile number');
                        }
                    }
                    if (/[0-9]/.test(t)){
                        tiles.push({ num: t, suit });
                        
                    }
                });
                current = [];
            } else if (/[0-9]/.test(c) || c === 'r') {
                // Interpret '0' and 'r' as red 5
                current.push(c === 'r' ? '0' : c);
            } else {
                throw new Error('Unexpected character');
            }
        }
        if (current.length > 0) throw new Error('Unflushed current at end');
        if (tiles.length === 0) throw new Error('No tiles parsed');

        // Sort tiles by suit order
        tiles.sort((a, b) => {
            const suitA = suitOrder.indexOf(a.suit);
            const suitB = suitOrder.indexOf(b.suit);
            if (suitA !== suitB) return suitA - suitB;
            // Red 5 comes after normal 5
            if (a.num === '0' && b.num === '5') return 1;
            if (a.num === '5' && b.num === '0') return -1;
            return (a.num === '0' ? 5 : parseInt(a.num)) - (b.num === '0' ? 5 : parseInt(b.num));
        });

        // Build emoji output
        interaction.reply(showHandMessage(tiles));
    } catch (e) {
        interaction.reply({content: showHandValidationFailedMessage(input), ephemeral: true});
    }
}

module.exports = { handleShowHandCommand };

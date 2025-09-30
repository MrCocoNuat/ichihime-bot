const { guildId } = require('../env');

function emoji(tile) {
    // Emoji mapping: fill in your actual emoji IDs below
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
        let output = tiles.map(tile => emoji(tile)).join('');
        if (!output || tiles.length === 0) throw new Error('No tiles parsed');
        interaction.reply(output);
    } catch (e) {
        interaction.reply(`input "${input}" is not a valid set of tiles`);
    }
}

module.exports = { handleShowHandCommand };

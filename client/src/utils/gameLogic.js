/**
 * Card properties:
 * number: 1, 2, 3
 * shape: 'oval', 'diamond', 'squiggle'
 * shading: 'solid', 'striped', 'open'
 * color: 'red', 'green', 'purple'
 */

export const SHAPES = ['oval', 'diamond', 'squiggle'];
export const SHADINGS = ['solid', 'striped', 'open'];
export const COLORS = ['red', 'green', 'purple'];
export const NUMBERS = [1, 2, 3];

export function generateDeck() {
    const deck = [];
    for (const number of NUMBERS) {
        for (const shape of SHAPES) {
            for (const shading of SHADINGS) {
                for (const color of COLORS) {
                    deck.push({
                        id: `${number}-${shape}-${shading}-${color}`,
                        number,
                        shape,
                        shading,
                        color
                    });
                }
            }
        }
    }
    return shuffle(deck);
}

export function shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

export function checkSet(card1, card2, card3) {
    if (!card1 || !card2 || !card3) return false;

    const properties = ['number', 'shape', 'shading', 'color'];

    for (const prop of properties) {
        const values = [card1[prop], card2[prop], card3[prop]];
        const allSame = values[0] === values[1] && values[1] === values[2];
        const allDifferent =
            values[0] !== values[1] &&
            values[0] !== values[2] &&
            values[1] !== values[2];

        if (!allSame && !allDifferent) {
            return false;
        }
    }

    return true;
}

export function findSets(board) {
    const sets = [];
    for (let i = 0; i < board.length; i++) {
        for (let j = i + 1; j < board.length; j++) {
            for (let k = j + 1; k < board.length; k++) {
                if (checkSet(board[i], board[j], board[k])) {
                    sets.push([board[i], board[j], board[k]]);
                }
            }
        }
    }
    return sets;
}

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { generateDeck, checkSet, findSets } from '../utils/gameLogic';

const GameContext = createContext();

const initialState = {
    deck: [],
    board: [],
    selectedCards: [],
    score: 0,
    gameStatus: 'idle', // idle, playing, paused, gameOver
    setsOnBoard: 0,
};

function gameReducer(state, action) {
    switch (action.type) {
        case 'START_GAME':
            const newDeck = generateDeck();
            const initialBoard = newDeck.splice(0, 12);
            return {
                ...initialState,
                deck: newDeck,
                board: initialBoard,
                gameStatus: 'playing',
                setsOnBoard: findSets(initialBoard).length,
            };

        case 'START_MULTIPLAYER_GAME':
            return {
                ...initialState,
                board: action.payload.board,
                gameStatus: 'playing',
                isMultiplayer: true,
                socket: action.payload.socket,
                roomId: action.payload.roomId,
                players: action.payload.players,
                setsOnBoard: findSets(action.payload.board).length,
                playerId: action.payload.socket.id
            };

        case 'UPDATE_GAME_STATE':
            console.log('Context processing UPDATE_GAME_STATE', action.payload);
            return {
                ...state,
                board: action.payload.newBoard,
                players: {
                    ...state.players,
                    ...Object.entries(action.payload.scores).reduce((acc, [id, score]) => ({
                        ...acc,
                        [id]: { ...state.players[id], score }
                    }), {})
                },
                deck: { length: action.payload.remainingDeck }, // We don't know the full deck in client
                setsOnBoard: findSets(action.payload.newBoard).length,
                selectedCards: [] // Clear selection on update
            };

        case 'SELECT_CARD':
            // ... existing selection logic ...
            // But if multiplayer, we might want to emit selection? No, local only until set claim.
            if (state.selectedCards.find(c => c.id === action.payload.id)) {
                // Deselect if already selected
                return {
                    ...state,
                    selectedCards: state.selectedCards.filter(c => c.id !== action.payload.id),
                };
            }

            if (state.selectedCards.length >= 3) return state;

            return {
                ...state,
                selectedCards: [...state.selectedCards, action.payload],
            };

        case 'CHECK_SET':
            // In multiplayer, we emit the claim instead of processing locally
            if (state.isMultiplayer) {
                if (state.selectedCards.length === 3) {
                    state.socket.emit('game_action', {
                        type: 'CLAIM_SET',
                        cards: state.selectedCards
                    });
                }
                return { ...state, selectedCards: [] }; // Optimistic clear or wait? Better clear.
            }

            // ... existing single player logic ...
            const { selectedCards, board, deck, score } = state;
            if (selectedCards.length !== 3) return state;

            const isSet = checkSet(selectedCards[0], selectedCards[1], selectedCards[2]);

            if (isSet) {
                // Remove cards from board
                const newBoard = [...board];
                const selectedIds = selectedCards.map(c => c.id);

                // Replace with new cards if deck has cards, or just remove if deck is empty
                // Note: Set rules say we must maintain at least 12 cards unless deck is empty.
                // If board has > 12 cards (due to "add 3 cards" rule), we just remove the set.

                let cardsToAdd = [];
                // In single player we have the full deck
                if (board.length <= 12 && deck.length > 0) {
                    cardsToAdd = deck.slice(0, 3);
                }

                // We need to replace the specific indices to maintain order or just filter and append?
                // Standard Set: Replace the cards in their slots if < 12 or = 12.
                // If > 12, just remove them.

                let updatedBoard = newBoard.map(card => {
                    if (selectedIds.includes(card.id)) {
                        return cardsToAdd.length > 0 ? cardsToAdd.shift() : null;
                    }
                    return card;
                }).filter(card => card !== null);

                // If we had > 12 cards and found a set, we might just shrink the board.
                // But the map above handles replacement. If we didn't have replacements (deck empty), they are null and filtered.
                // Wait, if board > 12, we shouldn't replace, just remove.

                if (board.length > 12) {
                    updatedBoard = board.filter(card => !selectedIds.includes(card.id));
                }

                const remainingDeck = board.length <= 12 ? deck.slice(3) : deck;

                return {
                    ...state,
                    board: updatedBoard,
                    deck: remainingDeck,
                    selectedCards: [],
                    score: score + 1,
                    setsOnBoard: findSets(updatedBoard).length,
                };
            } else {
                return {
                    ...state,
                    selectedCards: [],
                    score: Math.max(0, score - 1), // Penalty for wrong set?
                };
            }

        case 'ADD_CARDS':
            // Multiplayer doesn't support manual add cards yet (usually auto or vote)
            if (state.isMultiplayer) return state;

            if (state.deck.length === 0) return state;
            const addedCards = state.deck.slice(0, 3);
            const boardWithAdded = [...state.board, ...addedCards];
            return {
                ...state,
                board: boardWithAdded,
                deck: state.deck.slice(3),
                setsOnBoard: findSets(boardWithAdded).length,
            };

        case 'SURRENDER':
            if (state.isMultiplayer) {
                state.socket.emit('game_action', { type: 'SURRENDER' });
                return state; // Wait for server update or just leave?
            }
            return {
                ...state,
                gameStatus: 'gameOver',
                winner: 'Deck' // Or just lost
            };

        case 'GAME_OVER':
            return {
                ...state,
                gameStatus: 'gameOver',
                winner: action.payload.winner
            };

        default:
            return state;
    }
}

export function GameProvider({ children }) {
    const [state, dispatch] = useReducer(gameReducer, initialState);

    return (
        <GameContext.Provider value={{ state, dispatch }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    return useContext(GameContext);
}

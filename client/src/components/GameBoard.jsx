import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import Card from './Card';
import styles from './GameBoard.module.css';

const GameBoard = () => {
    const { state, dispatch } = useGame();
    const { board, selectedCards, setsOnBoard, deck, score } = state;

    useEffect(() => {
        if (selectedCards.length === 3) {
            // Small delay to show selection before checking
            const timer = setTimeout(() => {
                dispatch({ type: 'CHECK_SET' });
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [selectedCards, dispatch]);

    const handleCardClick = (card) => {
        dispatch({ type: 'SELECT_CARD', payload: card });
    };

    const handleAddCards = () => {
        dispatch({ type: 'ADD_CARDS' });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.score}>Score: {score}</div>
                <div className={styles.info}>Sets available: {setsOnBoard}</div>
                <div className={styles.info}>Deck: {deck.length}</div>
            </div>

            <div className={styles.grid}>
                {board.map((card) => (
                    <Card
                        key={card.id}
                        card={card}
                        isSelected={selectedCards.some(c => c.id === card.id)}
                        onClick={() => handleCardClick(card)}
                    />
                ))}
            </div>

            <div className={styles.controls}>
                <button
                    className={styles.button}
                    onClick={handleAddCards}
                    disabled={deck.length === 0 || setsOnBoard > 0}
                    title={setsOnBoard > 0 ? "There are sets on the board!" : "Add 3 cards"}
                >
                    Add 3 Cards
                </button>
                <button
                    className={`${styles.button} ${styles.surrender}`}
                    onClick={() => dispatch({ type: 'SURRENDER' })}
                >
                    Surrender
                </button>
            </div>
        </div>
    );
};

export default GameBoard;

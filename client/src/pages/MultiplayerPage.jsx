import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import GameBoard from '../components/GameBoard';
import { useNavigate } from 'react-router-dom';
import styles from './MultiplayerPage.module.css';

const MultiplayerPage = () => {
    const { state, dispatch } = useGame();
    const { socket, players, playerId } = state;
    const navigate = useNavigate();

    useEffect(() => {
        if (!socket) {
            navigate('/');
            return;
        }

        socket.on('game_update', (data) => {
            console.log('Client received game_update:', data);
            dispatch({ type: 'UPDATE_GAME_STATE', payload: data });
        });

        socket.on('game_over', (data) => {
            const isWinner = data.winner === socket.id;
            const ratingData = data.ratings?.[socket.id];
            const ratingChange = ratingData ? ratingData.change : 0;
            const newRating = ratingData ? ratingData.new : 1200;

            const changeStr = ratingChange >= 0 ? `+${ratingChange}` : ratingChange;

            alert(`Game Over! ${isWinner ? 'You Won! 🏆' : 'You Lost 😔'}\n\nRating: ${newRating} (${changeStr})`);
            navigate('/');
        });

        return () => {
            socket.off('game_update');
            socket.off('game_over');
        };
    }, [socket, dispatch, navigate]);

    if (!players) return null;

    const myScore = players[playerId]?.score || 0;
    const opponentId = Object.keys(players).find(id => id !== playerId);
    const opponentScore = players[opponentId]?.score || 0;

    return (
        <div className={styles.container}>
            <div className={styles.scoreboard}>
                <div className={styles.player}>
                    <span>You</span>
                    <span className={styles.score}>{myScore}</span>
                </div>
                <div className={styles.vs}>VS</div>
                <div className={styles.player}>
                    <span>Opponent</span>
                    <span className={styles.score}>{opponentScore}</span>
                </div>
            </div>

            <GameBoard />
        </div>
    );
};

export default MultiplayerPage;

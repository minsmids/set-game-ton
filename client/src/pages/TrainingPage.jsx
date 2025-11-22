import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import GameBoard from '../components/GameBoard';
import { Link } from 'react-router-dom';

const TrainingPage = () => {
    const { dispatch } = useGame();

    useEffect(() => {
        dispatch({ type: 'START_GAME' });
    }, [dispatch]);

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
                <Link to="/" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    ← Back to Menu
                </Link>
            </div>
            <GameBoard />
        </div>
    );
};

export default TrainingPage;

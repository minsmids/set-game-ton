import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connectSocket } from '../socket';
import styles from './LeaderboardPage.module.css';

const LeaderboardPage = () => {
    const navigate = useNavigate();
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const socket = connectSocket();

        socket.emit('get_leaderboard');

        socket.on('leaderboard_data', (data) => {
            setLeaderboard(data);
            setLoading(false);
        });

        return () => {
            socket.off('leaderboard_data');
        };
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button className={styles.backButton} onClick={() => navigate('/')}>
                    ← Back
                </button>
                <h1>Leaderboard</h1>
            </div>

            <div className={styles.content}>
                {loading ? (
                    <div className={styles.loader}>Loading...</div>
                ) : (
                    <div className={styles.list}>
                        <div className={styles.row + ' ' + styles.headerRow}>
                            <span className={styles.rank}>#</span>
                            <span className={styles.player}>Player</span>
                            <span className={styles.points}>Points</span>
                            <span className={styles.wins}>Wins</span>
                        </div>
                        {leaderboard.length === 0 ? (
                            <div className={styles.empty}>No games played yet.</div>
                        ) : (
                            leaderboard.map((user, index) => (
                                <div key={user.wallet} className={styles.row}>
                                    <span className={styles.rank}>
                                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                                    </span>
                                    <span className={styles.player}>
                                        {user.wallet.slice(0, 4)}...{user.wallet.slice(-4)}
                                    </span>
                                    <span className={styles.points}>{user.points}</span>
                                    <span className={styles.wins}>{user.wins}</span>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaderboardPage;

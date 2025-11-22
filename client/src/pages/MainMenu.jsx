import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MainMenu.module.css';

const MainMenu = () => {

    return (
        <div className={styles.container}>
            <div className={styles.walletBtn}>
                <Link to="/profile" style={{ textDecoration: 'none', fontSize: '1.5rem' }}>👤</Link>
            </div>

            <h1 className={styles.title}>SET GAME</h1>

            <div className={styles.menu}>
                <Link to="/training" className={styles.menuItem}>
                    <div className={styles.icon}>🧘</div>
                    <div className={styles.label}>
                        <h3>Training</h3>
                        <p>Practice solo against the deck</p>
                    </div>
                </Link>

                <div className={styles.menuItem}>
                    <Link to="/lobby" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', width: '100%' }}>
                        <div className={styles.icon}>⚔️</div>
                        <div className={styles.label}>
                            <h3>Ranked Match</h3>
                            <p>Play against others</p>
                        </div>
                    </Link>
                </div>

                <Link to="/leaderboard" className={styles.menuItem}>
                    <div className={styles.icon}>🏆</div>
                    <div className={styles.label}>
                        <h3>Leaderboard</h3>
                        <p>Global rankings</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default MainMenu;

import React from 'react';
import { Link } from 'react-router-dom';
import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import styles from './MainMenu.module.css';

const MainMenu = () => {
    const wallet = useTonWallet();

    return (
        <div className={styles.container}>
            <div className={styles.walletBtn}>
                <Link to="/profile" style={{ marginRight: '10px', textDecoration: 'none', fontSize: '1.5rem' }}>👤</Link>
                <TonConnectButton />
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

                <div
                    className={`${styles.menuItem} ${!wallet ? styles.disabled : ''}`}
                    onClick={(e) => {
                        if (!wallet) {
                            e.preventDefault();
                            alert('Please connect your TON wallet to play Ranked Match!');
                        }
                    }}
                >
                    <Link to={wallet ? "/lobby" : "#"} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', width: '100%' }}>
                        <div className={styles.icon}>⚔️</div>
                        <div className={styles.label}>
                            <h3>Ranked Match</h3>
                            <p>{wallet ? "Play against others" : "Connect Wallet to Play"}</p>
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

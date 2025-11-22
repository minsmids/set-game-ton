import React from 'react';
import { Link } from 'react-router-dom';
import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import styles from './MainMenu.module.css';

const MainMenu = () => {
    const wallet = useTonWallet();

    return (
        <div className={styles.container}>
            <div className={styles.walletBtn}>
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

                <Link to="/lobby" className={styles.menuItem}>
                    <div className={styles.icon}>⚔️</div>
                    <div className={styles.label}>
                        <h3>Ranked Match</h3>
                        <p>Play against others</p>
                    </div>
                </Link>

                <div className={`${styles.menuItem} ${styles.disabled}`}>
                    <div className={styles.icon}>🏆</div>
                    <div className={styles.label}>
                        <h3>Leaderboard</h3>
                        <p>Global rankings (Coming Soon)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainMenu;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTonWallet } from '@tonconnect/ui-react';
import { connectSocket } from '../socket';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
    const navigate = useNavigate();
    const wallet = useTonWallet();
    const [profile, setProfile] = useState(null);
    const [newName, setNewName] = useState('');
    const [telegramUser, setTelegramUser] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
        if (!wallet && !tgUser) {
            navigate('/');
            return;
        }

        const socket = connectSocket();
        const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;

        const payload = {};
        if (wallet) payload.wallet = wallet.account.address;
        if (tgUser) payload.telegramId = tgUser.id;

        // Fetch profile
        socket.emit('get_profile', payload);

        socket.on('profile_data', (data) => {
            setProfile(data);
            setNewName(data.name || '');
        });

        socket.on('profile_updated', (data) => {
            setProfile(data);
            setIsSaving(false);
            alert('Profile updated!');
        });

        // Check Telegram Web App
        if (window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp;
            tg.ready();

            if (tg.initDataUnsafe?.user) {
                setTelegramUser(tg.initDataUnsafe.user);

                // Verify with backend
                fetch(import.meta.env.VITE_API_URL + '/api/auth/telegram', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ initData: tg.initData })
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            // Auto-update profile with Telegram info if not set
                            // Or just store the ID
                            socket.emit('update_profile', {
                                wallet: walletAddress,
                                telegramId: data.user.id,
                                // Only set name if not already set
                                // name: profile?.name ? undefined : data.user.first_name 
                            });
                        }
                    })
                    .catch(err => console.error('Auth error:', err));
            }
        }

        return () => {
            socket.off('profile_data');
            socket.off('profile_updated');
        };
    }, [wallet, navigate]);

    const handleSave = () => {
        const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
        if (!wallet && !tgUser) return;
        setIsSaving(true);
        setIsSaving(true);
        const socket = connectSocket();

        const payload = {};
        if (wallet) payload.wallet = wallet.account.address;
        if (tgUser) payload.telegramId = tgUser.id;
        payload.name = newName;

        socket.emit('update_profile', payload);
    };

    const useTelegramName = () => {
        if (telegramUser) {
            setNewName(telegramUser.first_name + (telegramUser.last_name ? ' ' + telegramUser.last_name : ''));
        }
    };

    if (!profile) return <div className={styles.loader}>Loading...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button className={styles.backButton} onClick={() => navigate('/')}>
                    ← Back
                </button>
                <h1>Profile</h1>
            </div>

            <div className={styles.card}>
                <div className={styles.stats}>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Rating</span>
                        <span className={styles.statValue}>{profile.elo}</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Wins</span>
                        <span className={styles.statValue}>{profile.wins}</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Games</span>
                        <span className={styles.statValue}>{profile.gamesPlayed}</span>
                    </div>
                </div>

                <div className={styles.form}>
                    <label>Display Name</label>
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Enter your name"
                        maxLength={20}
                    />

                    {telegramUser && (
                        <button className={styles.tgButton} onClick={useTelegramName}>
                            Use Telegram Name ({telegramUser.first_name})
                        </button>
                    )}

                    <button
                        className={styles.saveButton}
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save Profile'}
                    </button>
                </div>

                <div className={styles.walletInfo}>
                    <p>Wallet: {wallet.account.address.slice(0, 6)}...{wallet.account.address.slice(-4)}</p>
                    {telegramUser && <p className={styles.verified}>✅ Verified Telegram: @{telegramUser.username}</p>}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

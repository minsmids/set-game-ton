import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connectSocket } from '../socket';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [newName, setNewName] = useState('');
    const [telegramUser, setTelegramUser] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const getUserId = () => {
        const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
        if (tgUser) return { telegramId: tgUser.id };

        let guestId = localStorage.getItem('guest_id');
        if (!guestId) {
            guestId = 'guest_' + Math.floor(Math.random() * 100000);
            localStorage.setItem('guest_id', guestId);
        }
        return { telegramId: guestId };
    };

    useEffect(() => {
        const socket = connectSocket();
        const userId = getUserId();

        if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
            setTelegramUser(window.Telegram.WebApp.initDataUnsafe.user);
        }

        // Fetch profile
        socket.emit('get_profile', userId);

        socket.on('profile_data', (data) => {
            setProfile(data);
            setNewName(data.name || '');
        });

        socket.on('profile_updated', (data) => {
            setProfile(data);
            setIsSaving(false);
            alert('Profile updated!');
        });

        return () => {
            socket.off('profile_data');
            socket.off('profile_updated');
        };
    }, [navigate]);

    const handleSave = () => {
        setIsSaving(true);
        const socket = connectSocket();
        const userId = getUserId();

        const payload = { ...userId, name: newName };
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
                    {telegramUser ? (
                        <p className={styles.verified}>✅ Authenticated as {telegramUser.first_name}</p>
                    ) : (
                        <p>Guest Mode</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connectSocket, disconnectSocket } from '../socket';
import { useGame } from '../context/GameContext';
import styles from './LobbyPage.module.css';

import { useTonWallet } from '@tonconnect/ui-react';

const LobbyPage = () => {
    const { dispatch } = useGame();
    const navigate = useNavigate();
    const wallet = useTonWallet();
    const [status, setStatus] = useState('idle'); // connecting, idle, queue, waiting_private, found
    const [inviteCode, setInviteCode] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!wallet) {
            navigate('/');
            return;
        }

        const socket = connectSocket();

        const onConnect = () => {
            setStatus('idle');
        };

        const onGameStart = (data) => {
            setStatus('found');
            dispatch({ type: 'START_MULTIPLAYER_GAME', payload: { ...data, socket } });
            setTimeout(() => {
                navigate('/multiplayer');
            }, 1000);
        };

        const onPrivateGameCreated = ({ code }) => {
            setStatus('waiting_private');
            setInviteCode(code);
        };

        const onError = ({ message }) => {
            setError(message);
            setStatus('idle');
        };

        socket.on('connect', onConnect);
        socket.on('game_start', onGameStart);
        socket.on('private_game_created', onPrivateGameCreated);
        socket.on('error', onError);

        if (socket.connected) {
            onConnect();
        }

        return () => {
            socket.off('connect', onConnect);
            socket.off('game_start', onGameStart);
            socket.off('private_game_created', onPrivateGameCreated);
            socket.off('error', onError);
        };
    }, [navigate, dispatch, wallet]);

    const handleJoinQueue = () => {
        if (!wallet) return;
        setError('');
        setStatus('queue');
        const socket = connectSocket();
        socket.emit('join_queue', {
            wallet: wallet.account.address,
            name: 'Player ' + wallet.account.address.substr(0, 4)
        });
    };

    const handleCreatePrivate = () => {
        if (!wallet) return;
        setError('');
        const socket = connectSocket();
        socket.emit('create_private_game', {
            wallet: wallet.account.address,
            name: 'Host'
        });
    };

    const handleJoinPrivate = () => {
        if (!wallet) return;
        setError('');
        if (joinCode.length !== 6) return;
        const socket = connectSocket();
        socket.emit('join_private_game', {
            code: joinCode,
            userData: {
                wallet: wallet.account.address,
                name: 'Guest'
            }
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2>Ranked Match</h2>

                {error && <div className={styles.error}>{error}</div>}

                {status === 'connecting' && <p>Connecting to server...</p>}

                {(status === 'idle' || status === 'connecting') && (
                    <div className={styles.menu}>
                        <button className={styles.button} onClick={handleJoinQueue}>Find Match</button>
                        <div className={styles.divider}>OR</div>
                        <button className={styles.button} onClick={handleCreatePrivate}>Create Private Game</button>
                        <div className={styles.joinInput}>
                            <input
                                type="text"
                                placeholder="Enter 6-digit code"
                                maxLength={6}
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value)}
                            />
                            <button
                                className={styles.button}
                                onClick={handleJoinPrivate}
                                disabled={joinCode.length !== 6}
                            >
                                Join
                            </button>
                        </div>
                    </div>
                )}

                {status === 'queue' && (
                    <div className={styles.loader}>
                        <div className={styles.spinner}></div>
                        <p>Searching for opponent...</p>
                    </div>
                )}

                {status === 'waiting_private' && (
                    <div className={styles.waiting}>
                        <p>Share this code with your friend:</p>
                        <div className={styles.code}>{inviteCode}</div>
                        <div className={styles.spinner}></div>
                        <p>Waiting for player to join...</p>
                    </div>
                )}

                {status === 'found' && (
                    <div className={styles.found}>
                        <p>Match Found!</p>
                        <p>Starting game...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LobbyPage;

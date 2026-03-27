import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
    getFirestore,
    collection,
    onSnapshot,
    query,
    orderBy,
    doc,
    updateDoc,
    deleteDoc,
    writeBatch,
} from 'firebase/firestore';
import { app } from '../firebase/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import { FiCheck, FiTrash2, FiCheckCircle } from 'react-icons/fi';

const Notification = () => {
    const [currentUser, setCurrentUser] = useState(undefined);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const db = getFirestore(app);
    const auth = getAuth(app);

    // Auth state listener
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });
        return () => unsub();
    }, [auth]);

    // Firestore listener
    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }
        const q = query(
            collection(db, 'notifications', currentUser.uid, 'items'),
            orderBy('createdAt', 'desc')
        );
        const unsub = onSnapshot(q, (snap) => {
            setNotifications(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
            setLoading(false);
        });
        return () => unsub();
    }, [currentUser, db]);

    // --- NEW LOGIC: AUTO-MARK AS READ ---
    // This removes the "1 2 3" badge count as soon as the user sees the list
    useEffect(() => {
        const unreadNotifications = notifications.filter((n) => !n.read);
        if (unreadNotifications.length > 0) {
            markAllRead();
        }
    }, [notifications]); 
    // -------------------------------------

    const markRead = async (notifId) => {
        if (!currentUser) return;
        const ref = doc(db, 'notifications', currentUser.uid, 'items', notifId);
        await updateDoc(ref, { read: true });
    };

    const deleteNotif = async (notifId) => {
        if (!currentUser) return;
        const ref = doc(db, 'notifications', currentUser.uid, 'items', notifId);
        await deleteDoc(ref);
    };

    const markAllRead = async () => {
        if (!currentUser || notifications.length === 0) return;
        const batch = writeBatch(db);
        let hasUnread = false;

        notifications
            .filter((n) => !n.read)
            .forEach((n) => {
                hasUnread = true;
                const ref = doc(db, 'notifications', currentUser.uid, 'items', n.id);
                batch.update(ref, { read: true });
            });

        if (hasUnread) {
            await batch.commit();
        }
    };

    const formatTime = (timestamp) => {
        if (!timestamp?.toDate) return '';
        const d = timestamp.toDate();
        const now = new Date();
        const diff = now - d;
        if (diff < 60000) return 'just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return d.toLocaleDateString();
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    if (currentUser === undefined || loading) {
        return (
            <div className="min-h-screen w-full bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500" />
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="min-h-screen w-full bg-black flex items-center justify-center">
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl px-8 py-8 text-center max-w-sm">
                    <FaBell className="text-amber-500 mx-auto mb-3 text-3xl" />
                    <p className="text-amber-500 font-bold mb-1">Sign in to see notifications</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-black text-white">
            <div className="fixed inset-0 z-0 opacity-5 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-black to-black" />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto px-4 pt-28 pb-16">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-serif italic text-white">Notifications</h1>
                        <p className="text-[10px] uppercase tracking-widest text-amber-500/60 font-black mt-1">
                            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllRead}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[10px] uppercase tracking-widest font-black hover:bg-amber-500/20 transition-colors"
                        >
                            <FiCheckCircle size={14} /> Mark all read
                        </button>
                    )}
                </div>

                {notifications.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-32 gap-4 text-center"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                            <FaBell size={28} />
                        </div>
                        <div>
                            <p className="text-white font-serif italic text-lg">No notifications yet</p>
                            <p className="text-gray-600 text-xs uppercase tracking-widest mt-1">
                                When someone messages you, it will appear here
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <div className="space-y-3">
                        <AnimatePresence>
                            {notifications.map((notif) => (
                                <motion.div
                                    key={notif.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.18 }}
                                    className={`relative flex items-start gap-4 p-4 rounded-2xl border cursor-default transition-all ${
                                        notif.read
                                            ? 'bg-white/3 border-white/5'
                                            : 'bg-amber-500/5 border-amber-500/20'
                                    }`}
                                >
                                    {!notif.read && (
                                        <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-amber-500" />
                                    )}

                                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 flex-shrink-0">
                                        <FaUserCircle size={22} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] uppercase tracking-widest text-amber-500/70 font-black mb-0.5">
                                            {notif.senderName || "Unknown User"}
                                        </p>
                                        <p className="text-sm text-gray-200 leading-relaxed truncate">
                                            {notif.text}
                                        </p>
                                        <p className="text-[9px] text-gray-600 mt-1 uppercase tracking-widest">
                                            {formatTime(notif.createdAt)}
                                        </p>
                                    </div>

                                    <div className="flex gap-1 flex-shrink-0">
                                        {!notif.read && (
                                            <button
                                                onClick={() => markRead(notif.id)}
                                                className="p-1.5 rounded-lg bg-white/5 hover:bg-amber-500/20 text-gray-500 hover:text-amber-500 transition-colors pointer-events-auto"
                                                title="Mark as read"
                                            >
                                                <FiCheck size={13} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteNotif(notif.id)}
                                            className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors pointer-events-auto"
                                            title="Delete"
                                        >
                                            <FiTrash2 size={13} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notification;
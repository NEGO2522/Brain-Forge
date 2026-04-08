import React, { useEffect, useState } from 'react';
import useSEO from '../hooks/useSEO';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import { FiCheck, FiTrash2, FiCheckCircle } from 'react-icons/fi';

const Notification = () => {
  useSEO({
    title: 'Notifications',
    description: 'Check your latest notifications from the Linkaura community.',
    keywords: 'notifications, alerts, linkaura messages',
  });

  const [currentUser,    setCurrentUser]    = useState(undefined);
  const [notifications,  setNotifications]  = useState([]);
  const [loading,        setLoading]        = useState(true);

  /* ── Auth ── */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setCurrentUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  /* ── Fetch + realtime notifications ── */
  useEffect(() => {
    if (!currentUser) { setLoading(false); return; }

    // Initial fetch
    supabase.from('notifications')
      .select('*')
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setNotifications(data || []);
        setLoading(false);
      });

    // Realtime subscription
    const channel = supabase
      .channel(`notifs:${currentUser.id}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'notifications',
        filter: `user_id=eq.${currentUser.id}`,
      }, () => {
        // Refetch on any change
        supabase.from('notifications')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false })
          .then(({ data }) => setNotifications(data || []));
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [currentUser]);

  /* ── Auto mark as read when notifications appear ── */
  useEffect(() => {
    const unread = notifications.filter(n => !n.read);
    if (unread.length > 0) markAllRead(unread);
  }, [notifications]);

  const markRead = async (id) => {
    if (!currentUser) return;
    await supabase.from('notifications').update({ read: true }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotif = async (id) => {
    if (!currentUser) return;
    await supabase.from('notifications').delete().eq('id', id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllRead = async (list) => {
    const targets = list || notifications.filter(n => !n.read);
    if (!currentUser || targets.length === 0) return;
    const ids = targets.map(n => n.id);
    await supabase.from('notifications').update({ read: true }).in('id', ids);
    setNotifications(prev => prev.map(n => ids.includes(n.id) ? { ...n, read: true } : n));
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (currentUser === undefined || loading) return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500" />
    </div>
  );

  if (!currentUser) return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center">
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl px-8 py-8 text-center max-w-sm">
        <FaBell className="text-amber-500 mx-auto mb-3 text-3xl" />
        <p className="text-amber-500 font-bold mb-1">Sign in to see notifications</p>
      </div>
    </div>
  );

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
            <button onClick={() => markAllRead()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[10px] uppercase tracking-widest font-black hover:bg-amber-500/20 transition-colors">
              <FiCheckCircle size={14} /> Mark all read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 gap-4 text-center">
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
              {notifications.map(notif => (
                <motion.div key={notif.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.18 }}
                  className={`relative flex items-start gap-4 p-4 rounded-2xl border cursor-default transition-all ${
                    notif.read ? 'bg-white/3 border-white/5' : 'bg-amber-500/5 border-amber-500/20'
                  }`}>
                  {!notif.read && <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-amber-500" />}

                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 flex-shrink-0">
                    <FaUserCircle size={22} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-widest text-amber-500/70 font-black mb-0.5">
                      {notif.sender_name || 'Unknown User'}
                    </p>
                    <p className="text-sm text-gray-200 leading-relaxed truncate">{notif.text}</p>
                    <p className="text-[9px] text-gray-600 mt-1 uppercase tracking-widest">
                      {formatTime(notif.created_at)}
                    </p>
                  </div>

                  <div className="flex gap-1 flex-shrink-0">
                    {!notif.read && (
                      <button onClick={() => markRead(notif.id)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-amber-500/20 text-gray-500 hover:text-amber-500 transition-colors">
                        <FiCheck size={13} />
                      </button>
                    )}
                    <button onClick={() => deleteNotif(notif.id)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors">
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

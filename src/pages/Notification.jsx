import React, { useEffect, useState } from 'react';
import useSEO from '../hooks/useSEO';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiCheck, FiTrash2, FiCheckCircle, FiUser } from 'react-icons/fi';
import Navbar from '../components/Navbar';

const Notification = () => {
  useSEO({
    title: 'Notifications',
    description: 'Check your latest notifications from the Linkaura community.',
    keywords: 'notifications, alerts, linkaura messages',
  });

  const [currentUser,   setCurrentUser]   = useState(undefined);
  const [notifications, setNotifications] = useState([]);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setCurrentUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setCurrentUser(s?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser) { setLoading(false); return; }
    supabase.from('notifications').select('*').eq('user_id', currentUser.id).order('created_at', { ascending: false })
      .then(({ data }) => { setNotifications(data || []); setLoading(false); });
    const ch = supabase.channel(`notifs:${currentUser.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${currentUser.id}` }, () => {
        supabase.from('notifications').select('*').eq('user_id', currentUser.id).order('created_at', { ascending: false })
          .then(({ data }) => setNotifications(data || []));
      }).subscribe();
    return () => supabase.removeChannel(ch);
  }, [currentUser]);

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
    const d = new Date(ts), now = new Date(), diff = now - d;
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const noiseBg = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'repeat', backgroundSize: '128px',
  };

  if (currentUser === undefined || loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center" style={{ fontFamily: 'sans-serif' }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-t-2 border-black animate-spin" />
        <p className="text-[10px] uppercase tracking-widest font-black text-black/40">Loading…</p>
      </div>
    </div>
  );

  if (!currentUser) return (
    <div className="min-h-screen bg-white flex items-center justify-center" style={{ fontFamily: 'sans-serif' }}>
      <div className="border border-black/15 px-10 py-10 text-center max-w-xs">
        <FiBell size={28} className="text-black/25 mx-auto mb-4" />
        <p className="text-sm font-black uppercase tracking-widest text-black/50">Sign in to see notifications</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black" style={{ fontFamily: "'Georgia', serif" }}>
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]" style={noiseBg} />
      <Navbar />

      {/* HEADER */}
      <section className="relative border-b border-black/10 overflow-hidden pt-28">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }} />
        <div className="relative z-10 px-6 md:px-12 py-12 max-w-2xl mx-auto flex items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 border border-black/15 text-[10px] font-black uppercase tracking-[0.4em] text-black/50 mb-6" style={{ fontFamily: 'sans-serif' }}>
              <FiBell size={10} /> Notifications
            </span>
            <h1 className="text-4xl sm:text-6xl font-serif font-bold leading-[0.92] tracking-tight text-black">Inbox.</h1>
            <p className="text-[10px] uppercase tracking-[0.4em] font-black text-black/35 mt-3" style={{ fontFamily: 'sans-serif' }}>
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button onClick={() => markAllRead()}
              className="flex items-center gap-2 px-5 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-black/80 transition-all flex-shrink-0"
              style={{ fontFamily: 'sans-serif' }}>
              <FiCheckCircle size={13} /> Mark all read
            </button>
          )}
        </div>
      </section>

      {/* LIST */}
      <section className="px-6 md:px-12 py-12 max-w-2xl mx-auto relative z-10" style={{ fontFamily: 'sans-serif' }}>
        {notifications.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-start gap-4 py-24">
            <FiBell size={32} className="text-black/20" />
            <p className="font-serif italic text-2xl text-black/40">No notifications yet</p>
            <p className="text-[10px] uppercase tracking-widest font-black text-black/25">When someone messages you, it will appear here</p>
          </motion.div>
        ) : (
          <div className="flex flex-col border-t border-black/8">
            <AnimatePresence>
              {notifications.map(notif => (
                <motion.div key={notif.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.18 }}
                  className={`flex items-start gap-4 py-5 border-b border-black/8 ${!notif.read ? 'bg-black/[0.015]' : ''}`}>
                  <div className="w-9 h-9 bg-black flex items-center justify-center flex-shrink-0">
                    <FiUser size={14} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-widest font-black text-black/40 mb-0.5">{notif.sender_name || 'Unknown User'}</p>
                    <p className="text-sm text-black/70 leading-relaxed truncate">{notif.text}</p>
                    <p className="text-[9px] text-black/25 mt-1 uppercase tracking-widest font-black">{formatTime(notif.created_at)}</p>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    {!notif.read && (
                      <button onClick={() => markRead(notif.id)}
                        className="w-8 h-8 border border-black/15 flex items-center justify-center text-black/35 hover:bg-black hover:text-white hover:border-black transition-all duration-200">
                        <FiCheck size={12} />
                      </button>
                    )}
                    <button onClick={() => deleteNotif(notif.id)}
                      className="w-8 h-8 border border-black/15 flex items-center justify-center text-black/35 hover:bg-black hover:text-white hover:border-black transition-all duration-200">
                      <FiTrash2 size={12} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </div>
  );
};

export default Notification;

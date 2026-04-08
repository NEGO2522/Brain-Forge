import React, { useState, useEffect, useRef } from 'react';
import useSEO from '../hooks/useSEO';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSend, FiUser, FiMapPin, FiHome,
  FiHelpCircle, FiMap, FiFileText, FiCode, FiChevronLeft, FiCpu,
} from 'react-icons/fi';

const fmt = (ts) => {
  if (!ts) return '';
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const QUICK = [
  { id: 'doubt',    icon: FiHelpCircle, label: 'Ask Doubt'     },
  { id: 'guidance', icon: FiMap,        label: 'Get Guidance'  },
  { id: 'resume',   icon: FiFileText,   label: 'Resume Review' },
  { id: 'project',  icon: FiCode,       label: 'Project Help'  },
];

const Chat = () => {
  useSEO({ title: 'Chat', description: 'Real-time chat on Linkaura.' });

  const { id }    = useParams();
  const { state } = useLocation();
  const navigate  = useNavigate();
  const profile   = state?.profile;

  const [messages,    setMessages]    = useState([]);
  const [input,       setInput]       = useState('');
  const [sending,     setSending]     = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);

  const bottomRef   = useRef(null);
  const textareaRef = useRef(null);

  // Get current user
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setCurrentUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Compute room id: sorted user ids joined with underscore
  const chatRoomId = currentUser && profile?.user_id
    ? [currentUser.id, profile.user_id].sort().join('_')
    : null;

  // Real-time messages via Supabase Realtime
  useEffect(() => {
    if (!chatRoomId) return;

    // Fetch existing messages
    supabase
      .from('chat_messages')
      .select('*')
      .eq('room_id', chatRoomId)
      .order('created_at', { ascending: true })
      .then(({ data }) => setMessages(data || []));

    // Subscribe to new messages
    const channel = supabase
      .channel(`room:${chatRoomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `room_id=eq.${chatRoomId}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [chatRoomId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const doSend = async (text) => {
    if (!text?.trim() || !chatRoomId || !currentUser) return;
    setSending(true);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    const senderName = currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'You';

    try {
      // Insert message
      await supabase.from('chat_messages').insert({
        room_id:     chatRoomId,
        sender_id:   currentUser.id,
        sender_name: senderName,
        text:        text.trim(),
      });

      // Send notification to receiver
      const receiverId = profile?.user_id;
      if (receiverId && receiverId !== currentUser.id) {
        await supabase.from('notifications').insert({
          user_id:     receiverId,
          sender_id:   currentUser.id,
          sender_name: senderName,
          type:        'message',
          text:        text.length > 60 ? text.slice(0, 60) + '…' : text,
          room_id:     chatRoomId,
          read:        false,
        });
      }
    } catch (e) { console.error(e); }
    finally { setSending(false); }
  };

  const quickSend = (type) => {
    const n = profile?.name?.split(' ')[0] || 'there';
    const s = profile?.tech_stack?.split(',')[0]?.trim() || 'your field';
    const map = {
      doubt:    `Hi ${n}, I have a doubt related to ${s} and would really appreciate your help.`,
      guidance: `Hi ${n}, I'd love to get your guidance on how to grow in ${s}. Could you share some direction?`,
      resume:   `Hi ${n}, would you be open to doing a quick resume review for me?`,
      project:  `Hi ${n}, I'm working on a project and could use some expert help. Would you be open to guiding me?`,
    };
    doSend(map[type]);
  };

  if (currentUser === undefined) return (
    <div className="h-screen bg-[#030303] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin" />
        <p className="text-[10px] uppercase tracking-[0.4em] text-amber-500/40 font-black">Connecting…</p>
      </div>
    </div>
  );

  const techTags = profile?.tech_stack?.split(',').map(t => t.trim()).filter(Boolean) || [];

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-[#030303] text-white pt-16 md:pt-20 relative">

      {/* Ambient glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-amber-500/[0.04] rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-amber-600/[0.03] rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: 'linear-gradient(#f59e0b 1px,transparent 1px),linear-gradient(90deg,#f59e0b 1px,transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* HEADER */}
      <header className="relative z-20 flex-shrink-0 flex items-center gap-4 px-4 md:px-8 py-3 bg-black/60 backdrop-blur-2xl border-b border-white/[0.06]">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all text-gray-400 hover:text-amber-500 flex-shrink-0">
          <FiChevronLeft size={20} />
        </motion.button>

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/30 to-amber-600/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FiUser size={20} />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-black" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black uppercase tracking-widest truncate text-white">
                {profile?.name || 'Anonymous'}
              </h2>
              <span className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Live</span>
              </span>
            </div>
            <div className="flex items-center gap-3 mt-0.5">
              <div className="flex items-center gap-1">
                <FiMapPin size={9} className="text-amber-500/50 flex-shrink-0" />
                <span className="text-[10px] text-gray-500 uppercase tracking-wide truncate">
                  {profile?.address || 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate('/')}
          className="flex-shrink-0 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500 hover:text-black transition-all text-amber-500">
          <FiHome size={18} />
        </motion.button>
      </header>

      {/* MESSAGES */}
      <main className="relative z-10 flex-1 overflow-y-auto py-6 px-4 md:px-[12%] space-y-3">
        {messages.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center h-full gap-6 py-24">
            <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/20 flex items-center justify-center">
              <FiUser size={36} className="text-amber-500/60" />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#030303]" />
            </div>
            <div className="text-center space-y-2">
              <p className="font-serif italic text-2xl text-white/80">
                Say hello to <span className="text-amber-500">{profile?.name?.split(' ')[0] || 'them'}</span>
              </p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-600 font-black">Or use a quick action below</p>
            </div>
            {techTags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 max-w-xs">
                {techTags.map(t => (
                  <span key={t} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-400">{t}</span>
                ))}
              </div>
            )}
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            const isMe = msg.sender_id === currentUser?.id;
            const prev = messages[i - 1];
            const showSender = !isMe && msg.sender_name !== prev?.sender_name;
            return (
              <motion.div key={msg.id}
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                {!isMe && (
                  <div className="flex-shrink-0 w-7 h-7 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-1">
                    <FiUser size={13} />
                  </div>
                )}
                <div className={`flex flex-col gap-1 max-w-[78%] md:max-w-[62%] ${isMe ? 'items-end' : 'items-start'}`}>
                  {showSender && (
                    <span className="text-[9px] text-amber-500/50 font-black uppercase tracking-widest px-1">{msg.sender_name}</span>
                  )}
                  <div className={`relative px-4 py-3 rounded-2xl text-sm leading-relaxed break-words ${
                    isMe
                      ? 'bg-amber-500 text-black font-semibold rounded-br-sm shadow-[0_4px_20px_rgba(245,158,11,0.25)]'
                      : 'bg-white/[0.05] border border-white/[0.08] text-gray-100 rounded-bl-sm'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[8px] text-gray-700 px-1 font-bold uppercase tracking-wider">
                    {fmt(msg.created_at)}
                  </span>
                </div>
                {isMe && (
                  <div className="flex-shrink-0 w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-1">
                    <FiUser size={13} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </main>

      {/* INPUT */}
      <footer className="relative z-20 flex-shrink-0 px-4 md:px-[12%] pt-3 pb-5 bg-black/40 backdrop-blur-2xl border-t border-white/[0.05]">
        {currentUser && (
          <div className="flex gap-2 overflow-x-auto pb-3 mb-1" style={{ scrollbarWidth: 'none' }}>
            {QUICK.map(({ id, icon: Icon, label }) => (
              <motion.button key={id} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                onClick={() => quickSend(id)} disabled={sending}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all disabled:opacity-30 border bg-white/[0.03] border-white/10 text-gray-400 hover:bg-amber-500/10 hover:border-amber-500/40 hover:text-amber-400">
                <Icon size={12} className="text-amber-500 flex-shrink-0" />{label}
              </motion.button>
            ))}
          </div>
        )}

        {currentUser ? (
          <div className="relative group max-w-5xl mx-auto">
            <div className="absolute -inset-[1px] rounded-[1.8rem] bg-gradient-to-r from-amber-500/30 via-amber-400/10 to-transparent blur-sm opacity-0 group-focus-within:opacity-100 transition-all duration-500 pointer-events-none" />
            <div className="relative flex items-end gap-3 bg-[#111] border border-white/[0.08] rounded-[1.8rem] px-5 py-3 focus-within:border-amber-500/30 transition-all">
              <textarea ref={textareaRef} rows={1} value={input}
                onChange={e => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 130) + 'px'; }}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doSend(input); } }}
                placeholder={`Message ${profile?.name?.split(' ')[0] || 'them'}…`}
                className="flex-1 bg-transparent outline-none resize-none text-sm text-white placeholder:text-gray-600 leading-relaxed py-1"
                style={{ minHeight: '28px', scrollbarWidth: 'none' }} />
              <motion.button whileTap={{ scale: 0.88 }} onClick={() => doSend(input)}
                disabled={sending || !input.trim()}
                className="flex-shrink-0 w-10 h-10 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)] disabled:opacity-25 disabled:shadow-none transition-all">
                {sending
                  ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  : <FiSend size={16} />}
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <button onClick={() => navigate('/login')}
              className="px-8 py-3 bg-amber-500 text-black font-black uppercase tracking-widest text-xs rounded-full hover:bg-amber-400 transition-all">
              Sign In to Chat
            </button>
          </div>
        )}
        <p className="text-center text-[8px] text-gray-700 uppercase tracking-[0.3em] font-black mt-2">
          Enter to send · Shift+Enter for new line
        </p>
      </footer>
    </div>
  );
};

export default Chat;

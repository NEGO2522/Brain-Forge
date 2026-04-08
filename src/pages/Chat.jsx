import React, { useState, useEffect, useRef } from 'react';
import useSEO from '../hooks/useSEO';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSend, FiUser, FiMapPin, FiHome,
  FiHelpCircle, FiMap, FiFileText, FiCode, FiChevronLeft, FiZap,
} from 'react-icons/fi';

/* ── Colorful initials avatar ── */
const Avatar = ({ name, size = 'md' }) => {
  const initials = (name || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const palette = [
    ['#f59e0b','#78350f'], ['#10b981','#064e3b'], ['#6366f1','#1e1b4b'],
    ['#ec4899','#500724'], ['#14b8a6','#042f2e'], ['#f97316','#431407'],
  ];
  const [fg, bg] = palette[(name || '').charCodeAt(0) % palette.length];
  const sz = size === 'lg' ? 'w-12 h-12 text-sm' : size === 'sm' ? 'w-7 h-7 text-[9px]' : 'w-10 h-10 text-xs';
  return (
    <div className={`${sz} rounded-2xl flex items-center justify-center font-black flex-shrink-0 select-none`}
      style={{ background: `${bg}cc`, border: `1px solid ${fg}40`, color: fg }}>
      {initials}
    </div>
  );
};

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
    <div className="h-screen bg-[#080808] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin" />
        <p className="text-[9px] uppercase tracking-[0.4em] font-black" style={{ color: 'rgba(245,158,11,0.4)' }}>Connecting…</p>
      </div>
    </div>
  );

  const techTags = profile?.tech_stack?.split(',').map(t => t.trim()).filter(Boolean) || [];

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-[#080808] text-white pt-0 relative">

      {/* ── Ambient background ── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-[20%] w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-[10%] w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.03) 0%, transparent 70%)' }} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
      </div>

      {/* ── HEADER ── */}
      <header className="relative z-20 flex-shrink-0 flex items-center gap-3 px-4 md:px-8 py-3 flex-shrink-0"
        style={{ background: 'rgba(12,12,12,0.95)', borderBottom: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)' }}>

        {/* Back button */}
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)}
          className="p-2 rounded-xl transition-all flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,158,11,0.4)'; e.currentTarget.style.color = '#f59e0b'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
        >
          <FiChevronLeft size={18} />
        </motion.button>

        {/* Profile info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative flex-shrink-0">
            <Avatar name={profile?.name} size="md" />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2"
              style={{ borderColor: '#0c0c0c' }} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-black uppercase tracking-wide truncate" style={{ color: '#e5e7eb' }}>
                {profile?.name || 'Anonymous'}
              </h2>
              <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full"
                style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: '#6ee7b7' }}>Live</span>
              </span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <FiMapPin size={9} style={{ color: 'rgba(245,158,11,0.45)', flexShrink: 0 }} />
              <span className="text-[9px] uppercase tracking-wide truncate" style={{ color: 'rgba(255,255,255,0.25)' }}>
                {profile?.address || 'Unknown location'}
              </span>
            </div>
          </div>
        </div>

        {/* Home button */}
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate('/')}
          className="flex-shrink-0 p-2.5 rounded-xl transition-all"
          style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#f59e0b' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#f59e0b'; e.currentTarget.style.color = '#000'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.1)'; e.currentTarget.style.color = '#f59e0b'; }}
        >
          <FiHome size={16} />
        </motion.button>
      </header>

      {/* ── MESSAGES ── */}
      <main className="relative z-10 flex-1 overflow-y-auto py-8 px-4 md:px-[10%] lg:px-[15%] min-h-0"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(245,158,11,0.1) transparent' }}>

        {messages.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center h-full gap-6 py-16">
            <div className="relative">
              <Avatar name={profile?.name} size="lg" />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 flex items-center justify-center"
                style={{ borderColor: '#080808' }}>
                <span className="w-2 h-2 rounded-full bg-white" />
              </span>
            </div>
            <div className="text-center space-y-2">
              <p className="font-serif italic text-2xl" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Say hello to <span style={{ color: '#f59e0b' }}>{profile?.name?.split(' ')[0] || 'them'}</span>
              </p>
              <p className="text-[9px] uppercase tracking-[0.35em] font-black" style={{ color: 'rgba(255,255,255,0.2)' }}>
                Or use a quick action below
              </p>
            </div>
            {techTags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 max-w-xs">
                {techTags.map(t => (
                  <span key={t} className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest"
                    style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)', color: 'rgba(245,158,11,0.6)' }}>
                    {t}
                  </span>
                ))}
              </div>
            )}
            <div className="w-px h-10" style={{ background: 'linear-gradient(to bottom, transparent, rgba(245,158,11,0.3))' }} />
            <FiZap size={13} style={{ color: 'rgba(245,158,11,0.3)' }} />
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            const isMe = msg.sender_id === currentUser?.id;
            const prevMsg = messages[i - 1];
            const showSender = !prevMsg || prevMsg.sender_id !== msg.sender_id;
            return (
              <motion.div key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                className={`flex items-end gap-2.5 ${
                  isMe ? 'justify-end' : 'justify-start'
                } ${showSender ? 'mt-5' : 'mt-1'}`}
              >
                {/* Avatar — received side */}
                {!isMe && (
                  <div className={showSender ? '' : 'opacity-0 pointer-events-none'}>
                    <Avatar name={msg.sender_name} size="sm" />
                  </div>
                )}

                <div className={`flex flex-col gap-1 max-w-[72%] md:max-w-[58%] ${isMe ? 'items-end' : 'items-start'}`}>
                  {showSender && (
                    <span className="text-[9px] font-black uppercase tracking-widest px-1"
                      style={{ color: isMe ? 'rgba(245,158,11,0.55)' : 'rgba(255,255,255,0.22)' }}>
                      {isMe ? 'You' : msg.sender_name}
                    </span>
                  )}
                  <div className={`px-4 py-2.5 text-sm leading-relaxed break-words ${
                    isMe ? 'rounded-2xl rounded-br-sm font-medium' : 'rounded-2xl rounded-bl-sm'
                  }`}
                    style={isMe
                      ? { background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#000', boxShadow: '0 4px 20px rgba(245,158,11,0.2)' }
                      : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#d1d5db' }
                    }>
                    {msg.text}
                  </div>
                  <span className="text-[8px] px-1" style={{ color: 'rgba(255,255,255,0.18)' }}>
                    {fmt(msg.created_at)}
                  </span>
                </div>

                {/* Spacer — sent side */}
                {isMe && <div className="w-7 flex-shrink-0" />}
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </main>

      {/* ── INPUT ── */}
      <footer className="relative z-20 flex-shrink-0 px-4 md:px-[10%] lg:px-[15%] pt-3 pb-5"
        style={{ background: 'rgba(12,12,12,0.95)', borderTop: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)' }}>

        {/* Quick actions */}
        {currentUser && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-1" style={{ scrollbarWidth: 'none' }}>
            {QUICK.map(({ id, icon: Icon, label }) => (
              <button key={id} onClick={() => quickSend(id)} disabled={sending}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all disabled:opacity-20 flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.08)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)'; e.currentTarget.style.color = '#f59e0b'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
              >
                <Icon size={11} style={{ color: '#f59e0b', flexShrink: 0 }} />{label}
              </button>
            ))}
          </div>
        )}

        {/* Textarea */}
        {currentUser ? (
          <div className="flex items-end gap-3 rounded-2xl p-2 pl-5 transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            onFocusCapture={e => e.currentTarget.style.borderColor = 'rgba(245,158,11,0.35)'}
            onBlurCapture={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
          >
            <textarea ref={textareaRef} rows={1} value={input}
              onChange={e => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 130) + 'px';
              }}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doSend(input); } }}
              placeholder={`Message ${profile?.name?.split(' ')[0] || 'them'}…`}
              className="flex-1 bg-transparent outline-none resize-none text-sm leading-relaxed py-3"
              style={{ color: '#e5e7eb', minHeight: '44px', caretColor: '#f59e0b', scrollbarWidth: 'none' }}
            />
            <motion.button whileTap={{ scale: 0.88 }} onClick={() => doSend(input)}
              disabled={sending || !input.trim()}
              className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center mb-1 transition-all"
              style={{ background: input.trim() ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'rgba(255,255,255,0.06)', color: input.trim() ? '#000' : 'rgba(255,255,255,0.2)' }}
            >
              {sending
                ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                : <FiSend size={16} />}
            </motion.button>
          </div>
        ) : (
          <div className="text-center py-3">
            <button onClick={() => navigate('/login')}
              className="px-8 py-3 font-black uppercase tracking-widest text-[10px] rounded-full transition-all"
              style={{ background: '#f59e0b', color: '#000' }}
              onMouseEnter={e => e.currentTarget.style.background = '#d97706'}
              onMouseLeave={e => e.currentTarget.style.background = '#f59e0b'}
            >
              Sign In to Chat
            </button>
          </div>
        )}
        <p className="text-center text-[8px] uppercase tracking-[0.3em] font-black mt-2" style={{ color: 'rgba(255,255,255,0.1)' }}>
          Enter to send · Shift+Enter for new line
        </p>
      </footer>
    </div>
  );
};

export default Chat;

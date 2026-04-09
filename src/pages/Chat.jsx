import React, { useState, useEffect, useRef } from 'react';
import useSEO from '../hooks/useSEO';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSend, FiMapPin, FiHome, FiHelpCircle, FiMap,
  FiFileText, FiCode, FiChevronLeft, FiZap,
} from 'react-icons/fi';

const Avatar = ({ name, size = 'md' }) => {
  const initials = (name || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const sz = size === 'lg' ? 'w-12 h-12 text-sm' : size === 'sm' ? 'w-7 h-7 text-[9px]' : 'w-10 h-10 text-xs';
  return (
    <div className={`${sz} bg-black flex items-center justify-center font-black text-white flex-shrink-0 select-none`}>
      {initials}
    </div>
  );
};

const fmt = (ts) => ts ? new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setCurrentUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setCurrentUser(s?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  const chatRoomId = currentUser && profile?.user_id
    ? [currentUser.id, profile.user_id].sort().join('_') : null;

  useEffect(() => {
    if (!chatRoomId) return;
    supabase.from('chat_messages').select('*').eq('room_id', chatRoomId).order('created_at', { ascending: true })
      .then(({ data }) => setMessages(data || []));
    const channel = supabase.channel(`room:${chatRoomId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `room_id=eq.${chatRoomId}` },
        (payload) => setMessages(prev => [...prev, payload.new]))
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [chatRoomId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const doSend = async (text) => {
    if (!text?.trim() || !chatRoomId || !currentUser) return;
    setSending(true); setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    const senderName = currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'You';
    try {
      await supabase.from('chat_messages').insert({ room_id: chatRoomId, sender_id: currentUser.id, sender_name: senderName, text: text.trim() });
      const receiverId = profile?.user_id;
      if (receiverId && receiverId !== currentUser.id) {
        await supabase.from('notifications').insert({
          user_id: receiverId, sender_id: currentUser.id, sender_name: senderName,
          type: 'message', text: text.length > 60 ? text.slice(0, 60) + '…' : text, room_id: chatRoomId, read: false,
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
    <div className="h-screen bg-white flex items-center justify-center" style={{ fontFamily: 'sans-serif' }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-t-2 border-black animate-spin" />
        <p className="text-[9px] uppercase tracking-[0.4em] font-black text-black/40">Connecting…</p>
      </div>
    </div>
  );

  const techTags = profile?.tech_stack?.split(',').map(t => t.trim()).filter(Boolean) || [];

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-white text-black" style={{ fontFamily: 'sans-serif' }}>

      {/* HEADER */}
      <header className="flex-shrink-0 flex items-center gap-3 px-4 md:px-8 py-3 bg-white border-b border-black/8">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)}
          className="p-2 border border-black/15 text-black/40 hover:bg-black hover:text-white hover:border-black transition-all flex-shrink-0">
          <FiChevronLeft size={18} />
        </motion.button>

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative flex-shrink-0">
            <Avatar name={profile?.name} size="md" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-black border-2 border-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-black uppercase tracking-wide truncate text-black">
              {profile?.name || 'Anonymous'}
            </h2>
            {profile?.address && (
              <div className="flex items-center gap-1 mt-0.5">
                <FiMapPin size={9} className="text-black/30 flex-shrink-0" />
                <span className="text-[9px] uppercase tracking-wide truncate text-black/30">{profile.address}</span>
              </div>
            )}
          </div>
        </div>

        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate('/')}
          className="flex-shrink-0 p-2.5 border border-black/15 text-black/40 hover:bg-black hover:text-white hover:border-black transition-all">
          <FiHome size={16} />
        </motion.button>
      </header>

      {/* MESSAGES */}
      <main className="flex-1 overflow-y-auto py-8 px-4 md:px-[10%] lg:px-[15%] min-h-0"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,0,0,0.08) transparent' }}>

        {messages.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center h-full gap-6 py-16">
            <Avatar name={profile?.name} size="lg" />
            <div className="text-center space-y-2">
              <p className="font-serif font-bold text-2xl text-black/40">
                Say hello to {profile?.name?.split(' ')[0] || 'them'}
              </p>
              <p className="text-[9px] uppercase tracking-[0.35em] font-black text-black/20">Or use a quick action below</p>
            </div>
            {techTags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 max-w-xs">
                {techTags.map(t => (
                  <span key={t} className="px-3 py-1 border border-black/15 text-[8px] font-black uppercase tracking-widest text-black/35">
                    {t}
                  </span>
                ))}
              </div>
            )}
            <div className="w-px h-10 bg-gradient-to-b from-transparent to-black/10" />
            <FiZap size={13} className="text-black/15" />
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            const isMe = msg.sender_id === currentUser?.id;
            const prevMsg = messages[i - 1];
            const showSender = !prevMsg || prevMsg.sender_id !== msg.sender_id;
            return (
              <motion.div key={msg.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'} ${showSender ? 'mt-5' : 'mt-1'}`}>
                {!isMe && (
                  <div className={showSender ? '' : 'opacity-0 pointer-events-none'}>
                    <Avatar name={msg.sender_name} size="sm" />
                  </div>
                )}
                <div className={`flex flex-col gap-1 max-w-[72%] md:max-w-[58%] ${isMe ? 'items-end' : 'items-start'}`}>
                  {showSender && (
                    <span className="text-[9px] font-black uppercase tracking-widest px-1 text-black/30">
                      {isMe ? 'You' : msg.sender_name}
                    </span>
                  )}
                  <div className="px-4 py-2.5 text-sm leading-relaxed break-words"
                    style={isMe
                      ? { background: '#000', color: '#fff' }
                      : { background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', color: '#111' }
                    }>
                    {msg.text}
                  </div>
                  <span className="text-[8px] px-1 text-black/20">{fmt(msg.created_at)}</span>
                </div>
                {isMe && <div className="w-7 flex-shrink-0" />}
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </main>

      {/* INPUT */}
      <footer className="flex-shrink-0 px-4 md:px-[10%] lg:px-[15%] pt-3 pb-5 bg-white border-t border-black/8">
        {currentUser && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-1" style={{ scrollbarWidth: 'none' }}>
            {QUICK.map(({ id, icon: Icon, label }) => (
              <button key={id} onClick={() => quickSend(id)} disabled={sending}
                className="flex items-center gap-1.5 px-3.5 py-1.5 border border-black/15 text-[9px] font-black uppercase tracking-widest text-black/40 whitespace-nowrap hover:bg-black hover:text-white hover:border-black transition-all disabled:opacity-20 flex-shrink-0">
                <Icon size={11} />{label}
              </button>
            ))}
          </div>
        )}

        {currentUser ? (
          <div className="flex items-end gap-3 border border-black/15 p-2 pl-4 focus-within:border-black transition-colors">
            <textarea ref={textareaRef} rows={1} value={input}
              onChange={e => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 130) + 'px';
              }}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doSend(input); } }}
              placeholder={`Message ${profile?.name?.split(' ')[0] || 'them'}…`}
              className="flex-1 bg-transparent outline-none resize-none text-sm leading-relaxed py-3 text-black placeholder-black/25"
              style={{ minHeight: '44px', scrollbarWidth: 'none' }}
            />
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => doSend(input)}
              disabled={sending || !input.trim()}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center mb-1 bg-black text-white disabled:bg-black/15 disabled:text-black/20 transition-all">
              {sending
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <FiSend size={15} />}
            </motion.button>
          </div>
        ) : (
          <div className="text-center py-3">
            <button onClick={() => navigate('/login')}
              className="px-8 py-3 bg-black text-white font-black uppercase tracking-widest text-[10px] hover:bg-black/80 transition-all">
              Sign In to Chat
            </button>
          </div>
        )}
        <p className="text-center text-[8px] uppercase tracking-[0.3em] font-black mt-2 text-black/20">
          Enter to send · Shift+Enter for new line
        </p>
      </footer>
    </div>
  );
};

export default Chat;

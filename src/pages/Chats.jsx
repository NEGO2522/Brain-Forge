import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSend, FiUser, FiSearch, FiMessageSquare,
  FiMapPin, FiCpu, FiHelpCircle, FiMap, FiFileText, FiCode, FiZap,
} from 'react-icons/fi';

/* ── Avatar initials ── */
const Avatar = ({ name, size = 'md' }) => {
  const initials = (name || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const colors = [
    ['#f59e0b','#78350f'], ['#10b981','#064e3b'], ['#6366f1','#1e1b4b'],
    ['#ec4899','#500724'], ['#14b8a6','#042f2e'], ['#f97316','#431407'],
  ];
  const [fg, bg] = colors[(name || '').charCodeAt(0) % colors.length];
  const sz = size === 'lg' ? 'w-12 h-12 text-sm' : size === 'sm' ? 'w-7 h-7 text-[9px]' : 'w-9 h-9 text-[10px]';
  return (
    <div className={`${sz} rounded-2xl flex items-center justify-center font-black flex-shrink-0`}
      style={{ background: `${bg}cc`, border: `1px solid ${fg}40`, color: fg }}>
      {initials}
    </div>
  );
};

const getRoomId = (a, b) => [a, b].sort().join('_');

const formatTime = (ts) => {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
  return d.toLocaleDateString();
};

const Chats = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [profiles,    setProfiles]    = useState([]);
  const [search,      setSearch]      = useState('');
  const [selected,    setSelected]    = useState(null);
  const [messages,    setMessages]    = useState([]);
  const [input,       setInput]       = useState('');
  const [sending,     setSending]     = useState(false);

  const bottomRef   = useRef(null);
  const textareaRef = useRef(null);
  const navigate    = useNavigate();
  const channelRef  = useRef(null);

  /* ── Auth ── */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setCurrentUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setCurrentUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  /* ── Load profiles ── */
  useEffect(() => {
    supabase.from('user_profiles').select('*').then(({ data }) => setProfiles(data || []));
  }, []);

  /* ── Real-time messages ── */
  useEffect(() => {
    if (!selected || !currentUser) return;
    const roomId = getRoomId(currentUser.id, selected.user_id);

    // Load history
    supabase.from('chat_messages').select('*')
      .eq('room_id', roomId).order('created_at', { ascending: true })
      .then(({ data }) => setMessages(data || []));

    // Subscribe
    if (channelRef.current) supabase.removeChannel(channelRef.current);
    channelRef.current = supabase
      .channel(`room:${roomId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'chat_messages',
        filter: `room_id=eq.${roomId}`,
      }, (payload) => setMessages(prev => [...prev, payload.new]))
      .subscribe();

    return () => { if (channelRef.current) supabase.removeChannel(channelRef.current); };
  }, [selected, currentUser]);

  /* ── Auto-scroll ── */
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !selected || !currentUser) return;
    setSending(true);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    const roomId     = getRoomId(currentUser.id, selected.user_id);
    const senderName = currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'You';

    try {
      await supabase.from('chat_messages').insert({ room_id: roomId, sender_id: currentUser.id, sender_name: senderName, text });
      if (selected.user_id !== currentUser.id) {
        await supabase.from('notifications').insert({
          user_id: selected.user_id, sender_id: currentUser.id, sender_name: senderName,
          type: 'message', text: text.length > 60 ? text.slice(0, 60) + '…' : text,
          room_id: roomId, read: false,
        });
      }
    } catch (err) { console.error(err); }
    finally { setSending(false); }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleQuickAction = async (type) => {
    if (!selected || !currentUser) return;
    const firstName = selected.name?.split(' ')[0] || 'there';
    const skill     = selected.tech_stack?.split(',')[0]?.trim() || 'your field';
    const map = {
      doubt:    `Hi ${firstName}, I have a doubt related to ${skill} and would appreciate your help.`,
      guidance: `Hi ${firstName}, I'd love to get your guidance on how to grow in ${skill}.`,
      resume:   `Hi ${firstName}, would you be open to doing a quick resume review for me?`,
      project:  `Hi ${firstName}, I'm working on a project and could use your expert help.`,
    };
    const text = map[type];
    if (!text) return;
    setSending(true);
    const roomId     = getRoomId(currentUser.id, selected.user_id);
    const senderName = currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'You';
    try {
      await supabase.from('chat_messages').insert({ room_id: roomId, sender_id: currentUser.id, sender_name: senderName, text });
      if (selected.user_id !== currentUser.id) {
        await supabase.from('notifications').insert({
          user_id: selected.user_id, sender_id: currentUser.id, sender_name: senderName,
          type: 'message', text: text.length > 60 ? text.slice(0, 60) + '…' : text,
          room_id: roomId, read: false,
        });
      }
    } catch (err) { console.error(err); }
    finally { setSending(false); }
  };

  if (currentUser === undefined) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
        <p className="text-[9px] uppercase tracking-[0.4em] font-black text-amber-500/40">Connecting</p>
      </div>
    </div>
  );

  if (!currentUser) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center text-white">
      <div className="text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <FiMessageSquare size={32} className="text-amber-500/50" />
        </div>
        <div>
          <p className="font-serif italic text-2xl mb-1">Sign in to chat</p>
          <p className="text-[10px] uppercase tracking-widest text-gray-600">Connect with your peers</p>
        </div>
        <button onClick={() => navigate('/login')}
          className="px-8 py-3 bg-amber-500 text-black font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-amber-400 transition-all">
          Sign In
        </button>
      </div>
    </div>
  );

  const filteredProfiles = profiles.filter(p =>
    p.user_id !== currentUser.id &&
    (p.name?.toLowerCase().includes(search.toLowerCase()) ||
     p.tech_stack?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="h-screen w-full bg-[#080808] text-white flex overflow-hidden pt-0">

      {/* ── Ambient background ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.04) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.03) 0%, transparent 70%)' }} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }} />
      </div>

      {/* ───────────────────── SIDEBAR ───────────────────── */}
      <aside className="fixed top-0 left-0 h-full z-40 w-[300px] lg:w-[320px] flex flex-col pt-0"
        style={{ background: '#0c0c0c', borderRight: '1px solid rgba(255,255,255,0.05)' }}>

        {/* Sidebar header */}
        <div className="px-5 py-5 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-serif italic text-lg text-white">Messages</h2>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}>
              {filteredProfiles.length}
            </span>
          </div>
          <p className="text-[9px] uppercase tracking-[0.35em] font-black" style={{ color: 'rgba(245,158,11,0.5)' }}>
            Active members
          </p>
        </div>

        {/* Search */}
        <div className="px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2" size={12}
              style={{ color: 'rgba(245,158,11,0.4)' }} />
            <input type="text" placeholder="Search by name or skill…" value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-xl py-2.5 pl-8 pr-3 text-xs outline-none transition-all placeholder:text-gray-700 tracking-wide"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#e5e7eb' }}
              onFocus={e => e.target.style.borderColor = 'rgba(245,158,11,0.3)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.07)'}
            />
          </div>
        </div>

        {/* Profile list */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          {filteredProfiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3" style={{ opacity: 0.25 }}>
              <FiUser size={28} style={{ color: '#f59e0b' }} />
              <p className="text-[9px] uppercase tracking-[0.35em] font-black">No members found</p>
            </div>
          ) : filteredProfiles.map((profile, i) => {
            const isActive = selected?.id === profile.id;
            return (
              <motion.button
                key={profile.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => { setSelected(profile); setMessages([]); }}
                className="w-full text-left px-4 py-3.5 flex items-center gap-3 transition-all duration-200 relative"
                style={{
                  background: isActive ? 'rgba(245,158,11,0.07)' : 'transparent',
                  borderLeft: `2px solid ${isActive ? '#f59e0b' : 'transparent'}`,
                  borderBottom: '1px solid rgba(255,255,255,0.03)',
                }}
                onMouseEnter={e => !isActive && (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                onMouseLeave={e => !isActive && (e.currentTarget.style.background = 'transparent')}
              >
                <Avatar name={profile.name} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold truncate" style={{ color: isActive ? '#f59e0b' : '#e5e7eb' }}>
                      {profile.name || 'Anonymous'}
                    </p>
                    {profile.year && (
                      <span className="text-[8px] font-black flex-shrink-0 px-1.5 py-0.5 rounded-md"
                        style={{ background: 'rgba(245,158,11,0.1)', color: 'rgba(245,158,11,0.7)', border: '1px solid rgba(245,158,11,0.15)' }}>
                        Y{profile.year}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <FiMapPin size={8} style={{ color: 'rgba(245,158,11,0.35)', flexShrink: 0 }} />
                    <p className="text-[9px] truncate uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.25)' }}>
                      {profile.address || 'Somewhere'}
                    </p>
                  </div>
                  {profile.tech_stack && (
                    <p className="text-[8px] font-black uppercase tracking-wider truncate mt-0.5" style={{ color: 'rgba(245,158,11,0.45)' }}>
                      {profile.tech_stack.split(',').slice(0, 2).join(' · ')}
                    </p>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </aside>

      {/* ──────────────────── CHAT PANEL ──────────────────── */}
      <main className="relative z-10 flex-1 flex flex-col min-w-0 ml-[300px] lg:ml-[320px] min-h-0">

        {/* Chat header */}
        <div className="flex items-center gap-4 px-6 py-4 flex-shrink-0"
          style={{ background: 'rgba(12,12,12,0.95)', borderBottom: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)' }}>
          {selected ? (
            <>
              <Avatar name={selected.name} size="lg" />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-black uppercase tracking-wide truncate" style={{ color: '#e5e7eb' }}>
                  {selected.name}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <FiCpu size={9} style={{ color: 'rgba(245,158,11,0.5)' }} />
                  <p className="text-[9px] uppercase tracking-widest truncate" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    {selected.tech_stack?.split(',').slice(0, 2).join(' · ') || 'No stack listed'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full flex-shrink-0"
                style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#6ee7b7' }}>Live</span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                <FiMessageSquare size={14} style={{ color: '#f59e0b' }} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.5)' }}>Linkaura Chat</p>
                <p className="text-[9px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>Select a member to begin</p>
              </div>
            </div>
          )}
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto py-8 px-6 md:px-10 lg:px-16 min-h-0" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(245,158,11,0.1) transparent' }}>
          {!selected && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center gap-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-3xl flex items-center justify-center"
                  style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.12)' }}>
                  <FiMessageSquare size={36} style={{ color: 'rgba(245,158,11,0.4)' }} />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 animate-pulse" />
              </div>
              <div className="text-center space-y-2">
                <p className="font-serif italic text-3xl" style={{ color: 'rgba(255,255,255,0.15)' }}>Pick a conversation</p>
                <p className="text-[9px] uppercase tracking-[0.35em] font-black" style={{ color: 'rgba(255,255,255,0.1)' }}>
                  Choose a member from the sidebar
                </p>
              </div>
            </motion.div>
          )}

          {selected && messages.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center gap-5">
              <Avatar name={selected.name} size="lg" />
              <div className="text-center space-y-1">
                <p className="text-sm font-black" style={{ color: 'rgba(255,255,255,0.3)' }}>{selected.name}</p>
                <p className="text-[9px] uppercase tracking-[0.35em] font-black" style={{ color: 'rgba(255,255,255,0.12)' }}>
                  No messages yet — say hello!
                </p>
              </div>
              <div className="w-px h-12" style={{ background: 'linear-gradient(to bottom, transparent, rgba(245,158,11,0.3))' }} />
              <FiZap size={14} style={{ color: 'rgba(245,158,11,0.3)' }} />
            </motion.div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg, i) => {
              const isMe = msg.sender_id === currentUser.id;
              const prevMsg = messages[i - 1];
              const showSender = !prevMsg || prevMsg.sender_id !== msg.sender_id;
              return (
                <motion.div key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className={`flex gap-2.5 mb-1 ${isMe ? 'justify-end' : 'justify-start'} ${showSender ? 'mt-5' : 'mt-1'}`}
                >
                  {/* Avatar for received messages */}
                  {!isMe && (
                    <div className={showSender ? 'mt-0' : 'opacity-0 pointer-events-none'}>
                      <Avatar name={msg.sender_name} size="sm" />
                    </div>
                  )}

                  <div className={`max-w-[68%] md:max-w-[58%] flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
                    {showSender && (
                      <span className="text-[9px] font-black uppercase tracking-widest px-1"
                        style={{ color: isMe ? 'rgba(245,158,11,0.6)' : 'rgba(255,255,255,0.25)' }}>
                        {isMe ? 'You' : msg.sender_name}
                      </span>
                    )}
                    <div className={`px-4 py-2.5 text-sm leading-relaxed break-words ${
                      isMe
                        ? 'rounded-2xl rounded-br-sm font-medium'
                        : 'rounded-2xl rounded-bl-sm'
                    }`}
                      style={isMe
                        ? { background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000' }
                        : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#d1d5db' }
                      }>
                      {msg.text}
                    </div>
                    <span className="text-[8px] px-1" style={{ color: 'rgba(255,255,255,0.18)' }}>
                      {formatTime(msg.created_at)}
                    </span>
                  </div>

                  {/* Spacer for sent messages alignment */}
                  {isMe && <div className="w-7 flex-shrink-0" />}
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        {selected && (
          <div className="px-6 md:px-10 lg:px-16 pb-5 pt-3 flex-shrink-0"
            style={{ background: 'rgba(12,12,12,0.95)', borderTop: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)' }}>

            {/* Quick action chips */}
            <div className="flex gap-2 overflow-x-auto mb-3 pb-0.5" style={{ scrollbarWidth: 'none' }}>
              {[
                { id: 'doubt',    icon: <FiHelpCircle size={11} />, text: 'Ask Doubt'     },
                { id: 'guidance', icon: <FiMap size={11} />,        text: 'Get Guidance'  },
                { id: 'resume',   icon: <FiFileText size={11} />,   text: 'Resume Review' },
                { id: 'project',  icon: <FiCode size={11} />,       text: 'Project Help'  },
              ].map(btn => (
                <button key={btn.id} onClick={() => handleQuickAction(btn.id)} disabled={sending}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap disabled:opacity-20 flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.08)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)'; e.currentTarget.style.color = '#f59e0b'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
                >
                  <span style={{ color: '#f59e0b' }}>{btn.icon}</span>
                  {btn.text}
                </button>
              ))}
            </div>

            {/* Textarea + send */}
            <div className="relative">
              <div className="flex items-end gap-3 rounded-2xl p-2 pl-5 transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                onFocusCapture={e => e.currentTarget.style.borderColor = 'rgba(245,158,11,0.35)'}
                onBlurCapture={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
              >
                <textarea ref={textareaRef} rows={1} value={input}
                  onChange={e => {
                    setInput(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={`Message ${selected.name?.split(' ')[0] || 'member'}…`}
                  className="flex-1 bg-transparent border-none outline-none text-sm py-3 resize-none leading-relaxed"
                  style={{ color: '#e5e7eb', minHeight: '44px', caretColor: '#f59e0b' }}
                />
                <motion.button whileTap={{ scale: 0.88 }} onClick={handleSend}
                  disabled={sending || !input.trim()}
                  className="h-11 w-11 flex items-center justify-center rounded-xl flex-shrink-0 mb-1 transition-all"
                  style={{ background: input.trim() ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'rgba(255,255,255,0.06)', color: input.trim() ? '#000' : 'rgba(255,255,255,0.2)' }}
                >
                  {sending
                    ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    : <FiSend size={16} />}
                </motion.button>
              </div>
            </div>
            <p className="text-center text-[8px] uppercase tracking-[0.3em] font-black mt-2" style={{ color: 'rgba(255,255,255,0.1)' }}>
              Enter to send · Shift+Enter for new line
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Chats;

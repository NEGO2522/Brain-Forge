import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSend, FiUser, FiSearch, FiMessageSquare,
  FiMapPin, FiCpu, FiHelpCircle, FiMap, FiFileText, FiCode, FiZap,
} from 'react-icons/fi';

/* ── Avatar ── */
const Avatar = ({ name, size = 'md' }) => {
  const initials = (name || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const sz = size === 'lg' ? 'w-12 h-12 text-sm' : size === 'sm' ? 'w-7 h-7 text-[9px]' : 'w-9 h-9 text-[10px]';
  return (
    <div className={`${sz} bg-black flex items-center justify-center font-black text-white flex-shrink-0`}>
      {initials}
    </div>
  );
};

const getRoomId = (a, b) => [a, b].sort().join('_');
const formatTime = (ts) => {
  if (!ts) return '';
  const d = new Date(ts), now = new Date(), diff = now - d;
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setCurrentUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setCurrentUser(s?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    supabase.from('user_profiles').select('*').then(({ data }) => setProfiles(data || []));
  }, []);

  useEffect(() => {
    if (!selected || !currentUser) return;
    const roomId = getRoomId(currentUser.id, selected.user_id);
    supabase.from('chat_messages').select('*').eq('room_id', roomId).order('created_at', { ascending: true })
      .then(({ data }) => setMessages(data || []));
    if (channelRef.current) supabase.removeChannel(channelRef.current);
    channelRef.current = supabase.channel(`room:${roomId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `room_id=eq.${roomId}` },
        (payload) => setMessages(prev => [...prev, payload.new]))
      .subscribe();
    return () => { if (channelRef.current) supabase.removeChannel(channelRef.current); };
  }, [selected, currentUser]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !selected || !currentUser) return;
    setSending(true); setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    const roomId = getRoomId(currentUser.id, selected.user_id);
    const senderName = currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'You';
    try {
      await supabase.from('chat_messages').insert({ room_id: roomId, sender_id: currentUser.id, sender_name: senderName, text });
      if (selected.user_id !== currentUser.id) {
        await supabase.from('notifications').insert({
          user_id: selected.user_id, sender_id: currentUser.id, sender_name: senderName,
          type: 'message', text: text.length > 60 ? text.slice(0, 60) + '…' : text, room_id: roomId, read: false,
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
    const skill = selected.tech_stack?.split(',')[0]?.trim() || 'your field';
    const map = {
      doubt:    `Hi ${firstName}, I have a doubt related to ${skill} and would appreciate your help.`,
      guidance: `Hi ${firstName}, I'd love to get your guidance on how to grow in ${skill}.`,
      resume:   `Hi ${firstName}, would you be open to doing a quick resume review for me?`,
      project:  `Hi ${firstName}, I'm working on a project and could use your expert help.`,
    };
    const text = map[type]; if (!text) return;
    setSending(true);
    const roomId = getRoomId(currentUser.id, selected.user_id);
    const senderName = currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'You';
    try {
      await supabase.from('chat_messages').insert({ room_id: roomId, sender_id: currentUser.id, sender_name: senderName, text });
      if (selected.user_id !== currentUser.id) {
        await supabase.from('notifications').insert({
          user_id: selected.user_id, sender_id: currentUser.id, sender_name: senderName,
          type: 'message', text: text.length > 60 ? text.slice(0, 60) + '…' : text, room_id: roomId, read: false,
        });
      }
    } catch (err) { console.error(err); }
    finally { setSending(false); }
  };

  if (currentUser === undefined) return (
    <div className="min-h-screen bg-white flex items-center justify-center" style={{ fontFamily: 'sans-serif' }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-t-2 border-black animate-spin" />
        <p className="text-[10px] uppercase tracking-widest font-black text-black/40">Connecting</p>
      </div>
    </div>
  );

  if (!currentUser) return (
    <div className="min-h-screen bg-white flex items-center justify-center" style={{ fontFamily: 'sans-serif' }}>
      <div className="text-center space-y-6">
        <div className="w-16 h-16 mx-auto border border-black/15 flex items-center justify-center">
          <FiMessageSquare size={24} className="text-black/30" />
        </div>
        <div>
          <p className="font-serif font-bold text-2xl mb-1 text-black">Sign in to chat</p>
          <p className="text-[10px] uppercase tracking-widest font-black text-black/35">Connect with your peers</p>
        </div>
        <button onClick={() => navigate('/login')}
          className="px-8 py-3 bg-black text-white font-black uppercase tracking-widest text-[10px] hover:bg-black/80 transition-all">
          Sign In
        </button>
      </div>
    </div>
  );

  const filteredProfiles = profiles.filter(p =>
    p.user_id !== currentUser.id &&
    (p.name?.toLowerCase().includes(search.toLowerCase()) || p.tech_stack?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="h-screen w-full bg-white text-black flex overflow-hidden" style={{ fontFamily: 'sans-serif' }}>

      {/* ── SIDEBAR ── */}
      <aside className="fixed top-0 left-0 h-full z-40 w-[300px] lg:w-[320px] flex flex-col bg-white border-r border-black/8">
        {/* Header */}
        <div className="px-6 py-5 flex-shrink-0 border-b border-black/8">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-serif font-bold text-lg text-black">Messages</h2>
            <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 border border-black/15 text-black/40">
              {filteredProfiles.length}
            </span>
          </div>
          <p className="text-[9px] uppercase tracking-[0.35em] font-black text-black/30">Active members</p>
        </div>

        {/* Search */}
        <div className="px-4 py-3 flex-shrink-0 border-b border-black/8">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30" size={12} />
            <input type="text" placeholder="Search by name or skill…" value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full py-2.5 pl-8 pr-3 text-xs border border-black/15 outline-none focus:border-black transition-colors text-black placeholder-black/30 bg-white"
            />
          </div>
        </div>

        {/* Profile list */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          {filteredProfiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 opacity-30">
              <FiUser size={24} />
              <p className="text-[9px] uppercase tracking-[0.35em] font-black">No members found</p>
            </div>
          ) : filteredProfiles.map((profile, i) => {
            const isActive = selected?.id === profile.id;
            return (
              <motion.button key={profile.id}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                onClick={() => { setSelected(profile); setMessages([]); }}
                className={`w-full text-left px-5 py-4 flex items-center gap-3 transition-all duration-150 border-b border-black/5 ${isActive ? 'bg-black/[0.04] border-l-2 border-l-black' : 'hover:bg-black/[0.02] border-l-2 border-l-transparent'}`}>
                <Avatar name={profile.name} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-xs font-black uppercase tracking-wide truncate ${isActive ? 'text-black' : 'text-black/60'}`}>
                      {profile.name || 'Anonymous'}
                    </p>
                    {profile.year && (
                      <span className="text-[8px] font-black flex-shrink-0 px-1.5 py-0.5 border border-black/15 text-black/35">
                        Y{profile.year}
                      </span>
                    )}
                  </div>
                  {profile.tech_stack && (
                    <p className="text-[9px] font-black uppercase tracking-wide truncate text-black/30 mt-0.5">
                      {profile.tech_stack.split(',').slice(0, 2).join(' · ')}
                    </p>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </aside>

      {/* ── CHAT PANEL ── */}
      <main className="relative flex-1 flex flex-col min-w-0 ml-[300px] lg:ml-[320px] min-h-0">

        {/* Chat header */}
        <div className="flex items-center gap-4 px-6 py-4 flex-shrink-0 bg-white border-b border-black/8">
          {selected ? (
            <>
              <Avatar name={selected.name} size="lg" />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-black uppercase tracking-wide truncate text-black">{selected.name}</h3>
                <p className="text-[9px] uppercase tracking-widest truncate text-black/35 mt-0.5">
                  {selected.tech_stack?.split(',').slice(0, 2).join(' · ') || 'No stack listed'}
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 border border-black/15 flex-shrink-0">
                <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-black/50">Live</span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border border-black/15 flex items-center justify-center">
                <FiMessageSquare size={14} className="text-black/30" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-black/50">Linkaura Chat</p>
                <p className="text-[9px] uppercase tracking-widest text-black/25">Select a member to begin</p>
              </div>
            </div>
          )}
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto py-8 px-6 md:px-10 lg:px-16 min-h-0" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,0,0,0.08) transparent' }}>
          {!selected && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center gap-6">
              <div className="w-16 h-16 border border-black/10 flex items-center justify-center">
                <FiMessageSquare size={28} className="text-black/20" />
              </div>
              <div className="text-center space-y-1">
                <p className="font-serif font-bold text-2xl text-black/20">Pick a conversation</p>
                <p className="text-[9px] uppercase tracking-[0.35em] font-black text-black/15">Choose a member from the sidebar</p>
              </div>
            </motion.div>
          )}

          {selected && messages.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center gap-5">
              <Avatar name={selected.name} size="lg" />
              <div className="text-center space-y-1">
                <p className="text-sm font-black uppercase tracking-wide text-black/30">{selected.name}</p>
                <p className="text-[9px] uppercase tracking-[0.35em] font-black text-black/20">No messages yet — say hello!</p>
              </div>
              <div className="w-px h-10 bg-gradient-to-b from-transparent to-black/15" />
              <FiZap size={13} className="text-black/20" />
            </motion.div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg, i) => {
              const isMe = msg.sender_id === currentUser.id;
              const prevMsg = messages[i - 1];
              const showSender = !prevMsg || prevMsg.sender_id !== msg.sender_id;
              return (
                <motion.div key={msg.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}
                  className={`flex gap-2.5 mb-1 ${isMe ? 'justify-end' : 'justify-start'} ${showSender ? 'mt-5' : 'mt-1'}`}>
                  {!isMe && (
                    <div className={showSender ? 'mt-0' : 'opacity-0 pointer-events-none'}>
                      <Avatar name={msg.sender_name} size="sm" />
                    </div>
                  )}
                  <div className={`max-w-[68%] md:max-w-[58%] flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
                    {showSender && (
                      <span className="text-[9px] font-black uppercase tracking-widest px-1 text-black/30">
                        {isMe ? 'You' : msg.sender_name}
                      </span>
                    )}
                    <div className={`px-4 py-2.5 text-sm leading-relaxed break-words`}
                      style={isMe
                        ? { background: '#000', color: '#fff' }
                        : { background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', color: '#111' }
                      }>
                      {msg.text}
                    </div>
                    <span className="text-[8px] px-1 text-black/20">{formatTime(msg.created_at)}</span>
                  </div>
                  {isMe && <div className="w-7 flex-shrink-0" />}
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        {selected && (
          <div className="px-6 md:px-10 lg:px-16 pb-5 pt-3 flex-shrink-0 bg-white border-t border-black/8">
            {/* Quick actions */}
            <div className="flex gap-2 overflow-x-auto mb-3 pb-0.5" style={{ scrollbarWidth: 'none' }}>
              {[
                { id: 'doubt',    icon: <FiHelpCircle size={11} />, text: 'Ask Doubt'     },
                { id: 'guidance', icon: <FiMap size={11} />,        text: 'Get Guidance'  },
                { id: 'resume',   icon: <FiFileText size={11} />,   text: 'Resume Review' },
                { id: 'project',  icon: <FiCode size={11} />,       text: 'Project Help'  },
              ].map(btn => (
                <button key={btn.id} onClick={() => handleQuickAction(btn.id)} disabled={sending}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 border border-black/15 text-[9px] font-black uppercase tracking-widest text-black/40 whitespace-nowrap hover:bg-black hover:text-white hover:border-black transition-all disabled:opacity-20 flex-shrink-0">
                  {btn.icon} {btn.text}
                </button>
              ))}
            </div>

            {/* Textarea + send */}
            <div className="flex items-end gap-3 border border-black/15 p-2 pl-4 focus-within:border-black transition-colors">
              <textarea ref={textareaRef} rows={1} value={input}
                onChange={e => {
                  setInput(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
                onKeyDown={handleKeyDown}
                placeholder={`Message ${selected.name?.split(' ')[0] || 'member'}…`}
                className="flex-1 bg-transparent border-none outline-none text-sm py-3 resize-none leading-relaxed text-black placeholder-black/25"
                style={{ minHeight: '44px' }}
              />
              <motion.button whileTap={{ scale: 0.9 }} onClick={handleSend}
                disabled={sending || !input.trim()}
                className="h-10 w-10 flex items-center justify-center flex-shrink-0 mb-1 transition-all bg-black text-white disabled:bg-black/20 disabled:text-black/20">
                {sending
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <FiSend size={15} />}
              </motion.button>
            </div>
            <p className="text-center text-[8px] uppercase tracking-[0.3em] font-black mt-2 text-black/20">
              Enter to send · Shift+Enter for new line
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Chats;

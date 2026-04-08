import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSend, FiUser, FiSearch, FiMessageSquare,
  FiMapPin, FiCpu, FiHelpCircle, FiMap, FiFileText, FiCode,
} from 'react-icons/fi';

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
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="h-10 w-10 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
    </div>
  );

  if (!currentUser) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <div className="text-center space-y-4">
        <FiMessageSquare size={48} className="mx-auto text-amber-500/30" />
        <p className="text-sm text-gray-400">Sign in to access chats</p>
        <button onClick={() => navigate('/login')}
          className="px-8 py-3 bg-amber-500 text-black font-black uppercase tracking-widest text-xs rounded-full hover:bg-amber-400 transition-all">
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
    <div className="h-screen w-full bg-black text-white flex overflow-hidden pt-16">

      {/* SIDEBAR */}
      <aside className="fixed top-0 left-0 h-full z-40 w-[300px] lg:w-[340px] bg-[#0a0a0a] border-r border-white/[0.06] flex flex-col pt-16">
        <div className="p-5 border-b border-white/[0.06] flex-shrink-0">
          <h2 className="text-base font-serif italic text-white">Messages</h2>
          <p className="text-[10px] uppercase tracking-widest text-amber-500/60 font-black mt-0.5">
            {filteredProfiles.length} members
          </p>
        </div>

        <div className="px-4 py-3 border-b border-white/[0.06] flex-shrink-0">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500/40" size={14} />
            <input type="text" placeholder="Search members..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-xs outline-none focus:border-amber-500/40 transition-all placeholder:text-gray-600 tracking-wide" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredProfiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-30 gap-3">
              <FiUser size={32} />
              <p className="text-[10px] uppercase tracking-widest">No members found</p>
            </div>
          ) : filteredProfiles.map(profile => (
            <button key={profile.id} onClick={() => { setSelected(profile); setMessages([]); }}
              className={`w-full text-left px-4 py-4 flex items-center gap-3 border-b border-white/[0.04] transition-all hover:bg-white/5 ${
                selected?.id === profile.id ? 'bg-amber-500/10 border-l-2 border-l-amber-500' : 'border-l-2 border-l-transparent'
              }`}>
              <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 flex-shrink-0">
                <FiUser size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate text-white">{profile.name || 'Anonymous'}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <FiMapPin size={9} className="text-amber-500/40 flex-shrink-0" />
                  <p className="text-[10px] text-gray-500 truncate uppercase tracking-wide">{profile.address || 'Unknown'}</p>
                </div>
                {profile.tech_stack && (
                  <p className="text-[9px] text-amber-500/50 font-black uppercase tracking-wider truncate mt-0.5">
                    {profile.tech_stack.split(',').slice(0, 2).join(' · ')}
                  </p>
                )}
              </div>
              {profile.year && (
                <span className="flex-shrink-0 text-[9px] font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2 py-1 uppercase">
                  Y{profile.year}
                </span>
              )}
            </button>
          ))}
        </div>
      </aside>

      {/* CHAT PANEL */}
      <main className="flex-1 flex flex-col min-w-0 relative ml-[300px] lg:ml-[340px]">

        <div className="flex items-center gap-3 px-4 md:px-6 py-4 border-b border-white/[0.06] bg-[#0a0a0a] flex-shrink-0">
          {selected ? (
            <>
              <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 flex-shrink-0">
                <FiUser size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold uppercase tracking-wide truncate">{selected.name}</h3>
                <div className="flex items-center gap-1">
                  <FiCpu size={9} className="text-amber-500/40" />
                  <p className="text-[10px] text-gray-500 truncate uppercase tracking-widest">
                    {selected.tech_stack?.split(',').slice(0, 2).join(' · ') || 'No stack listed'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Live</span>
              </div>
            </>
          ) : null}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 lg:px-16 py-6 space-y-4 min-h-0">
          {!selected && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="min-h-full flex flex-col items-center justify-center gap-6 opacity-30">
              <FiMessageSquare size={64} className="text-amber-500/40" />
              <div className="text-center space-y-2">
                <p className="font-serif italic text-2xl">Pick a conversation</p>
                <p className="text-[10px] uppercase tracking-widest text-gray-500">Choose a member from the left to start chatting</p>
              </div>
            </motion.div>
          )}

          {selected && messages.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="min-h-full flex flex-col items-center justify-center gap-4 opacity-30">
              <div className="w-px h-16 bg-gradient-to-b from-transparent to-amber-500" />
              <p className="text-[10px] uppercase tracking-[0.4em] font-black">Start the conversation</p>
            </motion.div>
          )}

          <AnimatePresence initial={false}>
            {messages.map(msg => {
              const isMe = msg.sender_id === currentUser.id;
              return (
                <motion.div key={msg.id}
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.15 }}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] md:max-w-[65%] flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
                    <span className="text-[9px] uppercase tracking-widest text-gray-600 font-black px-1">
                      {isMe ? 'You' : msg.sender_name}
                    </span>
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed break-words ${
                      isMe
                        ? 'bg-amber-500 text-black font-semibold rounded-br-sm'
                        : 'bg-white/5 border border-white/10 text-gray-200 rounded-bl-sm'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[8px] text-gray-700 px-1">{formatTime(msg.created_at)}</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        {selected && (
          <div className="px-4 md:px-8 lg:px-16 py-4 border-t border-white/[0.06] bg-[#0a0a0a] flex-shrink-0">
            <div className="flex gap-2 overflow-x-auto mb-3 pb-1 max-w-4xl mx-auto" style={{ scrollbarWidth: 'none' }}>
              {[
                { id: 'doubt',    icon: <FiHelpCircle size={13} />, text: 'Ask Doubt'     },
                { id: 'guidance', icon: <FiMap size={13} />,        text: 'Get Guidance'  },
                { id: 'resume',   icon: <FiFileText size={13} />,   text: 'Resume Review' },
                { id: 'project',  icon: <FiCode size={13} />,       text: 'Project Help'  },
              ].map(btn => (
                <button key={btn.id} onClick={() => handleQuickAction(btn.id)} disabled={sending}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:border-amber-500/50 hover:bg-amber-500/5 hover:text-amber-500 transition-all whitespace-nowrap disabled:opacity-20 text-gray-400">
                  <span className="text-amber-500">{btn.icon}</span>{btn.text}
                </button>
              ))}
            </div>

            <div className="relative group max-w-4xl mx-auto">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/20 to-transparent rounded-[2rem] blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
              <div className="relative flex items-end gap-2 bg-[#121212] border border-white/10 rounded-[2rem] p-2 pl-5 focus-within:border-amber-500/40 transition-all">
                <textarea ref={textareaRef} rows={1} value={input}
                  onChange={e => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'; }}
                  onKeyDown={handleKeyDown}
                  placeholder={`Message ${selected.name?.split(' ')[0] || 'member'}...`}
                  className="flex-1 bg-transparent border-none outline-none text-sm py-3 resize-none placeholder:text-gray-600 leading-relaxed"
                  style={{ minHeight: '44px' }} />
                <motion.button whileTap={{ scale: 0.9 }} onClick={handleSend} disabled={sending || !input.trim()}
                  className="h-11 w-11 flex items-center justify-center rounded-full bg-amber-500 hover:bg-amber-400 text-black shadow-lg disabled:opacity-20 transition-all flex-shrink-0 mb-1">
                  {sending
                    ? <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    : <FiSend size={17} />}
                </motion.button>
              </div>
            </div>
            <p className="text-center text-[9px] text-gray-700 uppercase tracking-widest font-black mt-2">
              Press Enter to send · Shift+Enter for new line
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Chats;

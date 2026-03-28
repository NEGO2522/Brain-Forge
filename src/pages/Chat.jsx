import React, { useState, useEffect, useRef } from 'react';
import useSEO from '../hooks/useSEO';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  setDoc,
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebase/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSend,
  FiUser,
  FiMapPin,
  FiMessageSquare,
  FiHome,
  FiHelpCircle,
  FiMap,
  FiFileText,
  FiCode,
  FiChevronLeft
} from 'react-icons/fi';

const Chat = () => {
  useSEO({
    title: 'Chat',
    description: 'Connect and chat with ambitious talent on the Linkaura platform.',
    keywords: 'chat, linkaura message, network, collaboration'
  });

  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const profile = state?.profile;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined); 
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  const db = getFirestore(app);
  const auth = getAuth(app);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  const chatRoomId = currentUser && profile?.userId
    ? [currentUser.uid, profile.userId].sort().join('_')
    : null;

  useEffect(() => {
    if (!chatRoomId) return;
    const q = query(
      collection(db, 'chats', chatRoomId, 'messages'),
      orderBy('createdAt', 'asc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [chatRoomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (messageText) => {
    if (!messageText?.trim() || !chatRoomId || !currentUser) return;
    setSending(true);
    const text = messageText.trim();
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    try {
      await addDoc(collection(db, 'chats', chatRoomId, 'messages'), {
        text,
        senderId: currentUser.uid,
        senderName: currentUser.displayName || currentUser.email?.split('@')[0] || 'You',
        createdAt: serverTimestamp(),
      });

      const receiverId = profile?.userId;
      if (receiverId && receiverId !== currentUser.uid) {
        const notifRef = doc(collection(db, 'notifications', receiverId, 'items'));
        await setDoc(notifRef, {
          type: 'message',
          senderId: currentUser.uid,
          senderName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Someone',
          senderPhoto: currentUser.photoURL || null,
          text: text.length > 60 ? text.slice(0, 60) + '…' : text,
          chatRoomId,
          read: false,
          createdAt: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const handleStructuredHelp = (helpType) => {
    const helpMessages = {
      doubt: `I have a doubt about ${profile?.techStack || 'your expertise'} and would appreciate your guidance.`,
      roadmap: `Could you share your career roadmap and learning path for ${profile?.techStack || 'your field'}?`,
      resume: `Would you be open to reviewing my resume and providing feedback for improvement?`,
      project: `I'm working on a project and would love to get your expert feedback and suggestions.`
    };
    handleSend(helpMessages[helpType]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp?.toDate) return '';
    return timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (currentUser === undefined) {
    return (
      <div className="min-h-screen w-full bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
          <span className="text-amber-500/50 text-xs font-black uppercase tracking-[0.3em]">Initializing</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[#050505] text-white flex flex-col relative overflow-hidden font-sans">
      
      {/* ── Background Glows ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* ── Header ── */}
      <header className="relative z-20 flex items-center gap-4 px-6 py-4 bg-black/40 backdrop-blur-2xl border-b border-white/[0.05]">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white/5 rounded-full transition-colors"
        >
          <FiChevronLeft size={24} className="text-gray-400" />
        </button>
        
        <div className="flex-1 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 p-[1px]">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
              <FiUser className="text-amber-500" size={18} />
            </div>
          </div>
          <div className="min-w-0">
            <h2 className="text-sm md:text-base font-bold tracking-tight truncate uppercase">
              {profile?.name || 'Anonymous User'}
            </h2>
            <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              <FiMapPin className="text-amber-500/50" size={10} />
              {profile?.address || 'Global'}
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:border-amber-500/40 transition-all text-amber-500"
        >
          <FiHome size={20} />
        </button>
      </header>

      {/* ── Messages Area ── */}
      <main className="flex-1 overflow-y-auto px-4 md:px-[15%] py-8 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
        
        {!currentUser && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <FiMessageSquare size={48} className="text-amber-500/20" />
            <h3 className="text-xl font-bold tracking-tighter">Authentication Required</h3>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 bg-amber-500 text-black font-black uppercase tracking-widest text-xs rounded-full hover:bg-amber-400 transition-all"
            >
              Sign In to Chat
            </button>
          </div>
        )}

        {currentUser && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 opacity-40">
            <div className="w-px h-12 bg-gradient-to-b from-transparent to-amber-500 mb-4" />
            <p className="text-[10px] uppercase tracking-[0.4em] font-black">Begin Transmission</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUser?.uid;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] md:max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-2xl ${
                    isMe 
                    ? 'bg-amber-500 text-black font-semibold rounded-br-none' 
                    : 'bg-white/[0.03] border border-white/10 text-gray-200 rounded-bl-none backdrop-blur-md'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="mt-1.5 text-[9px] font-bold text-gray-600 uppercase tracking-tighter px-1">
                    {isMe ? 'Sent' : msg.senderName} • {formatTime(msg.createdAt)}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </main>

      {/* ── Input Area ── */}
      <footer className="p-4 md:px-[15%] md:pb-8 relative z-20">
        <div className="max-w-4xl mx-auto space-y-4">
          
          {/* Quick Actions */}
          {currentUser && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              {[
                { id: 'doubt', icon: <FiHelpCircle />, text: 'Doubt' },
                { id: 'roadmap', icon: <FiMap />, text: 'Roadmap' },
                { id: 'resume', icon: <FiFileText />, text: 'Resume' },
                { id: 'project', icon: <FiCode />, text: 'Project' }
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => handleStructuredHelp(btn.id)}
                  disabled={sending}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:border-amber-500/50 hover:bg-amber-500/5 transition-all whitespace-nowrap disabled:opacity-20"
                >
                  <span className="text-amber-500">{btn.icon}</span>
                  {btn.text}
                </button>
              ))}
            </div>
          )}

          {/* Text Input */}
          {currentUser && (
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/20 to-amber-600/0 rounded-[2rem] blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
              <div className="relative flex items-center gap-2 bg-[#121212] border border-white/10 rounded-[2rem] p-2 pl-5 focus-within:border-amber-500/50 transition-all">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={`Speak with ${profile?.name?.split(' ')[0] || 'Operator'}...`}
                  className="flex-1 bg-transparent border-none outline-none text-sm py-3 resize-none placeholder:text-gray-600 scrollbar-hide"
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSend(input)}
                  disabled={sending || !input.trim()}
                  className="h-11 w-11 flex items-center justify-center rounded-full bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20 disabled:opacity-20 transition-all flex-shrink-0"
                >
                  {sending ? (
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <FiSend size={18} />
                  )}
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default Chat;
import React, { useState, useEffect, useRef } from 'react';
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
  getDoc,
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebase/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowLeft,
  FiSend,
  FiUser,
  FiMapPin,
  FiCpu,
  FiMessageSquare,
  FiLoader,
  FiHome,
} from 'react-icons/fi';

const Chat = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const profile = state?.profile;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined); // undefined = loading
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  const db = getFirestore(app);
  const auth = getAuth(app);

  // Wait for Firebase auth to resolve before rendering
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  // Derive a stable chat room ID from the two user IDs (sorted so it's symmetric)
  const chatRoomId = currentUser
    ? [currentUser.uid, id].sort().join('_')
    : null;

  // Subscribe to messages in Firestore
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

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatRoomId || !currentUser) return;
    setSending(true);
    const text = input.trim();
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    try {
      // 1. Save the message
      await addDoc(collection(db, 'chats', chatRoomId, 'messages'), {
        text,
        senderId: currentUser.uid,
        senderName: currentUser.displayName || currentUser.email?.split('@')[0] || 'You',
        createdAt: serverTimestamp(),
      });

      // 2. Write a notification for the receiver (the other person, id from URL params)
      const receiverId = id; // id comes from useParams()
      if (receiverId && receiverId !== currentUser.uid) {
        const notifRef = doc(
          collection(db, 'notifications', receiverId, 'items')
        );
        await setDoc(notifRef, {
          type: 'message',
          senderId: currentUser.uid,
          senderName:
            currentUser.displayName ||
            currentUser.email?.split('@')[0] ||
            'Someone',
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const techStackArray = profile?.techStack
    ? profile.techStack.split(',').map((t) => t.trim())
    : [];

  const formatTime = (timestamp) => {
    if (!timestamp?.toDate) return '';
    return timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Still resolving auth state
  if (currentUser === undefined) {
    return (
      <div className="min-h-screen w-full bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col relative overflow-hidden">

      {/* Ambient background */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <img src="/Profile.jpg" className="w-full h-full object-cover" alt="bg" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      <div className="relative z-10 flex flex-col h-screen pt-4">

        
          {/* ── Header ── */}
        <div className="flex items-center gap-4 px-4 md:px-10 py-4 border-b border-white/10 bg-black/60 backdrop-blur-xl">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <FiUser size={18} />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-base font-serif italic truncate">
              {profile?.name || 'Unknown Operator'}
            </h2>
            <p className="text-[9px] uppercase tracking-widest text-amber-500/60 font-black flex items-center gap-1">
              <FiMapPin size={9} /> {profile?.address || 'Unknown Location'}
            </p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/40 transition-colors"
          >
            <FiHome className="text-amber-500" size={18} />
          </button>
        </div>

        {/* ── Messages Area ── */}
        <div className="flex-1 overflow-y-auto px-4 md:px-10 py-6 space-y-4">

          {/* Not logged in */}
          {!currentUser && (
            <div className="flex justify-center py-16">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl px-6 py-6 text-center max-w-sm">
                <FiMessageSquare className="text-amber-500 mx-auto mb-3" size={28} />
                <p className="text-amber-500 text-sm font-bold mb-1">Sign in to chat</p>
                <p className="text-gray-500 text-xs">You need to be logged in to view or send messages.</p>
                <button
                  onClick={() => navigate('/login')}
                  className="mt-4 px-5 py-2 bg-amber-500 text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-amber-400 transition-colors"
                >
                  Go to Login
                </button>
              </div>
            </div>
          )}

          {/* Empty state */}
          {currentUser && messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 gap-4 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                <FiMessageSquare size={28} />
              </div>
              <div>
                <p className="text-white font-serif italic text-lg">Start the conversation</p>
                <p className="text-gray-600 text-xs uppercase tracking-widest mt-1">
                  Say hello to {profile?.name?.split(' ')[0] || 'this operator'}
                </p>
              </div>
            </motion.div>
          )}

          {/* Messages */}
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isMe = msg.senderId === currentUser?.uid;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
                    <span className="text-[9px] uppercase tracking-widest text-gray-600 font-black px-1">
                      {isMe ? 'You' : msg.senderName}
                    </span>
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm leading-relaxed break-words ${
                        isMe
                          ? 'bg-amber-500 text-black font-semibold rounded-br-md'
                          : 'bg-white/5 border border-white/10 text-gray-200 rounded-bl-md'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[8px] text-gray-700 px-1">
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* ── Input Area ── */}
        <div className="px-4 md:px-10 py-4 border-t border-white/10 bg-black/60 backdrop-blur-xl">
          {!currentUser ? (
            <p className="text-center text-gray-600 text-xs uppercase tracking-widest py-2">
              Log in to send messages
            </p>
          ) : (
            <div className="flex items-end gap-3 max-w-4xl mx-auto">
              <div className="flex-1 relative">
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
                  placeholder={`Message ${profile?.name?.split(' ')[0] || 'operator'}…`}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-5 outline-none focus:border-amber-500/50 transition-all text-sm resize-none overflow-hidden placeholder:text-gray-600 leading-relaxed"
                  style={{ minHeight: '52px' }}
                />
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleSend}
                disabled={sending || !input.trim()}
                className="p-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-black shadow-[0_0_20px_rgba(245,158,11,0.3)] flex-shrink-0"
              >
                {sending ? (
                  <div className="animate-spin rounded-full h-[18px] w-[18px] border-t-2 border-black" />
                ) : (
                  <FiSend size={18} />
                )}
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;

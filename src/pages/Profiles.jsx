import React, { useState, useEffect } from 'react';
import useSEO from '../hooks/useSEO';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGithub, FiLinkedin, FiMapPin, FiSearch,
  FiMessageSquare, FiCalendar, FiCode, FiUser
} from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

/* ── Colour palette helper ── */
const AVATAR_PALETTES = [
  ['#f59e0b', '#92400e'],
  ['#06b6d4', '#164e63'],
  ['#8b5cf6', '#4c1d95'],
  ['#10b981', '#064e3b'],
  ['#ef4444', '#7f1d1d'],
  ['#f97316', '#7c2d12'],
];

const avatarPalette = (name = '') => {
  const idx = (name.charCodeAt(0) || 0) % AVATAR_PALETTES.length;
  return AVATAR_PALETTES[idx];
};

const initials = (name = '') =>
  name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('') || '?';

/* ════════════════════════════════════════════
   PROFILE CARD
════════════════════════════════════════════ */
const ProfileCard = ({ profile, index, currentUserId }) => {
  const navigate  = useNavigate();
  const techStack = profile.tech_stack ? profile.tech_stack.split(',').map(t => t.trim()).filter(Boolean) : [];

  const linkedinUrl = profile.linkedin?.startsWith('http')
    ? profile.linkedin : `https://linkedin.com/in/${profile.linkedin}`;
  const githubUrl = profile.github?.startsWith('http')
    ? profile.github : `https://github.com/${profile.github}`;

  const isOwnProfile = currentUserId === profile.user_id;

  const [userRating,  setUserRating]  = useState(0);
  const [avgRating,   setAvgRating]   = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [hovered,     setHovered]     = useState(0);

  useEffect(() => {
    if (!profile.id) return;
    // Fetch ratings from Supabase
    const fetchRatings = async () => {
      const { data } = await supabase
        .from('profile_ratings')
        .select('rating, rater_id')
        .eq('profile_id', profile.id);

      if (data && data.length > 0) {
        const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
        setAvgRating(avg);
        setRatingCount(data.length);
        if (currentUserId) {
          const mine = data.find(r => r.rater_id === currentUserId);
          if (mine) setUserRating(mine.rating);
        }
      }
    };
    fetchRatings();
  }, [profile.id, currentUserId]);

  const handleRate = async (val) => {
    if (!currentUserId) return navigate('/login');
    if (isOwnProfile) return;
    setUserRating(val);
    try {
      await supabase.from('profile_ratings').upsert({
        profile_id: profile.id,
        rater_id:   currentUserId,
        rating:     val,
      }, { onConflict: 'profile_id,rater_id' });

      // Optimistic update
      const newCount = userRating === 0 ? ratingCount + 1 : ratingCount;
      setAvgRating((avgRating * ratingCount - userRating + val) / newCount);
      setRatingCount(newCount);
    } catch (e) { console.error(e); }
  };

  const handleChat = () => {
    if (currentUserId) navigate(`/chat/${profile.id}`, { state: { profile } });
    else navigate('/login');
  };

  const [fg, bg] = avatarPalette(profile.name);

  const card  = 'rgba(255,255,255,0.04)';
  const border = 'rgba(255,255,255,0.08)';
  const muted  = 'rgba(255,255,255,0.35)';
  const faint  = 'rgba(255,255,255,0.06)';
  const faintB = 'rgba(255,255,255,0.08)';
  const textPri = '#ffffff';
  const tagText = 'rgba(255,255,255,0.65)';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      className="group relative flex flex-col rounded-3xl overflow-hidden transition-all duration-500"
      style={{
        backgroundColor: card,
        border: `1px solid ${border}`,
        backdropFilter: 'blur(20px)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}
      whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(245,158,11,0.2)' }}
    >
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ border: '1px solid rgba(245,158,11,0.30)' }} />

      {/* TOP STRIP */}
      <div className="relative h-28 flex-shrink-0 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${bg}55, rgba(0,0,0,0) 80%)` }}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `repeating-linear-gradient(0deg, ${fg}22 0px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, ${fg}22 0px, transparent 1px, transparent 40px)`,
          backgroundSize: '40px 40px',
        }} />
        {profile.year && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest"
            style={{ backgroundColor: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.35)', color: '#f59e0b' }}>
            <FiCalendar size={9} /> Year {profile.year}
          </div>
        )}
        <div className="absolute -bottom-7 left-6 w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black shadow-xl"
          style={{
            background: `linear-gradient(135deg, ${fg}, ${bg})`,
            color: '#fff',
            boxShadow: `0 0 0 4px #0a0a0a, 0 8px 24px ${fg}55`,
          }}>
          {initials(profile.name)}
        </div>
      </div>

      {/* BODY */}
      <div className="flex flex-col flex-grow px-6 pt-10 pb-6 gap-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-xl font-serif font-semibold truncate leading-tight" style={{ color: textPri }}>
              {profile.name || 'Anonymous'}
            </h3>
            {profile.address && (
              <p className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold mt-0.5" style={{ color: '#f59e0b' }}>
                <FiMapPin size={9} /> {profile.address}
              </p>
            )}
          </div>
          <div className="flex gap-1.5 flex-shrink-0">
            {profile.github && (
              <a href={githubUrl} target="_blank" rel="noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200 hover:scale-110"
                style={{ backgroundColor: faint, border: `1px solid ${faintB}`, color: muted }}
                onMouseEnter={e => e.currentTarget.style.color = '#f59e0b'}
                onMouseLeave={e => e.currentTarget.style.color = muted}>
                <FiGithub size={14} />
              </a>
            )}
            {profile.linkedin && (
              <a href={linkedinUrl} target="_blank" rel="noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200 hover:scale-110"
                style={{ backgroundColor: faint, border: `1px solid ${faintB}`, color: muted }}
                onMouseEnter={e => e.currentTarget.style.color = '#f59e0b'}
                onMouseLeave={e => e.currentTarget.style.color = muted}>
                <FiLinkedin size={14} />
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(s => (
              <FaStar key={s} size={10} color={s <= Math.round(avgRating) ? '#f59e0b' : '#2d2d2d'} />
            ))}
          </div>
          <span className="text-[10px] font-bold" style={{ color: muted }}>
            {ratingCount > 0 ? `${avgRating.toFixed(1)} · ${ratingCount} rating${ratingCount !== 1 ? 's' : ''}` : 'No ratings yet'}
          </span>
        </div>

        <div style={{ height: 1, backgroundColor: faintB }} />

        <div className="flex flex-col gap-2 flex-grow">
          <p className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.25em] font-black" style={{ color: muted }}>
            <FiCode size={10} style={{ color: '#f59e0b' }} /> Tech Stack
          </p>
          <div className="flex flex-wrap gap-1.5">
            {techStack.length > 0 ? techStack.map((tech, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wide"
                style={{ backgroundColor: faint, border: `1px solid ${faintB}`, color: tagText }}>
                {tech}
              </span>
            )) : (
              <span style={{ color: muted, fontSize: 11 }} className="italic">Not specified</span>
            )}
          </div>
        </div>

        {!isOwnProfile && (
          <div className="flex flex-col gap-3 pt-2 border-t" style={{ borderColor: faintB }}>
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase tracking-[0.2em] font-black" style={{ color: muted }}>Your Rating</span>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(s => (
                  <button key={s} onClick={() => handleRate(s)}
                    onMouseEnter={() => setHovered(s)} onMouseLeave={() => setHovered(0)}
                    className="transition-transform hover:scale-125 active:scale-90">
                    <FaStar size={15} color={s <= (hovered || userRating) ? '#f59e0b' : '#2d2d2d'} />
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleChat}
              className="w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 cursor-pointer transition-all duration-300"
              style={{ backgroundColor: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.25)', color: '#f59e0b' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f59e0b'; e.currentTarget.style.color = '#000'; e.currentTarget.style.borderColor = '#f59e0b'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(245,158,11,0.10)'; e.currentTarget.style.color = '#f59e0b'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.25)'; }}>
              <FiMessageSquare size={13} /> Start Conversation
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

/* ════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════ */
const Profiles = () => {
  useSEO({
    title: 'Directory',
    description: 'Explore the Linkaura directory. Find developers, designers, and creators to connect with.',
    keywords: 'directory, user profiles, tech stack, developers network, linkaura',
  });

  const [profiles,     setProfiles]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [searchQuery,  setSearch]       = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUserId(session?.user?.id ?? null);
    });

    // Fetch all profiles from Supabase
    const fetchProfiles = async () => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setProfiles(data || []);
      } catch (e) {
        console.error('Error fetching profiles:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  const filtered = profiles.filter(p =>
    (p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     p.tech_stack?.toLowerCase().includes(searchQuery.toLowerCase())) &&
    p.user_id !== currentUserId
  );

  const pageBg  = '#000000';
  const textPri = '#ffffff';
  const textMut = 'rgba(255,255,255,0.40)';
  const inputBg = 'rgba(255,255,255,0.05)';
  const inputBd = 'rgba(255,255,255,0.10)';

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden" style={{ backgroundColor: pageBg, color: textPri }}>
      <Navbar />

      {/* Background orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.04) 0%, transparent 70%)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 pt-36 pb-24 relative z-10">
        <div className="mb-14">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.3em] mb-6"
            style={{ backgroundColor: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.25)', color: '#f59e0b' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Aura Directory
          </motion.div>

          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="text-5xl md:text-7xl font-serif tracking-tight leading-[0.95] mb-4" style={{ color: textPri }}>
            Find Your <br /><span className="text-amber-500 italic">People</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
            className="text-sm md:text-base font-light max-w-md mb-10" style={{ color: textMut }}>
            Browse real profiles of developers, designers and builders. Connect directly.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="max-w-lg relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2" size={16} style={{ color: '#f59e0b' }} />
            <input
              type="text"
              placeholder="Search by name or tech stack…"
              value={searchQuery}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-2xl py-4 pl-11 pr-5 outline-none text-sm font-medium transition-all duration-300"
              style={{ backgroundColor: inputBg, border: `1px solid ${inputBd}`, color: textPri }}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(245,158,11,0.50)'}
              onBlur={e  => e.currentTarget.style.borderColor = inputBd}
            />
          </motion.div>

          {!loading && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="mt-5 text-[10px] uppercase tracking-[0.4em] font-black" style={{ color: textMut }}>
              {filtered.length} {filtered.length === 1 ? 'Profile' : 'Profiles'} Found
            </motion.p>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-start gap-4 py-16">
            <div className="w-10 h-10 rounded-full border-t-2 border-b-2 border-amber-500 animate-spin"
              style={{ boxShadow: '0 0 12px rgba(245,158,11,0.3)' }} />
            <p className="text-[10px] uppercase tracking-widest" style={{ color: '#f59e0b' }}>Loading profiles…</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" layout>
                {filtered.map((profile, i) => (
                  <ProfileCard key={profile.id} profile={profile} index={i} currentUserId={currentUserId} />
                ))}
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 flex flex-col items-center gap-4">
                <FiUser size={40} style={{ color: textMut, opacity: 0.4 }} />
                <p className="font-serif italic text-xl" style={{ color: textMut }}>No profiles found.</p>
                <p className="text-[11px] uppercase tracking-widest" style={{ color: textMut, opacity: 0.5 }}>Try a different search term</p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Profiles;

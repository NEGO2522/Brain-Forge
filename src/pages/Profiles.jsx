import React, { useState, useEffect } from 'react';
import useSEO from '../hooks/useSEO';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGithub, FiLinkedin, FiMapPin, FiSearch,
  FiMessageSquare, FiCalendar, FiCode, FiUser, FiArrowRight
} from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

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
      const newCount = userRating === 0 ? ratingCount + 1 : ratingCount;
      setAvgRating((avgRating * ratingCount - userRating + val) / newCount);
      setRatingCount(newCount);
    } catch (e) { console.error(e); }
  };

  const handleChat = () => {
    if (currentUserId) navigate(`/chat/${profile.id}`, { state: { profile } });
    else navigate('/login');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      className="group flex flex-col bg-white border border-black/10 hover:border-black transition-all duration-300"
      style={{ fontFamily: 'sans-serif' }}
    >
      {/* TOP STRIP — initials + year badge */}
      <div className="relative border-b border-black/8 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-black flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-black">{initials(profile.name)}</span>
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-black uppercase tracking-[0.15em] text-black truncate leading-tight">
              {profile.name || 'Anonymous'}
            </h3>
            {profile.address && (
              <p className="flex items-center gap-1 text-[9px] uppercase tracking-widest font-black text-black/35 mt-0.5">
                <FiMapPin size={8} /> {profile.address}
              </p>
            )}
          </div>
        </div>
        {profile.year && (
          <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-black/40 border border-black/15 px-2.5 py-1 flex-shrink-0">
            <FiCalendar size={8} /> Yr {profile.year}
          </div>
        )}
      </div>

      {/* BODY */}
      <div className="flex flex-col flex-grow px-6 py-5 gap-5">

        {/* Rating display */}
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(s => (
              <FaStar key={s} size={10} color={s <= Math.round(avgRating) ? '#000000' : '#e5e5e5'} />
            ))}
          </div>
          {ratingCount > 0 && (
            <span className="text-[10px] font-black text-black/35">{avgRating.toFixed(1)}</span>
          )}
        </div>

        {/* Tech stack */}
        <div className="flex flex-col gap-2 flex-grow">
          <p className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.3em] font-black text-black/30">
            <FiCode size={9} /> Tech Stack
          </p>
          <div className="flex flex-wrap gap-1.5">
            {techStack.length > 0 ? techStack.map((tech, i) => (
              <span key={i} className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wide border border-black/15 text-black/55">
                {tech}
              </span>
            )) : (
              <span className="text-[11px] italic text-black/30">Not specified</span>
            )}
          </div>
        </div>

        {/* Links */}
        <div className="flex gap-2">
          {profile.github && (
            <a href={githubUrl} target="_blank" rel="noreferrer"
              className="flex items-center justify-center w-8 h-8 border border-black/15 text-black/40 hover:bg-black hover:text-white hover:border-black transition-all duration-200">
              <FiGithub size={13} />
            </a>
          )}
          {profile.linkedin && (
            <a href={linkedinUrl} target="_blank" rel="noreferrer"
              className="flex items-center justify-center w-8 h-8 border border-black/15 text-black/40 hover:bg-black hover:text-white hover:border-black transition-all duration-200">
              <FiLinkedin size={13} />
            </a>
          )}
        </div>

        {!isOwnProfile && (
          <div className="flex flex-col gap-3 pt-4 border-t border-black/8">
            {/* Star rating */}
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase tracking-[0.3em] font-black text-black/30">Your Rating</span>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(s => (
                  <button key={s} onClick={() => handleRate(s)}
                    onMouseEnter={() => setHovered(s)} onMouseLeave={() => setHovered(0)}
                    className="transition-transform hover:scale-110 active:scale-90">
                    <FaStar size={14} color={s <= (hovered || userRating) ? '#000000' : '#e5e5e5'} />
                  </button>
                ))}
              </div>
            </div>
            {/* CTA */}
            <button onClick={handleChat}
              className="group/btn w-full py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black/80 transition-all duration-200">
              <FiMessageSquare size={12} /> Message
              <FiArrowRight size={11} className="group-hover/btn:translate-x-1 transition-transform" />
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
    p.user_id !== currentUserId &&
    p.year !== '1'
  );

  return (
    <div className="min-h-screen bg-white text-black" style={{ fontFamily: "'Georgia', serif" }}>

      {/* Noise texture — same as Landing */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat', backgroundSize: '128px',
      }} />

      <Navbar />

      {/* ── HERO HEADER ── */}
      <section className="relative border-b border-black/10 overflow-hidden pt-28">
        {/* Grid lines */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }} />
        <div className="relative z-10 px-6 md:px-12 py-16 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 border border-black/15 text-[10px] font-black uppercase tracking-[0.4em] text-black/50 mb-8" style={{ fontFamily: 'sans-serif' }}>
              <FiUser size={10} /> Senior Directory
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-7xl md:text-[5.5rem] font-serif font-bold leading-[0.92] tracking-tight text-black mb-6">
            Find Your<br />Senior.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base text-black/50 max-w-md leading-relaxed mb-10" style={{ fontFamily: 'sans-serif', fontWeight: 400 }}>
            Browse real profiles of seniors in your domain. Connect directly, learn from experience.
          </motion.p>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="relative max-w-lg" style={{ fontFamily: 'sans-serif' }}>
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={15} />
            <input
              type="text"
              placeholder="Search by name or tech stack…"
              value={searchQuery}
              onChange={e => setSearch(e.target.value)}
              className="w-full py-4 pl-11 pr-5 border border-black/15 bg-white outline-none text-sm text-black placeholder-black/30 font-medium focus:border-black transition-colors duration-200"
            />
          </motion.div>

          {!loading && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="mt-5 text-[10px] uppercase tracking-[0.4em] font-black text-black/30" style={{ fontFamily: 'sans-serif' }}>
              {filtered.length} {filtered.length === 1 ? 'Profile' : 'Profiles'} Found
            </motion.p>
          )}
        </div>
      </section>

      {/* ── GRID ── */}
      <section className="px-6 md:px-12 py-16 max-w-5xl mx-auto relative z-10">
        {loading ? (
          <div className="flex flex-col items-start gap-3 py-16" style={{ fontFamily: 'sans-serif' }}>
            <div className="w-6 h-6 border-t-2 border-black animate-spin" />
            <p className="text-[10px] uppercase tracking-widest font-black text-black/40">Loading profiles…</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-black/8" layout>
                {filtered.map((profile, i) => (
                  <ProfileCard key={profile.id} profile={profile} index={i} currentUserId={currentUserId} />
                ))}
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="py-24 flex flex-col items-start gap-4" style={{ fontFamily: 'sans-serif' }}>
                <FiUser size={32} className="text-black/20" />
                <p className="font-serif italic text-2xl text-black/40">No profiles found.</p>
                <p className="text-[10px] uppercase tracking-widest font-black text-black/25">Try a different search term</p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </section>
    </div>
  );
};

export default Profiles;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiSearch, FiMapPin, FiGithub, FiLinkedin,
  FiMessageSquare, FiUser, FiCode, FiArrowRight,
  FiUsers, FiStar
} from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { supabase } from '../supabaseClient';
import Navbar from '../components/Navbar';
import Footer from './Footer';

const initials = (name = '') =>
  name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('') || '?';

/* ─── TEACHER CARD ─── */
const TeacherCard = ({ teacher, index, currentUserId }) => {
  const navigate = useNavigate();
  const techStack = teacher.tech_stack
    ? teacher.tech_stack.split(',').map(t => t.trim()).filter(Boolean)
    : [];

  const githubUrl = teacher.github?.startsWith('http')
    ? teacher.github : `https://github.com/${teacher.github}`;
  const linkedinUrl = teacher.linkedin?.startsWith('http')
    ? teacher.linkedin : `https://linkedin.com/in/${teacher.linkedin}`;

  const [avgRating,   setAvgRating]   = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [userRating,  setUserRating]  = useState(0);
  const [hovered,     setHovered]     = useState(0);

  const isOwn = currentUserId === teacher.user_id;

  useEffect(() => {
    if (!teacher.id) return;
    (async () => {
      const { data } = await supabase
        .from('profile_ratings')
        .select('rating, rater_id')
        .eq('profile_id', teacher.id);
      if (data?.length) {
        const avg = data.reduce((s, r) => s + r.rating, 0) / data.length;
        setAvgRating(avg);
        setRatingCount(data.length);
        const mine = data.find(r => r.rater_id === currentUserId);
        if (mine) setUserRating(mine.rating);
      }
    })();
  }, [teacher.id, currentUserId]);

  const handleRate = async (val) => {
    if (!currentUserId) return navigate('/login');
    if (isOwn) return;
    setUserRating(val);
    await supabase.from('profile_ratings').upsert(
      { profile_id: teacher.id, rater_id: currentUserId, rating: val },
      { onConflict: 'profile_id,rater_id' }
    );
    const newCount = userRating === 0 ? ratingCount + 1 : ratingCount;
    setAvgRating((avgRating * ratingCount - userRating + val) / newCount);
    setRatingCount(newCount);
  };

  const handleChat = () => {
    if (currentUserId) navigate(`/chat/${teacher.id}`, { state: { student: teacher } });
    else navigate('/login');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      className="group flex flex-col bg-white border border-black/10 hover:border-black transition-all duration-300 h-full"
      style={{ fontFamily: 'sans-serif' }}
    >
      {/* TOP STRIP */}
      <div className="border-b border-black/8 px-5 py-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 bg-black flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-black">{initials(teacher.name)}</span>
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-black uppercase tracking-[0.12em] text-black leading-tight truncate">
              {teacher.name || 'Anonymous'}
            </h3>
            {teacher.address && (
              <p className="flex items-center gap-1 text-[9px] uppercase tracking-widest font-black text-black/35 mt-0.5 truncate">
                <FiMapPin size={8} className="flex-shrink-0" />
                <span className="truncate">{teacher.address}</span>
              </p>
            )}
          </div>
        </div>
        {teacher.year && (
          <div className="flex-shrink-0 text-[9px] font-black uppercase tracking-widest text-black/40 border border-black/15 px-2 py-1 whitespace-nowrap">
            Yr {teacher.year}
          </div>
        )}
      </div>

      {/* BODY */}
      <div className="flex flex-col flex-1 px-5 py-4 gap-4">

        {/* Stars */}
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(s => (
              <FaStar key={s} size={10} color={s <= Math.round(avgRating) ? '#000' : '#e5e5e5'} />
            ))}
          </div>
          {ratingCount > 0 && (
            <span className="text-[10px] font-black text-black/35">{avgRating.toFixed(1)}</span>
          )}
        </div>

        {/* Tech stack */}
        <div className="flex flex-col gap-2 flex-1">
          <p className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.3em] font-black text-black/30">
            <FiCode size={9} /> Expertise
          </p>
          <div className="flex flex-wrap gap-1.5 content-start">
            {techStack.length > 0 ? techStack.slice(0, 4).map((t, i) => (
              <span key={i} className="px-2 py-1 text-[9px] font-black uppercase tracking-wide border border-black/15 text-black/55 whitespace-nowrap">
                {t}
              </span>
            )) : (
              <span className="text-[11px] italic text-black/30">Not specified</span>
            )}
            {techStack.length > 4 && (
              <span className="px-2 py-1 text-[9px] font-black border border-black/15 text-black/35">+{techStack.length - 4}</span>
            )}
          </div>
        </div>

        {/* Links */}
        <div className="flex gap-2">
          {teacher.github && (
            <a href={githubUrl} target="_blank" rel="noreferrer"
              className="flex items-center justify-center w-8 h-8 border border-black/15 text-black/40 hover:bg-black hover:text-white hover:border-black transition-all duration-200">
              <FiGithub size={13} />
            </a>
          )}
          {teacher.linkedin && (
            <a href={linkedinUrl} target="_blank" rel="noreferrer"
              className="flex items-center justify-center w-8 h-8 border border-black/15 text-black/40 hover:bg-black hover:text-white hover:border-black transition-all duration-200">
              <FiLinkedin size={13} />
            </a>
          )}
        </div>

        {!isOwn && (
          <div className="flex flex-col gap-3 pt-3 border-t border-black/8 mt-auto">
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase tracking-[0.3em] font-black text-black/30">Your Rating</span>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(s => (
                  <button key={s} onClick={() => handleRate(s)}
                    onMouseEnter={() => setHovered(s)} onMouseLeave={() => setHovered(0)}
                    className="transition-transform hover:scale-110 active:scale-90">
                    <FaStar size={13} color={s <= (hovered || userRating) ? '#000' : '#e5e5e5'} />
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleChat}
              className="group/btn w-full py-2.5 bg-black text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black/80 transition-all duration-200">
              <FiMessageSquare size={12} /> Message
              <FiArrowRight size={11} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

/* ─── MAIN PAGE ─── */
const Teacher = () => {
  const [teachers,      setTeachers]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [searchQuery,   setSearch]        = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [myProfile,     setMyProfile]     = useState(null);
  const [myAvgRating,   setMyAvgRating]   = useState(0);
  const [myRatingCount, setMyRatingCount] = useState(0);
  const [profileLoading, setProfileLoading] = useState(true);
  const [activeTab,     setActiveTab]     = useState('directory');

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id ?? null;
      setCurrentUserId(userId);

      if (userId) {
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();
        if (profileData) {
          setMyProfile(profileData);
          const { data: ratingData } = await supabase
            .from('profile_ratings')
            .select('rating')
            .eq('profile_id', profileData.id);
          if (ratingData?.length) {
            const avg = ratingData.reduce((s, r) => s + r.rating, 0) / ratingData.length;
            setMyAvgRating(avg);
            setMyRatingCount(ratingData.length);
          }
        }
      }
      setProfileLoading(false);

      try {
        // Fetch all profiles that are year 4 (seniors/teachers)
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setTeachers(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const myTechStack = myProfile?.tech_stack
    ? myProfile.tech_stack.split(',').map(t => t.trim()).filter(Boolean)
    : [];

  const filtered = teachers.filter(t =>
    t.user_id !== currentUserId &&
    (t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     t.tech_stack?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const tabs = [
    { id: 'directory', label: 'Directory', icon: FiUsers },
    { id: 'my-profile', label: 'My Profile', icon: FiUser },
  ];

  const noiseBg = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'repeat',
    backgroundSize: '128px',
  };

  return (
    <div className="min-h-screen bg-white text-black" style={{ fontFamily: "'Georgia', serif" }}>
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]" style={noiseBg} />
      <Navbar />

      <section className="relative border-b border-black/10 overflow-hidden pt-24">
        {/* Grid lines */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }} />

        {/* My profile strip */}
        {!profileLoading && myProfile && (
          <div className="relative z-10 px-6 md:px-12 pt-8 pb-0 max-w-5xl mx-auto" style={{ fontFamily: 'sans-serif' }}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="border border-black/10 bg-white flex flex-col md:flex-row"
            >
              {/* Avatar + name */}
              <div className="flex items-center gap-5 px-7 py-6 border-b md:border-b-0 md:border-r border-black/10 md:min-w-[260px]">
                <div className="w-14 h-14 bg-black flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg font-black">{initials(myProfile.name)}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] uppercase tracking-[0.35em] font-black text-black/30 mb-0.5">You</p>
                  <h2 className="text-base font-black uppercase tracking-[0.12em] text-black truncate leading-tight">
                    {myProfile.name || 'Anonymous'}
                  </h2>
                  {myProfile.address && (
                    <p className="flex items-center gap-1 text-[9px] uppercase tracking-widest font-black text-black/35 mt-0.5 truncate">
                      <FiMapPin size={8} className="flex-shrink-0" />
                      <span className="truncate">{myProfile.address}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-black/10">
                <div className="px-6 py-5 flex flex-col justify-center">
                  <p className="text-[9px] uppercase tracking-[0.3em] font-black text-black/30 mb-1">Year</p>
                  <p className="text-sm font-black text-black">{myProfile.year ? `Year ${myProfile.year}` : '—'}</p>
                </div>
                <div className="px-6 py-5 flex flex-col justify-center">
                  <p className="text-[9px] uppercase tracking-[0.3em] font-black text-black/30 mb-1">Expertise</p>
                  <p className="text-sm font-black text-black truncate">
                    {myTechStack.length > 0 ? myTechStack[0] : '—'}
                    {myTechStack.length > 1 && <span className="text-black/40"> +{myTechStack.length - 1}</span>}
                  </p>
                </div>
                <div className="px-6 py-5 flex flex-col justify-center">
                  <p className="text-[9px] uppercase tracking-[0.3em] font-black text-black/30 mb-1">Rating</p>
                  <div className="flex items-center gap-1.5">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <FaStar key={s} size={9} color={s <= Math.round(myAvgRating) ? '#000' : '#e5e5e5'} />
                      ))}
                    </div>
                    <span className="text-[10px] font-black text-black/50">
                      {myRatingCount > 0 ? myAvgRating.toFixed(1) : 'None'}
                    </span>
                  </div>
                </div>
                <div className="px-6 py-5 flex flex-col justify-center gap-2">
                  {myProfile.github && (
                    <a href={myProfile.github.startsWith('http') ? myProfile.github : `https://github.com/${myProfile.github}`}
                      target="_blank" rel="noreferrer"
                      className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-black text-black/40 hover:text-black transition-colors">
                      <FiGithub size={10} /> GitHub
                    </a>
                  )}
                  {myProfile.linkedin && (
                    <a href={myProfile.linkedin.startsWith('http') ? myProfile.linkedin : `https://linkedin.com/in/${myProfile.linkedin}`}
                      target="_blank" rel="noreferrer"
                      className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-black text-black/40 hover:text-black transition-colors">
                      <FiLinkedin size={10} /> LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <div className="flex border-b border-black/10 mt-8">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 text-[10px] font-black uppercase tracking-[0.3em] transition-all border-b-2 ${
                    activeTab === tab.id
                      ? 'text-black border-black'
                      : 'text-black/35 border-transparent hover:text-black'
                  }`}>
                  <tab.icon size={11} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="relative z-10 px-6 md:px-12 py-12 max-w-5xl mx-auto">

          {/* Hero — only for guests or on directory tab */}
          {(!myProfile || activeTab === 'directory') && (
            <>
              {!myProfile && (
                <>
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 border border-black/15 text-[10px] font-black uppercase tracking-[0.4em] text-black/50 mb-8" style={{ fontFamily: 'sans-serif' }}>
                      <FiUser size={10} /> Educators
                    </span>
                  </motion.div>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className="text-5xl sm:text-7xl md:text-[5.5rem] font-serif font-bold leading-[0.92] tracking-tight text-black mb-6">
                    Find Your<br />Educator.
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-base text-black/50 max-w-md leading-relaxed mb-10" style={{ fontFamily: 'sans-serif', fontWeight: 400 }}>
                    Connect with experienced educators in your domain. Learn directly from those who've been there.
                  </motion.p>
                </>
              )}

              {/* Search */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="relative max-w-lg" style={{ fontFamily: 'sans-serif' }}>
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={15} />
                <input
                  type="text"
                  placeholder="Search by name or expertise..."
                  value={searchQuery}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full py-4 pl-11 pr-5 border border-black/15 bg-white outline-none text-sm text-black placeholder-black/30 font-medium focus:border-black transition-colors duration-200"
                />
              </motion.div>

              {!loading && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                  className="mt-5 text-[10px] uppercase tracking-[0.4em] font-black text-black/30" style={{ fontFamily: 'sans-serif' }}>
                  {filtered.length} {filtered.length === 1 ? 'Educator' : 'Educators'} Found
                </motion.p>
              )}
            </>
          )}

          {/* DIRECTORY */}
          {activeTab === 'directory' && (
            loading ? (
              <div className="flex flex-col items-start gap-3 py-16" style={{ fontFamily: 'sans-serif' }}>
                <div className="w-6 h-6 border-t-2 border-black animate-spin" />
                <p className="text-[10px] uppercase tracking-widest font-black text-black/40">Loading educators...</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filtered.length > 0 ? (
                  <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8" layout>
                    {filtered.map((teacher, i) => (
                      <TeacherCard key={teacher.id} teacher={teacher} index={i} currentUserId={currentUserId} />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="py-24 flex flex-col items-start gap-4" style={{ fontFamily: 'sans-serif' }}>
                    <FiUser size={32} className="text-black/20" />
                    <p className="font-serif italic text-2xl text-black/40">No educators found.</p>
                    <p className="text-[10px] uppercase tracking-widest font-black text-black/25">Try a different search term</p>
                  </motion.div>
                )}
              </AnimatePresence>
            )
          )}

          {/* MY PROFILE TAB */}
          {activeTab === 'my-profile' && myProfile && (
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
              className="space-y-px border border-black/10" style={{ fontFamily: 'sans-serif' }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/10">
                {[
                  { label: 'Full Name', value: myProfile.name },
                  { label: 'Email',     value: myProfile.email },
                  { label: 'Location',  value: myProfile.address },
                  { label: 'Year',      value: myProfile.year ? `Year ${myProfile.year}` : null },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white px-7 py-5">
                    <p className="text-[9px] uppercase tracking-[0.35em] font-black text-black/30 mb-1">{label}</p>
                    <p className="text-sm font-black text-black">
                      {value || <span className="text-black/25 font-normal italic">Not set</span>}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-white px-7 py-6">
                <p className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.35em] font-black text-black/30 mb-3">
                  <FiCode size={9} /> Expertise
                </p>
                <div className="flex flex-wrap gap-2">
                  {myTechStack.length > 0 ? myTechStack.map((t, i) => (
                    <span key={i} className="px-3 py-1.5 border border-black/15 text-[9px] font-black uppercase tracking-wide text-black/60">{t}</span>
                  )) : <span className="text-sm italic text-black/30">Not specified</span>}
                </div>
              </div>

              <div className="bg-white px-7 py-6 flex items-center gap-4">
                {myProfile.github && (
                  <a href={myProfile.github.startsWith('http') ? myProfile.github : `https://github.com/${myProfile.github}`}
                    target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 border border-black/15 text-[10px] font-black uppercase tracking-widest text-black/50 hover:bg-black hover:text-white hover:border-black transition-all">
                    <FiGithub size={12} /> GitHub
                  </a>
                )}
                {myProfile.linkedin && (
                  <a href={myProfile.linkedin.startsWith('http') ? myProfile.linkedin : `https://linkedin.com/in/${myProfile.linkedin}`}
                    target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 border border-black/15 text-[10px] font-black uppercase tracking-widest text-black/50 hover:bg-black hover:text-white hover:border-black transition-all">
                    <FiLinkedin size={12} /> LinkedIn
                  </a>
                )}
              </div>

              <div className="bg-white px-7 py-6">
                <p className="text-[9px] uppercase tracking-[0.35em] font-black text-black/30 mb-3">Your Rating from Peers</p>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(s => (
                      <FaStar key={s} size={16} color={s <= Math.round(myAvgRating) ? '#000' : '#e5e5e5'} />
                    ))}
                  </div>
                  <span className="text-base font-black text-black">
                    {myRatingCount > 0 ? `${myAvgRating.toFixed(1)} / 5` : 'No ratings yet'}
                  </span>
                  {myRatingCount > 0 && (
                    <span className="text-[10px] font-black text-black/35 uppercase tracking-widest">
                      ({myRatingCount} {myRatingCount === 1 ? 'rating' : 'ratings'})
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Teacher;

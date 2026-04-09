import React, { useState, createContext, useContext, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiUser, FiBell, FiMessageSquare, FiArrowRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export const MenuContext = createContext({ isMenuOpen: false, setIsMenuOpen: () => {} });

export const MenuProvider = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <MenuContext.Provider value={{ isMenuOpen, setIsMenuOpen }}>
      {children}
    </MenuContext.Provider>
  );
};

const Navbar = () => {
  const { isMenuOpen, setIsMenuOpen } = useContext(MenuContext);
  const [isLoggedIn,  setIsLoggedIn]  = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate  = useNavigate();
  const location  = useLocation();

  // Check if we're on the user profile page with an incomplete profile
  const isOnUserPage = location.pathname === '/user';
  const [profileLocked, setProfileLocked] = useState(false);

  useEffect(() => {
    if (!isOnUserPage) { setProfileLocked(false); return; }
    // Check if profile is complete by querying Supabase
    const checkProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data } = await supabase
        .from('user_profiles')
        .select('name, email, address, github, linkedin, tech_stack, year')
        .eq('user_id', session.user.id)
        .single();
      if (!data) { setProfileLocked(true); return; }
      const allFilled = Object.values(data).every(v => v && String(v).trim());
      setProfileLocked(!allFilled);
    };
    checkProfile();
  }, [isOnUserPage]);

  // Guard navigation — block all nav when profile is locked
  const guardedNavigate = (path) => {
    if (profileLocked) return; // do nothing
    navigate(path);
    setIsMenuOpen(false);
  };

  /* ── Auth + unread notification count ── */
  useEffect(() => {
    let notifChannel = null;

    const setupNotifs = async (userId) => {
      if (!userId) { setUnreadCount(0); return; }

      // Initial count
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);
      setUnreadCount(count || 0);

      // Realtime subscription
      notifChannel = supabase
        .channel(`navbar-notifs:${userId}`)
        .on('postgres_changes', {
          event: '*', schema: 'public', table: 'notifications',
          filter: `user_id=eq.${userId}`,
        }, async () => {
          const { count: newCount } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('read', false);
          setUnreadCount(newCount || 0);
        })
        .subscribe();
    };

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session?.user);
      setupNotifs(session?.user?.id);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsLoggedIn(!!session?.user);
      if (notifChannel) { supabase.removeChannel(notifChannel); notifChannel = null; }
      setupNotifs(session?.user?.id);
    });

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      subscription.unsubscribe();
      if (notifChannel) supabase.removeChannel(notifChannel);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 1024) setIsMenuOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMenuOpen]);

  const handleProfileClick     = () => guardedNavigate('/user');
  const handleNotificationClick = () => guardedNavigate('/notification');
  const handleChatsClick       = () => guardedNavigate('/chats');

  // Wrap Link clicks to block navigation when locked
  const handleNavLinkClick = (e) => {
    if (profileLocked) e.preventDefault();
    else setIsMenuOpen(false);
  };

  const navLinks = [
    { to: '/',          text: 'Home'      },
    { to: '/student',  text: 'Students'  },
    { to: '/teacher',  text: 'Teachers'  },
    { to: '/educators', text: 'Educators' },
  ];

  const scrolledBg = 'bg-white/95 backdrop-blur-md shadow-[0_1px_0_0_rgba(0,0,0,0.08)]';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
      scrolled ? scrolledBg : 'bg-white border-b border-black/8'
    }`} style={{ fontFamily: 'sans-serif' }}>
      <div className="flex items-center justify-between px-6 md:px-12 py-5">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 z-[110]" onClick={(e) => { if (profileLocked) { e.preventDefault(); return; } setIsMenuOpen(false); }}>
          <div className="w-7 h-7 bg-black flex items-center justify-center">
            <span className="text-white text-[10px] font-black">L</span>
          </div>
          <span className="text-sm font-black uppercase tracking-[0.3em] text-black">Linkaura</span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {navLinks.map(link => {
            const isActive = location.pathname === link.to;
            return (
              <Link key={link.to} to={link.to}
                onClick={handleNavLinkClick}
                className={`text-[11px] font-black uppercase tracking-widest transition-colors ${
                  isActive ? 'text-black' : 'text-black/40 hover:text-black'
                } ${profileLocked ? 'opacity-40 cursor-not-allowed' : ''}`}>
                {link.text}
              </Link>
            );
          })}
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-3 z-[110]">
          {isLoggedIn ? (
            <>
              <button onClick={handleChatsClick}
                className="hidden md:flex w-8 h-8 border border-black/15 items-center justify-center text-black/40 hover:bg-black hover:text-white hover:border-black transition-all duration-200">
                <FiMessageSquare size={14} />
              </button>
              <button onClick={handleNotificationClick}
                className="hidden md:flex relative w-8 h-8 border border-black/15 items-center justify-center text-black/40 hover:bg-black hover:text-white hover:border-black transition-all duration-200">
                <FiBell size={14} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] bg-black text-white flex items-center justify-center text-[8px] font-black px-0.5">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              <button onClick={handleProfileClick}
                className="hidden md:flex w-8 h-8 border border-black/15 items-center justify-center text-black/40 hover:bg-black hover:text-white hover:border-black transition-all duration-200">
                <FiUser size={14} />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login"
                className="text-[11px] font-black uppercase tracking-widest text-black/50 hover:text-black transition-colors">
                Sign In
              </Link>
              <Link to="/signup"
                className="px-5 py-2.5 bg-black text-white text-[11px] font-black uppercase tracking-widest hover:bg-black/80 transition-all rounded-xl">
                Join Free
              </Link>
            </div>
          )}

          {/* HAMBURGER */}
          <button
            className="lg:hidden w-8 h-8 flex flex-col items-center justify-center border border-black/15 hover:bg-black hover:border-black transition-all duration-200 cursor-pointer group"
            onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle Menu">
            <div className="flex flex-col gap-1.5">
              <div className={`w-4 h-0.5 bg-black transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <div className={`w-4 h-0.5 bg-black transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
              <div className={`w-4 h-0.5 bg-black transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
            className="fixed inset-0 w-full h-[100dvh] z-[105] flex flex-col lg:hidden bg-white"
            style={{ fontFamily: 'sans-serif' }}>
            {/* Mobile menu header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/8">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-black flex items-center justify-center">
                  <span className="text-white text-[10px] font-black">L</span>
                </div>
                <span className="text-sm font-black uppercase tracking-[0.3em] text-black">Linkaura</span>
              </div>
              <button onClick={() => setIsMenuOpen(false)}
                className="w-8 h-8 border border-black/15 flex items-center justify-center text-black/50 hover:bg-black hover:text-white hover:border-black transition-all">
                <span className="text-lg leading-none">&times;</span>
              </button>
            </div>

            <div className="flex flex-col flex-1 px-6 py-12 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div key={link.to} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                  <Link to={link.to} onClick={handleNavLinkClick}
                    className={`block text-3xl font-serif font-bold text-black hover:text-black/50 transition-colors py-3 border-b border-black/8 ${profileLocked ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}`}>
                    {link.text}
                  </Link>
                </motion.div>
              ))}

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="pt-10">
                {isLoggedIn ? (
                  <div className="space-y-3">
                    <button onClick={handleChatsClick} className="w-full flex items-center gap-3 px-5 py-3 border border-black/10 text-[11px] font-black uppercase tracking-widest text-black/50 hover:bg-black hover:text-white hover:border-black transition-all">
                      <FiMessageSquare size={14} /> Chats
                    </button>
                    <button onClick={handleNotificationClick} className="w-full flex items-center gap-3 px-5 py-3 border border-black/10 text-[11px] font-black uppercase tracking-widest text-black/50 hover:bg-black hover:text-white hover:border-black transition-all">
                      <FiBell size={14} /> Notifications
                      {unreadCount > 0 && <span className="ml-auto bg-black text-white text-[9px] font-black px-1.5 py-0.5">{unreadCount > 9 ? '9+' : unreadCount}</span>}
                    </button>
                    <button onClick={handleProfileClick} className="w-full flex items-center gap-3 px-5 py-3 border border-black/10 text-[11px] font-black uppercase tracking-widest text-black/50 hover:bg-black hover:text-white hover:border-black transition-all">
                      <FiUser size={14} /> My Profile
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link to="/signup" onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center gap-2 px-8 py-4 bg-black text-white text-[11px] font-black uppercase tracking-widest hover:bg-black/80 transition-all">
                      Join Free <FiArrowRight size={13} />
                    </Link>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center px-8 py-4 border border-black/15 text-[11px] font-black uppercase tracking-widest text-black/50 hover:border-black hover:text-black transition-all">
                      Sign In
                    </Link>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

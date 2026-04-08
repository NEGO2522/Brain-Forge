import React, { useState, useEffect, useRef, useCallback } from 'react';
import useSEO from '../hooks/useSEO';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUser, FiMail, FiGithub, FiLinkedin, FiMapPin,
  FiCpu, FiLogOut, FiSave, FiCheckCircle,
  FiAlertCircle, FiX, FiChevronDown, FiSearch, FiPlus, FiCalendar,
  FiPhone, FiClock, FiToggleLeft, FiToggleRight, FiVideo
} from 'react-icons/fi';

const TECH_DOMAINS = [
  "Beginner", "Frontend Developer", "Backend Developer", "Full Stack Developer",
  "Mobile App Developer", "UI/UX Designer", "DevOps Engineer", "Data Scientist",
  "AI / ML Engineer", "Blockchain Developer", "Cloud Architect",
  "Cybersecurity Analyst", "Game Developer", "Embedded Systems", "Others"
];

/* ── Floating orb background ── */
const Orb = ({ style }) => (
  <div className="absolute rounded-full pointer-events-none" style={style} />
);

const User = () => {
  useSEO({
    title: 'Profile Settings',
    description: 'Manage your Linkaura identity, update your domain, location, and socials.',
    keywords: 'profile, user settings, linkaura identity, tech stack'
  });

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const locationInputRef = useRef(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', address: '', github: '', linkedin: '', tech_stack: '', year: '2'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });
  const [profileComplete, setProfileComplete] = useState(false);
  const [showTechDropdown, setShowTechDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [customTech, setCustomTech] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // ── 1-on-1 call states ──
  const [callEnabled, setCallEnabled] = useState(false);
  const [showCallForm, setShowCallForm] = useState(false);
  const [callData, setCallData] = useState({
    phone: '',
    timeFrom: '',
    timeTo: '',
    days: [],
  });
  const [callSaved, setCallSaved] = useState(false);

  const WORKING_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleCallDay = (day) => {
    setCallData(prev => ({
      ...prev,
      days: prev.days.includes(day) ? prev.days.filter(d => d !== day) : [...prev.days, day],
    }));
  };

  const handleCallChange = (e) => {
    const { name, value } = e.target;
    setCallData(prev => ({ ...prev, [name]: value }));
  };

  const handleCallSubmit = async () => {
    const { phone, timeFrom, timeTo, days } = callData;
    if (!phone || !timeFrom || !timeTo || days.length === 0) {
      setSubmitStatus({ success: false, message: 'Fill all call availability fields!' });
      setTimeout(() => setSubmitStatus({ success: null, message: '' }), 4000);
      return;
    }
    if (!profileId) {
      setSubmitStatus({ success: false, message: 'Save your profile first!' });
      setTimeout(() => setSubmitStatus({ success: null, message: '' }), 4000);
      return;
    }
    try {
      const { error } = await supabase.from('user_profiles').update({
        call_phone: phone,
        call_time_from: timeFrom,
        call_time_to: timeTo,
        call_days: days.join(','),
        call_enabled: true,
      }).eq('id', profileId);
      if (error) throw error;
      setCallSaved(true);
      setShowCallForm(false);
      setSubmitStatus({ success: true, message: 'Call availability saved!' });
      setTimeout(() => setSubmitStatus({ success: null, message: '' }), 4000);
    } catch (err) {
      setSubmitStatus({ success: false, message: err.message });
      setTimeout(() => setSubmitStatus({ success: null, message: '' }), 4000);
    }
  };

  const handleToggleCall = () => {
    if (!callEnabled) {
      setCallEnabled(true);
      setShowCallForm(true);
    } else {
      setCallEnabled(false);
      setShowCallForm(false);
      setCallSaved(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/login'); return; }
      const user = session.user;
      setCurrentUser(user);
      const { data } = await supabase.from('user_profiles').select('*').eq('user_id', user.id).single();
      if (data) {
        setProfileId(data.id);
        const loaded = {
          name: data.name || '', email: data.email || user.email || '',
          address: data.address || '', github: data.github || '',
          linkedin: data.linkedin || '', tech_stack: data.tech_stack || '', year: data.year || '2',
        };
        setFormData(loaded);
        setProfileComplete(Object.values(loaded).every(v => v && String(v).trim()));
      } else {
        setFormData(prev => ({ ...prev, email: user.email || '' }));
      }
    };
    load();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setShowTechDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleTech = (tech) => {
    if (tech === 'Others') { setShowCustomInput(true); setShowTechDropdown(false); return; }
    const current = formData.tech_stack ? formData.tech_stack.split(',').map(t => t.trim()).filter(t => t) : [];
    const next = current.includes(tech) ? current.filter(t => t !== tech) : [...current, tech];
    setFormData(prev => ({ ...prev, tech_stack: next.join(', ') }));
  };

  const handleAddCustomTech = () => {
    if (customTech.trim()) { toggleTech(customTech.trim()); setCustomTech(''); setShowCustomInput(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEmpty = Object.values(formData).some(v => !v || (typeof v === 'string' && !v.trim()));
    if (isEmpty) {
      setSubmitStatus({ success: false, message: 'All fields are mandatory!' });
      setTimeout(() => setSubmitStatus({ success: null, message: '' }), 4000);
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = { ...formData, user_id: currentUser.id, updated_at: new Date().toISOString() };
      if (profileId) {
        const { error } = await supabase.from('user_profiles').update(payload).eq('id', profileId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('user_profiles').insert({ ...payload, created_at: new Date().toISOString() }).select().single();
        if (error) throw error;
        setProfileId(data.id);
      }
      setProfileComplete(true);
      setSubmitStatus({ success: true, message: 'Profile saved! Redirecting...' });
      setTimeout(() => navigate('/profiles'), 1800);
    } catch (err) {
      setSubmitStatus({ success: false, message: err.message });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus({ success: null, message: '' }), 4000);
    }
  };

  useEffect(() => {
    if (profileComplete) return;
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => window.history.pushState(null, '', window.location.href);
    const handleBeforeUnload = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [profileComplete]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const selectedTechs = formData.tech_stack ? formData.tech_stack.split(',').filter(t => t.trim()) : [];

  return (
    <div className="min-h-screen w-full bg-[#080808] text-white relative overflow-x-hidden">

      {/* ── Ambient background orbs ── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <Orb style={{ width: 600, height: 600, top: '-10%', left: '-5%', background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)' }} />
        <Orb style={{ width: 500, height: 500, bottom: '5%', right: '-8%', background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)' }} />
        <Orb style={{ width: 300, height: 300, top: '40%', left: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.04) 0%, transparent 70%)' }} />
        {/* Fine grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-24">

        {/* ── Incomplete banner ── */}
        <AnimatePresence>
          {!profileComplete && (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="mb-8 flex items-center gap-4 px-6 py-4 rounded-2xl border"
              style={{ background: 'rgba(245,158,11,0.06)', borderColor: 'rgba(245,158,11,0.25)' }}
            >
              <FiAlertCircle className="text-amber-400 text-lg shrink-0" />
              <p className="text-amber-400 text-[10px] font-black uppercase tracking-[0.25em]">
                Complete all fields to unlock the full Linkaura experience.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-14"
        >
          <div className="flex items-center gap-5">
            {/* Avatar ring */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
                <FiUser className="text-amber-400 text-2xl" />
              </div>
              {profileComplete && (
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#080808] flex items-center justify-center">
                  <FiCheckCircle className="text-white text-[9px]" />
                </span>
              )}
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.4em] font-black mb-1" style={{ color: 'rgba(245,158,11,0.7)' }}>Linkaura</p>
              <h1 className="text-3xl sm:text-4xl font-serif italic leading-none">
                Profile <span className="text-amber-400">Settings</span>
              </h1>
            </div>
          </div>

          <button type="button" onClick={handleSignOut}
            className="group flex items-center gap-2.5 px-5 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all duration-200"
            style={{ background: 'rgba(239,68,68,0.06)', borderColor: 'rgba(239,68,68,0.2)', color: 'rgba(252,165,165,0.9)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'; }}
          >
            <FiLogOut className="text-sm" /> Sign Out
          </button>
        </motion.div>

        {/* ── Main grid ── */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* Left: main fields — spans 3 cols */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-3 space-y-5"
            >
              {/* Identity card */}
              <SectionCard label="Identity">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InputField label="Full Name" icon={<FiUser />} name="name" value={formData.name} onChange={handleChange} required placeholder="Your name" />
                  <InputField label="Email" icon={<FiMail />} name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" />
                </div>

                {/* Year of study */}
                <div className="space-y-2 mt-1">
                  <FieldLabel icon={<FiCalendar />} label="Year of Study" required />
                  <div className="grid grid-cols-4 gap-2">
                    {['2','3','4'].map(y => (
                      <button
                        key={y} type="button"
                        onClick={() => setFormData(prev => ({ ...prev, year: y }))}
                        className="py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200"
                        style={formData.year === y
                          ? { background: '#f59e0b', color: '#000', border: '1px solid #f59e0b' }
                          : { background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }
                        }
                      >
                        Year {y}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2 mt-1">
                  <FieldLabel icon={<FiMapPin />} label="Location" required />
                  <div className="relative">
                    <input
                      ref={locationInputRef}
                      name="address"
                      type="text"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="Start typing your city…"
                      className="w-full rounded-xl py-3.5 px-4 text-sm transition-all duration-200 outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#e5e7eb' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(245,158,11,0.4)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                    />
                  </div>
                </div>
              </SectionCard>

              {/* Skills card */}
              <SectionCard label="Skills & Domain">
                <div className="space-y-3 relative" ref={dropdownRef}>
                  {/* Selected chips */}
                  <div
                    onClick={() => setShowTechDropdown(!showTechDropdown)}
                    className="min-h-[54px] w-full rounded-xl p-3 flex flex-wrap gap-2 cursor-pointer transition-all duration-200"
                    style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${selectedTechs.length ? 'rgba(245,158,11,0.35)' : 'rgba(255,255,255,0.08)'}` }}
                  >
                    {selectedTechs.length ? selectedTechs.map(tech => (
                      <span key={tech}
                        className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase px-3 py-1.5 rounded-lg transition-colors"
                        style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' }}
                      >
                        {tech.trim()}
                        <FiX className="cursor-pointer hover:text-white" onClick={e => { e.stopPropagation(); toggleTech(tech.trim()); }} />
                      </span>
                    )) : (
                      <span className="text-[11px] py-1 px-1" style={{ color: 'rgba(255,255,255,0.2)' }}>Click to select skills…</span>
                    )}
                    <FiChevronDown className={`ml-auto self-center transition-transform duration-200 ${showTechDropdown ? 'rotate-180' : ''}`} style={{ color: 'rgba(255,255,255,0.3)' }} />
                  </div>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {showTechDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 w-full mt-1 rounded-2xl overflow-hidden shadow-2xl"
                        style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                          <FiSearch className="text-amber-400 shrink-0" />
                          <input
                            className="bg-transparent border-none outline-none text-xs w-full"
                            style={{ color: '#e5e7eb' }}
                            placeholder="Filter skills…"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            autoFocus
                          />
                        </div>
                        <div className="max-h-56 overflow-y-auto p-2 grid grid-cols-2 gap-1">
                          {TECH_DOMAINS.filter(o => o.toLowerCase().includes(searchTerm.toLowerCase())).map(option => {
                            const active = formData.tech_stack.includes(option);
                            return (
                              <div key={option} onClick={() => toggleTech(option)}
                                className="px-3 py-2.5 text-[10px] uppercase font-bold tracking-wider rounded-xl cursor-pointer transition-all duration-150"
                                style={active
                                  ? { background: 'rgba(245,158,11,0.2)', color: '#f59e0b' }
                                  : { color: 'rgba(255,255,255,0.4)' }}
                                onMouseEnter={e => !active && (e.currentTarget.style.background = 'rgba(255,255,255,0.05)', e.currentTarget.style.color = '#fff')}
                                onMouseLeave={e => !active && (e.currentTarget.style.background = 'transparent', e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                              >
                                {option}
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Custom tech input */}
                  <AnimatePresence>
                    {showCustomInput && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="flex gap-2 mt-2">
                        <input
                          className="flex-1 rounded-xl px-4 py-3 text-xs outline-none"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,158,11,0.3)', color: '#e5e7eb' }}
                          placeholder="e.g. Python, Rust…"
                          value={customTech}
                          onChange={e => setCustomTech(e.target.value)}
                          onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddCustomTech())}
                        />
                        <button type="button" onClick={handleAddCustomTech}
                          className="px-5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                          style={{ background: '#f59e0b', color: '#000' }}>
                          <FiPlus />
                        </button>
                        <button type="button" onClick={() => setShowCustomInput(false)}
                          className="px-3 rounded-xl text-sm transition-all"
                          style={{ color: 'rgba(255,255,255,0.3)' }}>
                          <FiX />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </SectionCard>

              {/* ── 1-on-1 Call card ── */}
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="rounded-2xl overflow-hidden"
                style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}
              >
                {/* Header row */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: callEnabled ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${callEnabled ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.08)'}`, transition: 'all 0.3s' }}>
                        <FiVideo className="text-sm" style={{ color: callEnabled ? '#f59e0b' : 'rgba(255,255,255,0.3)' }} />
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.35em] font-black mb-0.5" style={{ color: 'rgba(245,158,11,0.7)' }}>For Juniors</p>
                        <h3 className="text-sm font-black" style={{ color: '#e5e7eb' }}>1-on-1 Call</h3>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleToggleCall}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300"
                      style={callEnabled
                        ? { background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.35)', color: '#f59e0b' }
                        : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}
                    >
                      {callEnabled
                        ? <><FiToggleRight className="text-base" /> Enabled</>
                        : <><FiToggleLeft className="text-base" /> Enable</>}
                    </button>
                  </div>
                  <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    Let juniors book a direct call with you. Share your number and availability.
                  </p>
                  {callSaved && (
                    <div className="mt-3 flex items-center gap-2 text-[9px] font-black uppercase tracking-wider" style={{ color: '#6ee7b7' }}>
                      <FiCheckCircle /> Availability saved
                    </div>
                  )}
                </div>
                <AnimatePresence>
                  {showCallForm && (
                    <motion.div
                      key="call-form"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden', borderTop: '1px solid rgba(245,158,11,0.15)' }}
                    >
                      <div className="p-6 space-y-5">
                        <div className="space-y-2">
                          <FieldLabel icon={<FiPhone />} label="Your Phone Number" required />
                          <div className="flex rounded-xl overflow-hidden"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                            onFocusCapture={e => e.currentTarget.style.borderColor = 'rgba(245,158,11,0.4)'}
                            onBlurCapture={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                          >
                            <span className="px-3 flex items-center text-[10px] font-black shrink-0"
                              style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.25)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>+91</span>
                            <input name="phone" type="tel" maxLength={10} value={callData.phone} onChange={handleCallChange}
                              placeholder="9876543210"
                              className="bg-transparent w-full py-3.5 px-4 text-xs outline-none font-bold"
                              style={{ color: '#e5e7eb' }} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <FieldLabel icon={<FiClock />} label="Available Time Slot" required />
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <p className="text-[9px] uppercase tracking-widest font-black" style={{ color: 'rgba(255,255,255,0.25)' }}>From</p>
                              <input name="timeFrom" type="time" value={callData.timeFrom} onChange={handleCallChange}
                                className="w-full rounded-xl py-3 px-4 text-xs outline-none font-bold"
                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#e5e7eb', colorScheme: 'dark' }}
                                onFocus={e => e.target.style.borderColor = 'rgba(245,158,11,0.4)'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                            </div>
                            <div className="space-y-1">
                              <p className="text-[9px] uppercase tracking-widest font-black" style={{ color: 'rgba(255,255,255,0.25)' }}>To</p>
                              <input name="timeTo" type="time" value={callData.timeTo} onChange={handleCallChange}
                                className="w-full rounded-xl py-3 px-4 text-xs outline-none font-bold"
                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#e5e7eb', colorScheme: 'dark' }}
                                onFocus={e => e.target.style.borderColor = 'rgba(245,158,11,0.4)'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <FieldLabel icon={<FiCalendar />} label="Available Days" required />
                          <div className="grid grid-cols-4 gap-2">
                            {WORKING_DAYS.map(day => (
                              <button key={day} type="button" onClick={() => toggleCallDay(day)}
                                className="py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-200"
                                style={callData.days.includes(day)
                                  ? { background: '#f59e0b', color: '#000', border: '1px solid #f59e0b' }
                                  : { background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                {day}
                              </button>
                            ))}
                          </div>
                        </div>
                        <button type="button" onClick={handleCallSubmit}
                          className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all duration-200"
                          style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#000' }}
                          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                          onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                          <FiSave /> Save Availability
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

            </motion.div>

            {/* Right: socials + save — spans 2 cols */}
            <div className="lg:col-span-2 space-y-5">

              {/* Socials card */}
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <SectionCard label="Social Links">
                  <SocialInput label="GitHub" icon={<FiGithub />} prefix="github.com/" name="github" value={formData.github} onChange={handleChange} required />
                  <div className="h-4" />
                  <SocialInput label="LinkedIn" icon={<FiLinkedin />} prefix="in/" name="linkedin" value={formData.linkedin} onChange={handleChange} required />
                </SectionCard>
              </motion.div>

              {/* Save card */}
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="rounded-2xl overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
              >
                <div className="p-7">
                  {/* Progress dots */}
                  <div className="flex gap-1.5 mb-5">
                    {['name','email','address','github','linkedin','tech_stack','year'].map(f => (
                      <div key={f} className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{ background: formData[f] && String(formData[f]).trim() ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.15)' }} />
                    ))}
                  </div>

                  <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-1" style={{ color: 'rgba(0,0,0,0.5)' }}>
                    {selectedTechs.length === 0 ? 'Not started' : profileComplete ? 'All done!' : 'In progress'}
                  </p>
                  <h3 className="text-2xl font-serif italic text-black mb-1">Save Profile</h3>
                  <p className="text-[10px] font-bold mb-6" style={{ color: 'rgba(0,0,0,0.5)' }}>
                    All 7 fields are required.
                  </p>

                  <button type="submit" disabled={isSubmitting}
                    className="w-full py-4 rounded-xl flex items-center justify-center gap-2.5 font-black text-xs uppercase tracking-widest transition-all duration-200"
                    style={{ background: '#000', color: '#fff' }}
                    onMouseEnter={e => !isSubmitting && (e.currentTarget.style.background = '#111')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#000')}
                  >
                    {isSubmitting
                      ? <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Saving…</>
                      : <><FiSave /> Save &amp; Continue</>
                    }
                  </button>
                </div>
              </motion.div>

              {/* Tip card */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="rounded-2xl p-5"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <p className="text-[9px] uppercase tracking-[0.3em] font-black mb-2" style={{ color: 'rgba(245,158,11,0.6)' }}>Tip</p>
                <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  A complete profile increases your chances of being discovered by peers and educators on Linkaura.
                </p>
              </motion.div>

            </div>
          </div>
        </form>
      </div>

      {/* ── Toast notification ── */}
      <AnimatePresence>
        {submitStatus.message && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            className="fixed bottom-8 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl"
            style={submitStatus.success
              ? { background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#6ee7b7' }
              : { background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }
            }
          >
            {submitStatus.success
              ? <FiCheckCircle className="text-lg shrink-0" />
              : <FiAlertCircle className="text-lg shrink-0" />
            }
            <span className="text-[10px] font-black uppercase tracking-widest">{submitStatus.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Sub-components ── */

const SectionCard = ({ label, children }) => (
  <div className="rounded-2xl p-6 space-y-5"
    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
    <p className="text-[9px] uppercase tracking-[0.35em] font-black" style={{ color: 'rgba(245,158,11,0.7)' }}>{label}</p>
    {children}
  </div>
);

const FieldLabel = ({ icon, label, required }) => (
  <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-black ml-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
    <span className="text-amber-400">{icon}</span>
    {label}
    {required && <span className="text-amber-500">*</span>}
  </label>
);

const InputField = ({ label, icon, name, value, onChange, required, placeholder }) => (
  <div className="space-y-2">
    <FieldLabel icon={icon} label={label} required={required} />
    <input
      name={name} type="text" value={value} onChange={onChange} required={required}
      placeholder={placeholder}
      className="w-full rounded-xl py-3.5 px-4 text-sm transition-all duration-200 outline-none"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#e5e7eb' }}
      onFocus={e => e.target.style.borderColor = 'rgba(245,158,11,0.4)'}
      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
    />
  </div>
);

const SocialInput = ({ label, icon, prefix, name, value, onChange, required }) => (
  <div className="space-y-2">
    <FieldLabel icon={icon} label={label} required={required} />
    <div className="flex rounded-xl overflow-hidden transition-all duration-200"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
      onFocusCapture={e => e.currentTarget.style.borderColor = 'rgba(245,158,11,0.4)'}
      onBlurCapture={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
    >
      <span className="px-3 flex items-center text-[9px] font-black uppercase shrink-0"
        style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.25)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        {prefix}
      </span>
      <input name={name} value={value} onChange={onChange} required={required}
        className="bg-transparent w-full py-3.5 px-4 text-xs outline-none font-bold"
        style={{ color: '#e5e7eb' }}
        placeholder="username"
      />
    </div>
  </div>
);

export default User;

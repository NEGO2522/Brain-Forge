import React, { useState, useEffect, useRef } from 'react';
import useSEO from '../hooks/useSEO';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUser, FiMail, FiGithub, FiLinkedin, FiMapPin,
  FiLogOut, FiSave, FiCheckCircle, FiAlertCircle,
  FiX, FiChevronDown, FiSearch, FiPlus, FiCalendar,
  FiPhone, FiClock, FiToggleLeft, FiToggleRight, FiVideo,
} from 'react-icons/fi';

const TECH_DOMAINS = [
  "Beginner", "Frontend Developer", "Backend Developer", "Full Stack Developer",
  "Mobile App Developer", "UI/UX Designer", "DevOps Engineer", "Data Scientist",
  "AI / ML Engineer", "Blockchain Developer", "Cloud Architect",
  "Cybersecurity Analyst", "Game Developer", "Embedded Systems", "Others"
];

/* ── Label ── */
const FieldLabel = ({ icon, label, required }) => (
  <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-black text-black/40 mb-1.5" style={{ fontFamily: 'sans-serif' }}>
    <span>{icon}</span>{label}{required && <span className="text-black">*</span>}
  </label>
);

/* ── Plain input ── */
const InputField = ({ label, icon, name, value, onChange, required, placeholder }) => (
  <div>
    <FieldLabel icon={icon} label={label} required={required} />
    <input name={name} type="text" value={value} onChange={onChange} required={required} placeholder={placeholder}
      className="w-full py-3.5 px-4 border border-black/15 text-sm outline-none text-black placeholder-black/25 focus:border-black transition-colors bg-white"
      style={{ fontFamily: 'sans-serif' }} />
  </div>
);

/* ── Social input with prefix ── */
const SocialInput = ({ label, icon, prefix, name, value, onChange, required }) => (
  <div>
    <FieldLabel icon={icon} label={label} required={required} />
    <div className="flex border border-black/15 focus-within:border-black transition-colors">
      <span className="px-3 flex items-center text-[9px] font-black uppercase bg-black/[0.03] text-black/30 border-r border-black/10 flex-shrink-0" style={{ fontFamily: 'sans-serif' }}>
        {prefix}
      </span>
      <input name={name} value={value} onChange={onChange} required={required} placeholder="username"
        className="bg-transparent w-full py-3.5 px-4 text-xs outline-none font-bold text-black"
        style={{ fontFamily: 'sans-serif' }} />
    </div>
  </div>
);

/* ── Section card ── */
const SectionCard = ({ label, children }) => (
  <div className="border border-black/10 p-7 space-y-5 bg-white" style={{ fontFamily: 'sans-serif' }}>
    <p className="text-[9px] uppercase tracking-[0.4em] font-black text-black/30">{label}</p>
    {children}
  </div>
);

const User = () => {
  useSEO({ title: 'Profile Settings', description: 'Manage your Linkaura identity.', keywords: 'profile, user settings' });

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [currentUser,   setCurrentUser]   = useState(null);
  const [profileId,     setProfileId]     = useState(null);
  const [formData,      setFormData]      = useState({ name: '', email: '', address: '', github: '', linkedin: '', tech_stack: '', year: '2' });
  const [isSubmitting,  setIsSubmitting]  = useState(false);
  const [submitStatus,  setSubmitStatus]  = useState({ success: null, message: '' });
  const [profileComplete, setProfileComplete] = useState(false);
  const [showTechDropdown, setShowTechDropdown] = useState(false);
  const [searchTerm,    setSearchTerm]    = useState('');
  const [customTech,    setCustomTech]    = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // 1-on-1 call
  const [callEnabled,  setCallEnabled]  = useState(false);
  const [showCallForm, setShowCallForm] = useState(false);
  const [callData,     setCallData]     = useState({ phone: '', timeFrom: '', timeTo: '', days: [] });
  const [callSaved,    setCallSaved]    = useState(false);
  const WORKING_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleCallDay  = (day) => setCallData(prev => ({ ...prev, days: prev.days.includes(day) ? prev.days.filter(d => d !== day) : [...prev.days, day] }));
  const handleCallChange = (e) => setCallData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleCallSubmit = async () => {
    const { phone, timeFrom, timeTo, days } = callData;
    if (!phone || !timeFrom || !timeTo || days.length === 0) {
      setSubmitStatus({ success: false, message: 'Fill all call availability fields!' });
      setTimeout(() => setSubmitStatus({ success: null, message: '' }), 4000); return;
    }
    if (!profileId) {
      setSubmitStatus({ success: false, message: 'Save your profile first!' });
      setTimeout(() => setSubmitStatus({ success: null, message: '' }), 4000); return;
    }
    try {
      const { error } = await supabase.from('user_profiles').update({ call_phone: phone, call_time_from: timeFrom, call_time_to: timeTo, call_days: days.join(','), call_enabled: true }).eq('id', profileId);
      if (error) throw error;
      setCallSaved(true); setShowCallForm(false);
      setSubmitStatus({ success: true, message: 'Call availability saved!' });
      setTimeout(() => setSubmitStatus({ success: null, message: '' }), 4000);
    } catch (err) { setSubmitStatus({ success: false, message: err.message }); setTimeout(() => setSubmitStatus({ success: null, message: '' }), 4000); }
  };
  const handleToggleCall = () => {
    if (!callEnabled) { setCallEnabled(true); setShowCallForm(true); }
    else { setCallEnabled(false); setShowCallForm(false); setCallSaved(false); }
  };

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/login'); return; }
      const user = session.user; setCurrentUser(user);
      const { data } = await supabase.from('user_profiles').select('*').eq('user_id', user.id).single();
      if (data) {
        setProfileId(data.id);
        const loaded = { name: data.name || '', email: data.email || user.email || '', address: data.address || '', github: data.github || '', linkedin: data.linkedin || '', tech_stack: data.tech_stack || '', year: data.year || '2' };
        setFormData(loaded);
        setProfileComplete(Object.values(loaded).every(v => v && String(v).trim()));
      } else { setFormData(prev => ({ ...prev, email: user.email || '' })); }
    };
    load();
  }, []);

  useEffect(() => {
    const handler = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowTechDropdown(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const toggleTech = (tech) => {
    if (tech === 'Others') { setShowCustomInput(true); setShowTechDropdown(false); return; }
    const current = formData.tech_stack ? formData.tech_stack.split(',').map(t => t.trim()).filter(t => t) : [];
    const next = current.includes(tech) ? current.filter(t => t !== tech) : [...current, tech];
    setFormData(prev => ({ ...prev, tech_stack: next.join(', ') }));
  };
  const handleAddCustomTech = () => { if (customTech.trim()) { toggleTech(customTech.trim()); setCustomTech(''); setShowCustomInput(false); } };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(formData).some(v => !v || (typeof v === 'string' && !v.trim()))) {
      setSubmitStatus({ success: false, message: 'All fields are mandatory!' });
      setTimeout(() => setSubmitStatus({ success: null, message: '' }), 4000); return;
    }
    setIsSubmitting(true);
    try {
      const payload = { ...formData, user_id: currentUser.id, updated_at: new Date().toISOString() };
      if (profileId) {
        const { error } = await supabase.from('user_profiles').update(payload).eq('id', profileId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('user_profiles').insert({ ...payload, created_at: new Date().toISOString() }).select().single();
        if (error) throw error; setProfileId(data.id);
      }
      setProfileComplete(true);
      setSubmitStatus({ success: true, message: 'Profile saved! Redirecting...' });
      setTimeout(() => navigate('/student'), 1800);
    } catch (err) { setSubmitStatus({ success: false, message: err.message }); }
    finally { setIsSubmitting(false); setTimeout(() => setSubmitStatus({ success: null, message: '' }), 4000); }
  };

  useEffect(() => {
    if (profileComplete) return;
    window.history.pushState(null, '', window.location.href);
    const handlePop = () => window.history.pushState(null, '', window.location.href);
    const handleBU  = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('popstate', handlePop);
    window.addEventListener('beforeunload', handleBU);
    return () => { window.removeEventListener('popstate', handlePop); window.removeEventListener('beforeunload', handleBU); };
  }, [profileComplete]);

  const handleSignOut = async () => { await supabase.auth.signOut(); navigate('/login'); };
  const selectedTechs = formData.tech_stack ? formData.tech_stack.split(',').filter(t => t.trim()) : [];

  const noiseBg = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'repeat', backgroundSize: '128px',
  };

  return (
    <div className="min-h-screen bg-white text-black" style={{ fontFamily: "'Georgia', serif" }}>
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]" style={noiseBg} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-24">

        {/* Incomplete banner */}
        <AnimatePresence>
          {!profileComplete && (
            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              className="mb-8 flex items-center gap-4 px-6 py-4 border border-black/15 bg-black/[0.02]" style={{ fontFamily: 'sans-serif' }}>
              <FiAlertCircle className="text-black text-lg shrink-0" />
              <p className="text-black text-[10px] font-black uppercase tracking-[0.25em]">
                Complete all fields to unlock the full Linkaura experience.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-14">
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <div className="w-14 h-14 bg-black flex items-center justify-center">
                <FiUser className="text-white text-xl" />
              </div>
              {profileComplete && (
                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-black border-2 border-white flex items-center justify-center">
                  <FiCheckCircle className="text-white text-[9px]" />
                </span>
              )}
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.4em] font-black text-black/30 mb-1" style={{ fontFamily: 'sans-serif' }}>Linkaura</p>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold leading-none text-black">Profile Settings</h1>
            </div>
          </div>
          <button type="button" onClick={handleSignOut}
            className="group flex items-center gap-2.5 px-5 py-3 border border-black/15 text-[10px] font-black uppercase tracking-widest text-black/50 hover:bg-black hover:text-white hover:border-black transition-all duration-200"
            style={{ fontFamily: 'sans-serif' }}>
            <FiLogOut className="text-sm" /> Sign Out
          </button>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* Left: main fields */}
            <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-3 space-y-5">

              {/* Identity */}
              <SectionCard label="Identity">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InputField label="Full Name" icon={<FiUser size={11} />} name="name" value={formData.name} onChange={handleChange} required placeholder="Your name" />
                  <InputField label="Email"     icon={<FiMail size={11} />} name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" />
                </div>

                {/* Year */}
                <div>
                  <FieldLabel icon={<FiCalendar size={11} />} label="Year of Study" required />
                  <div className="grid grid-cols-4 gap-2">
                    {['1','2','3','4'].map(y => (
                      <button key={y} type="button" onClick={() => setFormData(prev => ({ ...prev, year: y }))}
                        className={`py-3 text-[10px] font-black uppercase tracking-widest transition-all duration-150 border ${
                          formData.year === y ? 'bg-black text-white border-black' : 'bg-white text-black/40 border-black/15 hover:border-black hover:text-black'
                        }`} style={{ fontFamily: 'sans-serif' }}>
                        Yr {y}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <FieldLabel icon={<FiMapPin size={11} />} label="Location" required />
                  <input name="address" type="text" value={formData.address} onChange={handleChange} required placeholder="Start typing your city…"
                    className="w-full py-3.5 px-4 border border-black/15 text-sm outline-none text-black placeholder-black/25 focus:border-black transition-colors bg-white"
                    style={{ fontFamily: 'sans-serif' }} />
                </div>
              </SectionCard>

              {/* Skills */}
              <SectionCard label="Skills & Domain">
                <div className="space-y-3 relative" ref={dropdownRef}>
                  {/* Chip selector */}
                  <div onClick={() => setShowTechDropdown(!showTechDropdown)}
                    className={`min-h-[52px] w-full border p-3 flex flex-wrap gap-2 cursor-pointer transition-colors ${selectedTechs.length ? 'border-black/25' : 'border-black/15'} hover:border-black`}>
                    {selectedTechs.length ? selectedTechs.map(tech => (
                      <span key={tech} className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase px-3 py-1.5 bg-black text-white"
                        style={{ fontFamily: 'sans-serif' }}>
                        {tech.trim()}
                        <FiX className="cursor-pointer" onClick={e => { e.stopPropagation(); toggleTech(tech.trim()); }} />
                      </span>
                    )) : (
                      <span className="text-[11px] py-1 px-1 text-black/25" style={{ fontFamily: 'sans-serif' }}>Click to select skills…</span>
                    )}
                    <FiChevronDown className={`ml-auto self-center text-black/30 transition-transform duration-200 ${showTechDropdown ? 'rotate-180' : ''}`} />
                  </div>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {showTechDropdown && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}
                        className="absolute z-50 w-full mt-1 border border-black/15 bg-white shadow-lg overflow-hidden">
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-black/8">
                          <FiSearch size={12} className="text-black/40 shrink-0" />
                          <input className="bg-transparent border-none outline-none text-xs w-full text-black placeholder-black/30"
                            placeholder="Filter skills…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} autoFocus
                            style={{ fontFamily: 'sans-serif' }} />
                        </div>
                        <div className="max-h-52 overflow-y-auto p-2 grid grid-cols-2 gap-1">
                          {TECH_DOMAINS.filter(o => o.toLowerCase().includes(searchTerm.toLowerCase())).map(option => {
                            const active = formData.tech_stack.includes(option);
                            return (
                              <div key={option} onClick={() => toggleTech(option)}
                                className={`px-3 py-2.5 text-[10px] uppercase font-bold tracking-wider cursor-pointer transition-all ${active ? 'bg-black text-white' : 'text-black/50 hover:bg-black/5 hover:text-black'}`}
                                style={{ fontFamily: 'sans-serif' }}>
                                {option}
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Custom input */}
                  <AnimatePresence>
                    {showCustomInput && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="flex gap-2 mt-2">
                        <input className="flex-1 px-4 py-3 border border-black/15 text-xs outline-none focus:border-black text-black placeholder-black/25 bg-white"
                          placeholder="e.g. Python, Rust…" value={customTech} onChange={e => setCustomTech(e.target.value)}
                          onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddCustomTech())}
                          style={{ fontFamily: 'sans-serif' }} />
                        <button type="button" onClick={handleAddCustomTech}
                          className="px-5 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-black/80 transition-all">
                          <FiPlus />
                        </button>
                        <button type="button" onClick={() => setShowCustomInput(false)}
                          className="px-3 border border-black/15 text-black/40 hover:bg-black hover:text-white hover:border-black transition-all">
                          <FiX />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </SectionCard>

              {/* 1-on-1 Call card */}
              <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
                className="border border-black/10 bg-white" style={{ fontFamily: 'sans-serif' }}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 border flex items-center justify-center transition-all ${callEnabled ? 'border-black bg-black' : 'border-black/15'}`}>
                        <FiVideo size={13} className={callEnabled ? 'text-white' : 'text-black/30'} />
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.35em] font-black text-black/30 mb-0.5">For Juniors</p>
                        <h3 className="text-sm font-black uppercase tracking-wide text-black">1-on-1 Call</h3>
                      </div>
                    </div>
                    <button type="button" onClick={handleToggleCall}
                      className={`flex items-center gap-2 px-4 py-2 border text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${callEnabled ? 'bg-black text-white border-black' : 'border-black/15 text-black/45 hover:border-black hover:text-black'}`}>
                      {callEnabled ? <><FiToggleRight className="text-base" /> Enabled</> : <><FiToggleLeft className="text-base" /> Enable</>}
                    </button>
                  </div>
                  <p className="text-[10px] leading-relaxed text-black/40">Let juniors book a direct call with you. Share your number and availability.</p>
                  {callSaved && (
                    <div className="mt-3 flex items-center gap-2 text-[9px] font-black uppercase tracking-wider text-black">
                      <FiCheckCircle /> Availability saved
                    </div>
                  )}
                </div>
                <AnimatePresence>
                  {showCallForm && (
                    <motion.div key="call-form" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }} style={{ overflow: 'hidden', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                      <div className="p-6 space-y-5">
                        <div>
                          <FieldLabel icon={<FiPhone size={11} />} label="Your Phone Number" required />
                          <div className="flex border border-black/15 focus-within:border-black transition-colors">
                            <span className="px-3 flex items-center text-[10px] font-black bg-black/[0.03] text-black/30 border-r border-black/10">+91</span>
                            <input name="phone" type="tel" maxLength={10} value={callData.phone} onChange={handleCallChange}
                              placeholder="9876543210" className="bg-transparent w-full py-3.5 px-4 text-xs outline-none font-bold text-black" />
                          </div>
                        </div>
                        <div>
                          <FieldLabel icon={<FiClock size={11} />} label="Available Time Slot" required />
                          <div className="grid grid-cols-2 gap-3">
                            {[['timeFrom','From'],['timeTo','To']].map(([n, lbl]) => (
                              <div key={n}>
                                <p className="text-[9px] uppercase tracking-widest font-black text-black/30 mb-1">{lbl}</p>
                                <input name={n} type="time" value={callData[n]} onChange={handleCallChange}
                                  className="w-full py-3 px-4 border border-black/15 text-xs outline-none focus:border-black text-black bg-white" />
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <FieldLabel icon={<FiCalendar size={11} />} label="Available Days" required />
                          <div className="grid grid-cols-4 gap-2">
                            {WORKING_DAYS.map(day => (
                              <button key={day} type="button" onClick={() => toggleCallDay(day)}
                                className={`py-2.5 text-[9px] font-black uppercase tracking-widest transition-all border ${callData.days.includes(day) ? 'bg-black text-white border-black' : 'border-black/15 text-black/40 hover:border-black hover:text-black'}`}>
                                {day}
                              </button>
                            ))}
                          </div>
                        </div>
                        <button type="button" onClick={handleCallSubmit}
                          className="w-full py-3.5 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest bg-black text-white hover:bg-black/80 transition-all">
                          <FiSave /> Save Availability
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>

            {/* Right: socials + save */}
            <div className="lg:col-span-2 space-y-5">

              <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <SectionCard label="Social Links">
                  <SocialInput label="GitHub"   icon={<FiGithub size={11} />}   prefix="github.com/" name="github"   value={formData.github}   onChange={handleChange} required />
                  <div className="h-2" />
                  <SocialInput label="LinkedIn" icon={<FiLinkedin size={11} />} prefix="in/"         name="linkedin" value={formData.linkedin} onChange={handleChange} required />
                </SectionCard>
              </motion.div>

              {/* Save card */}
              <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-black p-7">
                {/* Progress */}
                <div className="flex gap-1.5 mb-5">
                  {['name','email','address','github','linkedin','tech_stack','year'].map(f => (
                    <div key={f} className="h-0.5 flex-1 transition-all duration-300"
                      style={{ background: formData[f] && String(formData[f]).trim() ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.15)' }} />
                  ))}
                </div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-1 text-white/40" style={{ fontFamily: 'sans-serif' }}>
                  {selectedTechs.length === 0 ? 'Not started' : profileComplete ? 'All done!' : 'In progress'}
                </p>
                <h3 className="text-2xl font-serif font-bold text-white mb-1">Save Profile</h3>
                <p className="text-[10px] font-bold mb-6 text-white/40" style={{ fontFamily: 'sans-serif' }}>All 7 fields are required.</p>
                <button type="submit" disabled={isSubmitting}
                  className="w-full py-4 flex items-center justify-center gap-2.5 font-black text-xs uppercase tracking-widest bg-white text-black hover:bg-white/90 transition-all disabled:opacity-50"
                  style={{ fontFamily: 'sans-serif' }}>
                  {isSubmitting
                    ? <><span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> Saving…</>
                    : <><FiSave /> Save &amp; Continue</>}
                </button>
              </motion.div>

              {/* Tip */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="border border-black/10 p-5" style={{ fontFamily: 'sans-serif' }}>
                <p className="text-[9px] uppercase tracking-[0.3em] font-black text-black/30 mb-2">Tip</p>
                <p className="text-[11px] leading-relaxed text-black/40">
                  A complete profile increases your chances of being discovered by peers and educators on Linkaura.
                </p>
              </motion.div>
            </div>
          </div>
        </form>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {submitStatus.message && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-8 right-6 z-[100] flex items-center gap-3 px-6 py-4 border shadow-lg"
            style={submitStatus.success
              ? { background: '#fff', border: '1px solid rgba(0,0,0,0.15)', color: '#000' }
              : { background: '#fff', border: '1px solid rgba(0,0,0,0.15)', color: '#000' }}>
            {submitStatus.success ? <FiCheckCircle className="text-lg shrink-0" /> : <FiAlertCircle className="text-lg shrink-0" />}
            <span className="text-[10px] font-black uppercase tracking-widest" style={{ fontFamily: 'sans-serif' }}>{submitStatus.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default User;
